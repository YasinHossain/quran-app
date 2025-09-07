/* eslint-disable no-console */
import fs from 'fs';

export interface GeneratorPaths {
  featurePath: string;
  domainPath: string;
}

export const resolvePaths = (featureName: string): GeneratorPaths => ({
  featurePath: `app/(features)/${featureName}`,
  domainPath: 'src/domain/entities',
});

export const ensureDirectories = (dirs: string[]): void => {
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`   Created: ${dir}`);
    }
  }
};

export const writeFile = (filePath: string, content: string, message?: string): void => {
  fs.writeFileSync(filePath, content);
  if (message) {
    console.log(`   Created: ${message}`);
  }
};

export const fileExists = (filePath: string): boolean => fs.existsSync(filePath);
export const readFile = (filePath: string): string => fs.readFileSync(filePath, 'utf8');
export const appendFile = (filePath: string, content: string): void =>
  fs.appendFileSync(filePath, content);
