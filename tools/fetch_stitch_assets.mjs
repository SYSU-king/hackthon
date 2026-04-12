import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { Stitch, StitchToolClient } from "@google/stitch-sdk";

const projectId = "8477727617233002131";
const screenSpecs = [
  {
    id: "0f67e2ca1d744bfe960622c66b13a8b7",
    slug: "strategy-protocol",
    name: "Strategy Protocol (Technical)",
  },
  {
    id: "b532765517ea4a6491f3b7f5a0362bf9",
    slug: "landing-page",
    name: "Landing Page (Technical)",
  },
  {
    id: "1e03d2df82b941bf96acf793a03f4eec",
    slug: "path-detail",
    name: "Path Detail (Technical)",
  },
  {
    id: "70fef224eb49493a8f4f4a4dedf6fbfe",
    slug: "simulation-process",
    name: "Simulation Process (Technical)",
  },
];
const designSystemId = "asset-stub-assets-7524043e9a58414ba53b5625b54594e8-1775894506576";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const metaDir = path.join(rootDir, "assets", "stitch", "meta");

const apiKey = process.env.STITCH_API_KEY;
if (!apiKey) {
  throw new Error("STITCH_API_KEY is required");
}

await mkdir(metaDir, { recursive: true });

const client = new StitchToolClient({ apiKey });
const sdk = new Stitch(client);
const project = sdk.project(projectId);

try {
  const projectInfo = await client.callTool("get_project", {
    name: `projects/${projectId}`,
  });
  await writeFile(
    path.join(metaDir, "project.json"),
    JSON.stringify(projectInfo, null, 2),
    "utf-8",
  );

  const designSystems = await client.callTool("list_design_systems", { projectId });
  await writeFile(
    path.join(metaDir, "project-assets.json"),
    JSON.stringify(designSystems, null, 2),
    "utf-8",
  );

  const screens = [];
  for (const spec of screenSpecs) {
    const screen = await project.getScreen(spec.id);
    const htmlUrl = await screen.getHtml();
    const imageUrl = await screen.getImage();
    screens.push({
      ...spec,
      projectId,
      htmlUrl,
      imageUrl,
      htmlFile: `assets/stitch/html/${spec.slug}.html`,
      imageFile: `assets/stitch/images/${spec.slug}.png`,
    });
  }

  const payload = {
    projectId,
    fetchedAt: new Date().toISOString(),
    designSystemId,
    screens,
  };

  await writeFile(
    path.join(metaDir, "screen-urls.json"),
    JSON.stringify(payload, null, 2),
    "utf-8",
  );

  process.stdout.write(JSON.stringify(payload, null, 2));
} finally {
  await client.close();
}
