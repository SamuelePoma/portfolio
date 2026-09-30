/** True for links that leave the site (absolute http(s) URLs and protocol-relative URLs). */
export function isExternalHref(href: string): boolean {
  return /^(https?:)?\/\//i.test(href);
}
