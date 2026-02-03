export const getCredentialStyle = (type: string) => {
	const styles: { [key: string]: string } = {
		TOR: "bg-purple-100 text-purple-700",
		DIPLOMA: "bg-purple-100 text-purple-700",
		CERT_OF_GRADES: "bg-yellow-100 text-yellow-700",
		OFFICIAL_TRANSCRIPT: "bg-yellow-100 text-yellow-700", // Mapping assumption
		CERTIFICATE_OF_HONORS: "bg-green-100 text-green-700", // Mapping assumption
		default: "bg-slate-100 text-slate-700",
	};
	return styles[type] || styles.default;
};
