import { isUndefined } from "lodash-es";
import { useMDXComponent } from "next-contentlayer/hooks";
import { Suspense } from "react";

import { ViewsCounter } from "@/lib/components/ViewsCounter";
import { customMDXComponents } from "@/lib/domains/mdx";
import { allPages } from "contentlayer/generated";

export default function Home() {
	const post = allPages.find((page) => page.page_slug === "introduction");

	if (isUndefined(post)) {
		throw new Error("introduction.mdx is missing");
	}

	const MDXContent = useMDXComponent(post.body.code);

	return (
		<>
			<h1 className="py-20 text-center font-serif text-6xl">
				Hey, I&apos;m Sreetam!{" "}
				<span role="img" aria-label="wave">
					👋
				</span>
			</h1>
			<Suspense>
				<MDXContent components={customMDXComponents} />
				<ViewsCounter slug="/" hidden />
			</Suspense>
		</>
	);
}
