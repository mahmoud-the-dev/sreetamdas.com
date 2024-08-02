import { compile } from "@mdx-js/mdx";

import { SITE_TITLE_APPEND } from "@/config";
import { ViewsCounter } from "@/lib/components/ViewsCounter";

import { NewsletterEmailsPreviews } from "./components";
import { fetchNewsletterEmails } from "./helpers";

export const metadata = {
	title: `Newsletter ${SITE_TITLE_APPEND}`,
	description:
		"Curated links keeping up with the JavaScript, React and webdev world. And mechanical keyboards!",
};

export default async function NewsletterEmailsPage() {
	const newsletter_emails_previews_data = await getNewsletterEmailsPreviewsData();

	return (
		<>
			<h1 className="pb-20 pt-10 font-serif text-8xl font-bold tracking-tighter">/newsletter</h1>
			<NewsletterEmailsPreviews emails={newsletter_emails_previews_data} />
			<ViewsCounter slug="/newsletter" />
		</>
	);
}

function getEmailPreviewContent(content: string) {
	// remove salutation, get two paragraphs
	return content.replace("Hello there!\n", "").split("\n").slice(0, 3).join("\n");
}
async function getNewsletterEmailsPreviewsData() {
	const buttondown_api_emails_response = await fetchNewsletterEmails();

	return await Promise.all(
		buttondown_api_emails_response.results
			.reverse()
			.map(async ({ body, subject, publish_date, id, secondary_id, slug }) => ({
				slug,
				subject,
				publish_date,
				id,
				secondary_id,
				body: String(
					await compile(getEmailPreviewContent(body), { outputFormat: "function-body" }),
				),
			})),
	);
}
