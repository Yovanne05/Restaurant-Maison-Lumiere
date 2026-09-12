import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Site entièrement statique : `next build` produit un dossier `out/` que l'on
  // dépose tel quel sur n'importe quel hébergement de fichiers.
  output: "export",

  // Une page par dossier (`carte/index.html`). Apache et Nginx servent alors
  // l'URL `/carte/` sans la moindre règle de réécriture.
  trailingSlash: true,

  // L'optimiseur d'images de Next réclame un serveur. Les photos sont donc déjà
  // redimensionnées et converties en WebP dans `public/media`.
  images: { unoptimized: true },
};

export default nextConfig;
