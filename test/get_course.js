const { get_course } = require('../dist/index.js');

group = ""; // ID du groupe
course_id = null; // uid du cours (optionnel si course_date est défini)
course_date = new Date("2025-09-29T07:00:00.000Z"); // date et heure de début du cours (optionnel si course_id est défini)

get_course(group_id, course_id, course_date).then((course) => {
    console.log(course);
}).catch((err) => {
    console.error(err);
});