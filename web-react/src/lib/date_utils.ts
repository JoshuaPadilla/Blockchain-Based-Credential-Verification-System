export function formatDate(date: Date | string): string {
	const dateObj = typeof date === "string" ? new Date(date) : date;

	if (isNaN(dateObj.getTime())) {
		throw new Error("Invalid Date");
	}

	return new Intl.DateTimeFormat("en-US", {
		month: "short", // "Jan"
		day: "numeric", // "2"
		year: "numeric", // "2026"
	}).format(dateObj);
}
