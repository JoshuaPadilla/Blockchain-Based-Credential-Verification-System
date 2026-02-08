import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL;

// Set config defaults when creating the instance
const axiosClient = axios.create({
	baseURL: `${baseUrl}/api/`,
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
	},
});

export default axiosClient;
