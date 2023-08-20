"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { FOOBAR_PAGES } from "./flags";
import { type FoobarSliceType } from "./store";

import { IS_DEV } from "@/config";
import { LinkTo } from "@/lib/components/Anchor";
import { useCustomPlausible } from "@/lib/domains/Plausible";
import {
	addFoobarToLocalStorage,
	checkIfAllAchievementsAreDone,
	logConsoleMessages,
} from "@/lib/domains/foobar/helpers";
import { useGlobalStore } from "@/lib/domains/global";
import { useHasMounted } from "@/lib/helpers/hooks";

const foobarDataSelector = (state: FoobarSliceType) => ({
	foobar_data: state.foobar_data,
	setFoobarData: state.setFoobarData,
});

type FoobarPixelProps = {
	path?: "/404";
};

/**
 * Entry point into /foobar
 * - Adds link to resume /foobar
 * - Adds required console messages and other helpers
 * - Track navigation for corresponding achievements
 */
export const FoobarPixel = (props: FoobarPixelProps) => {
	const pathname = usePathname();
	const has_mounted = useHasMounted();
	const plausibleEvent = useCustomPlausible();
	const { foobar_data, setFoobarData } = useGlobalStore(foobarDataSelector);
	const { unlocked, visited_pages, completed } = foobar_data;

	useEffect(() => {
		// Add functions for Foobar badges
		addFoobarToLocalStorage();

		// @ts-expect-error add custom function
		window.hack = () => {
			// eslint-disable-next-line no-console
			console.warn("/foobar/hack");
		};

		if (!IS_DEV) {
			logConsoleMessages();
		}
	}, []);

	useEffect(() => {
		let page_name = pathname;
		if (props.path === "/404") {
			page_name = "/404";

			if (!completed.includes(FOOBAR_PAGES.notFound)) {
				setFoobarData({
					completed: completed.concat([FOOBAR_PAGES.notFound]),
				});
			}
		}

		if (!visited_pages?.includes(page_name)) {
			setFoobarData({
				visited_pages: visited_pages.concat([page_name]),
			});
		}

		// for the `navigator` achievement
		if (visited_pages.length >= 5 && !completed.includes(FOOBAR_PAGES.navigator)) {
			plausibleEvent("foobar", { props: { achievement: FOOBAR_PAGES.navigator } });
			setFoobarData({
				completed: completed.concat([FOOBAR_PAGES.navigator]),
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [completed, visited_pages, pathname]);

	useEffect(() => {
		// for the `completed` achievement
		if (checkIfAllAchievementsAreDone(completed)) {
			plausibleEvent("foobar", { props: { achievement: "completed" } });
			setFoobarData({
				all_achievements: true,
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [completed]);

	return has_mounted && unlocked ? (
		<span className="col-start-2 col-end-3">
			<code>
				<LinkTo href="/foobar" style={{ border: "none" }}>
					resume /foobar
				</LinkTo>
			</code>
		</span>
	) : null;
};
