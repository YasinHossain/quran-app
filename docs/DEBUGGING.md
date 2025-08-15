# Debugging

Use these tips to troubleshoot the application.

## Verify Node.js version

Ensure you are using Node.js 20 or later:

```bash
node -v
```

Run `nvm use` if the version does not match `.nvmrc`.

## Check environment variables

Confirm required variables are set and loaded:

```bash
env | grep QURAN_API_BASE_URL
```

Copy `.env.example` to `.env` if variables are missing.

## Enable verbose logs

Enable detailed logging by setting a debug variable before running a command:

```bash
DEBUG=* npm run dev
```

Adjust the value as needed for specific modules.

## Run tests in watch mode

Re-run tests automatically while editing code:

```bash
npm test --watch
```
