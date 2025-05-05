import { useEffect, useState } from "preact/hooks";
import type { CollectionEntry } from "astro:content";
import type { TargetedEvent } from "preact/compat";
import Fuse, { type FuseResult } from "fuse.js";

type Props = {
  targets: CollectionEntry<"targets">[];
  manufacturers: string[];
};

type Entry = {
  manufacturer: string;
  family: string;
  variant: string;
  cores: string;
  nvm: string[];
  ram: string[];
};

export default function TargetsView({ targets, manufacturers }: Props) {
  function getJep106({ data }: CollectionEntry<"targets">) {
    if (data.manufacturer) {
      const manufacturer =
        manufacturers[
          Number(data.manufacturer.cc) * 256 + Number(data.manufacturer.id)
        ];
      if (!manufacturer)
        return `Unlisted: id=${data.manufacturer.id}, cc=${data.manufacturer.cc}`;
      return manufacturers[
        Number(data.manufacturer.cc) * 256 + Number(data.manufacturer.id)
      ];
    } else {
      return "Unknown";
    }
  }

  const urlSearchParams = new URLSearchParams(window.location.search);
  const pageParam = Object.fromEntries(urlSearchParams.entries()).p;
  let initialPage = pageParam ? +pageParam : 0;

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(initialPage);

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    urlSearchParams.set("q", search);
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}?${urlSearchParams.toString()}`
    );
  }, [search]);

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    urlSearchParams.set("p", "" + currentPage);
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}?${urlSearchParams.toString()}`
    );
  }, [currentPage]);

  const items = targets.flatMap((t) =>
    t.data.variants.map((v) => ({
      manufacturer: getJep106(t),
      family: t.data.name,
      variant: v.name,
      cores: v.cores.map((c) => c.type).join(", "),
      nvm: v.memory_map
        .filter((m) => m.nvm)
        .map((m) => m.nvm!)
        .map(
          (m) =>
            `${m.name ? m.name + "" : ""} 0x${m.range.start
              .toString(16)
              .toUpperCase()} - 0x${m.range.end.toString(16).toUpperCase()}`
        ),
      ram: v.memory_map
        .filter((m) => m.ram)
        .map((m) => m.ram!)
        .map(
          (m) =>
            `${m.name ? m.name + " " : ""} 0x${m.range.start
              .toString(16)
              .toUpperCase()} - 0x${m.range.end.toString(16).toUpperCase()}`
        ),
    }))
  );

  const fuse = new Fuse(items, {
    keys: ["manufacturer", "family", "variant", "cores"],
    useExtendedSearch: true,
    ignoreDiacritics: true,
    includeScore: true,
    includeMatches: true,
    threshold: 0.2,
  });

  const results = search
    ? fuse.search(search)
    : fuse.search({ cores: "!1234567890" });

  return (
    <>
      <div class="sticky top-0 bg-slate-100 border-b-[1px] border-slate-200 p-5">
        <div class="flex flex-col md:flex-row items-center justify-between gap-2">
          <label>
            <input
              onChange={(e) => setSearch((e.target as HTMLSelectElement).value)}
              class="w-full bg-gray-100 p-2 py-1 border-slate-300 border-2 rounded-md"
              placeholder="Search"
            />
          </label>

          <p class="text-center">
            Showing{" "}
            <span class="font-bold">
              {results.length} / {items.length}
            </span>{" "}
            targets
          </p>
        </div>
      </div>

      <PaginatedItems
        items={items}
        results={results}
        itemsPerPage={20}
        search={search}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </>
  );
}

