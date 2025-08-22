# GitHub MCP Server Usage Examples

This document provides practical examples of how to use the GitHub MCP server with your Quran App project.

## Repository Analysis

### View Repository Status
```
User: "What's the current status of my quran-app repository?"

Expected Response: 
- Current branch information
- Uncommitted changes
- Recent commit summary
- Repository statistics
```

### Branch Management
```
User: "Show me all branches in the quran-app repository"

User: "Create a new branch called 'feature/audio-improvements'"

User: "Switch to the mobile-responsive-upgrade branch"
```

### Commit History
```
User: "Show me the last 5 commits on the current branch"

User: "What changes were made in commit 6cf85e16?"

User: "Find commits that mention 'mobile' or 'responsive'"
```

## Code Analysis & Development

### File Operations
```
User: "Show me the structure of the app/shared directory"

User: "What components are in the SurahListSidebar.tsx file?"

User: "Find all TypeScript files that import 'useBreakpoint'"
```

### Issue Management
```
User: "List all open issues in the repository"

User: "Create a new issue for implementing voice search feature"

User: "Show me issues labeled with 'bug' or 'mobile'"
```

### Pull Request Management
```
User: "List all open pull requests"

User: "What files are changed in PR #45?"

User: "Review the changes in the latest pull request"
```

## Development Workflow

### Feature Development
```
User: "I want to add a new prayer times feature. Help me plan this."

Expected Workflow:
1. Claude analyzes existing code structure
2. Creates feature branch
3. Suggests component architecture
4. Identifies integration points
5. Plans testing approach
```

### Code Review Assistant
```
User: "Review the changes in my current working directory"

User: "Are there any potential issues with the responsive design changes?"

User: "Check if the new components follow the project's patterns"
```

### Testing & Quality
```
User: "Find all test files related to the audio player"

User: "What components don't have test coverage?"

User: "Run the linting checks and show me any issues"
```

## Project Management

### Documentation Updates
```
User: "Update the README.md to reflect the new MCP server setup"

User: "Create documentation for the new responsive design patterns"

User: "Check if all new features are documented"
```

### Release Planning
```
User: "What changes have been made since the last release?"

User: "Create a changelog for version 1.2.0"

User: "Tag a new release with the current changes"
```

### Architecture Analysis
```
User: "Analyze the component structure in the features directory"

User: "How is state management handled across the application?"

User: "Show me the API integration patterns used in the project"
```

## Mobile Development Focus

Since your project is on a mobile responsive branch:

### Responsive Design Review
```
User: "Review all components for mobile responsiveness"

User: "Find components that use hardcoded breakpoints"

User: "Check the mobile navigation implementation"
```

### Mobile Performance
```
User: "Identify components that might impact mobile performance"

User: "Review image optimization across the mobile interface"

User: "Check for mobile-specific accessibility issues"
```

### Touch Interface
```
User: "Review touch targets in the mobile interface"

User: "Find gesture implementations in the codebase"

User: "Check mobile keyboard interactions"
```

## Advanced Queries

### Cross-File Analysis
```
User: "Find all usages of the 'useVerseListing' hook across the codebase"

User: "What components depend on the ThemeContext?"

User: "Map the data flow from API to components"
```

### Code Quality Insights
```
User: "Identify duplicate code patterns in the shared components"

User: "Find unused imports across the project"

User: "Review TypeScript strict mode compliance"
```

### Integration Testing
```
User: "Test the MCP server connection with a simple query"

User: "Verify all MCP tools are working correctly"

User: "Check GitHub API rate limits and status"
```

## Tips for Best Results

1. **Be Specific**: Include file paths, component names, or specific features
2. **Context Matters**: Mention the mobile responsive focus when relevant
3. **Iterative Queries**: Build on previous responses for deeper analysis
4. **Combine Tools**: Leverage both file system and GitHub API capabilities

## Common Patterns

The MCP server works best when you:
- Reference specific branches or commits
- Ask about code relationships and dependencies
- Need real-time repository information
- Want to understand project architecture
- Plan development workflows

## Security Reminders

- The GitHub token provides access to your repository
- All operations are performed with your GitHub permissions
- Local file operations respect your system permissions
- No external services access your code beyond GitHub API