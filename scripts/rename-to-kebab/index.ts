import { readdir, stat, rename, readFile, writeFile } from 'fs/promises';
import { join, dirname, basename, extname, relative, resolve } from 'path';
import { existsSync } from 'fs';

type RenameMapping = {
  oldPath: string;
  newPath: string;
  type: 'file' | 'directory';
};

/**
 * Converts a name to kebab-case
 * Handles camelCase, PascalCase, and snake_case
 */
const toKebabCase = (name: string): string => {
  // Remove file extension for processing
  const ext = extname(name);
  const nameWithoutExt = basename(name, ext);

  // If already in kebab-case, return as is
  if (/^[a-z0-9]+(-[a-z0-9]+)*$/.test(nameWithoutExt)) {
    return name;
  }

  // Convert camelCase/PascalCase to kebab-case
  let result = nameWithoutExt
    // Insert space before capital letters
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    // Insert space before capital letters at start
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    // Replace underscores and spaces with hyphens
    .replace(/[_\s]+/g, '-')
    // Convert to lowercase
    .toLowerCase()
    // Remove multiple consecutive hyphens
    .replace(/-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '');

  return result + ext;
};

/**
 * Recursively finds all files and directories that need renaming
 */
const findItemsToRename = async (
  dir: string,
  rootDir: string,
  mappings: RenameMapping[] = []
): Promise<RenameMapping[]> => {
  const items = await readdir(dir);

  for (const item of items) {
    const fullPath = join(dir, item);
    const stats = await stat(fullPath);

    if (stats.isDirectory()) {
      // Skip node_modules, .git, dist, .next, tests, etc.
      if (
        item.startsWith('.') ||
        item === 'node_modules' ||
        item === 'dist' ||
        item === '.next' ||
        item === 'build' ||
        item === 'tests' ||
        item === 'test'
      ) {
        continue;
      }

      const kebabName = toKebabCase(item);
      if (kebabName !== item) {
        const relativeOldPath = relative(rootDir, fullPath);
        const relativeNewPath = join(
          dirname(relativeOldPath),
          kebabName
        ).replace(/\\/g, '/');
        mappings.push({
          oldPath: fullPath,
          newPath: join(rootDir, relativeNewPath),
          type: 'directory',
        });
      }

      // Recurse into directory (always use current path, not renamed)
      await findItemsToRename(fullPath, rootDir, mappings);
    } else if (stats.isFile()) {
      // Only process TypeScript/JavaScript files
      const ext = extname(item);
      if (
        !['.ts', '.tsx', '.js', '.jsx', '.json'].includes(ext) &&
        !item.endsWith('.d.ts')
      ) {
        continue;
      }

      const kebabName = toKebabCase(item);
      if (kebabName !== item) {
        const relativeOldPath = relative(rootDir, fullPath);
        const relativeNewPath = join(
          dirname(relativeOldPath),
          kebabName
        ).replace(/\\/g, '/');
        mappings.push({
          oldPath: fullPath,
          newPath: join(rootDir, relativeNewPath),
          type: 'file',
        });
      }
    }
  }

  return mappings;
};

/**
 * Builds a mapping of old import paths to new import paths
 */
const buildImportMappings = (
  mappings: RenameMapping[],
  rootDir: string
): Array<{ oldPath: string; newPath: string }> => {
  const importMappings: Array<{ oldPath: string; newPath: string }> = [];

  for (const mapping of mappings) {
    const relativeOldPath = relative(rootDir, mapping.oldPath).replace(
      /\\/g,
      '/'
    );
    const relativeNewPath = relative(rootDir, mapping.newPath).replace(
      /\\/g,
      '/'
    );

    if (mapping.type === 'file') {
      // For files, map both with and without extension
      const oldImportPath = relativeOldPath.replace(/\.(ts|tsx|js|jsx)$/, '');
      const newImportPath = relativeNewPath.replace(/\.(ts|tsx|js|jsx)$/, '');
      
      // Map the full path without extension
      importMappings.push({
        oldPath: oldImportPath,
        newPath: newImportPath,
      });

      // Map individual file name (for cases like "@/lib/config/RoutesConfig")
      const oldFileName = basename(oldImportPath);
      const newFileName = basename(newImportPath);
      if (oldFileName !== newFileName) {
        importMappings.push({
          oldPath: oldFileName,
          newPath: newFileName,
        });
      }

      // Handle index files
      if (basename(oldImportPath) === 'index') {
        const oldDir = dirname(oldImportPath);
        const newDir = dirname(newImportPath);
        importMappings.push({
          oldPath: oldDir,
          newPath: newDir,
        });
      }
    } else {
      // For directories, map the directory name and full path
      const oldDirName = basename(relativeOldPath);
      const newDirName = basename(relativeNewPath);
      
      // Map the full directory path
      importMappings.push({
        oldPath: relativeOldPath,
        newPath: relativeNewPath,
      });

      // Map just the directory name (for partial matches)
      importMappings.push({
        oldPath: oldDirName,
        newPath: newDirName,
      });
    }
  }

  // Sort by length (longest first) to ensure we match longest paths first
  return importMappings.sort((a, b) => b.oldPath.length - a.oldPath.length);
};

