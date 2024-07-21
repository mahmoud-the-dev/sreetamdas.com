"use client";

import PlausibleProvider from "next-plausible";
import { useEffect } from "react";

import { bricolage_grotesque_font, inter_font, iosevka_font } from "@/lib/domains/fonts";
import { FOOBAR_SOURCE_CODE } from "@/lib/domains/foobar/helpers";

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		// eslint-disable-next-line no-console
		console.error(error);
	}, [error]);

	return (
		<html
			lang="en"
			dir="ltr"
			// biome-ignore lint/nursery/useSortedClasses: needed
			className={`scroll-pt-16 scroll-smooth ${inter_font.variable} ${iosevka_font.variable} ${bricolage_grotesque_font.variable}`}
			suppressHydrationWarning
		>
			<head>
				<link rel="icon" href="/favicon.png" />

				<PlausibleProvider
					domain="sreetamdas.com"
					customDomain="sreetamdas.com"
					trackOutboundLinks
					trackFileDownloads
				/>
			</head>
			<body className="min-h-screen bg-background text-foreground selection:bg-secondary selection:text-background">
				<script
					// biome-ignore lint/security/noDangerouslySetInnerHtml: needed
					dangerouslySetInnerHTML={{
						__html: blockingScriptSetInitialColorScheme,
					}}
				/>
				<h2>Something went wrong!</h2>
				<button onClick={() => reset()} type="button">
					Try again
				</button>
				<script
					// biome-ignore lint/security/noDangerouslySetInnerHtml: needed
					dangerouslySetInnerHTML={{
						__html: FOOBAR_SOURCE_CODE,
					}}
				/>
			</body>
		</html>
	);
}

const blockingScriptSetInitialColorScheme = `(function() {
	function setInitialColorScheme() {
		function getInitialColorScheme() {
			const persistedColorScheme = window.localStorage.getItem("color-scheme");
			const hasPersistedColorScheme = typeof persistedColorScheme === "string";

			/**
			 * If the user has explicitly chosen light or dark, use it
			 */
			if (hasPersistedColorScheme) {
				const root = window.document.documentElement;
				root.style.setProperty("--initial-color-scheme", persistedColorScheme);

				if (persistedColorScheme !== "system") {
					return persistedColorScheme;
				}
			}

			/**
			 * If they haven't been explicit, check the media query
			 */
			const mql = window.matchMedia("(prefers-color-scheme: dark)");
			const hasSystemColorSchemePreference = typeof mql.matches === "boolean";

			if (hasSystemColorSchemePreference) {
				return mql.matches ? "dark" : "light";
			}

			/**
			 * If they are using a browser/OS that doesn't support
			 * color themes, default to 'light'.
			 */
			return "light";
		}

		const colorScheme = getInitialColorScheme();
		if (colorScheme === "dark") {
			document.documentElement.setAttribute("data-color-scheme", "dark");
		}
	}
	setInitialColorScheme();
})()

// IIFE!
`;
