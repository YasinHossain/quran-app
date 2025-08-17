#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

import { quranTools, handleQuranTool } from './tools/quran-tools.js';
import { bookmarkTools, handleBookmarkTool } from './tools/bookmark-tools.js';
import { settingsTools, handleSettingsTool } from './tools/settings-tools.js';
import { navigationTools, handleNavigationTool } from './tools/navigation-tools.js';

class QuranMCPServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'quran-app-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  private setupToolHandlers(): void {
    // Combine all tools
    const allTools = [...quranTools, ...bookmarkTools, ...settingsTools, ...navigationTools];

    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: allTools,
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        // Route to appropriate handler based on tool name
        if (quranTools.some((tool) => tool.name === name)) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(await handleQuranTool(name, args), null, 2),
              },
            ],
          };
        }

        if (bookmarkTools.some((tool) => tool.name === name)) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(await handleBookmarkTool(name, args), null, 2),
              },
            ],
          };
        }

        if (settingsTools.some((tool) => tool.name === name)) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(await handleSettingsTool(name, args), null, 2),
              },
            ],
          };
        }

        if (navigationTools.some((tool) => tool.name === name)) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(await handleNavigationTool(name, args), null, 2),
              },
            ],
          };
        }

        throw new Error(`Unknown tool: ${name}`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ error: errorMessage }, null, 2),
            },
          ],
          isError: true,
        };
      }
    });
  }

  private setupErrorHandling(): void {
    this.server.onerror = (error) => {
      console.error('[MCP Error]', error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Quran App MCP Server running on stdio');
  }
}

const server = new QuranMCPServer();
server.run().catch(console.error);
