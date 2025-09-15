// src/app/lib/redux/features/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
	email: string;
	role: string;
	name?: string;
	[key: string]: any;
}

interface AuthState {
	user: User | null;
	token: string | null;
}

const initialState: AuthState = {
	user: typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "null") : null,
	token: typeof window !== "undefined" ? localStorage.getItem("accessToken") : null,
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		loginUser: (state, action: PayloadAction<{ user: User; token: string }>) => {
			state.user = action.payload.user;
			state.token = action.payload.token;
			if (typeof window !== "undefined") {
				localStorage.setItem("user", JSON.stringify(action.payload.user));
				localStorage.setItem("accessToken", action.payload.token);
				localStorage.setItem("role", action.payload.user.role);
			}
		},
		logoutUser: (state) => {
			state.user = null;
			state.token = null;
			if (typeof window !== "undefined") {
				localStorage.removeItem("user");
				localStorage.removeItem("accessToken");
				localStorage.removeItem("role");
			}
		},
	},
});

export const { loginUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;
