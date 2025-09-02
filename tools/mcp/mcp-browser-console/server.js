#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import CDP from 'chrome-remote-interface';

class BrowserConsoleServer {
  constructor() {
    this.server = new Server(
      {
        name: 'browser-console-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
          resources: {},
        },
      }
    );

    this.chromeClient = null;
    this.consoleLogs = [];
    this.isConnected = false;

    this.setupToolHandlers();
    this.setupResourceHandlers();
  }

  setupToolHandlers() {
    this.server.setRequestHandler('tools/list', async () => {
      return {
        tools: [
          {
            name: 'connect_chrome',
            description: 'Connect to Chrome DevTools to start capturing console logs',
            inputSchema: {
              type: 'object',
              properties: {
                port: {
                  type: 'number',
                  description: 'Chrome DevTools port (default: 9222)',
                  default: 9222,
                },
                host: {
                  type: 'string',
                  description: 'Chrome DevTools host (default: localhost)',
                  default: 'localhost',
                },
                url: {
                  type: 'string',
                  description: 'Specific URL/tab to connect to (optional - will find matching tab)',
                },
                tabId: {
                  type: 'string',
                  description: 'Specific Chrome tab ID to connect to (optional)',
                },
              },
            },
          },
          {
            name: 'get_console_logs',
            description: 'Get captured console logs from the browser',
            inputSchema: {
              type: 'object',
              properties: {
                level: {
                  type: 'string',
                  description: 'Filter by log level (log, warn, error, info, debug)',
                  enum: ['log', 'warn', 'error', 'info', 'debug'],
                },
                limit: {
                  type: 'number',
                  description: 'Maximum number of logs to return (default: 50)',
                  default: 50,
                },
                since: {
                  type: 'string',
                  description: 'ISO timestamp to get logs since that time',
                },
              },
            },
          },
          {
            name: 'clear_console_logs',
            description: 'Clear the captured console logs buffer',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'evaluate_in_browser',
            description: 'Execute JavaScript code in the browser console',
            inputSchema: {
              type: 'object',
              properties: {
                expression: {
                  type: 'string',
                  description: 'JavaScript expression to evaluate',
                },
              },
              required: ['expression'],
            },
          },
          {
            name: 'get_browser_info',
            description: 'Get information about connected browser tabs',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'find_tabs',
            description: 'Find Chrome tabs by URL pattern',
            inputSchema: {
              type: 'object',
              properties: {
                url: {
                  type: 'string',
                  description: 'URL pattern to search for in tabs',
                },
                port: {
                  type: 'number',
                  description: 'Chrome DevTools port (default: 9222)',
                  default: 9222,
                },
                host: {
                  type: 'string',
                  description: 'Chrome DevTools host (default: localhost)',
                  default: 'localhost',
                },
              },
              required: ['url'],
            },
          },
          {
            name: 'navigate_to_url',
            description: 'Navigate the current tab to a specific URL',
            inputSchema: {
              type: 'object',
              properties: {
                url: {
                  type: 'string',
                  description: 'URL to navigate to',
                },
              },
              required: ['url'],
            },
          },
        ],
      };
    });

    this.server.setRequestHandler('tools/call', async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'connect_chrome':
            return await this.connectChrome(
              args?.port || 9222,
              args?.host || 'localhost',
              args?.url,
              args?.tabId
            );

          case 'get_console_logs':
            return await this.getConsoleLogs(args?.level, args?.limit || 50, args?.since);

          case 'clear_console_logs':
            return await this.clearConsoleLogs();

          case 'evaluate_in_browser':
            return await this.evaluateInBrowser(args.expression);

          case 'get_browser_info':
            return await this.getBrowserInfo();

          case 'find_tabs':
            return await this.findTabs(args.url, args?.port || 9222, args?.host || 'localhost');

          case 'navigate_to_url':
            return await this.navigateToUrl(args.url);

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  setupResourceHandlers() {
    this.server.setRequestHandler('resources/list', async () => {
      return {
        resources: [
          {
            uri: 'console://logs',
            name: 'Live Console Logs',
            description: 'Real-time browser console logs',
            mimeType: 'application/json',
          },
        ],
      };
    });

    this.server.setRequestHandler('resources/read', async (request) => {
      const { uri } = request.params;

      if (uri === 'console://logs') {
        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: JSON.stringify(this.consoleLogs, null, 2),
            },
          ],
        };
      }

      throw new Error(`Unknown resource: ${uri}`);
    });
  }

  async connectChrome(port = 9222, host = 'localhost', targetUrl = null, tabId = null) {
    try {
      if (this.chromeClient) {
        await this.chromeClient.close();
      }

      // Get list of available tabs
      const tabs = await CDP.List({ port, host });
      let targetTab = null;

      if (tabId) {
        // Connect to specific tab ID
        targetTab = tabs.find((tab) => tab.id === tabId);
        if (!targetTab) {
          throw new Error(`Tab with ID '${tabId}' not found`);
        }
      } else if (targetUrl) {
        // Find tab with matching URL
        targetTab = tabs.find((tab) => tab.url.includes(targetUrl) || targetUrl.includes(tab.url));
        if (!targetTab) {
          throw new Error(
            `No tab found with URL containing '${targetUrl}'. Available tabs: ${tabs.map((t) => t.url).join(', ')}`
          );
        }
      } else {
        // Use the first available tab
        targetTab = tabs.find((tab) => tab.type === 'page');
        if (!targetTab) {
          throw new Error('No page tabs available');
        }
      }

      // Connect to the specific tab
      this.chromeClient = await CDP({ tab: targetTab, port, host });
      const { Runtime, Console } = this.chromeClient;

      // Enable runtime and console domains
      await Runtime.enable();
      await Console.enable();

      // Listen for console messages
      Console.messageAdded((message) => {
        const logEntry = {
          timestamp: new Date().toISOString(),
          level: message.message.level,
          text: message.message.text,
          url: message.message.url,
          line: message.message.line,
          column: message.message.column,
          args: message.message.parameters?.map((p) => p.value) || [],
        };

        this.consoleLogs.push(logEntry);

        // Keep only last 1000 logs to prevent memory issues
        if (this.consoleLogs.length > 1000) {
          this.consoleLogs.shift();
        }
      });

      // Listen for runtime console API calls
      Runtime.consoleAPICalled((message) => {
        const logEntry = {
          timestamp: new Date(message.timestamp).toISOString(),
          level: message.type,
          args: message.args?.map((arg) => arg.value || arg.description || String(arg)) || [],
          stackTrace: message.stackTrace,
          url: message.stackTrace?.callFrames?.[0]?.url,
          line: message.stackTrace?.callFrames?.[0]?.lineNumber,
          column: message.stackTrace?.callFrames?.[0]?.columnNumber,
        };

        this.consoleLogs.push(logEntry);

        if (this.consoleLogs.length > 1000) {
          this.consoleLogs.shift();
        }
      });

      this.isConnected = true;

      return {
        content: [
          {
            type: 'text',
            text: `Successfully connected to Chrome DevTools on ${host}:${port}.\nConnected to tab: ${targetTab.title}\nURL: ${targetTab.url}\nConsole logging is now active.`,
          },
        ],
      };
    } catch (error) {
      this.isConnected = false;
      throw new Error(
        `Failed to connect to Chrome DevTools: ${error.message}. Make sure Chrome is running with --remote-debugging-port=${port}`
      );
    }
  }

  async getConsoleLogs(level, limit = 50, since) {
    let logs = [...this.consoleLogs];

    if (level) {
      logs = logs.filter((log) => log.level === level);
    }

    if (since) {
      const sinceDate = new Date(since);
      logs = logs.filter((log) => new Date(log.timestamp) >= sinceDate);
    }

    logs = logs.slice(-limit);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              totalLogs: this.consoleLogs.length,
              filteredLogs: logs.length,
              logs: logs,
            },
            null,
            2
          ),
        },
      ],
    };
  }

  async clearConsoleLogs() {
    this.consoleLogs = [];
    return {
      content: [
        {
          type: 'text',
          text: 'Console logs buffer cleared.',
        },
      ],
    };
  }

  async evaluateInBrowser(expression) {
    if (!this.isConnected || !this.chromeClient) {
      throw new Error('Not connected to Chrome DevTools. Use connect_chrome tool first.');
    }

    try {
      const { Runtime } = this.chromeClient;
      const result = await Runtime.evaluate({
        expression,
        returnByValue: true,
        generatePreview: true,
      });

      if (result.exceptionDetails) {
        throw new Error(`JavaScript Error: ${result.exceptionDetails.text}`);
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                expression,
                result: result.result.value,
                type: result.result.type,
                description: result.result.description,
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to evaluate expression: ${error.message}`);
    }
  }

  async getBrowserInfo() {
    if (!this.isConnected) {
      return {
        content: [
          {
            type: 'text',
            text: 'Not connected to Chrome DevTools.',
          },
        ],
      };
    }

    try {
      const tabs = await CDP.List();
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                connected: this.isConnected,
                totalConsoleLogs: this.consoleLogs.length,
                tabs: tabs.map((tab) => ({
                  id: tab.id,
                  title: tab.title,
                  url: tab.url,
                  type: tab.type,
                })),
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to get browser info: ${error.message}`);
    }
  }

  async findTabs(urlPattern, port = 9222, host = 'localhost') {
    try {
      const tabs = await CDP.List({ port, host });
      const matchingTabs = tabs.filter(
        (tab) => tab.url.includes(urlPattern) || urlPattern.includes(tab.url)
      );

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                searchPattern: urlPattern,
                totalTabs: tabs.length,
                matchingTabs: matchingTabs.length,
                tabs: matchingTabs.map((tab) => ({
                  id: tab.id,
                  title: tab.title,
                  url: tab.url,
                  type: tab.type,
                })),
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to find tabs: ${error.message}`);
    }
  }

  async navigateToUrl(url) {
    if (!this.isConnected || !this.chromeClient) {
      throw new Error('Not connected to Chrome DevTools. Use connect_chrome tool first.');
    }

    try {
      const { Page } = this.chromeClient;
      await Page.enable();
      await Page.navigate({ url });

      return {
        content: [
          {
            type: 'text',
            text: `Successfully navigated to: ${url}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to navigate to URL: ${error.message}`);
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }
}

const server = new BrowserConsoleServer();
server.run().catch(console.error);
