import type { BundledLanguage } from "shiki/bundle/full";
import { CodeBlock } from "../CodeBlock";

type Props = {

};

export default function TargetsView({ }: Props) {
    const [command, lang] = installInstructions();
    return <div class="flex flex-col items-center w-full">
        <h2 class="text-xl">Installing is easy</h2>
        <CodeBlock
            code={command}
            lang={lang}
        />
        <span class="mt-5">
            More
            <a
                href={import.meta.env.BASE_URL + "docs/getting-started/installation"}
                class="text-[#15846f] underline ml-1"
            >
                install methods
            </a>
        </span>
    </div>
}

export function installInstructions(): [string, BundledLanguage] {
    const userAgent = window.navigator.userAgent;
    const platform =
        window.navigator?.platform || window.navigator.platform;
    console.log(platform);
    const macosPlatforms = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"];
    const windowsPlatforms = ["Win32", "Win64", "Windows", "WinCE"];
    const iosPlatforms = ["iPhone", "iPad", "iPod"];

    const shell = `curl -LsSf https://github.com/probe-rs/probe-rs/releases/latest/download/probe-rs-tools-installer.sh | sh`;

    if (macosPlatforms.indexOf(platform) !== -1) {
        return [`brew install probe-rs/probe-rs/probe-rs`, 'shell'];
    } else if (iosPlatforms.indexOf(platform) !== -1) {
        return [shell, 'shell'];
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
        return [`powershell -ExecutionPolicy Bypass -c "irm https://github.com/probe-rs/probe-rs/releases/download/v0.27.0/probe-rs-tools-installer.ps1 | iex"`, 'powershell'];
    } else if (/Android/.test(userAgent)) {
        return [shell, 'shell'];
    } else if (/Linux/.test(platform)) {
        return [shell, 'shell'];
    }

    return [shell, 'shell'];;
}