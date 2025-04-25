import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";
import yaml from "js-yaml";

const blog = defineCollection({
  // Load Markdown and MDX files in the `src/content/blog/` directory.
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // Transform string to Date object
    date: z.coerce.date(),
    authors: z.array(z.string()),
  }),
});

const docs = defineCollection({
  loader: glob({ base: "./src/content/docs", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.coerce.number(),
  }),
});

const docsFolderYaml = defineCollection({
  loader: glob({
    base: "./src/content/docs",
    pattern: "**/_data.yaml",
    generateId: ({ entry }) => entry.replace("/_data.yaml", ""),
  }),
  schema: z.object({
    title: z.coerce.string(),
    sectionOrder: z.coerce.number(),
  }),
});

import type { Loader } from "astro/loaders";
import { readdirSync, readFileSync } from "node:fs";

// Format: https://probe.rs/docs/knowledge-base/cmsis-packs/#yaml-format

// prettier-ignore
const targetYamlSchema = yaml.DEFAULT_SCHEMA.extend([
  new yaml.Type("!Arm", { kind: "mapping", construct: d => ({ arm: d }) }),
  new yaml.Type("!AtsamDsu", { kind: "mapping", construct: d => ({ atsamDsu: d }) }),
  new yaml.Type("!Espressif", { kind: "mapping", construct: d => ({ espressif: d }) }),
  new yaml.Type("!Flash", { kind: "mapping", construct: d => ({ flash: d }) }),
  new yaml.Type("!Generic", { kind: "mapping", construct: d => ({ generic: d }) }),
  new yaml.Type("!InfineonScu", { kind: "mapping", construct: d => ({ infineonScu: d }) }),
  new yaml.Type("!InfineonXmcScu", { kind: "mapping", construct: d => ({ infineonXmcScu: d }) }),
  new yaml.Type("!InfineonPsocSiid", { kind: "mapping", construct: d => ({ infineonPsocSiid: d }) }),
  new yaml.Type("!NordicConfigId", { kind: "mapping", construct: d => ({ nordicConfigId: d }) }),
  new yaml.Type("!NordicFicrInfo", { kind: "mapping", construct: d => ({ nordicFicrInfo: d }) }),
  new yaml.Type("!Nvm", { kind: "mapping", construct: d => ({ nvm: d }) }),
  new yaml.Type("!Ram", { kind: "mapping", construct: d => ({ ram: d }) }),
  new yaml.Type("!Riscv", { kind: 'mapping', construct: d => ({ riscv: d }) }),
  new yaml.Type("!v1", { kind: "scalar", construct: d => ({ v1: d }) }),
  new yaml.Type("!v2", { kind: "scalar", construct: d => ({ v2: d }) }),
  new yaml.Type("!Xtensa", { kind: "mapping", construct: d => ({ xtensa: d }) }),
]);

const targetSchema = z.object({
  name: z.string(),
  manufacturer: z
    .object({
      id: z.number(),
      cc: z.number(),
    })
    .optional(),
  variants: z.array(
    z.object({
      name: z.string(),
      flash_algorithms: z.array(z.string()).optional(),
      cores: z.array(
        z.object({
          name: z.string(),
          type: z.string(),
          core_access_options: z.object({
            arm: z.object({
              ap: z.object({
                v1: z.string().optional(),
                v2: z.string().optional(),
              }).optional(),
              targetsel: z.number().optional(),
              debug_base: z.number().optional(),
              cti_base: z.number().optional(),
              jtag_tap: z.object({
                v1: z.string().optional(),
                v2: z.string().optional(),
              }).optional()
            }).optional().nullable(),
            riscv: z.object({
              hart_id: z.number().optional(),
              jtag_tap: z.object({
                v1: z.string().optional(),
                v2: z.string().optional(),
              }).optional()
            }).optional().nullable(),
            xtensa: z.object({
              jtag_tap: z.object({
                v1: z.string().optional(),
                v2: z.string().optional(),
              }).optional()
            }).optional().nullable()
          }).optional(),
        })
      ),
      memory_map: z.array(
        z.object({
          nvm: z.object({
            name: z.string().optional(),
            range: z.object({ start: z.number(), end: z.number() }),
            cores: z.array(z.string()),
            access: z.object({
              read: z.boolean().optional().default(true),
              write: z.boolean().optional().default(true),
              execute: z.boolean().optional().default(true),
              boot: z.boolean().optional().default(false),
            }).optional(),
            is_alias: z.boolean().optional().default(false)
          }).optional(),
          ram: z.object({
            name: z.string().optional(),
            range: z.object({ start: z.number(), end: z.number() }),
            cores: z.array(z.string()),
            access: z.object({
              read: z.boolean().optional().default(true),
              write: z.boolean().optional().default(true),
              execute: z.boolean().optional().default(true),
              boot: z.boolean().optional().default(false),
            }).optional()
          }).optional(),
          generic: z.object({
            name: z.string().optional(),
            range: z.object({ start: z.number(), end: z.number() }),
            cores: z.array(z.string()),
            access: z.object({
              read: z.boolean().optional().default(true),
              write: z.boolean().optional().default(true),
              execute: z.boolean().optional().default(true),
              boot: z.boolean().optional().default(false),
            }).optional()
          }).optional()
        })
      ),
    })
  ),
  flash_algorithms: z
    .array(
      z.object({
        name: z.string(),
        description: z.string(),
        default: z.boolean().optional(),
        instructions: z.string(),
        pc_init: z.number().optional(),
        pc_uninit: z.number().optional(),
        pc_program_page: z.number(),
        pc_erase_sector: z.number(),
        pc_erase_all: z.number().optional(),
        data_section_offset: z.number(),
        transfer_encoding: z.enum(["raw", "miniz"]).optional(),
        flash_properties: z.object({
          address_range: z.object({
            start: z.number(),
            end: z.number(),
          }),
          page_size: z.number(),
          erased_byte_value: z.number(),
          program_page_timeout: z.number(),
          erase_sector_timeout: z.number(),
          sectors: z.array(
            z.object({
              size: z.number(),
              address: z.number(),
            })
          ),
          cores: z.array(z.string()).optional(),
        }),
      })
    )
    .optional(),
});

const targetLoader: Loader = {
  name: "target-loader",
  load: async ({ store, logger, parseData, meta, generateDigest }) => {
    store.clear();

    // Vite's recommended import.meta.glob doesn't seem
    // to work in content.config.ts :/
    // const FOLDER = "src/content/probe-rs-repo/probe-rs/targets/";
    const FOLDER = 'node_modules/probe.rs-data/probe-rs/targets/';  // pull from git repo
    for (const file of readdirSync(FOLDER)) {
      const raw = readFileSync(FOLDER + file).toString();
      const parsed = yaml.load(raw, {
        schema: targetYamlSchema,
        filename: FOLDER + file,
      });
      const id = file.replace(".yaml", "");
      // try {
      const data = await parseData({
        id,
        data: parsed as Record<string, unknown>,
        filePath: FOLDER + file,
      });
      store.set({ id, data });
      // } catch (e) {
      //   console.log("failed:", parsed.variants[0].cores);
      //   // throw e;
      // }
    }
  },
  schema: targetSchema,
};

const targets = defineCollection({
  loader: targetLoader,
  schema: targetSchema,
});

export const collections = { blog, docs, docsFolderYaml, targets };
