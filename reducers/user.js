const initialState = {
	user: null,
};

export const user = (state = initialState, action) => {
	switch (action.type) {
	case 'USER_LOGIN':
		return Object.assign({}, state, {
			user: action.user,
		});
	case 'USER_LOGOUT':
		return Object.assign({}, state, {
			user: null,
		});
	case 'SET_USER_NAME':
		let newUser = JSON.parse(JSON.stringify(state.user));
		newUser.displayName = action.name;
		return Object.assign({}, state, {
			user: newUser,
		}); 
	default:
		return state;
	}
};
