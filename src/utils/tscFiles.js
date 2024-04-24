const { spawnSync } = require("child_process");
const fs = require("fs");
const { join } = require("path");

module.exports = function tscFiles(args, tscOutputFileName, alwaysInclude) {
  const randomChars = () => {
    return Math.random().toString(36).slice(2);
  };

  const resolveFromRoot = (...paths) => {
    return join(process.cwd(), ...paths);
  };

  const argsProjectIndex = args.findIndex((arg) =>
    ["-p", "--project"].includes(arg)
  );

  const argsProjectValue =
    argsProjectIndex !== -1 ? args[argsProjectIndex + 1] : undefined;

  const files = args.filter((file) => /\.(ts|tsx)$/.test(file));
  if (files.length === 0) {
    return
  }

  const remainingArgsToForward = args
    .slice()
    .filter((arg) => !files.includes(arg));

  if (argsProjectIndex !== -1) {
    remainingArgsToForward.splice(argsProjectIndex, 2);
  }

  // Load existing config
  const tsconfigPath = argsProjectValue || resolveFromRoot("tsconfig.json");
  const tsconfigContent = fs.readFileSync(tsconfigPath).toString();
  // Use 'eval' to read the JSON as regular JavaScript syntax so that comments are allowed
  let tsconfig = {};
  eval(`tsconfig = ${tsconfigContent}`);

  // Write a temp config file
  const tmpTsconfigPath = resolveFromRoot(`tsconfig.${randomChars()}.json`);
  const tmpTsconfig = {
    ...tsconfig,
    compilerOptions: {
      ...tsconfig.compilerOptions,
      skipLibCheck: true,
      composite: true,
    },
    files,
    include: Array.isArray(alwaysInclude) ? alwaysInclude : [],
  };
  fs.writeFileSync(tmpTsconfigPath, JSON.stringify(tmpTsconfig, null, 2));

  // Attach cleanup handlers
  let didCleanup = false;
  for (const eventName of ["exit", "SIGHUP", "SIGINT", "SIGTERM"]) {
    process.on(eventName, () => {
      if (didCleanup) return;
      didCleanup = true;

      fs.unlinkSync(tmpTsconfigPath);
    });
  }

  // Type-check our files
  const { status } = spawnSync(
    "tsc",
    ["-p", tmpTsconfigPath, "--noEmit", "--tsBuildInfoFile", tscOutputFileName],
    { stdio: "ignore" }
  );

  return status
};
