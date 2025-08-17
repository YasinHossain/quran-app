# Quran App MCP Server - Usage Examples

Your MCP server is now configured and working! Here are examples of how to use it with Claude Code.

## ✅ Current Status

- **MCP Server**: Successfully built and running
- **Claude Code**: Configured and connected
- **Tools Available**: 27 tools across 4 categories

## 🚀 Quick Test Commands

### Basic Usage (with permission bypass for testing)

```bash
# Get Juz metadata
echo "Get the Juz metadata" | claude --dangerously-skip-permissions --print

# Search for verses
echo "Search for verses about 'mercy'" | claude --dangerously-skip-permissions --print

# Add a bookmark
echo "Add verse 1:1 to my bookmarks" | claude --dangerously-skip-permissions --print

# View bookmarks
echo "Show me my bookmarks" | claude --dangerously-skip-permissions --print
```

### Interactive Usage (recommended)

```bash
# Start interactive session
claude

# Then ask:
# "Get information about Juz 15"
# "Search for verses containing 'guidance'"
# "Add 2:255 to my bookmarks"
# "What are my current user settings?"
```

## 📖 Example Queries

### Quran Data

- "What verses are in Juz 1?"
- "Get me verses from chapter 2 (Al-Baqarah)"
- "Find the translation of verse 2:255"
- "Get random verse for daily reflection"
- "What tafsir is available for verse 3:110?"

### Navigation

- "Get context around verse 2:255 (2 verses before and after)"
- "Find verse 112:1 and tell me about its location"
- "Navigate to Surah Al-Fatiha and show me navigation options"

### Bookmarks

- "Create a new bookmark folder called 'Daily Reflections'"
- "Add verse 2:255 to my 'Favorites' folder"
- "Show me all my bookmarked verses"
- "Remove verse 1:1 from bookmarks"

### Settings

- "What are my current user settings?"
- "Update my theme to dark mode"
- "Add translation ID 131 to my selected translations"
- "What Arabic fonts are available?"

### Development Queries

- "Help me implement a feature to display verses from Juz 15"
- "How should I structure the bookmark component based on the current data?"
- "What API endpoints does my app use for verse translations?"

## 🔧 Permission Management

### First Time Setup

1. Start Claude Code: `claude`
2. Ask a question that requires MCP tools
3. Grant permissions when prompted
4. Future requests will remember your preferences

### For Testing/Development

Use `--dangerously-skip-permissions` flag:

```bash
claude --dangerously-skip-permissions
```

## 💡 Advanced Usage

### Combining Multiple Operations

```bash
claude --print "Search for verses about 'prayer', add the first result to bookmarks, then show me my bookmark folders"
```

### Development Assistance

```bash
claude "I want to add a feature to display the current user's favorite verses. Use the MCP server to understand the bookmark structure and help me implement this."
```

### Data Analysis

```bash
claude "Analyze the structure of Juz metadata and suggest how to improve the navigation in my app"
```

## 🐛 Troubleshooting

### MCP Server Not Responding

```bash
# Check server status
claude mcp list

# Restart if needed
claude mcp remove quran-app
claude mcp add quran-app node ./mcp-server/dist/index.js
```

### Permission Issues

- Use `--dangerously-skip-permissions` for testing
- In interactive mode, grant permissions when prompted
- Permissions are remembered for future sessions

### API Errors

- Ensure internet connection (Quran.com API required)
- Check server logs: MCP server outputs to stderr
- Rebuild server: `cd mcp-server && npm run build`

## 📈 Benefits for Development

1. **Faster Context**: Get verse data without reading files
2. **Real-time Data**: Live access to Quran.com API
3. **Reduced Tokens**: Targeted queries vs full file reads
4. **Better Understanding**: AI knows your app's data structure
5. **Enhanced Development**: AI can suggest features based on actual data

## 🎯 What's Next

Your MCP server is fully functional! You can now:

- Develop features with AI assistance that understands your Quran data
- Test bookmark and settings functionality
- Get real-time verse searches and translations
- Have AI suggest improvements based on actual app structure

The MCP server will make your development workflow significantly more efficient by giving Claude Code deep understanding of your Quran app's capabilities and data.
