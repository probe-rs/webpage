import { useState } from "preact/hooks";
import type { CollectionEntry } from "astro:content";
import type { TargetedEvent } from "preact/compat";

type Props = {
	targets: CollectionEntry<'targets'>[],
	manufacturers: string[],
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

	const SHOW_ALL = 'Show All';
	const [selectedManufacturer, setSelectedManufacturer] = useState(SHOW_ALL);
	const [selectedFamily, setSelectedFamily] = useState(SHOW_ALL);

	const manufacturersToShow = [...new Set(targets.map(getJep106))].sort();
	const targetsFromManufacturer = targets
		.filter(t => selectedManufacturer == SHOW_ALL || selectedManufacturer == getJep106(t));
	const familiesToShow = targetsFromManufacturer
		.map(t => t.data.name)
		.sort();
	const targetsToShow = targetsFromManufacturer
		.filter(t => selectedFamily == SHOW_ALL || selectedFamily == t.data.name)
		.sort((a, b) => {
			if (getJep106(a) > getJep106(b)) {
				return 1;
			} else if (getJep106(a) == getJep106(b)) {
				return a.data.name > b.data.name ? 1 : -1;
			} else {
				return -1;
			}
		});

	function onChangeManufacturer({ target }: TargetedEvent<HTMLSelectElement, Event>) {
		setSelectedManufacturer((target as HTMLSelectElement).value);
		setSelectedFamily(SHOW_ALL);
	}

	return <>
		<p class="text-center">Showing {targetsToShow.length} {targetsToShow.length == 1 ? 'target' : 'targets'}.</p>

		<div class="sticky top-2 bg-graytransparent rounded-lg p-2">
			<div class="flex flex-col md:flex-row justify-center">
				<label>
					<h3 class="mt-0 text-center">Manufacturer</h3>
					<select onChange={onChangeManufacturer} class="w-full bg-gray-100 p-1">
						{[SHOW_ALL, ...manufacturersToShow].map(m => <option value={m}>{m}</option>)}
					</select>
				</label>

				<label>
					<h3 class="mt-0 text-center">Family</h3>
					<select onChange={e => setSelectedFamily((e.target as HTMLSelectElement).value)} class="w-full bg-gray-100 p-1">
						{[SHOW_ALL, ...familiesToShow].map(f => <option value={f} selected={f == selectedFamily}>{f}</option>)}
					</select>
				</label>
			</div>
		</div>

		<table>
			<thead>
				<tr class="grid md:table-row grid-cols-2">
					<th>Manufacturer</th>
					<th>Family</th>
					<th>Variant</th>
					<th>Cores</th>
					<th>Flash</th>
					<th>RAM</th>
				</tr>
			</thead>
			<tbody>
				{targetsToShow.flatMap(t => t.data.variants.map(v => <tr class="grid md:table-row grid-cols-2">
					<td>{getJep106(t)}</td>
					<td>{t.data.name}</td>
					<td>{v.name}</td>
					<td>
						{v.cores.length
							+ (v.cores.length == 1 ? ' core (' : ' cores (')
							+ v.cores.map(c => c.type).join(', ') + ')'}
					</td>
					<td>{JSON.stringify(v.memory_map)}</td>
					<td>{v.cores.length}</td>
				</tr>))}
			</tbody>
		</table>
	</>;
}