function PaginatedItems({
  items,
  results,
  itemsPerPage,
  search,
  currentPage,
  setCurrentPage,
}: {
  items: Entry[];
  results: FuseResult<Entry>[];
  itemsPerPage: number;
  search: string;
  currentPage: number;
  setCurrentPage: (v: number) => void;
}) {
  const pageCount = Math.ceil(results.length / itemsPerPage);
  if (currentPage >= pageCount) {
    setCurrentPage(0);
  }

  return (
    <div className="w-full flex flex-col items-center">
      <Items
        items={items}
        results={results}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        pageCount={pageCount}
        search={search}
      />
      <Paginate
        pageCount={pageCount}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}

function Paginate({
  pageCount,
  currentPage,
  setCurrentPage,
}: {
  pageCount: number;
  currentPage: number;
  setCurrentPage: (v: number) => void;
}) {
  const { current, pages } = paginate({
    current: currentPage,
    max: pageCount,
  });

  return (
    <ul className="flex flex-row list-none">
      {pages.map((page) => {
        if (page === current + 1) {
          return (
            <li className="px-4 pt-3 mt-0 mb-0 text-green border-t-2 border-green">
              {page}
            </li>
          );
        } else if (page === "…") {
          return (
            <li className="px-4 pt-3 mt-0 mb-0 border-t-2 border-transparent">
              {page}
            </li>
          );
        } else {
          return (
            <li class="px-4 pt-3 mt-0 mb-0 border-t-2 border-transparent hover:border-slate-200 cursor-pointer">
              <button
                onClick={() => {
                  setCurrentPage(+page - 1);
                }}
                style={{ color: "black" }}
                class="cursor-pointer"
              >
                {page}
              </button>
            </li>
          );
        }
      })}
    </ul>
  );
}

function Items({
  items,
  results,
  itemsPerPage,
  currentPage,
  search,
}: {
  items: Entry[];
  results: FuseResult<Entry>[];
  itemsPerPage: number;
  currentPage: number;
  pageCount: number;
  search: string;
}) {
  return (
    <table class="overflow-scroll max-h-svh mb-0 mt-0">
      <thead>
        <tr class="grid md:table-row grid-cols-2">
          <th class="p-2">Manufacturer</th>
          <th class="p-2">Family</th>
          <th class="p-2">Variant</th>
          <th class="p-2">Cores</th>
          <th class="p-2">Memories</th>
        </tr>
      </thead>
      <tbody>
        {results
          .slice(
            currentPage * itemsPerPage,
            Math.min((currentPage + 1) * itemsPerPage, results.length)
          )
          .map((r) => (
            <tr class="grid md:table-row grid-cols-2">
              <td
                class="p-2 pt-0 pb-0"
                dangerouslySetInnerHTML={{
                  __html: span(r, items, search, "manufacturer"),
                }}
              ></td>
              <td
                class="p-2 pt-0 pb-0"
                dangerouslySetInnerHTML={{
                  __html: span(r, items, search, "family"),
                }}
              ></td>
              <td
                class="p-2 pt-0 pb-0"
                dangerouslySetInnerHTML={{
                  __html: span(r, items, search, "variant"),
                }}
              ></td>
              <td
                class="p-2 pt-0 pb-0"
                dangerouslySetInnerHTML={{
                  __html: span(r, items, search, "cores"),
                }}
              ></td>
              <td class="p-2 pt-0 pb-0">
                {items[r.refIndex].nvm.map((m) => (
                  <p class="mb-0.5 mt-0.5">{m}</p>
                ))}
                {items[r.refIndex].ram.map((m) => (
                  <p class="mb-0.5 mt-0.5">{m}</p>
                ))}
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}

function span(
  result: FuseResult<Entry>,
  data: Entry[],
  search: string,
  key: string
) {
  if (search === "") {
    return (data[result.refIndex] as any)[key];
  }
  for (const match of result.matches!) {
    if (match.key == key) {
      const item = match.value!.substring(
        match.indices[0][0],
        match.indices[0][1] + 1
      );
      return match.value!.replace(
        item,
        "<span class='bg-amber-400'>" + item + "</span>"
      );
    }
  }

  return (data[result.refIndex] as any)[key];
}

/// Taken from https://zacfukuda.com/blog/pagination-algorithm
function paginate({ current, max }: { current: number; max: number }) {
  const prev = current === 1 ? null : current - 1;
  const next = current === max ? null : current + 1;
  const pages = [1 as number | string];

  if (current === 1 && max === 1) {
    return { current, prev, next, pages };
  }
  if (current > 4) {
    pages.push("…");
  }

  const r = 2;
  const r1 = current - r;
  const r2 = current + r;

  for (let i = r1 > 2 ? r1 : 2; i <= Math.min(max, r2); i++) {
    pages.push(i);
  }

  if (r2 + 1 < max) {
    pages.push("…");
  }
  if (r2 < max) {
    pages.push(max);
  }

  return { current, prev, next, pages };
}
