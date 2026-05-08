import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TEMPERO",
    short_name: "TEMPERO",
    description: "TEMPERO canteen planning pilot",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2f8d46",
    orientation: "portrait"
  };
}
