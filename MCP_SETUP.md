# GitHub MCP Server Setup for Quran App

This document explains how to set up the GitHub MCP (Model Context Protocol) server for the Quran App project, enabling Claude and other AI assistants to interact directly with the GitHub repository.

## Prerequisites

- Node.js (v18 or higher)
- Claude Desktop app installed
- GitHub Personal Access Token
- Quran App v1 project cloned locally

## Setup Steps

### 1. Create GitHub Personal Access Token

1. Go to GitHub Settings > Developer Settings > Personal Access Tokens > Tokens (classic)
2. Click "Generate new token (classic)"
3. Select the following scopes:
   - `repo` (Full control of private repositories)
   - `read:org` (Read org and team membership)
   - `read:user` (Read user profile data)
   - `user:email` (Access user email addresses)

### 2. Configure Claude Desktop

1. Open Claude Desktop
2. Click the hamburger menu (≡) → Settings → Developer tab
3. Click "Edit Config" to open the configuration file
4. Replace the contents with the configuration from `claude_desktop_config.json` in this directory
5. Replace `YOUR_GITHUB_TOKEN_HERE` with your actual GitHub token

### 3. Available MCP Servers

This setup includes three MCP servers:

#### GitHub Server
- **Purpose**: Direct GitHub repository access
- **Features**: 
  - Repository management
  - Issue and PR handling
  - File operations via GitHub API
  - Branch management

#### Filesystem Server  
- **Purpose**: Local file system access
- **Features**:
  - Read/write files in the project directory
  - Directory listing
  - File operations

#### Git Server
- **Purpose**: Git repository operations
- **Features**:
  - Git status and log
  - Commit operations
  - Branch management
  - Remote operations

### 4. Restart Claude Desktop

After updating the configuration:
1. Completely quit Claude Desktop
2. Restart the application
3. Start a new conversation

### 5. Verify Setup

In a new Claude conversation, you can test the MCP servers by asking:
- "What's the current status of my GitHub repository?"
- "Show me the recent commits"
- "List the files in the project"

## Benefits

With this MCP setup, Claude can:

1. **Direct Repository Access**: 
   - Analyze code without manual file uploads
   - View commit history and branches
   - Read issues and pull requests

2. **Enhanced Development Workflow**:
   - Make informed suggestions based on full project context
   - Help with code reviews and debugging
   - Assist with project planning and documentation

3. **Integrated File Operations**:
   - Read and modify files directly
   - Understand project structure
   - Make contextual recommendations

## Security Notes

- Keep your GitHub token secure and don't share it
- The token has access to your repositories - use appropriate scopes
- MCP servers run locally on your machine
- No data is sent to external services beyond GitHub API calls

## Troubleshooting

If the MCP servers don't work:

1. **Check Node.js version**: `node --version` (should be 18+)
2. **Verify token permissions**: Ensure all required scopes are selected
3. **Restart Claude Desktop**: Completely quit and relaunch
4. **Check configuration**: Ensure JSON syntax is valid in config file

## Usage Examples

Once set up, you can interact with your repository naturally:

```
User: "What files have been changed in the latest commit?"
User: "Show me the current branch and any uncommitted changes"
User: "Create a new feature branch for implementing dark mode"
User: "What issues are currently open on this repository?"
```

Claude will use the MCP servers to provide accurate, real-time information about your repository and project state.
