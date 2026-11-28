import type { MetadataRoute } from "next";

// Rend l'application installable sur le téléphone (icône sur l'écran d'accueil, plein écran).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Prospections Longrich",
    short_name: "Longrich",
    description: "L'application des partenaires et stockistes Longrich en Côte d'Ivoire.",
    lang: "fr",
    start_url: "/dashboard",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#F6FAF7",
    theme_color: "#0C7A4E",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
