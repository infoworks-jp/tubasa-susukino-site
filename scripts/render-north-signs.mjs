// Run against the local static server after build-north-signs.mjs. Use the
// checked-in WebP for publishing; Japanese glyph shapes depend on local fonts.
import fs from "node:fs/promises";
const { chromium } = await import(
  process.env.LOCATION_QA_PLAYWRIGHT || "playwright"
);
const browser = await chromium.launch({
  executablePath: process.env.LOCATION_QA_EXECUTABLE || undefined,
});
try {
  const page = await browser.newPage();
  await page.goto(
    (process.env.LOCATION_QA_BASE || "http://127.0.0.1:8080") +
      "/location/licenses.txt",
  );
  for (const n of [1]) {
    const result = await page.evaluate(async (n) => {
      const image = new Image();
      image.src = `/location/assets/manga/asahi-lower-sign-2025.svg`;
      await image.decode();
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      canvas.getContext("2d").drawImage(image, 0, 0);
      return canvas.toDataURL("image/webp", 0.94).split(",")[1];
    }, n);
    await fs.writeFile(
      new URL(
        `../location/assets/manga/asahi-lower-sign-2025.webp`,
        import.meta.url,
      ),
      Buffer.from(result, "base64"),
    );
  }
} finally {
  await browser.close();
}
