import * as Sentry from "@sentry/nextjs";
import { SupabaseIntegration } from "@supabase/sentry-js-integration";
import { SupabaseClient } from "@supabase/supabase-js";

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
const ENVIRONMENT = process.env.VERCEL_ENV || process.env.NODE_ENV;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

if (ENVIRONMENT !== "development" && SENTRY_DSN !== "") {
	Sentry.init({
		dsn: SENTRY_DSN,
		environment: ENVIRONMENT,
		tracesSampleRate: 0.25,

		integrations: [
			new SupabaseIntegration(SupabaseClient, {
				tracing: true,
				breadcrumbs: true,
				errors: true,
			}),
			new Sentry.Integrations.WinterCGFetch({
				breadcrumbs: true,
				shouldCreateSpanForRequest: (url) => !url.startsWith(`${SUPABASE_URL}/rest`),
			}),
		],
	});
}
