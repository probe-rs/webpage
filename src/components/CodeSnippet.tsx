import clsx from "clsx";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { useLayoutEffect, useState } from "preact/hooks";
import { Fragment, jsx, jsxs, type JSX } from "preact/jsx-runtime";
import { codeToHast, type BundledLanguage } from "shiki/bundle/full";

type Props = {
    snippets: { code: string, lang: BundledLanguage, title: string }[],
};

export default function CodeSnippet({ snippets }: Props) {
    const [selectedSnippet, setSelectedSnippet] = useState(0);
    const snippet = snippets[selectedSnippet];
    return <div class="flex flex-col p-0">
        <style>{`
            .code-tabs-decorator {
                width: 88px;
                background-image: url('data:image/svg+xml;charset=UTF-8,<svg width="54" height="14" viewBox="0 0 54 14" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="7" cy="7" r="7" fill="%23FF5533"/><circle cx="27" cy="7" r="7" fill="%23E6CF5C"/><circle cx="47" cy="7" r="7" fill="%237ACC52"/></svg>');
                background-repeat: no-repeat;
                background-position: 16px 14px;
            }
        `}</style>
        <ul
            aria-label="Code Tabs"
            class="flex list-none p-0 m-0 mt-0 mb-0 h-full probe-rs-code-menu bg-slate-200 rounded-t-md overflow-hidden before bg-[]"
        >
            <li class={"code-tabs-decorator mt-0 mb-0"}></li>
            {
                snippets.map((snippet: any, index) => (
                    <li class="p-0 m-0 mt-0 mb-0 whitespace-nowrap">
                        <button
                            className={clsx(
                                { "bg-slate-100": selectedSnippet == index, "bg-slate-200": selectedSnippet != index, "font-bold": selectedSnippet == index },
                                "p-2 px-4  hover:bg-slate-100 cursor-pointer",
                            )}
                            onClick={() => setSelectedSnippet(index)}
                        >
                            {snippet.title}
                        </button>
                    </li>
                ))
            }
        </ul>
        <CodeBlock {...snippet} />
    </div>
}

export async function highlight(code: string, lang: BundledLanguage) {
    const out = await codeToHast(code, {
        lang,
        themes: {
            light: 'min-light',
            dark: 'nord',
        }
    })

    return toJsxRuntime(out, {
        Fragment,
        jsx,
        jsxs,
    }) as JSX.Element
}

export function CodeBlock({ code, lang }: { code: string, lang: BundledLanguage, title: string }) {
    const [nodes, setNodes] = useState(undefined as JSX.Element | undefined)

    useLayoutEffect(() => {
        void highlight(code, lang).then(setNodes)
    }, [code, lang])

    return nodes ?? <p>Loading...</p>
}