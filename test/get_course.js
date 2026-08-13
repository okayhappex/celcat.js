import { Client, GROUPS } from "../lib/index.js";

const client = new Client();

let course_id = "f5c52197-6d54-46ab-a803-079ed115f811"; // uid du cours (optionnel si course_date est défini)

client.celcat
	.getCourse(GROUPS.MMI2.A2, { id: course_id })
	.then((course) => {
		console.log(course);
	})
	.catch((err) => {
		console.error(err);
	});
