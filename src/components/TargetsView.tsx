import { useState } from "preact/hooks";
import type { CollectionEntry } from "astro:content";
import type { TargetedEvent } from "preact/compat";
import Fuse, { type FuseResult } from "fuse.js";

type Props = {
	targets: CollectionEntry<'targets'>[],
	manufacturers: string[],
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
	function getJep106({ data }: CollectionEntry<'targets'>) {
		if (data.manufacturer) {
			const manufacturer = manufacturers[Number(data.manufacturer.cc) * 256 + Number(data.manufacturer.id)];
			if (!manufacturer) return `Unlisted: id=${data.manufacturer.id}, cc=${data.manufacturer.cc}`;
			return manufacturers[Number(data.manufacturer.cc) * 256 + Number(data.manufacturer.id)];
		} else {
			return 'Unknown';
		}
	};

	const [search, setSearch] = useState('');


	const data = targets.flatMap(t => t.data.variants.map(v => ({
		'manufacturer': getJep106(t), 'family': t.data.name, 'variant': v.name, 'cores': v.cores.map(c => c.type).join(', '),
		'nvm': v.memory_map.filter((m) => m.nvm).map(m => m.nvm!).map((m) => `${m.name ? m.name + '' : ''} 0x${m.range.start.toString(16).toUpperCase()} - 0x${m.range.end.toString(16).toUpperCase()}`),
		'ram': v.memory_map.filter((m) => m.ram).map(m => m.ram!).map((m) => `${m.name ? m.name + ' ' : ''} 0x${m.range.start.toString(16).toUpperCase()} - 0x${m.range.end.toString(16).toUpperCase()}`)
	})));

	const fuse = new Fuse(data, {
		keys: ['manufacturer', 'family', 'variant', 'cores'],
		ignoreDiacritics: true,
		includeScore: true,
		includeMatches: true,
		threshold: 0.2
	});

	const results = fuse.search(search);

	return <>
		<div class="sticky top-0 bg-slate-100 border-b-[1px] border-slate-200 p-5">
			<div class="flex flex-col md:flex-row items-center justify-between gap-2">
				<label>
					<input onChange={e => setSearch((e.target as HTMLSelectElement).value)} class="w-full bg-gray-100 p-2 rounded-md" placeholder="Search" />
				</label>

				<p class="text-center font-bold">Showing {data.length} {data.length == 1 ? 'target' : 'targets'}</p>
			</div>
		</div>

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
				{search ? results.map(r => <tr class="grid md:table-row grid-cols-2">
					<td class="p-2 pt-0 pb-0" dangerouslySetInnerHTML={{ __html: span(r, data, 'manufacturer') }}></td>
					<td class="p-2 pt-0 pb-0" dangerouslySetInnerHTML={{ __html: span(r, data, 'family') }}></td>
					<td class="p-2 pt-0 pb-0" dangerouslySetInnerHTML={{ __html: span(r, data, 'variant') }}></td>
					<td class="p-2 pt-0 pb-0" dangerouslySetInnerHTML={{ __html: span(r, data, 'cores') }}></td>
					<td class="p-2 pt-0 pb-0">
						{data[r.refIndex].nvm.map((m) => <p class="mb-0.5 mt-0.5">{m}</p>)}
						{data[r.refIndex].ram.map((m) => <p class="mb-0.5 mt-0.5">{m}</p>)}
					</td>
				</tr>) : data.map(v => <tr class="grid md:table-row grid-cols-2">
					<td class="p-2 pt-0 pb-0">{v.manufacturer}</td>
					<td class="p-2 pt-0 pb-0">{v.family}</td>
					<td class="p-2 pt-0 pb-0">{v.variant}</td>
					<td class="p-2 pt-0 pb-0">
						[{v.cores}]
					</td>
					<td class="p-2 pt-0 pb-0">
						{v.nvm.map((m) => <p class="mb-0.5 mt-0.5">{m}</p>)}
						{v.ram.map((m) => <p class="mb-0.5 mt-0.5">{m}</p>)}
					</td>
				</tr>)}
			</tbody>
		</table>
	</>;
}

function span(result: FuseResult<Entry>, data: Entry[], key: string) {
	for (const match of result.matches!) {
		if (match.key == key) {
			const item = match.value!.substring(match.indices[0][0], match.indices[0][1] + 1);
			return match.value!.replace(item, "<span class='bg-amber-400'>" + item + "</span>")
		}
	}

	return (data[result.refIndex] as any)[key];
}