/**
 * Updates a single import path using the mappings
 */
const updateImportPath = (
  importPath: string,
  importMappings: Array<{ oldPath: string; newPath: string }>
): string | null => {
  // Try to find matching mapping (longest match first)
  for (const { oldPath, newPath } of importMappings) {
    // Check for exact match
    if (importPath === oldPath) {
      return newPath;
    }

    // Check if import path starts with old path + '/' (for directory matches)
    // This handles cases like "@/lib/actions/scheduled_composition/get-scheduled-composition"
    // where oldPath is "lib/actions/scheduled_composition"
    if (importPath.startsWith(oldPath + '/')) {
      return importPath.replace(oldPath, newPath);
    }

    // Check if any path segment matches (for folder/file name matches)
    // This handles cases where just a folder or file name needs to change
    const pathParts = importPath.split('/');
    const updatedParts = [...pathParts];
    
    for (let i = 0; i < pathParts.length; i++) {
      // Match exact segment
      if (pathParts[i] === oldPath) {
        updatedParts[i] = newPath;
        return updatedParts.join('/');
      }
    }
  }

  return null;
};

/**
 * Updates imports in a file
 */
const updateImportsInFile = async (
  filePath: string,
  importMappings: Array<{ oldPath: string; newPath: string }>,
  rootDir: string
): Promise<boolean> => {
  const content = await readFile(filePath, 'utf-8');
  let updated = false;
  let newContent = content;

  // Match static import/export statements with @/ paths
  // Example: import X from "@/path/to/file"
  const staticImportRegex =
    /(import|export)(\s+.*?\s+from\s+)?(["']@\/([^"']+)["'])/g;

  newContent = newContent.replace(
    staticImportRegex,
    (match, keyword, middle, fullImport, importPath) => {
      const updatedPath = updateImportPath(importPath, importMappings);
      if (updatedPath && updatedPath !== importPath) {
        updated = true;
        const updatedImport = fullImport.replace(importPath, updatedPath);
        return `${keyword}${middle || ''}${updatedImport}`;
      }
      return match;
    }
  );

  // Match dynamic import statements with @/ paths
  // Example: await import("@/path/to/file") or import("@/path/to/file")
  const dynamicImportRegex = /(?:await\s+)?import\s*\(\s*(["']@\/([^"']+)["'])\s*\)/g;

  newContent = newContent.replace(
    dynamicImportRegex,
    (match, fullImport, importPath) => {
      const updatedPath = updateImportPath(importPath, importMappings);
      if (updatedPath && updatedPath !== importPath) {
        updated = true;
        const updatedImport = fullImport.replace(importPath, updatedPath);
        return match.replace(fullImport, updatedImport);
      }
      return match;
    }
  );

  // Handle file names in import paths (e.g., Editor -> editor)
  // Check if any import path ends with a capitalized file name that should be lowercase
  const filePathRegex = /(["']@\/([^"']+)["'])/g;
  
  newContent = newContent.replace(filePathRegex, (match, fullImport, importPath) => {
    const pathParts = importPath.split('/');
    const lastPart = pathParts[pathParts.length - 1];
    
    // If the last part starts with a capital letter and is not already in mappings,
    // check if we should convert it to kebab-case
    if (lastPart && /^[A-Z]/.test(lastPart)) {
      const kebabLastPart = toKebabCase(lastPart);
      if (kebabLastPart !== lastPart) {
        pathParts[pathParts.length - 1] = kebabLastPart;
        const updatedPath = pathParts.join('/');
        updated = true;
        return fullImport.replace(importPath, updatedPath);
      }
    }
    
    return match;
  });

  if (updated) {
    await writeFile(filePath, newContent, 'utf-8');
    return true;
  }

  return false;
};

/**
 * Recursively updates imports in all files
 */
