import { Client } from '../lib/index.js';

const client = new Client();

let group_id = "f5c52197-6d54-46ab-a803-079ed115f811"; // ID du groupe
let course_id = null; // uid du cours (optionnel si course_date est défini)

client.celcat.getCourse(group_id, course_id).then((course) => {
    console.log(course);
}).catch((err) => {
    console.error(err);
});
