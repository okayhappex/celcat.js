import { Timetable } from '../lib/index.js';

const tt = new Timetable()

let group_id = ""; // ID du groupe
let course_id = null; // uid du cours (optionnel si course_date est défini)
let course_date = new Date(); // date et heure de début du cours (optionnel si course_id est défini)

tt.getCourse(group_id, course_id, course_date).then((course) => {
    console.log(course);
}).catch((err) => {
    console.error(err);
});