# Domain Layer

This directory contains the core business logic and entities for the Quran app.

## Current Structure

### Entities (`entities/`)
- **Bookmark** - Verse bookmarking with metadata
- **Folder** - Bookmark organization and management  
- **Verse** - Quranic verse with translations and audio
- **Word** - Individual word with translation data
- **MemorizationPlan** - Progress tracking for memorization

### Repository Interfaces (`repositories/`)
- **IBookmarkRepository** - Bookmark data persistence
- **IVerseRepository** - Verse data retrieval and caching

### Use Cases (`usecases/`)
- **bookmark/** - Bookmark management business logic

## Future Features

Grammar research features are archived in `_future/` directory and can be integrated when needed.

## Design Principles

- **Immutable Entities** - All entities return new instances for changes
- **Rich Domain Models** - Business logic encapsulated in entities
- **Clean Interfaces** - Repository interfaces abstract storage details
- **Testable** - Domain logic independent of external dependencies