const initialState = {
	user: null,
};

export const user = (state = initialState, action) => {
	switch (action.type) {
	case 'USER_LOGIN':
		return Object.assign({}, state, {
			user: user,
		});
	case 'USER_LOGOUT':
		return Object.assign({}, state, {
			user: null,
		});
	default:
		return state;
	}
};
