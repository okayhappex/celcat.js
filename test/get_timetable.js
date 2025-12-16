import { Timetable } from '../lib/index.js';

const tt = new Timetable()

let group_id = "G1-TS2PGRAD6003"; // ID du groupe
let start_date = new Date("2025-12-14"); // date de début de la période
let end_date = null; // date de fin de la période (prend un jour par défaut)

let a = await tt.getTimetable(group_id, start_date)
console.log(a)