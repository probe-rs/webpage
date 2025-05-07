import { getCollection, type CollectionEntry } from "astro:content";
import type { ImageMetadata } from "astro";
import { readFileSync } from "node:fs";
import jep106 from "jep106/src/codes.json";

export const posts = (await getCollection("blog")).sort(
  (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
);

export const images = import.meta.glob<{ default: ImageMetadata }>(
  "/src/images/*.{jpeg,jpg,png,gif,svg}"
);

// Just the folders, ordered.
export const docFolders = (await getCollection("docsFolderYaml")).sort((a, b) =>
  (a.data.sectionOrder || 0) < (b.data.sectionOrder || 0) ? -1 : 1
);

// Docs, grouped by their containing folder.
export const docs = (await getCollection("docs")).reduce(
  (folderMap: { [key: string]: CollectionEntry<"docs">[] }, doc) => {
    const folder = doc.id.split("/").slice(0, -1).join("/");
    if (!folderMap[folder]) folderMap[folder] = [];
    folderMap[folder].push(doc);
    return folderMap;
  },
  {}
);

// Sort docs within each folder.
for (const [folder, docsInFolder] of Object.entries(docs)) {
  docsInFolder.sort((a, b) => (a.data.order < b.data.order ? -1 : 1));
}

export const targets = await getCollection("targets");

export const manufacturers = jep106.manufacturers;
