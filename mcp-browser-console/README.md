# Browser Console MCP Server

An MCP server that connects to Chrome browser via DevTools Protocol to access console logs for debugging.

## Features

- **Real-time console log capture** from Chrome browser
- **Filter logs** by level (log, warn, error, info, debug)
- **Execute JavaScript** in browser console
- **Browser tab information**
- **Live log streaming** via MCP resources

## Setup

1. **Install dependencies:**

```bash
cd mcp-browser-console
npm install
```

2. **Start Chrome with remote debugging:**

```bash
# Windows
chrome.exe --remote-debugging-port=9222

# macOS
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222

# Linux
google-chrome --remote-debugging-port=9222
```

3. **Configure Claude Code MCP:**
   Add to your `.claude/settings.local.json`:

```json
{
  "mcpServers": {
    "browser-console": {
      "command": "node",
      "args": ["C:\\Users\\yasin\\quran-app\\mcp-browser-console\\server.js"],
      "env": {}
    }
  }
}
```

## Usage

### Tools Available:

1. **connect_chrome** - Connect to Chrome DevTools
2. **get_console_logs** - Retrieve browser console logs
3. **clear_console_logs** - Clear log buffer
4. **evaluate_in_browser** - Execute JavaScript in browser
5. **get_browser_info** - Get browser/tab information

### Resources Available:

- **console://logs** - Live console logs as JSON

### Example Commands for Claude Code:

```bash
# Connect to Chrome
connect_chrome

# Get recent error logs
get_console_logs --level error --limit 10

# Execute JavaScript
evaluate_in_browser "console.log('Hello from Claude Code!'); document.title"

# View live logs
@console://logs
```

## Debugging Workflow

1. Start Chrome with debugging enabled
2. Open your web application
3. Connect Claude Code to browser console
4. Ask Claude Code to analyze console errors
5. Execute debugging JavaScript directly from Claude Code

## Security Notes

- Only connects to localhost by default
- Chrome must be explicitly started with remote debugging
- No data is stored permanently, only in memory buffer
