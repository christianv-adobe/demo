/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: H&M section breaks.
 * Inserts section breaks (<hr>) based on template sections from page-templates.json.
 *
 * Template sections (from page-templates.json):
 * - Section 1: "Page Title and Navigation" - selectors: .editorial-text, .navigation-pills
 * - Section 2: "Category Teasers" - selector: .two-teaser-container
 *
 * Section breaks needed: 1 (before section 2)
 * Section Metadata needed: 0 (no sections have a style property)
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.after) {
    const doc = element.ownerDocument || document;
    const template = payload && payload.template;
    if (!template || !template.sections || template.sections.length < 2) return;

    // Process sections in reverse order to avoid offset issues when inserting elements
    const sections = [...template.sections].reverse();

    sections.forEach((section, reverseIndex) => {
      // Skip the first section (last in reversed array) - no <hr> before first section
      const originalIndex = template.sections.length - 1 - reverseIndex;
      if (originalIndex === 0) return;

      // Find the first element of this section using its selector(s)
      const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
      let sectionElement = null;

      for (const sel of selectors) {
        sectionElement = element.querySelector(sel);
        if (sectionElement) break;
      }

      if (!sectionElement) return;

      // Insert Section Metadata block before the <hr> if section has a style
      if (section.style) {
        // Find the end of the previous section (just before this section element)
        // and append section-metadata there
        const sectionMetadata = WebImporter.Blocks.createBlock(doc, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionElement.before(sectionMetadata);
      }

      // Insert <hr> before this section element (section break)
      const hr = doc.createElement('hr');
      sectionElement.before(hr);
    });
  }
}
