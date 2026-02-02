import QRCode from "qrcode";
import { useEffect, useState } from "react";
import "./App.css";

function App() {
	const [qrUrl, setQrUrl] = useState("");

	useEffect(() => {
		const generateQR = async () => {
			const data = JSON.stringify({
				name: "Joshua Vincent Padilla",
				degree: "BS Computer Science",
				date: "2025-12-30",
				id: "DIP-2025-001",
			});

			const url = await QRCode.toDataURL(data, {
				width: 300,
				margin: 1,
			});

			setQrUrl(url);
		};

		generateQR();
	}, []);

	if (!qrUrl) return null;

	return (
		<div className="bg-white w-full h-screen flex justify-center items-center">
			asdas
		</div>
	);
}

export default App;
