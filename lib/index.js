import { Cache } from './cache.js';
import * as utils from './utils.js';
export class Timetable {
    cache;
    url;
    constructor(url, ttlSeconds = 86400) {
        this.cache = new Cache(ttlSeconds);
        this.url = url || 'https://celcat-back.mmi.codes';
    }
    async fetchIcal(id, start = new Date, end = undefined, forceReload = false) {
        if (!start)
            start = new Date();
        if (!end) {
            end = new Date(start.getTime() + 6 * 24 * 60 * 60 * 1000); // 7 jours
        }
        const cached = this.cache.getItem(`${id}_${start.toISOString()}_${end.toISOString()}`);
        if (cached && !forceReload) {
            return [200, cached];
        }
        const res = await fetch(`${this.url}/edt/${id}?start=${start.toISOString().split('T')[0]}&end=${end.toISOString().split('T')[0]}`);
        if (res.status === 200) {
            const data = await res.json();
            const courses = [];
            data.forEach(course => {
                courses.push({
                    uid: course.uid,
                    type: utils.formatTitle(course.summary).type,
                    summary: utils.formatTitle(course.summary).summary,
                    start: new Date(course.start),
                    end: new Date(course.end),
                    teachers: utils.formatDescription(course.description).teachers,
                    location: course.location,
                    module: utils.formatTitle(course.summary).module
                });
            });
            this.cache.setItem(`${id}_${start.toISOString()}_${end.toISOString()}`, courses);
            return [200, courses];
        }
        else {
            return [res.status, await res.text()];
        }
    }
    async getTimetable(group, start, end) {
        if (!group)
            throw new Error('Missing group id');
        if (!start)
            throw new Error('Missing start date');
        const [status, data] = await this.fetchIcal(group, start, end);
        if (status !== 200)
            throw new Error(`Error fetching iCal data: ${data}`);
        return data;
    }
    async getCourse(group, id, start) {
        if (!group)
            throw new Error('Missing group id');
        if (!id && !start)
            throw new Error('You must provide either an event id or a start date');
        const events = await this.getTimetable(group, start ?? new Date());
        return (events.find((ev) => (id && ev.uid === id) ||
            (start && ev.start.getTime() === start.getTime())) || null);
    }
}
