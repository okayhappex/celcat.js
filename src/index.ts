const ical = require('ical');

import type { Course } from './types/events.js';

/********************************/

function getDayInt(date: Date): number {
    if (!date) return 0;

    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0"); // mois = 0-11
    const d = String(date.getDate()).padStart(2, "0");

    return parseInt(`${y}${m}${d}`);
}

async function fetch_ical(id: string): Promise<[number, any]> {
    const res = await fetch(`https://celcat.rambouillet.iut-velizy.uvsq.fr/cal/ical/${id}/schedule.ics`);

    if (res.status == 200) {
        const data = await res.text();
        return [200, data];
    } else {
        return [res.status, await res.text()];
    }
}

function parseFromData(data: string): any[] {
    const cal: Course[] = ical.parseICS(data);

    const evs: Course[] = Object.values(cal).map(ev => ({
        uid: ev.uid,
        summary: ev.summary,
        start: ev.start,
        end: ev.end,
        location: ev.location,
        description: ev.description
    }));

    evs.sort((a: Course, b: Course) => getDayInt(a.start) - getDayInt(b.start));

    for (let i = 0; i < evs.length; i++) {
        evs[i].start.setSeconds(0, 0);
        evs[i].end.setSeconds(0, 0);
    }

    return evs;
}


/********************************/

async function get_timetable(group: string, start: Date, end?: Date): Promise<Course[]> {
    if (!group) {
        throw new Error("Missing group id");
    }

    if (!start) {
        throw new Error("Missing start date");
    }

    const data = await fetch_ical(group);

    if (data[0] != 200) {
        throw new Error(`Error fetching iCal data: ${data[1]}`);
    }

    let _start = getDayInt(new Date(start)) || 0;
    let _end = end ? getDayInt(new Date(end)) : (_start == 0 ? 21001231 : (_start + 5));

    const raw: string = data[1];
    const events = parseFromData(raw);

    let result: Course[] = [];

    for (let i = 1; i < events.length; i++) {
        let ev = events[i];
        let _date = getDayInt(ev.start);

        if (_start <= _date && _date <= _end) {
            result.push(ev);
        }
    }

    return result;
}

async function get_course(group: string, id?: string, start?: Date): Promise<Course | null> {
    if (!group) {
        throw new Error("Missing group id");
    }

    if (!(id || start)) {
        throw new Error("You must provide either an event id or a start date");
    }

    const data = await get_timetable(group, start ? new Date(start) : new Date());

    for (let i = 0; i < data.length; i++) {
        let ev = data[i];

        if ((id && ev.uid == id) || (start && ev.start.getTime() == new Date(start).getTime())) {
            return ev;
        }
    }

    return null;
}

export { get_timetable, get_course };