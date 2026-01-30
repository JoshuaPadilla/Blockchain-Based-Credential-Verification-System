// Helper: Convert Year to Words (e.g. 2018 -> "two thousand eighteen")
export const yearToWords = (year: number | string) => {
	const ones = [
		"",
		"one",
		"two",
		"three",
		"four",
		"five",
		"six",
		"seven",
		"eight",
		"nine",
	];
	const teens = [
		"ten",
		"eleven",
		"twelve",
		"thirteen",
		"fourteen",
		"fifteen",
		"sixteen",
		"seventeen",
		"eighteen",
		"nineteen",
	];
	const tens = [
		"",
		"",
		"twenty",
		"thirty",
		"forty",
		"fifty",
		"sixty",
		"seventy",
		"eighty",
		"ninety",
	];

	const yStr = year.toString();
	if (yStr.length !== 4) return yStr; // Fallback for non-4-digit years

	const firstTwo = parseInt(yStr.substring(0, 2));
	const lastTwo = parseInt(yStr.substring(2, 4));

	let prefix = "";
	if (firstTwo === 19) prefix = "nineteen";
	if (firstTwo === 20) prefix = "two thousand";

	let suffix = "";
	if (lastTwo === 0) {
		suffix = ""; // 2000 -> two thousand
	} else if (lastTwo < 10 && firstTwo === 20) {
		suffix = ` ${ones[lastTwo]}`; // 2008 -> two thousand eight (usually no "and" in US/PH formal)
		// If you prefer "two thousand and eight", change to: suffix = ` and ${ones[lastTwo]}`;
	} else if (lastTwo < 10) {
		suffix = ` oh ${ones[lastTwo]}`; // 1908 -> nineteen oh eight
	} else if (lastTwo < 20) {
		suffix = ` ${teens[lastTwo - 10]}`;
	} else {
		const ten = Math.floor(lastTwo / 10);
		const one = lastTwo % 10;
		suffix = ` ${tens[ten]}${one ? "-" + ones[one] : ""}`;
	}

	return (prefix + suffix).trim();
};

// Helper: Get Day Suffix (e.g. 1 -> "1st", 10 -> "10th")
export const getOrdinalDay = (day: number) => {
	const j = day % 10,
		k = day % 100;
	if (j == 1 && k != 11) return day + "st";
	if (j == 2 && k != 12) return day + "nd";
	if (j == 3 && k != 13) return day + "rd";
	return day + "th";
};
