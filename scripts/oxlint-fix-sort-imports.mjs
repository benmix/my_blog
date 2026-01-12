import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import ts from "typescript";

const OXLINT_CONFIG = "./.oxlintrc.json";
const TARGET_RULE = "sort-imports";
const DEFAULT_RULE_OPTIONS = {
  ignoreCase: true,
  ignoreDeclarationSort: false,
  ignoreMemberSort: false,
  memberSyntaxSortOrder: ["none", "all", "multiple", "single"],
};

const runOxlintJson = () => {
  if (!existsSync(OXLINT_CONFIG)) {
    throw new Error(`Missing config: ${OXLINT_CONFIG}`);
  }

  const localBin = join("node_modules", ".bin", "oxlint");
  const hasLocalBin = existsSync(localBin);
  const command = hasLocalBin ? localBin : "npx";
  const args = hasLocalBin
    ? ["--config", OXLINT_CONFIG, "-f", "json", "."]
    : ["--no-install", "oxlint", "--config", OXLINT_CONFIG, "-f", "json", "."];

  const result = spawnSync(command, args, { encoding: "utf8" });

  if (result.error) {
    throw result.error;
  }

  if (!result.stdout) {
    throw new Error(`oxlint produced no output. ${result.stderr ?? ""}`);
  }

  return result.stdout;
};

const collectSortImportFiles = (rawJson) => {
  const data = JSON.parse(rawJson);
  const files = new Set();

  const diagnostics = Array.isArray(data.diagnostics) ? data.diagnostics : [];
  for (const diag of diagnostics) {
    if (diag.code === `eslint(${TARGET_RULE})` && diag.filename) {
      files.add(diag.filename);
    }
  }

  return [...files];
};

const loadSortImportOptions = () => {
  let configText = "";
  try {
    configText = readFileSync(OXLINT_CONFIG, "utf8");
  } catch {
    return { ...DEFAULT_RULE_OPTIONS };
  }

  let config = {};
  try {
    config = JSON.parse(configText);
  } catch {
    return { ...DEFAULT_RULE_OPTIONS };
  }

  const rules = config?.rules ?? {};
  const ruleEntry = rules[TARGET_RULE];
  const ruleOptions = Array.isArray(ruleEntry) ? ruleEntry[1] : {};

  return {
    ...DEFAULT_RULE_OPTIONS,
    ...ruleOptions,
  };
};

const getScriptKind = (filePath) => {
  if (filePath.endsWith(".tsx")) {
    return ts.ScriptKind.TSX;
  }
  if (filePath.endsWith(".ts")) {
    return ts.ScriptKind.TS;
  }
  if (filePath.endsWith(".jsx")) {
    return ts.ScriptKind.JSX;
  }
  return ts.ScriptKind.JS;
};

const getMemberSyntaxType = (importClause) => {
  if (!importClause) {
    return "none";
  }

  if (
    importClause.namedBindings &&
    ts.isNamespaceImport(importClause.namedBindings)
  ) {
    return "all";
  }

  if (
    importClause.namedBindings &&
    ts.isNamedImports(importClause.namedBindings)
  ) {
    const namedCount = importClause.namedBindings.elements.length;
    const hasDefault = Boolean(importClause.name);
    if (hasDefault || namedCount > 1) {
      return "multiple";
    }
    return "single";
  }

  if (importClause.name) {
    return "single";
  }

  return "none";
};

const getModuleName = (importDecl) =>
  ts.isStringLiteral(importDecl.moduleSpecifier)
    ? importDecl.moduleSpecifier.text
    : "";

const getImportNameKey = (importClause) => {
  if (!importClause) {
    return "";
  }

  if (importClause.name) {
    return importClause.name.text;
  }

  if (
    importClause.namedBindings &&
    ts.isNamespaceImport(importClause.namedBindings)
  ) {
    return importClause.namedBindings.name.text;
  }

  if (
    importClause.namedBindings &&
    ts.isNamedImports(importClause.namedBindings)
  ) {
    const first = importClause.namedBindings.elements[0];
    if (!first) {
      return "";
    }
    return (first.propertyName ?? first.name).text;
  }

  return "";
};

const sortNamedImports = (namedImports, ignoreCase) => {
  const compare = (a, b) => {
    const aName = (a.propertyName ?? a.name).text;
    const bName = (b.propertyName ?? b.name).text;
    const aKey = ignoreCase ? aName.toLowerCase() : aName;
    const bKey = ignoreCase ? bName.toLowerCase() : bName;
    return aKey.localeCompare(bKey);
  };

  const sorted = [...namedImports.elements].sort(compare);
  return ts.factory.updateNamedImports(namedImports, sorted);
};

