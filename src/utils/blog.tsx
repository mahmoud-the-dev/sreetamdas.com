import fs from "fs";
import path from "path";

import matter from "gray-matter";

import { getMdxString } from "components/mdx";
import { TBlogPost } from "typings/blog";

export const getBlogPreviewImageURL = ({ slug }: { slug: TBlogPost["slug"] }) =>
	`${process.env.SITE_URL}/blog/${slug}/preview.png`;

export const getBlogPostsData = async () => {
	const DIR = path.join(process.cwd(), "src", "content", "blog");
	const files = fs.readdirSync(DIR).filter((file) => file.endsWith(".mdx"));
	const entries = await Promise.all(files.map((file) => import(`content/blog/${file}`)));

	const postsData: Array<TBlogPost> = files
		.map((file, index) => {
			const name = path.join(DIR, file);
			const contents = fs.readFileSync(name, "utf8");
			// @ts-expect-error provide a valid type for the return type
			const { data: meta }: TBlogPost = matter(contents);

			const slug = file.replace(/\.mdx?$/, "");
			const MDXContent = entries[index].default;

			return {
				...meta,
				slug,
				image: getBlogPreviewImageURL({ slug }),
				content: getMdxString(<MDXContent />),
			};
		})
		.filter((meta) => process.env.NODE_ENV === "development" || meta.published)
		.sort((a, b) => {
			return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
		});

	return postsData;
};

export const getAboutMDXPagesData = async () => {
	/**
	 * so Next.js (correctly) prevents us from building a website wherein we're
	 * trying to dynamically trying to create a page that _already_ exists
	 * "statically" - in our repo this can be seen when using our traditional
	 * approach we were creating pages for all the .mdx files in from the /content
	 * dir, but we've already defined a pages/about.tsx
	 *
	 * to counter this, we'll add logic here in order to only create static paths
	 * for pages that _dont_ exist already
	 */

	const DIR = path.join(process.cwd(), "src", "content");
	const existingPagesDIR = path.join(process.cwd(), "src", "pages");

	const files = fs.readdirSync(DIR).filter((file) => file.endsWith(".mdx"));
	const existingAboutPageFiles = fs
		.readdirSync(existingPagesDIR)
		.filter((file) => file.endsWith(".tsx"))
		.map((file) => file.replace(/\.tsx?$/, ""));

	const pagesData: Array<{ page: string }> = files
		.map((file) => {
			return {
				page: file.replace(/\.mdx?$/, ""),
			};
		})
		.filter(({ page }) => existingAboutPageFiles.indexOf(page) === -1);
	const entries = await Promise.all(pagesData.map(({ page }) => import(`content/${page}.mdx`)));
	const pagesDataWithContent = pagesData.map((data, index) => {
		const MDXContent = entries[index].default;

		return {
			...data,
			content: getMdxString(<MDXContent />),
		};
	});

	return pagesDataWithContent;
};
