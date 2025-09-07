# Manual PR Verification Setup Guide

Your PR verification is configured to run **only when requested** via comments. No automatic verification will occur.

## How to Trigger Verification

To run verification on a PR, comment with any of these keywords:

### Quality Checks

- `verify` - Runs full quality verification
- `check` - Runs all quality checks
- `run tests` - Runs the test suite

### Claude Code Review

- `@claude` - Triggers comprehensive code review
- `review` - Requests code review

## Manual Verification Features

When triggered via comments, the system will:

1. **🔍 Run Quality Checks**
   - Security audit
   - Code formatting verification
   - Linting checks
   - TypeScript type checking
   - Test suite with coverage
   - Build verification

2. **🤖 Claude Code Review**
   - Architectural compliance checking
   - Code quality analysis
   - Security vulnerability detection
   - Performance optimization suggestions
   - Testing coverage analysis
   - Mobile responsiveness verification

3. **📝 Automatic Comments**
   - Success notifications with checkmarks
   - Detailed failure reports with specific issues
   - Sticky comments that update on new pushes

## Examples

Comment on any PR with:

- `verify this PR` - Runs quality checks
- `@claude review this code` - Gets comprehensive review
- `check tests` - Runs test verification

## Environment Variables Required

Make sure these secrets are set in repository settings:

- `CLAUDE_CODE_OAUTH_TOKEN` - For Claude code review functionality
- `CODECOV_TOKEN` - For code coverage reporting (optional)

## Testing the Setup

1. Create a test PR
2. Verify all checks run automatically
3. Confirm PR cannot be merged until all checks pass
4. Test that Claude provides comprehensive review feedback

This setup ensures maximum code quality and prevents broken code from reaching your main branch.
