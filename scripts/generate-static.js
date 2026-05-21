// Post-build script: generates index.html + 404.html for GitHub Pages static deployment.
// Scans dist/client/assets/ to find the hashed CSS and JS entry files produced by Vite.
import { readFileSync, writeFileSync, readdirSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const clientDir = resolve(__dirname, "../dist/client");
const assetsDir = `${clientDir}/assets`;

if (!existsSync(assetsDir)) {
  console.error("dist/client/assets not found. Run npm run build first.");
  process.exit(1);
}

const assets = readdirSync(assetsDir);

const cssFiles = assets.filter((f) => f.endsWith(".css"));

const jsEntry = assets
  .filter((f) => f.endsWith(".js"))
  .find((f) => readFileSync(`${assetsDir}/${f}`, "utf8").includes("hydrateRoot"));

if (!jsEntry) {
  console.error("Could not find JS entry (hydrateRoot not found in any JS file).");
  process.exit(1);
}

const base = "/medi-pass-landing/";

const html = `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>MediPass — Respaldo de salud para tu equipo</title>
    <meta name="description" content="Membresía de salud para empresas en Mérida y todo México. Orientación médica 24/7, videoconsultas y médico a domicilio desde menos de $30 al mes por persona." />
    <meta property="og:title" content="MediPass — Contigo en cada paso" />
    <meta property="og:description" content="La membresía de salud para empresas. Sin seguros, sin complicaciones." />
    <meta property="og:type" content="website" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800&family=JetBrains+Mono:wght@400;500&display=swap" />
${cssFiles.map((f) => `    <link rel="stylesheet" crossorigin href="${base}assets/${f}" />`).join("\n")}
  </head>
  <body>
    <script type="module" crossorigin src="${base}assets/${jsEntry}"></script>
  </body>
</html>
`;

writeFileSync(`${clientDir}/index.html`, html);
writeFileSync(`${clientDir}/404.html`, html);

console.log(`✓ CSS:      ${cssFiles.join(", ")}`);
console.log(`✓ JS entry: ${jsEntry}`);
console.log("✓ Generated dist/client/index.html");
console.log("✓ Generated dist/client/404.html");
