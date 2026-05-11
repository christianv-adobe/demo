/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-teaser.
 * Base block: cards.
 * Source selector: .two-teaser-container, [id*=twoteasercontainer]
 * Validation: H&M CDN blocks headless browsers (Access Denied). Parser verified against cached source.html manually.
 * Generated: 2026-05-11
 *
 * Extracts teaser items from the two-teaser container.
 * Each teaser becomes a row with:
 *   - Column 1: picture/image element
 *   - Column 2: heading + CTA link
 *
 * Source HTML structure (validated against cached source):
 *   .two-teaser-container
 *     .teaser
 *       .teaser-image > picture > img
 *       .teaser-content > h2 + a[href]
 *
 * Also handles live page structure with data-testid selectors.
 */
export default function parse(element, { document }) {
  // Find teaser items using multiple strategies
  // Strategy 1: semantic class names (from scraped/cached HTML)
  let teasers = element.querySelectorAll('.teaser');

  // Strategy 2: data-testid attribute (live React page)
  if (teasers.length === 0) {
    teasers = element.querySelectorAll('[data-testid="stage-teaser-container"]');
  }

  // Strategy 3: find divs that contain both a picture/img and a heading
  if (teasers.length === 0) {
    const allDivs = Array.from(element.querySelectorAll('div'));
    const matched = [];
    allDivs.forEach((div) => {
      const hasPic = div.querySelector('picture, img');
      const hasHeading = div.querySelector('h2, h3');
      const hasLink = div.querySelector('a[href]');
      if (hasPic && hasHeading && hasLink) {
        // Ensure we don't select ancestors of already-matched elements
        const isChild = matched.some((m) => m.contains(div));
        const isParent = matched.some((m) => div.contains(m));
        if (!isChild && !isParent) {
          matched.push(div);
        }
      }
    });
    teasers = matched;
  }

  const cells = [];

  teasers.forEach((teaser) => {
    // Column 1: Extract picture element (prefer <picture> over standalone <img>)
    const picture = teaser.querySelector('picture') || teaser.querySelector('img');

    // Column 2: Extract heading and CTA link
    const heading = teaser.querySelector('h2, h3, h1');
    const ctaLink = teaser.querySelector('a[href]');

    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (ctaLink) contentCell.push(ctaLink);

    cells.push([picture || '', contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-teaser', cells });
  element.replaceWith(block);
}
