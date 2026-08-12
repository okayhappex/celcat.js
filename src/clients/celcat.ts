import ical from "ical";

import { Cache } from "../utils/cache.js";

import type {
	CalendarEvent,
	CelcatClientOptions,
} from "../types/celcat.js";

export class CelcatClient {
	private readonly cache: Cache;
	private readonly baseUrl: string;
	private readonly edtUrl: string;

	constructor(options: CelcatClientOptions = {}) {
		this.cache = new Cache(options.cacheTtlSeconds ?? 600);

		this.baseUrl =
			options.baseUrl ?? "https://celcat.rambouillet.iut-velizy.uvsq.fr";

		this.edtUrl =
			options.edtUrl ?? "https://edt.rambouillet.iut-velizy.uvsq.fr";
	}

	async getEvents(
		groupId: string,
		start: Date,
		end: Date,
		forceReload = false,
	): Promise<CalendarEvent[]> {
		if (!groupId) {
			throw new Error("Missing group id");
		}

		const cacheKey = `events_${groupId}_${this.formatDate(start)}_${this.formatDate(end)}`;

		if (!forceReload) {
			const cached = this.cache.getItem<CalendarEvent[]>(cacheKey);

			if (cached) {
				return cached;
			}
		}

		const events = await this.fetchIcal(groupId, start, end, forceReload);

		this.cache.setItem(cacheKey, events);

		return events;
	}

	private async fetchIcal(
		groupId: string,
		start: Date,
		end: Date,
		forceReload: boolean,
	): Promise<CalendarEvent[]> {
		const cacheKey = `ical_${groupId}`;

		let icalData = forceReload
			? undefined
			: this.cache.getItem<string>(cacheKey);

		if (!icalData) {
			const response = await fetch(
				`${this.baseUrl}/cal/ical/${groupId}/schedule.ics`,
			);

			if (!response.ok) {
				if (response.status === 404) {
					throw new Error(
						`No schedule found for group ID: ${groupId}`,
					);
				}

				throw new Error(
					`iCal fetch failed. Status: ${response.status}`,
				);
			}

			icalData = await response.text();

			this.cache.setItem(cacheKey, icalData);
		}

		const calendar = ical.parseICS(icalData);

		const startNumber = this.dateToYyyymmdd(start);
		const endNumber = this.dateToYyyymmdd(end);

		return Object.values(calendar)
			.filter((event) => event.type === "VEVENT")
			.map((event) => {
				const startDate = event.start
					? new Date(event.start)
					: undefined;

				const endDate = event.end ? new Date(event.end) : undefined;

				startDate?.setSeconds(0, 0);
				endDate?.setSeconds(0, 0);

				return {
					uid: event.uid,
					summary: event.summary ?? "",
					start: startDate?.toISOString() ?? "",
					end: endDate?.toISOString() ?? "",
					location: event.location ?? "",
					description: event.description ?? "",
				};
			})
			.filter((event) => {
				if (!event.start) {
					return false;
				}

				const dateNumber = this.dateToYyyymmdd(new Date(event.start));

				return dateNumber >= startNumber && dateNumber <= endNumber;
			})
			.sort(
				(a, b) =>
					new Date(a.start).getTime() - new Date(b.start).getTime(),
			)
			.filter((e) => e !== undefined) as CalendarEvent[];
	}

	private formatDate(date: Date): string {
		return date.toISOString().split("T")[0]!;
	}

	private dateToYyyymmdd(date: Date): number {
		if (Number.isNaN(date.getTime())) {
			return 0;
		}

		return Number(
			`${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(
				date.getDate(),
			).padStart(2, "0")}`,
		);
	}
}
