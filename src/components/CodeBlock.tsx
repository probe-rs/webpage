
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { useLayoutEffect, useState } from "preact/hooks";
import { Fragment, jsx, jsxs, type JSX } from "preact/jsx-runtime";
import { codeToHast, type BundledLanguage, type BundledTheme, type StringLiteralUnion, type ThemeRegistrationAny } from "shiki/bundle/full";

type Theme = ThemeRegistrationAny | StringLiteralUnion<BundledTheme, string> | undefined;

export function CodeBlock({ code, lang }: { code: string, lang: BundledLanguage, theme?: Theme }) {
    const [nodes, setNodes] = useState(undefined as JSX.Element | undefined)

    useLayoutEffect(() => {
        // Ignore the result if the code changed before it is ready.
        let current = true
        void highlight(code, lang).then((nodes) => current && setNodes(nodes))
        return () => { current = false }
    }, [code, lang])

    return nodes ?? <p>Loading...</p>
}

export async function highlight(code: string, lang: BundledLanguage, theme?: Theme) {
    const out = await codeToHast(code, {
        lang,
        themes: {
            light: theme ?? 'vitesse-light',
            dark: theme ?? 'vitesse-dark',
        },
        defaultColor: 'light'
    })

    return toJsxRuntime(out, {
        Fragment,
        jsx,
        jsxs,
    }) as JSX.Element
}