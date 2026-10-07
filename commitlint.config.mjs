const config = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // Long bodies are fine: bullet lists and links rarely fit 100 characters.
    "body-max-line-length": [0],
    "footer-max-line-length": [0],
  },
};

export default config;
