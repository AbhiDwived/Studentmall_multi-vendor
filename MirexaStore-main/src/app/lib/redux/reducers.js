// src/redux/reducers.js

const initialState = {
	searchQuery: "",
};

const searchReducer = (state = initialState, action) => {
	switch (action.type) {
		case "SET_SEARCH_QUERY":
			return { ...state, searchQuery: action.payload };
		default:
			return state;
	}
};

export default searchReducer;
