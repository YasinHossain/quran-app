# Setting up the Quran App MCP Server with Claude Code

This guide will help you configure Claude Code to use the Quran App MCP server for enhanced AI assistance with your Quran app development.

## Prerequisites

1. **Claude Code** installed and configured
2. **Node.js** 18+ installed
3. **Quran App v1** project cloned locally

## Installation Steps

### 1. Build the MCP Server

```bash
cd mcp-server
npm install
npm run build
```

### 2. Test the Server

```bash
# Test basic functionality
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}' | node dist/index.js

# Test a specific tool
echo '{"jsonrpc": "2.0", "id": 2, "method": "tools/call", "params": {"name": "get_juz_metadata", "arguments": {}}}' | node dist/index.js
```

### 3. Configure Claude Code

Add the MCP server to your Claude Code configuration. The configuration file location varies by platform:

- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

Add this configuration:

```json
{
  "mcpServers": {
    "quran-app": {
      "command": "node",
      "args": ["/full/path/to/quran-app-v1/mcp-server/dist/index.js"],
      "env": {}
    }
  }
}
```

**Important**: Replace `/full/path/to/quran-app-v1/` with the actual absolute path to your project.

### 4. Restart Claude Code

After adding the configuration, restart Claude Code completely to load the new MCP server.

## Verification

Once configured, you can test that the MCP server is working by asking Claude Code questions like:

- "What verses are in Juz 1?"
- "Search for verses about patience"
- "Get me the translation of Ayat al-Kursi (2:255)"
- "Add verse 2:255 to my bookmarks"
- "What are my current user settings?"

## Available Capabilities

The MCP server provides Claude Code with:

### 📖 Quran Data Access
- Get chapters, verses, translations, and tafsir
- Search verses by text or keywords
- Access random verses and specific references

### 🔖 Bookmark Management
- Create, organize, and manage bookmark folders
- Add/remove verses from bookmarks
- Check bookmark status of verses

### ⚙️ Settings Management
- Read and update user preferences
- Manage translation and tafsir selections
- Configure audio and display settings

### 🧭 Navigation Tools
- Get verse context and navigation
- Find verses by reference (chapter:verse)
- Navigate between chapters, pages, and juzs

## Example Usage

With the MCP server configured, Claude Code can help you with tasks like:

```
User: "Help me implement a feature to display verses from Juz 15"

Claude Code: Let me get information about Juz 15 first.
[Uses get_juz_metadata and get_verses_by_juz tools]

I can see Juz 15 contains verses from Al-Israa 1 through Al-Kahf 74. 
Here's how to implement the feature...
```

## Troubleshooting

### Server Not Starting
- Check that Node.js 18+ is installed
- Verify the build completed successfully
- Ensure the path in the configuration is absolute and correct

### Tools Not Available
- Restart Claude Code after configuration changes
- Check the configuration file syntax is valid JSON
- Verify the MCP server path exists and is executable

### API Errors
- Check internet connection (required for Quran.com API)
- Verify the server logs for specific error messages

## Development

To modify or extend the MCP server:

1. Edit files in `mcp-server/src/`
2. Run `npm run build` to recompile
3. Restart Claude Code to reload changes

See the [MCP Server README](mcp-server/README.md) for detailed development information.

## Storage

The MCP server stores user data in:
- **Location**: `~/.quran-app-mcp/`
- **Files**: `bookmarks.json`, `settings.json`

This data is separate from your main app's storage and can be shared between different instances of Claude Code.