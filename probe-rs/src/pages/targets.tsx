import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import humanFileSize from '../helpers/units';
import { useFuzzySearchList, Highlight } from '@nozbe/microfuzz/react'

import styles from "./targets.module.scss";
import { FuzzyMatches } from '@nozbe/microfuzz';
import { loadTargets, Target } from '../helpers/targets';
import useIsBrowser from '@docusaurus/useIsBrowser';

export default function Hello() {
    const gitRef = 'master';

    const [targets, setTargets] = useState([]);
    const isBrowser = useIsBrowser();

    useEffect(() => {
        if (isBrowser) {
            console.error('kek');
            loadTargets(gitRef).then(({ targets }) => { setTargets(targets); });
        }
    }, [gitRef])

    const [queryText, setQueryText] = useState('');
    const filteredList = useFuzzySearchList({
        list: targets,
        // If `queryText` is blank, `list` is returned in whole
        queryText,
        // optional `getText` or `key`, same as with `createFuzzySearch`
        getText: (item) => [item.name],
        // arbitrary mapping function, takes `FuzzyResult<T>` as input
        mapResultItem: ({ item, score, matches }) => ({ item, matches })
    });

    return (
        <Layout title="built-in targets" description="Hello React Page">
            <main className={styles.targets}>
                <header className={styles.header}>
                    <h1>built-in targets</h1>
                    <div><strong>probe-rs</strong> ships many built-in targets.</div>
                    <div>If a target is not listed, you have the option to extract it from a CMSIS-Pack or if that does not exist either, write a flash algorithm from scratch with our templates.</div>
                </header>



                <Filter filtered={filteredList} queryText={queryText} setQueryText={setQueryText} />

                <ul className="targets-list">
                    {filteredList.map(
                        ({ item: chip, matches }) => (
                            <li
                                className="target"
                                data-family={chip.family}
                                data-manufacturer={chip.manufacturer}
                            >
                                <a href={`/targets/${gitRef}/${chip.name}`}>
                                    <div className="border rounded m-2 p-2 border-secondary">
                                        <h4>{chip.name}</h4>
                                        <div>
                                            <span className="tag is-small is-color-lightgreen">
                                                {chip.cores.length}{" "}
                                                {chip.cores.length > 1 ? "Cores" : "Core"}
                                            </span>
                                            {chip.memory_map.map((memory) => (
                                                <>
                                                    {memory.Ram &&
                                                        (
                                                            <span className="tag is-small is-color-gold">
                                                                {humanFileSize(
                                                                    memory.Ram.range.end -
                                                                    memory.Ram.range.start,
                                                                )} Ram
                                                            </span>
                                                        )}
                                                    {memory.Nvm &&
                                                        (
                                                            <span className="tag is-small is-color-tomato">
                                                                {humanFileSize(
                                                                    memory.Nvm.range.end -
                                                                    memory.Nvm.range.start,
                                                                )} Flash
                                                            </span>
                                                        )}
                                                </>
                                            ))}
                                        </div>
                                    </div>
                                </a>
                            </li>
                        ),
                    )}
                </ul>
            </main>

        </Layout >
    );
}

interface FilterProps {
    filtered: { item: Target, matches: FuzzyMatches }[]
    queryText: string,
    setQueryText: (string) => void
}

function Filter({ filtered, queryText, setQueryText }: FilterProps) {
    return (<><input value={queryText} onChange={(e) => { e.preventDefault(); setQueryText(e.target.value) }} />
        {queryText}
        {/* {filtered.map(({ item, highlightRanges }) => (
        <Item key={item.key}>
            <Label><Highlight text={item.name} ranges={highlightRanges} /></Label>
        </Item>
    ))} */}
    </>)
}
