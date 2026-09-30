const config = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // Allow long bodies (e.g. bullet lists and co-author trailers).
    "body-max-line-length": [0],
    "footer-max-line-length": [0],
  },
};

export default config;
