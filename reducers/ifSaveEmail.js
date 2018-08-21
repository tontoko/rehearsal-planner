const initialState = {
	saved: true,
	email: '',
};

export const ifSaveEmail = (state = initialState, action) => {
	switch(action.type) {
	case 'TOGLE_SAVE_EMAIL':
		return Object.assign({}, state, {
			saved: !state.saved,
		});
	case 'SAVE_EMAIL':
		return Object.assign({}, state, {
			email: action.email,
		});
	default:
		return state;
	}
};
