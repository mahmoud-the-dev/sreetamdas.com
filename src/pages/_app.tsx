import "focus-visible";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { Hydrate, QueryClient, QueryClientProvider, DehydratedState } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { NextPage } from "next";
import PlausibleProvider from "next-plausible";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useState } from "react";
import type { PropsWithChildren } from "react";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "styled-components";

import { Database } from "@/domains/Supabase/database.types";
import { getInitialColorMode } from "@/domains/style/darkmode";
import { DefaultLayout } from "@/layouts/Default";
import { theme, toasterProps, GlobalStyles } from "@/styles";
import { StyledThemeObject } from "@/typings/styled";

if (process.env.NEXT_PUBLIC_API_MOCKING_ENABLED === "true") {
	require("mocks");
}

type NextPageWithLayout = NextPage & {
	Layout?: ({ children }: PropsWithChildren<unknown>) => JSX.Element;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AppPropsWithLayout = AppProps<{ dehydratedState: DehydratedState } & any> & {
	Component: NextPageWithLayout;
};

type ThemeObjectInitial = Pick<StyledThemeObject, "themeType" | "theme">;

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const initialTheme = getInitialColorMode()!;

	const [supabaseClient] = useState(() => createBrowserSupabaseClient<Database>());
	const [queryClient] = useState(() => new QueryClient());
	const [themeObject, setThemeObject] = useState<ThemeObjectInitial>({
		themeType: initialTheme,
		theme: theme[initialTheme],
	});
	function changeThemeVariant(themeType: StyledThemeObject["themeType"]) {
		setThemeObject((prevState) => ({ ...prevState, themeType, theme: theme[themeType] }));
	}
	const themeForContext: StyledThemeObject = {
		...themeObject,
		changeThemeVariant,
	};

	const ComponentLayout = Component.Layout ?? DefaultLayout;

	return (
		<>
			<Head>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<SessionContextProvider
				supabaseClient={supabaseClient}
				initialSession={pageProps.initialSession}
			>
				<QueryClientProvider client={queryClient}>
					<Hydrate state={pageProps.dehydratedState}>
						<PlausibleProvider
							domain="sreetamdas.com"
							customDomain="sreetamdas.com"
							trackOutboundLinks
							trackFileDownloads
						>
							<ThemeProvider theme={themeForContext}>
								<GlobalStyles />
								<Toaster {...toasterProps} />
								<ComponentLayout>
									<Component {...pageProps} />
								</ComponentLayout>
							</ThemeProvider>
						</PlausibleProvider>
					</Hydrate>
					<ReactQueryDevtools />
				</QueryClientProvider>
			</SessionContextProvider>
		</>
	);
};

export default MyApp;
