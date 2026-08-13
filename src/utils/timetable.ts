export interface FormattedTitle {
	type: string;
	summary: string;
	module: string;
}

export function formatTitle(title: string): FormattedTitle {
	const parts = title.split(";");

	let subject = parts[0]?.trim() ?? "";
	let type = "inconnu";

	if (subject.includes("Entreprise")) {
		type = "Entreprise";
		subject = "Entreprise - Entreprise";
	} else if (parts[1]?.includes("tutore")) {
		type = "Projet Tutoré";
	} else if (parts[1]?.includes("DS")) {
		type = "DS";
	} else if (parts[1]?.includes("Integration")) {
		type = "Integration";
	} else if (parts[1]?.includes("Reunion")) {
		type = "Reunion";
	} else {
		const match = parts[1]?.match(/ \(([^)]+)\)/);

		if (match?.[1]) {
			type = match[1];
		}
	}

	let module = subject.split(" - ")[0]?.trim() ?? "";
	let summary = subject.split(" - ")[1]?.trim() ?? "";

	if (
		module.toLowerCase().includes("tutore") ||
		module.toLowerCase().includes("autonomie")
	) {
		type = "Projet Tutoré";
		summary = "Projet Tutoré";
		module = "inconnu";
	}

	return {
		type,
		summary,
		module,
	};
}

export interface FormattedDescription {
	teachers: string[];
}

export function formatDescription(description: string): FormattedDescription {
	const firstPart = description.split("\n\n")[0] ?? "";

	const teachers = firstPart
		.split("; ")
		.filter(
			(element) =>
				!element.startsWith("MMI") &&
				!element.startsWith("RT") &&
				!element.startsWith("INFO") &&
				!element.startsWith("GEII"),
		);

	return {
		teachers,
	};
}
