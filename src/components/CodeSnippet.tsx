import { Code } from "astro/components";
import clsx from "clsx";
import { useState } from "preact/hooks";

const [selectedSnippet, setSelectedSnippet] = useState(0);

type Props = {
    snippets: { code: string, lang: string, title: string }[],
};

export default function CodeSnippet({ snippets }: Props) {

    return <div class="flex flex-col p-0">
        <ul
            aria-label="Code Tabs"
            class="flex list-none p-0 m-0 mt-0 mb-0 probe-rs-code-menu bg-slate-200 rounded-t-md overflow-hidden"
        >
            {
                snippets.map((snippet: any) => (
                    <li class="p-0 m-0 mt-0 mb-0 whitespace-nowrap">
                        <button
                            className={clsx(
                                "p-3 px-4 bg-slate-200 hover:bg-slate-100 cursor-pointer",
                                { "bg-slate-100": true, "font-bold": true },
                            )}
                        >
                            {snippet.title}
                        </button>
                    </li>
                ))
            }
        </ul>
        {/* <Code code={snippets[0].code} lang={snippets[0].lang as any} /> */}
    </div>
}