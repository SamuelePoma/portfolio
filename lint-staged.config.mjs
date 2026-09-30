const config = {
  "*.{ts,tsx,js,mjs,mts}": ["eslint --fix --max-warnings=0", "prettier --write"],
  "*.{json,css,yml,yaml,md}": ["prettier --write"],
  // Type errors can surface in files that weren't staged, so check the whole project.
  "*.{ts,tsx,mts}": () => "pnpm typecheck",
};

export default config;
