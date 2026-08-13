import { CelcatClient } from "./clients/celcat.js";
import { CelcatService } from "./services/celcat.js";

import type { CelcatClientOptions } from "./types/celcat.js";

export { GROUPS } from "./constants/groups.js";

export type {
	CalendarEvent,
	CelcatClientOptions,
	CelcatPostEvent,
	Course,
	CourseHours,
	Week,
	WeekDay,
} from "./types/celcat.js";

export type { GroupId } from "./constants/groups.js";

export interface ClientOptions {
	celcat?: CelcatClientOptions;
}

export class Client {
	public readonly celcat: CelcatService;

	constructor(options: ClientOptions = {}) {
		const celcat = new CelcatClient(options.celcat);

		this.celcat = new CelcatService(celcat);
	}
}