const updateImportsInDirectory = async (
  dir: string,
  importMappings: Array<{ oldPath: string; newPath: string }>,
  rootDir: string
): Promise<number> => {
  let updatedCount = 0;

  try {
    const items = await readdir(dir);

    for (const item of items) {
      const fullPath = join(dir, item);

      // Skip certain directories
      if (
        item.startsWith('.') ||
        item === 'node_modules' ||
        item === 'dist' ||
        item === '.next' ||
        item === 'build' ||
        item === 'tests' ||
        item === 'test'
      ) {
        continue;
      }

      const stats = await stat(fullPath);

      if (stats.isDirectory()) {
        updatedCount += await updateImportsInDirectory(
          fullPath,
          importMappings,
          rootDir
        );
      } else if (stats.isFile()) {
        const ext = extname(item);
        if (
          ['.ts', '.tsx', '.js', '.jsx'].includes(ext) ||
          item.endsWith('.d.ts')
        ) {
          const wasUpdated = await updateImportsInFile(
            fullPath,
            importMappings,
            rootDir
          );
          if (wasUpdated) {
            updatedCount++;
          }
        }
      }
    }
  } catch (error) {
    console.error(`Error processing directory ${dir}:`, error);
  }

  return updatedCount;
};

/**
 * Main function
 */
const main = async () => {
  const rootDir = resolve(process.cwd(), 'apps/nowcrm');
  console.log(`Starting rename to kebab-case in: ${rootDir}`);

  if (!existsSync(rootDir)) {
    console.error(`Directory not found: ${rootDir}`);
    process.exit(1);
  }

  try {
    // Step 1: Find all items that need renaming
    console.log('Step 1: Finding files and directories to rename...');
    const mappings = await findItemsToRename(rootDir, rootDir);
    console.log(`Found ${mappings.length} items to rename`);

    if (mappings.length === 0) {
      console.log('No items need renaming. All files and folders are already in kebab-case.');
      return;
    }

    // Sort mappings: files first (deepest first), then directories (deepest first)
    // This ensures files are renamed before their parent directories
    mappings.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'file' ? -1 : 1; // Files first
      }
      // For same type, deeper paths first
      const depthA = a.oldPath.split(/[/\\]/).length;
      const depthB = b.oldPath.split(/[/\\]/).length;
      return depthB - depthA;
    });

    // Step 2: Build import mappings (before any renames)
    console.log('Step 2: Building import path mappings...');
    const importMappings = buildImportMappings(mappings, rootDir);

    // Step 3: Rename files first (deepest first)
    console.log('Step 3: Renaming files...');
    let fileCount = 0;
    for (const mapping of mappings) {
      if (mapping.type === 'file') {
        try {
          // Check if destination already exists
          if (existsSync(mapping.newPath)) {
            console.log(`  ⚠ Skipping ${relative(rootDir, mapping.oldPath)} - destination already exists`);
            continue;
          }

          // Check if file exists at oldPath
          if (!existsSync(mapping.oldPath)) {
            console.log(`  ⚠ Skipping ${relative(rootDir, mapping.oldPath)} - file not found`);
            continue;
          }

          await rename(mapping.oldPath, mapping.newPath);
          console.log(`  ✓ ${relative(rootDir, mapping.oldPath)} → ${relative(rootDir, mapping.newPath)}`);
          fileCount++;
        } catch (error) {
          const err = error as { code?: string; message?: string };
          console.error(`  ✗ Failed to rename ${relative(rootDir, mapping.oldPath)}:`, err.message || error);
        }
      }
    }
    console.log(`Renamed ${fileCount} files`);

    // Step 4: Rename directories (deepest first)
    console.log('Step 4: Renaming directories...');
    let dirCount = 0;
    for (const mapping of mappings) {
      if (mapping.type === 'directory') {
        try {
          // Check if destination already exists
          if (existsSync(mapping.newPath)) {
            console.log(`  ⚠ Skipping ${relative(rootDir, mapping.oldPath)} - destination already exists`);
            continue;
          }

          // Check if old path still exists
          if (!existsSync(mapping.oldPath)) {
            console.log(`  ⚠ Skipping ${relative(rootDir, mapping.oldPath)} - already renamed`);
            continue;
          }

          await rename(mapping.oldPath, mapping.newPath);
          console.log(`  ✓ ${relative(rootDir, mapping.oldPath)} → ${relative(rootDir, mapping.newPath)}`);
          dirCount++;
        } catch (error) {
          const err = error as { code?: string; message?: string };
          if (err.code === 'ENOTEMPTY') {
            console.error(`  ✗ Failed to rename ${relative(rootDir, mapping.oldPath)}: Directory not empty. This may happen if files inside need renaming first.`);
          } else {
            console.error(`  ✗ Failed to rename ${relative(rootDir, mapping.oldPath)}:`, err.message || error);
          }
        }
      }
    }
    console.log(`Renamed ${dirCount} directories`);

    // Step 5: Update imports in all files
    console.log('Step 5: Updating imports...');
    const updatedFiles = await updateImportsInDirectory(
      rootDir,
      importMappings,
      rootDir
    );
    console.log(`Updated imports in ${updatedFiles} files`);

    console.log('\n✓ Rename to kebab-case completed successfully!');
  } catch (error) {
    console.error('Error during rename:', error);
    process.exit(1);
  }
};

main();
