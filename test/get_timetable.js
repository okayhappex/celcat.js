import { get_timetable } from '../dist/index.js';

let group_id = ""; // ID du groupe
let start_date = new Date("2025-09-29T07:00:00.000Z"); // date de début de la période
let end_date = null; // date de fin de la période (prend un jour par défaut)

get_timetable(group_id, start_date, end_date).then((course) => {
    console.log(course);
}).catch((err) => {
    console.error(err);
});