import { Client, GROUPS } from "../lib/index.js";

const client = new Client();

let start_date = new Date("2026-09-12"); // date de début de la période
let end_date = null; // date de fin de la période (prend un jour par défaut)

let a = await client.celcat.getWeek(GROUPS.MMI2.A2, start_date);
console.log(a);
