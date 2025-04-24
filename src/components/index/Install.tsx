import { CodeBlock } from "../CodeBlock";

type Props = {

};

export default function TargetsView({ }: Props) {
    return <div class="flex flex-col items-center w-full">
        <h2 class="text-xl">Installing is easy</h2>
        <CodeBlock
            code={`curl -LsSf https://github.com/probe-rs/probe-rs/releases/latest/download/probe-rs-tools-installer.sh | sh `}
            lang="shell"
        />
        <span class="mt-5"
        >More <a
            href={import.meta.env.BASE_URL + "docs/getting-started/installation"}
            class="text-[#15846f] underline">install methods</a
            ></span
        >
    </div>
}