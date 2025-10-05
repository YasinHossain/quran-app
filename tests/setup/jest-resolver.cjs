/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');
const { createRequire } = require('module');

const DEFAULT_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.json', '.mjs', '.cjs', '.node'];

function fileExists(filePath) {
  return fs.existsSync(filePath) && fs.lstatSync(filePath).isFile();
}

function readPackageMain(candidate) {
  const pkgJsonPath = path.join(candidate, 'package.json');
  if (!fileExists(pkgJsonPath)) {
    return null;
  }

  try {
    const pkgRaw = fs.readFileSync(pkgJsonPath, 'utf8');
    const pkg = JSON.parse(pkgRaw);
    if (pkg && typeof pkg.main === 'string') {
      const mainPath = path.join(candidate, pkg.main);
      if (fileExists(mainPath)) {
        return mainPath;
      }
    }
  } catch {
    // ignore JSON parsing errors and fall back to index resolution
    return null;
  }

  return null;
}

function resolveWithExtensions(candidate, extensions) {
  const exts = extensions && extensions.length ? extensions : DEFAULT_EXTENSIONS;

  for (const ext of [''].concat(exts)) {
    const filePath = ext ? `${candidate}${ext}` : candidate;
    if (fileExists(filePath)) {
      return filePath;
    }
  }

  if (fs.existsSync(candidate) && fs.lstatSync(candidate).isDirectory()) {
    const mainPath = readPackageMain(candidate);
    if (mainPath) {
      return mainPath;
    }

    for (const ext of exts) {
      const indexPath = path.join(candidate, `index${ext}`);
      if (fileExists(indexPath)) {
        return indexPath;
      }
    }
  }

  return null;
}

module.exports = function resolver(request, options) {
  const { defaultResolver, basedir, rootDir = process.cwd() } = options;

  const aliasMatchers = [
    {
      match: (value) => value.startsWith('@/'),
      resolve: (value) => {
        const fromPath = basedir || rootDir;
        const subPath = value.slice(2);
        const isFromQuranCom = fromPath.includes(`${path.sep}quran-com${path.sep}`);

        const candidateRoots = [];
        if (isFromQuranCom) {
          candidateRoots.push(path.join(rootDir, 'quran-com', 'src', subPath));
          candidateRoots.push(path.join(rootDir, 'quran-com', subPath));
        } else {
          candidateRoots.push(path.join(rootDir, subPath));
        }

        return candidateRoots;
      },
    },
    {
      match: (value) => value.startsWith('@tests/'),
      resolve: (value) => {
        const subPath = value.slice('@tests/'.length);
        return [
          path.join(rootDir, 'tests', subPath),
          path.join(rootDir, 'quran-com', 'tests', subPath),
        ];
      },
    },
    {
      match: (value) => value.startsWith('@infra/'),
      resolve: (value) => {
        const subPath = value.slice('@infra/'.length);
        return [path.join(rootDir, 'src', 'infrastructure', subPath)];
      },
    },
  ];

  for (const alias of aliasMatchers) {
    if (!alias.match(request)) {
      continue;
    }

    const candidates = alias.resolve(request);
    for (const candidate of candidates) {
      const resolved = resolveWithExtensions(candidate, options.extensions);
      if (resolved) {
        return resolved;
      }
    }
  }

  if (typeof defaultResolver === 'function') {
    return defaultResolver(request, options);
  }

  // Fallback: resolve using Node's resolution algorithm relative to project root
  try {
    const reqFromRoot = createRequire(path.join(rootDir, 'package.json'));
    return reqFromRoot.resolve(request);
  } catch {
    // continue to fallback resolution
    void 0;
  }

  // Last resort: resolve relative to basedir if provided
  try {
    const from = basedir || rootDir;
    const reqFromBase = createRequire(path.join(from, 'package.json'));
    return reqFromBase.resolve(request);
  } catch (e) {
    const err = new Error(
      `Custom resolver failed to resolve "${request}" from ${basedir || rootDir}: ${e.message}`
    );
    err.cause = e;
    throw err;
  }
};
