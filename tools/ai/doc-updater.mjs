#!/usr/bin/env node

import { register } from 'ts-node';
import { createRequire } from 'module';

register({ transpileOnly: true, compilerOptions: { module: 'commonjs' } });
const require = createRequire(import.meta.url);

const { getChangedFiles, identifyDocsToUpdate } = require('./scanner.ts');
const { updateDocFile, updateComponentRegistry, updateArchitectureMap } = require('./writer.ts');

(async () => {
  console.log('📚 Running AI Documentation Updates...\n');

  try {
    const changedFiles = getChangedFiles();
    const docsToUpdate = identifyDocsToUpdate(changedFiles);

    for (const docPath of docsToUpdate) {
      await updateDocFile(docPath, changedFiles);
    }

    await updateComponentRegistry();
    await updateArchitectureMap();

    console.log('✅ Documentation updates complete!');
  } catch (error) {
    console.error('❌ Documentation update error:', error.message);
    process.exit(1);
  }
})();
