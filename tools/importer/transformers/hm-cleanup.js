/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: H&M site-wide cleanup.
 * Removes non-authorable content from H&M pages.
 *
 * Selectors from live DOM inspection:
 * - [id*="screenreadertext"]: Screen-reader-only heading duplicating page title
 *     (e.g. #hm-components-general-screenreadertext-0)
 * - [id*="breadcrumb"]: Breadcrumb navigation at bottom of main content
 *     (e.g. #hm-components-navigation-breadcrumb-5)
 * - nav.breadcrumb / nav[aria-label="Breadcrumb"]: Breadcrumb in cleaned HTML form
 * - .screen-reader-text: Screen reader text in cleaned HTML form
 * - script: Schema/JSON-LD scripts within main
 * - header, footer: Global site chrome if present within main
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Remove elements that could interfere with block parsing
    // Screen-reader-only headings that duplicate the page title (not authorable)
    WebImporter.DOMUtils.remove(element, [
      '[id*="screenreadertext"]',
      '.screen-reader-text',
      'script',
    ]);
  }
  if (hookName === H.after) {
    // Remove non-authorable site chrome and navigation
    WebImporter.DOMUtils.remove(element, [
      '[id*="breadcrumb"]',
      'nav.breadcrumb',
      'nav[aria-label="Breadcrumb"]',
      'header',
      'footer',
      'noscript',
      'link',
    ]);
  }
}
