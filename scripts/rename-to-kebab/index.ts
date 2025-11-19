import fs from "fs";
import path from "path";

const root = path.resolve(process.argv[2] || ".");
const exts = new Set([".ts", ".tsx"]);
const IGNORED_DIRS = new Set(["tests"]);

// Alias behavior 
const NEXT_ALIAS = "@/";                    // update only last segment
const IGNORE_ALIAS_PREFIXES = ["@nowcrm/"]; // never touch these

// Detect import statements
const IMPORT_PATTERNS = [
  /import\s+[^'"]*?from\s+(['"])([^'"]+)\1/g,
  /import\s+(['"])([^'"]+)\1/g,
  /require\s*\(\s*(['"])([^'"]+)\1\s*\)/g,
  /import\s*\(\s*(['"])([^'"]+)\1\s*\)/g
];

// Convert to kebab-case
function toKebab(name: string): string {
  return name
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[_\s]+/g, "-")
    .toLowerCase();
}

function shouldIgnoreDir(fullPath: string): boolean {
  const parts = fullPath.split(path.sep);
  return parts.some((p) => IGNORED_DIRS.has(p));
}

// Recursively scan dirs FIRST to rename folders
function listAllItems(dir: string): string[] {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  const paths: string[] = [];

  for (const item of items) {
    const full = path.join(dir, item.name);
    paths.push(full);

    if (item.isDirectory()) {
      paths.push(...listAllItems(full));
    }
  }

  return paths;
}

interface Rename {
  from: string;
  to: string;
}

function computeFolderRenames(allItems: string[]): Rename[] {
  const folderRenames: Rename[] = [];

  for (const item of allItems) {
    if (!fs.existsSync(item)) continue;
    if (!fs.statSync(item).isDirectory()) continue;
    if (shouldIgnoreDir(item)) continue;

    const dirName = path.basename(item);
    const kebab = toKebab(dirName);

    if (dirName !== kebab) {
      folderRenames.push({
        from: item,
        to: path.join(path.dirname(item), kebab)
      });
    }
  }

  return folderRenames.sort(
    // Sort deepest paths first so renaming doesn't break traversal
    (a, b) => b.from.split("/").length - a.from.split("/").length
  );
}

function computeFileRenames(allItems: string[]): Rename[] {
  const fileRenames: Rename[] = [];

  for (const item of allItems) {
    if (!fs.existsSync(item)) continue;
    if (!fs.statSync(item).isFile()) continue;
    if (!exts.has(path.extname(item))) continue;
    if (shouldIgnoreDir(item)) continue;

    const fileName = path.basename(item);
    const ext = path.extname(item);
    const base = fileName.replace(ext, "");

    const kebab = toKebab(base) + ext;

    if (fileName !== kebab) {
      fileRenames.push({
        from: item,
        to: path.join(path.dirname(item), kebab)
      });
    }
  }

  return fileRenames;
}

function isProtectedNextAlias(importPath: string): boolean {
  return importPath.startsWith(NEXT_ALIAS);
}

function isIgnoredExternal(importPath: string): boolean {
  if (!importPath.startsWith(".") && !importPath.startsWith("@")) return true;
  return IGNORE_ALIAS_PREFIXES.some((p) => importPath.startsWith(p));
}

function updateAlias(importPath: string, r: Rename): string {
  const parts = importPath.split("/");
  const last = parts[parts.length - 1];

  const oldName = path.basename(r.from).replace(/\.tsx?$/, "");
  const newName = path.basename(r.to).replace(/\.tsx?$/, "");

  if (last === oldName) {
    parts[parts.length - 1] = newName;
    return parts.join("/");
  }

  return importPath;
}

function normalizeRelative(str: string): string {
  return str.replace(/\\/g, "/").replace(/\.tsx?$/, "");
}

function updateImports(allFiles: string[], renames: Rename[]): void {
  for (const file of allFiles) {
    const code = fs.readFileSync(file, "utf8");
    let updated = code;
    let changed = false;

    for (const r of renames) {
      const oldAbs = normalizeRelative(r.from);
      const newAbs = normalizeRelative(r.to);

      const relOld = normalizeRelative(
        path.relative(path.dirname(file), r.from)
      );
      const relNew = normalizeRelative(
        path.relative(path.dirname(file), r.to)
      );

      const oldName = path.basename(oldAbs);
      const newName = path.basename(newAbs);

      for (const regex of IMPORT_PATTERNS) {
        updated = updated.replace(regex, (m, q, importPath) => {
          if (isIgnoredExternal(importPath)) return m;

          if (isProtectedNextAlias(importPath)) {
            const replaced = updateAlias(importPath, r);
            if (replaced !== importPath) {
              changed = true;
              return m.replace(importPath, replaced);
            }
            return m;
          }

          if (importPath.includes(oldName)) {
            const replaced = importPath.replace(oldName, newName);
            changed = true;
            return m.replace(importPath, replaced);
          }

          if (importPath.includes(relOld)) {
            const replaced = importPath.replace(relOld, relNew);
            changed = true;
            return m.replace(importPath, replaced);
          }

          return m;
        });
      }
    }

    if (changed) {
      fs.writeFileSync(file, updated, "utf8");
    }
  }
}

function applyRenames(renames: Rename[]) {
  for (const r of renames) {
    if (fs.existsSync(r.from)) {
      fs.renameSync(r.from, r.to);
    }
  }
}

function run() {
  const allItems = listAllItems(root);

  const folderRenames = computeFolderRenames(allItems);
  applyRenames(folderRenames);

  const updatedItems = listAllItems(root);
  const fileRenames = computeFileRenames(updatedItems);
  applyRenames(fileRenames);

  const tsFiles = updatedItems.filter((p) => p.endsWith(".ts") || p.endsWith(".tsx"));
  updateImports(tsFiles, [...folderRenames, ...fileRenames]);

  console.log("Renamed", folderRenames.length, "folders and", fileRenames.length, "files.");
  console.log("Completed.");
}

run();
