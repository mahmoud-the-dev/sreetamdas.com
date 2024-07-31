import { isObject } from "lodash-es";
import {
	type CSSProperties,
	Children,
	type DetailedHTMLProps,
	type HTMLAttributes,
	type ReactNode,
	isValidElement,
} from "react";

import { cn } from "@/lib/helpers/utils";

type CodeBlockProps = DetailedHTMLProps<HTMLAttributes<HTMLPreElement>, HTMLPreElement> & {
	children?: ReactNode;
	language?: string;
	highlight?: string;
	"hide-line-numbers"?: "true";
	filename?: string;

	className?: string;
	style?: CSSProperties;
};

export const CodeBlock = (props: CodeBlockProps) => {
	const {
		children: code_element,
		style,
		"hide-line-numbers": hide_line_numbers = false,
		filename = null,
	} = props;

	if (!isValidElement(code_element)) {
		return null;
	}

	const lang = code_element?.props["data-language"];

	return (
		<figure className="my-5 flex flex-col">
			<div
				className="-mx-4 grid grid-flow-col overflow-x-scroll rounded-tl-global rounded-tr-global pl-2 pr-2 sm:-ml-12 sm:-mr-5 sm:pl-12 sm:pr-5"
				style={style}
			>
				{filename !== null ? (
					<span className="justify-self-start rounded-t-global py-1 font-mono text-zinc-400 max-sm:text-xs">
						{filename}
					</span>
				) : null}
				{lang !== "plain" ? (
					<span className="justify-self-end rounded-t-global py-1 font-mono text-zinc-400 max-sm:text-xs">
						{lang}
					</span>
				) : null}
			</div>
			<pre
				className={cn(
					"-mx-4 overflow-x-scroll rounded-bl-global rounded-br-global p-5 text-xs max-sm:px-2 sm:-ml-12 sm:-mr-5 sm:text-sm max-sm:[&>code>.block>.line]:whitespace-pre-wrap",
					filename === null && lang === "plain" && "rounded-global",
				)}
				style={style}
			>
				<code {...code_element?.props}>
					<CodeBlockChildren {...code_element?.props} hide_line_numbers={hide_line_numbers} />
				</code>
			</pre>
		</figure>
	);
};

type CodeBlockChildrenProps = { children: ReactNode; hide_line_numbers?: boolean };
function CodeBlockChildren({ children, hide_line_numbers }: CodeBlockChildrenProps) {
	if (typeof children === "string") {
		return children.split("\n").map((line, index) => (
			<span key={index} className="block">
				{line}
			</span>
		));
	}

	return Children.toArray(children)
		.filter((line) => line !== "\n")
		.map((line, i) => {
			const should_line_highlight =
				isObject(line) && "props" in line && (line.props["data-highlight"] ?? "false") === "true";

			return (
				<span
					key={i}
					className={cn(
						"block",
						should_line_highlight && "-mx-5 border-l-4 border-[#a86efd] bg-[#d0b2ff1a] px-4",
						hide_line_numbers && "pl-8",
					)}
				>
					{hide_line_numbers ? null : (
						<span
							className={cn(
								"inline-block w-0 select-none text-right text-zinc-600 max-sm:opacity-0 sm:-ml-2 sm:mr-2 sm:w-[2rem] sm:pr-2",
								should_line_highlight && "text-[#a86efd]",
							)}
							aria-hidden="true"
						>
							{i + 1}
						</span>
					)}
					{line}
				</span>
			);
		});
}
