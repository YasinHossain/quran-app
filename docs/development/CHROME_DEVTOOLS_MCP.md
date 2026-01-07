# Chrome DevTools MCP Server

The Chrome DevTools MCP server lets any MCP-aware coding agent open a full
Chrome session, browse pages, read the console, record traces, and interact
with DevTools directly from this repository. The workspace configuration now
ships with a ready-to-use server definition so whenever you ask an agent to
“start the chrome mcp server” it can spin up the tooling without any custom
setup.

## Prerequisites

- Node.js 20 or newer (matches `.nvmrc`).
- Chrome Stable installed locally.
- `npx` available (bundled with Node).

> **Security note:** The server exposes the Chrome instance to whatever MCP
> client you connect with. Only run it when you’re comfortable sharing the
> current browser state with the assistant.

## Quick start

1. Start Chrome in headless mode: `npm run start:chrome`.
2. The MCP server is configured in `.mcp.json` to connect to this local instance at `http://localhost:9222`.
3. Inside your MCP-aware client, start the `chrome-devtools` server.

## Configuration

The default `.mcp.json` is configured for a Linux container environment, assuming Chrome is running on `localhost:9222`.

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["-y", "chrome-devtools-mcp@latest", "--browser-url=http://localhost:9222"]
    }
  }
}
```

## Running Chrome with remote debugging (Window/WSL Legacy)

If you are running outside a container or want to connect to a Windows Chrome instance:

1. Start Chrome with remote debugging:

   ```bash
   "C:\Program Files\Google\Chrome\Application\chrome.exe" ^
     --remote-debugging-port=9222 ^
     --user-data-dir="%TEMP%\\chrome-profile-stable"
   ```

2. Update `.mcp.json` to point to the host IP (e.g. `172.xx.xx.xx`) or use proper port forwarding.

## Troubleshooting tips

- The server needs a full desktop session; make sure Chrome isn’t blocked by an
  OS sandbox or permissions prompt.
- On Windows 11 + WSL, start the server from Windows Terminal or ensure that
  GUI apps are allowed so Chrome can launch.
- Consult the upstream guide for advanced flags:
  https://github.com/ChromeDevTools/chrome-devtools-mcp.
