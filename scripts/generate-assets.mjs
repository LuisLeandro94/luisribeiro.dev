#!/usr/bin/env node
/**
 * Generates the favicon family and the Open Graph share image from the
 * design tokens, so they stay pixel-consistent with the live site without
 * depending on system fonts being installed wherever this runs.
 *
 * Satori lays out text as real vector glyph outlines (it does its own text
 * shaping from the font buffer), so the resulting SVG has no runtime font
 * dependency; resvg then rasterizes that SVG to PNG.
 *
 * Run once and commit the output: `npm run og:generate`.
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import satori from "satori";
import { decompress } from "wawoff2";
import { Resvg } from "@resvg/resvg-js";

const root = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(root, "..", "public");

const INK = "#0e0f10";
const PAPER = "#f1f2ee";
const GRAPHITE = "#646869";
const SIGNAL = "#2233d6";

async function loadFont(pkg, file, weight) {
  const woff2Path = path.join(root, "..", "node_modules", pkg, "files", file);
  const woff2 = await readFile(woff2Path);
  const ttf = await decompress(woff2);
  return {
    name: pkg.includes("mono") ? "Geist Mono" : "Geist",
    data: Buffer.from(ttf),
    weight,
    style: "normal",
  };
}

async function toPng(node, width, height, fonts) {
  const svg = await satori(node, { width, height, fonts });
  const resvg = new Resvg(svg, { fitTo: { mode: "width", value: width } });
  return resvg.render().asPng();
}

/** Rasterizes an already-laid-out SVG at a new pixel size (pure vector scale, no relayout). */
function rasterizeSvg(svg, width) {
  const resvg = new Resvg(svg, { fitTo: { mode: "width", value: width } });
  return resvg.render().asPng();
}

async function generateFavicons(fonts) {
  const monogram = {
    type: "div",
    props: {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: INK,
        color: PAPER,
        fontFamily: "Geist",
        fontWeight: 600,
      },
      children: [
        {
          type: "div",
          props: { style: { fontSize: 260, letterSpacing: "-0.04em" }, children: "LR" },
        },
      ],
    },
  };

  // Laid out once at a fixed design size, then scaled as pure vector output —
  // re-running satori per output size would re-layout at that pixel count and
  // make the fixed font size overflow the smaller canvases.
  const svg = await satori(monogram, { width: 512, height: 512, fonts });
  await writeFile(path.join(publicDir, "favicon.svg"), svg);
  await writeFile(path.join(publicDir, "favicon-32.png"), rasterizeSvg(svg, 32));
  await writeFile(path.join(publicDir, "apple-touch-icon.png"), rasterizeSvg(svg, 180));

  console.log("Generated favicon.svg, favicon-32.png, apple-touch-icon.png");
}

async function generateOgImage(fonts) {
  const node = {
    type: "div",
    props: {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        background: PAPER,
        padding: "72px 80px",
        fontFamily: "Geist",
      },
      children: [
        {
          type: "div",
          props: {
            style: { display: "flex", flexDirection: "column" },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    fontSize: 128,
                    fontWeight: 600,
                    letterSpacing: "-0.04em",
                    lineHeight: 0.95,
                    display: "flex",
                    gap: "0.22em",
                  },
                  children: [
                    { type: "span", props: { style: { color: SIGNAL }, children: "Luís" } },
                    { type: "span", props: { style: { color: INK }, children: "Ribeiro" } },
                  ],
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    marginTop: 28,
                    fontSize: 34,
                    fontWeight: 400,
                    color: INK,
                    letterSpacing: "-0.01em",
                    maxWidth: 900,
                    display: "flex",
                  },
                  children: "Software engineer, specialising in frontend.",
                },
              },
            ],
          },
        },
        {
          type: "div",
          props: {
            // Explicit `top` rather than `bottom`: satori/yoga mis-measures the
            // root's auto height when a flex-column child is instead pinned
            // with `bottom` (or via `justifyContent: space-between`), silently
            // laying the footer out past the canvas edge.
            style: {
              position: "absolute",
              left: 80,
              top: 528,
              fontFamily: "Geist Mono",
              fontWeight: 500,
              fontSize: 22,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: GRAPHITE,
              display: "flex",
            },
            children: "Software Engineer · Frontend · Portugal",
          },
        },
      ],
    },
  };

  const png = await toPng(node, 1200, 630, fonts);
  await writeFile(path.join(publicDir, "og.png"), png);
  console.log("Generated og.png (1200x630)");
}

async function main() {
  await mkdir(publicDir, { recursive: true });
  const fonts = await Promise.all([
    loadFont("@fontsource-variable/geist", "geist-latin-wght-normal.woff2", 600),
    loadFont("@fontsource-variable/geist-mono", "geist-mono-latin-wght-normal.woff2", 500),
  ]);
  await generateFavicons(fonts);
  await generateOgImage(fonts);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
