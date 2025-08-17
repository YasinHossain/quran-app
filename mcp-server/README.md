# Quran App MCP Server

A Model Context Protocol (MCP) server that provides AI assistants with access to Quran data and functionality from your Quran App v1.

## Features

### 📖 Quran Data Access

- **Chapters & Verses**: Get chapters, verses by chapter/juz/page
- **Translations**: Access multiple translation resources
- **Tafsir**: Retrieve commentary from various scholars
- **Search**: Find verses by text or keywords
- **Random Verses**: Get random verses for inspiration

### 🔖 Bookmark Management

- **CRUD Operations**: Create, read, update, delete bookmarks
- **Folder Organization**: Organize bookmarks into folders
- **Quick Access**: Check if verses are bookmarked

### ⚙️ Settings Management

- **User Preferences**: Theme, language, fonts, audio settings
- **Translation Selection**: Manage selected translations and tafsirs
- **Audio Configuration**: Reciter selection and playback options

### 🧭 Navigation Tools

- **Verse Context**: Get surrounding verses for context
- **Reference Lookup**: Find verses by chapter:verse notation
- **Location Finding**: Determine page/juz for any verse
- **Navigation Info**: Previous/next verse/chapter information

## Installation

1. **Install dependencies:**

   ```bash
   cd mcp-server
   npm install
   ```

2. **Build the server:**

   ```bash
   npm run build
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

## Configuration for Claude Code

Add this configuration to your Claude Code MCP settings:

```json
{
  "mcpServers": {
    "quran-app": {
      "command": "node",
      "args": ["/path/to/quran-app-v1/mcp-server/dist/index.js"],
      "env": {}
    }
  }
}
```

## Available Tools

### Quran Data Tools

- `get_chapters` - List all Quran chapters
- `get_chapter` - Get specific chapter details
- `get_verses_by_chapter` - Get verses from a chapter
- `get_verses_by_juz` - Get verses from a juz (para)
- `get_verses_by_page` - Get verses from a Mushaf page
- `get_verse` - Get specific verse by ID
- `search_verses` - Search verses by text
- `get_random_verse` - Get a random verse
- `get_translations` - List available translations
- `get_tafsir_resources` - List available tafsir sources
- `get_tafsir` - Get tafsir for a specific verse

### Bookmark Tools

- `get_bookmarks` - Get all bookmark folders
- `add_bookmark` - Add verse to bookmarks
- `remove_bookmark` - Remove verse from bookmarks
- `create_bookmark_folder` - Create new folder
- `delete_bookmark_folder` - Delete folder
- `rename_bookmark_folder` - Rename folder
- `is_bookmarked` - Check if verse is bookmarked

### Settings Tools

- `get_user_settings` - Get current user settings
- `update_user_settings` - Update user preferences
- `get_arabic_fonts` - List available Arabic fonts
- `reset_settings` - Reset to default settings

### Navigation Tools

- `navigate_to_verse` - Get navigation info for a verse
- `get_verse_context` - Get surrounding verses
- `find_verse_by_reference` - Find verses by chapter:verse
- `get_surah_navigation` - Get surah navigation info
- `get_page_navigation` - Get page navigation info
- `get_juz_navigation` - Get juz navigation info
- `find_verse_location` - Find page/juz for a verse

## Usage Examples

### Finding and Reading Verses

```typescript
// Get Ayat al-Kursi (Quran 2:255)
await mcp.call('navigate_to_verse', {
  verseKey: '2:255',
  translationIds: [20, 131], // Sahih International + Pickthall
});

// Get context around the verse
await mcp.call('get_verse_context', {
  verseKey: '2:255',
  contextBefore: 2,
  contextAfter: 2,
});
```

### Managing Bookmarks

```typescript
// Create a folder for favorite verses
const result = await mcp.call('create_bookmark_folder', {
  name: 'Daily Reflection',
});

// Add Ayat al-Kursi to the folder
await mcp.call('add_bookmark', {
  verseKey: '2:255',
  folderId: result.folderId,
});
```

### Searching the Quran

```typescript
// Search for verses about patience
const results = await mcp.call('search_verses', {
  query: 'patience',
  size: 10,
});
```

## Development

### Scripts

- `npm run build` - Build TypeScript to JavaScript
- `npm run dev` - Watch mode for development
- `npm start` - Start the compiled server
- `npm run inspector` - Start with Node.js inspector

### Adding New Tools

1. Define the tool schema in the appropriate `tools/*.ts` file
2. Implement the handler function
3. Add the tool to the main server in `index.ts`

## Data Storage

The MCP server uses local file storage for user data:

- **Location**: `~/.quran-app-mcp/`
- **Files**: `bookmarks.json`, `settings.json`
- **Format**: JSON with automatic backup

## API Dependencies

- **Quran.com API**: Primary source for Quran data
- **Local Data**: Juz metadata from `../data/juz.json`

## Error Handling

All tools include comprehensive error handling:

- API failures are gracefully handled
- Invalid parameters return helpful error messages
- Network issues are caught and reported

## Security

- No external network access except Quran.com API
- Local storage only in user's home directory
- No sensitive data handling
- Read-only access to app's data files

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add your tool implementation
4. Update this README with new tools
5. Submit a pull request

## License

MIT License - see the main project LICENSE file.
