/**
 * HTML validity for the prerendered pages (`pnpm validate:html`). The recommended rules,
 * minus a few that only describe how React serialises HTML: they are matters of style,
 * not validity, and the markup isn't written by hand.
 */
const config = {
  extends: ["html-validate:recommended"],
  rules: {
    // React writes void elements as <meta/>, boolean attributes as async="" and keeps
    // camelCase names (srcSet, charSet); browsers parse all of them the same way.
    "void-style": "off",
    "attribute-boolean-style": "off",
    "attribute-empty-style": "off",
    "attr-case": "off",
    // React `style` attributes; the Content-Security-Policy allows inline styles.
    "no-inline-style": "off",
    // HTML5 allows any id without spaces; React generates ids such as "_R_".
    "valid-id": ["error", { relaxed: true }],
  },
};

export default config;
