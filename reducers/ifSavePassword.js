const initialState = {
	saved: true,
};

export const ifSavePassword = (state = initialState, action) => {
	switch(action.type) {
	case 'IF_SAVE_PASSWORD':
		return Object.assign({}, state, {
			saved: !state.saved,
		});
	default:
		return state;
	}
};
