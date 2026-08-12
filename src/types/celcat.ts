export interface CalendarEvent {
	uid: string;
	summary: string;
	start: string;
	end: string;
	location: string;
	description: string;

	eventCategory?: string;
	modules?: string[] | null;
	department?: string;
	faculty?: string;
	sites?: string[] | null;
	allDay?: boolean;
	backgroundColor?: string;
	textColor?: string;

	teacher?: string;
	group?: string;
	roomClean?: string;
	moduleCode?: string;
	codeSimplifier?: string;
	moduleLabel?: string;
	summaryLabel?: string;
}

export interface CelcatPostEvent {
	id: string;
	start: string;
	end: string | null;
	allDay: boolean;
	description: string;
	backgroundColor: string;
	textColor: string;
	department: string;
	faculty: string;
	eventCategory: string;
	sites: string[] | null;
	modules: string[] | null;
	registerStatus: number;
	studentMark: number;
	custom1: null;
	custom2: null;
	custom3: null;
}

export interface RawIcalEvent {
	type: "VEVENT";
	uid: string;
	summary?: string;
	start?: Date;
	end?: Date;
	location?: string;
	description?: string;
}

export interface Course {
	uid: string;
	type: string;
	summary: string;
	start: Date;
	end: Date;
	teachers: string[];
	location: string;
	module: string;
}

export interface Week {
	monday: Course[];
	tuesday: Course[];
	wednesday: Course[];
	thursday: Course[];
	friday: Course[];
	saturday: Course[];
	sunday: Course[];
}

export type WeekDay = keyof Week;

export type CourseHours = Record<string, number>;

export interface CelcatClientOptions {
	baseUrl?: string;
	edtUrl?: string;
	cacheTtlSeconds?: number;
}
