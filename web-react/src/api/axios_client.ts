import axios from "axios";

// Set config defaults when creating the instance
const axiosClient = axios.create({
	baseURL: "http://localhost:3000",
	timeout: 5000,
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
	},
});

export default axiosClient;
