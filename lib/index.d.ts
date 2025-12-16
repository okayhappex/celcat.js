import type { Course } from './events.js';
export type { Course, RawCourse } from './events.js';
export declare class Timetable {
    private cache;
    private url;
    constructor(url?: string, ttlSeconds?: number);
    private fetchIcal;
    getTimetable(group: string, start: Date, end?: Date): Promise<Course[]>;
    getCourse(group: string, id?: string, start?: Date): Promise<Course | null>;
}
