import { Nexios } from "nexios-http";

const nexiosInstance = new Nexios({
	baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/",
	timeout: 30000,
	headers: {
		"Content-Type": "application/json",
	}
})

export default nexiosInstance
