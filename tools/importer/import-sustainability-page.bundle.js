/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-sustainability-page.js
  var import_sustainability_page_exports = {};
  __export(import_sustainability_page_exports, {
    default: () => import_sustainability_page_default
  });

  // tools/importer/parsers/cards-teaser.js
  function parse(element, { document: document2 }) {
    let teasers = element.querySelectorAll(".teaser");
    if (teasers.length === 0) {
      teasers = element.querySelectorAll('[data-testid="stage-teaser-container"]');
    }
    if (teasers.length === 0) {
      const allDivs = Array.from(element.querySelectorAll("div"));
      const matched = [];
      allDivs.forEach((div) => {
        const hasPic = div.querySelector("picture, img");
        const hasHeading = div.querySelector("h2, h3");
        const hasLink = div.querySelector("a[href]");
        if (hasPic && hasHeading && hasLink) {
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
      const picture = teaser.querySelector("picture") || teaser.querySelector("img");
      const heading = teaser.querySelector("h2, h3, h1");
      const ctaLink = teaser.querySelector("a[href]");
      const contentCell = [];
      if (heading) contentCell.push(heading);
      if (ctaLink) contentCell.push(ctaLink);
      cells.push([picture || "", contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-teaser", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/hm-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, [
        '[id*="screenreadertext"]',
        ".screen-reader-text",
        "script"
      ]);
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [
        '[id*="breadcrumb"]',
        "nav.breadcrumb",
        'nav[aria-label="Breadcrumb"]',
        "header",
        "footer",
        "noscript",
        "link"
      ]);
    }
  }

  // tools/importer/transformers/hm-sections.js
  var H2 = { before: "beforeTransform", after: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === H2.after) {
      const doc = element.ownerDocument || document;
      const template = payload && payload.template;
      if (!template || !template.sections || template.sections.length < 2) return;
      const sections = [...template.sections].reverse();
      sections.forEach((section, reverseIndex) => {
        const originalIndex = template.sections.length - 1 - reverseIndex;
        if (originalIndex === 0) return;
        const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionElement = null;
        for (const sel of selectors) {
          sectionElement = element.querySelector(sel);
          if (sectionElement) break;
        }
        if (!sectionElement) return;
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(doc, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionElement.before(sectionMetadata);
        }
        const hr = doc.createElement("hr");
        sectionElement.before(hr);
      });
    }
  }

  // tools/importer/import-sustainability-page.js
  var parsers = {
    "cards-teaser": parse
  };
  var PAGE_TEMPLATE = {
    name: "sustainability-page",
    description: "H&M sustainability landing page with environmental and social responsibility content",
    urls: [
      "https://www2.hm.com/de_de/sustainability-hm.html"
    ],
    blocks: [
      {
        name: "cards-teaser",
        instances: [".two-teaser-container, [id*=twoteasercontainer]"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Page Title and Navigation",
        selector: [".editorial-text", ".navigation-pills"],
        style: null,
        blocks: [],
        defaultContent: [".editorial-text h2", ".navigation-pills ul"]
      },
      {
        id: "section-2",
        name: "Category Teasers",
        selector: ".two-teaser-container",
        style: null,
        blocks: ["cards-teaser"],
        defaultContent: []
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
        elements.forEach((el) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element: el,
            section: blockDef.section || null
          });
        });
      });
    });
    return pageBlocks;
  }
  var import_sustainability_page_default = {
    transform: (payload) => {
      const { document: document2, url, html, params } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_sustainability_page_exports);
})();
