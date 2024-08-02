import { type Route } from "next";
import { HiOutlineCalendar, HiOutlineNewspaper } from "react-icons/hi";

import { LinkTo } from "@/lib/components/Anchor";
import { MDXContent } from "@/lib/components/MDX";
import { ViewsCounter } from "@/lib/components/ViewsCounter";

import { type ButtondownAPIEmailsResponse } from "./helpers";

export const BUTTONDOWN_EMAIL_STATS_URL_PREFIX = "https://buttondown.email/emails/analytics";

type NewsletterEmailDefaultFields = ButtondownAPIEmailsResponse["results"][number];

type EmailPreviewProps = Pick<NewsletterEmailDefaultFields, "body" | "slug" | "subject"> & {
	id: NewsletterEmailDefaultFields["id"];
	secondary_id: NewsletterEmailDefaultFields["secondary_id"];
	publish_date: NewsletterEmailDefaultFields["publish_date"];
};

type NewsletterEmailPreviewProps = {
	email: EmailPreviewProps;
	isAdminUser?: boolean;
};
const NewsletterEmailPreview = ({ email, isAdminUser = false }: NewsletterEmailPreviewProps) => (
	<article>
		<h2 className="p-0 font-sans text-2xl font-bold text-primary">
			<LinkTo href={`/newsletter/${email.slug}`} scroll={false}>
				{email.subject}
			</LinkTo>
		</h2>

		<div className="[mask-image:linear-gradient(to_bottom,_black_50%,_transparent_100%)]">
			<MDXContent code={email.body} />
		</div>
		<div className="grid grid-cols-[1fr_max-content] justify-between pt-2.5">
			<span className="flex items-center justify-end gap-5">
				<span className="flex gap-1.5 text-base">
					<HiOutlineNewspaper className="text-2xl" /> #{email.secondary_id}
				</span>
				<span className="flex gap-1.5 text-base">
					<HiOutlineCalendar className="text-2xl" />{" "}
					{new Date(email.publish_date).toLocaleDateString("en-US", {
						year: "numeric",
						month: "long",
						day: "numeric",
					})}
				</span>
				{isAdminUser && (
					<LinkTo href={`${BUTTONDOWN_EMAIL_STATS_URL_PREFIX}/${email.id}`} target="_blank">
						Stats
					</LinkTo>
				)}
			</span>
		</div>
	</article>
);

type NewsletterEmailsPreviewsProps = {
	emails: Array<NewsletterEmailPreviewProps["email"]>;
	// TODO add adminUser for newsletter stats' link
	// isAdminUser: NewsletterEmailPreviewProps["isAdminUser"];
};
export const NewsletterEmailsPreviews = ({ emails }: NewsletterEmailsPreviewsProps) => (
	<section className="grid gap-20">
		{emails.map((email, index) => (
			<NewsletterEmailPreview key={index} email={email} />
		))}
	</section>
);

type NewsletterEmailDetailProps = {
	email: ButtondownAPIEmailsResponse["results"][number] & {
		bodyCompiled: string;
	};
};
export const NewsletterEmailDetail = ({ email }: NewsletterEmailDetailProps) => {
	const { bodyCompiled } = email;

	return (
		<section>
			<article>
				<h1 className="pt-20 font-serif text-6xl">{email.subject}</h1>
				<div className="mb-12 mt-5 flex justify-end gap-5">
					<span className="flex items-center gap-1.5 text-base">
						<HiOutlineNewspaper className="text-2xl" /> #{email.secondary_id}
					</span>
					<span className="flex items-center gap-1.5 text-base">
						<HiOutlineCalendar className="text-2xl" />{" "}
						{new Date(email.publish_date).toLocaleDateString("en-US", {
							year: "numeric",
							month: "long",
							day: "numeric",
						})}
					</span>
				</div>

				<MDXContent code={bodyCompiled} />
			</article>
			<ViewsCounter slug={`/newsletter/${email.slug}` as Route} />
		</section>
	);
};