const buildSortedImportDecl = (importDecl, ignoreCase, ignoreMemberSort) => {
  if (ignoreMemberSort) {
    return importDecl;
  }

  const importClause = importDecl.importClause;
  if (!importClause || !importClause.namedBindings) {
    return importDecl;
  }

  if (ts.isNamedImports(importClause.namedBindings)) {
    const sortedNamed = sortNamedImports(importClause.namedBindings, ignoreCase);
    const updatedClause = ts.factory.updateImportClause(
      importClause,
      importClause.isTypeOnly,
      importClause.name,
      sortedNamed,
    );
    return ts.factory.updateImportDeclaration(
      importDecl,
      importDecl.modifiers,
      updatedClause,
      importDecl.moduleSpecifier,
      importDecl.assertClause,
    );
  }

  return importDecl;
};

const sortImportsInFile = (filePath, options) => {
  const text = readFileSync(filePath, "utf8");
  const sourceFile = ts.createSourceFile(
    filePath,
    text,
    ts.ScriptTarget.Latest,
    true,
    getScriptKind(filePath),
  );

  const importDecls = [];
  let seenImports = false;
  for (const statement of sourceFile.statements) {
    if (
      !seenImports &&
      ts.isExpressionStatement(statement) &&
      ts.isStringLiteral(statement.expression)
    ) {
      continue;
    }
    if (ts.isImportDeclaration(statement)) {
      seenImports = true;
      importDecls.push(statement);
      continue;
    }
    if (!seenImports) {
      return false;
    }
    break;
  }

  if (importDecls.length === 0) {
    return false;
  }

  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
  const sorted = importDecls
    .map((decl, index) => {
      const updated = buildSortedImportDecl(
        decl,
        options.ignoreCase,
        options.ignoreMemberSort,
      );
      const moduleName = getModuleName(updated);
      const importName = getImportNameKey(updated.importClause);
      const syntaxType = getMemberSyntaxType(updated.importClause);
      const orderIndex = options.memberSyntaxSortOrder.indexOf(syntaxType);
      const resolvedOrder = orderIndex === -1 ? options.memberSyntaxSortOrder.length : orderIndex;
      return {
        index,
        order: resolvedOrder,
        importNameKey: options.ignoreCase
          ? importName.toLowerCase()
          : importName,
        moduleNameKey: options.ignoreCase
          ? moduleName.toLowerCase()
          : moduleName,
        node: updated,
        leadingStart: decl.getFullStart(),
      };
    })
    .sort((a, b) => {
      if (options.ignoreDeclarationSort) {
        return a.index - b.index;
      }
      if (a.order !== b.order) {
        return a.order - b.order;
      }
      const importCompare = a.importNameKey.localeCompare(b.importNameKey);
      if (importCompare !== 0) {
        return importCompare;
      }
      const moduleCompare = a.moduleNameKey.localeCompare(b.moduleNameKey);
      if (moduleCompare !== 0) {
        return moduleCompare;
      }
      return a.index - b.index;
    });

  const statementsText = sorted.map((item) => {
    const ranges = ts.getLeadingCommentRanges(text, item.leadingStart) ?? [];
    const leadingComments = ranges
      .map((range) => text.slice(range.pos, range.end))
      .join("\n");
    const printed = printer.printNode(
      ts.EmitHint.Unspecified,
      item.node,
      sourceFile,
    );
    return leadingComments ? `${leadingComments}\n${printed}` : printed;
  });

  const firstImport = importDecls[0];
  const lastImport = importDecls[importDecls.length - 1];
  let prefix = text.slice(0, firstImport.getFullStart());
  if (prefix.length > 0 && !prefix.endsWith("\n")) {
    prefix += "\n";
  }
  const suffix = text.slice(lastImport.getEnd());
  const sortedBlock = statementsText.join("\n");
  const needsNewline = suffix.length > 0 && !suffix.startsWith("\n");
  const nextText = prefix + sortedBlock + (needsNewline ? "\n" : "") + suffix;

  if (nextText === text) {
    return false;
  }

  writeFileSync(filePath, nextText, "utf8");
  return true;
};

const main = () => {
  const options = loadSortImportOptions();

  let rawJson = "";
  try {
    rawJson = runOxlintJson();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Failed to run oxlint: ${message}`);
    process.exit(1);
  }

  let files = [];
  try {
    files = collectSortImportFiles(rawJson);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Failed to parse oxlint json output: ${message}`);
    process.exit(1);
  }

  if (files.length === 0) {
    console.log("No sort-imports issues found.");
    process.exit(0);
  }

  let touched = 0;
  for (const filePath of files) {
    try {
      if (sortImportsInFile(filePath, options)) {
        touched += 1;
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`Failed to fix ${filePath}: ${message}`);
      process.exit(1);
    }
  }

  console.log(`Fixed sort-imports in ${touched} file(s).`);
};

main();
