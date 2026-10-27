"use client";

import dynamic from "next/dynamic";

const SceneBackground = dynamic(
  () => import("./SceneBackground").then((m) => m.SceneBackground),
  { ssr: false },
);

export function SiteBackground() {
  return <SceneBackground />;
}
