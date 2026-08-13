import type { CelcatClient } from "../clients/celcat.js";
import type {
	CalendarEvent,
	Course,
	CourseHours,
	Week,
} from "../types/celcat.js";
import type { GroupId } from "../constants/groups.js";
import { formatDescription, formatTitle } from "../utils/timetable.js";

export class CelcatService {
	constructor(private readonly client: CelcatClient) {}

	async getCourses(
		groupId: GroupId,
		start: Date,
		end: Date,
		forceReload = false,
	): Promise<Course[]> {
		if (!groupId) {
			throw new Error("Missing group id");
		}

		if (!start) {
			throw new Error("Missing start date");
		}

		const events = await this.client.getEvents(
			groupId,
			start,
			end,
			forceReload,
		);

		return events.map((event) => this.toCourse(event));
	}

	async getCourse(
		groupId: GroupId,
		options: {
			id?: string;
			start?: Date;
			end?: Date;
			forceReload?: boolean;
		},
	): Promise<Course | null> {
		if (!groupId) {
			throw new Error("Missing group id");
		}

		if (!options.id && !options.start) {
			throw new Error(
				"You must provide either an event id or a start date",
			);
		}

		const courses = await this.getCourses(
			groupId,
			options.start ?? new Date(),
			options.end ??
				new Date(
					options.start ?? new Date().getTime() + 24 * 60 * 60 * 1000,
				),
			options.forceReload ?? false,
		);

		return (
			courses.find(
				(course) =>
					(options.id && course.uid === options.id) ||
					(options.start &&
						course.start.getTime() === options.start.getTime()),
			) ?? null
		);
	}

	async getWeek(
		groupId: GroupId,
		date: Date = new Date(),
		forceReload = false,
	): Promise<Week> {
		const monday = this.getMonday(date);

		const sunday = new Date(monday);
		sunday.setDate(sunday.getDate() + 6);
		sunday.setHours(23, 59, 59, 999);

		const courses = await this.getCourses(
			groupId,
			monday,
			sunday,
			forceReload,
		);

		const week: Week = {
			monday: [],
			tuesday: [],
			wednesday: [],
			thursday: [],
			friday: [],
			saturday: [],
			sunday: [],
		};

		for (const course of courses) {
			const day = this.getWeekDay(course.start);

			week[day].push(course);
		}

		return week;
	}

	async getWeekHours(
		groupId: GroupId,
		date: Date = new Date(),
		forceReload = false,
	): Promise<CourseHours> {
		const week = await this.getWeek(groupId, date, forceReload);

		const hours: CourseHours = {};

		for (const courses of Object.values(week)) {
			for (const course of courses) {
				if (course.type === "pause" || course.type === "lunch") {
					continue;
				}

				const duration =
					(course.end.getTime() - course.start.getTime()) /
					(1000 * 60 * 60);

				hours[course.module] = (hours[course.module] ?? 0) + duration;
			}
		}

		return hours;
	}

	private toCourse(event: CalendarEvent): Course {
		const title = formatTitle(event.summary);
		const description = formatDescription(event.description);

		let type = title.type;
		let summary = title.summary;
		let module = title.module;

		if (module === "Reunion") {
			type = "Réunion";
			summary = "Réunion";
			module = "Réunion";
		}

		return {
			uid: event.uid,
			type,
			summary,
			start: new Date(event.start),
			end: new Date(event.end),
			teachers: description.teachers,
			location: event.location,
			module,
		};
	}

	private getMonday(date: Date): Date {
		const monday = new Date(date);

		monday.setHours(0, 0, 0, 0);

		const day = monday.getDay();
		const diff = day === 0 ? -6 : 1 - day;

		monday.setDate(monday.getDate() + diff);

		return monday;
	}

	private getWeekDay(date: Date): keyof Week {
		switch (date.getDay()) {
			case 1:
				return "monday";
			case 2:
				return "tuesday";
			case 3:
				return "wednesday";
			case 4:
				return "thursday";
			case 5:
				return "friday";
			case 6:
				return "saturday";
			default:
				return "sunday";
		}
	}
}
