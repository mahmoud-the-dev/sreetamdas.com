const SENTRY_DSN =
	process.env.SENTRY_DSN ||
	process.env.NEXT_PUBLIC_SENTRY_DSN ||
	"https://01cad872659c4c56bc7aa5054cd26ff5@o326666.ingest.sentry.io/1835069";

/**
 * Trim `https://01cad872659c4c56bc7aa5054cd26ff5@o326666.ingest.sentry.io/1835069`
 * to `https://o326666.ingest.sentry.io/api/1835069`
 */
const [_https, , _token, ingestURL, projectID] = SENTRY_DSN.split(/[@/]{1}/);
export const SENTRY_ENVELOPE_URL = `https://${ingestURL}/api/${projectID}`;
