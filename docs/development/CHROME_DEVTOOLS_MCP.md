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

1. From the project root, run `npx -y chrome-devtools-mcp@latest`.
2. Wait for the terminal message indicating that Chrome was launched and the
   MCP server is ready.
3. Inside your MCP-aware client (Codex CLI, Claude Desktop, etc.) tell the
   agent to start or use the `chrome-devtools` server. The CLI reads
   `.mcp.json`, finds the entry we added, and connects automatically.

Because we invoke the server through `npx` with the `@latest` tag, you’ll always
pick up the newest release whenever the agent launches it.

## Optional flags you can pass

You can supply the same flags documented upstream via `.mcp.json` or when
starting manually. A few useful examples:

- `--channel=beta` – launch Chrome Beta instead of Stable.
- `--headless=true` – run Chrome without a visible window for CI environments.
- `--browser-url=http://127.0.0.1:9222` – connect to an already-running Chrome
  that you started with `--remote-debugging-port`.

To change the defaults repo-wide, edit `.mcp.json` and append the flag to the
`args` array.

## Running Chrome with remote debugging (optional)

If you would rather connect to an existing Chrome profile, start Chrome with a
custom user data directory and an open debugging port:

```bash
"C:\Program Files\Google\Chrome\Application\chrome.exe" ^
  --remote-debugging-port=9222 ^
  --user-data-dir="%TEMP%\\chrome-profile-stable"
```

Then update `.mcp.json` (or start the server manually) with
`--browser-url=http://127.0.0.1:9222`.

## Troubleshooting tips

- The server needs a full desktop session; make sure Chrome isn’t blocked by an
  OS sandbox or permissions prompt.
- On Windows 11 + WSL, start the server from Windows Terminal or ensure that
  GUI apps are allowed so Chrome can launch.
- Consult the upstream guide for advanced flags:
  https://github.com/ChromeDevTools/chrome-devtools-mcp.
