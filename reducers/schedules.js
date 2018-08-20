const initialState = {
	schedules: [],
	index: 0
};

export const schedules = (state = initialState, action) => {
	switch (action.type) {
	case 'CREATE_SCHEDULE':
		return Object.assign({}, state, {
			schedules: [
				...state.schedules,
				{
					id: state.index,
					title: action.data.title,
					location: action.data.location,
					participants: action.data.participants,
					date: action.data.date,
				}
			],
			index: state.index + 1,
		});
	case 'EDIT_SCHEDULE':
		const targetEditIndex = action.data.targetIndex;
		const edited = state.schedules.filter(n => n.id !== targetEditIndex);
		return Object.assign({}, state, {
			schedules: [
				...edited, 
				{
					id: targetEditIndex,
					title: action.data.title,
					location: action.data.location,
					participants: action.data.participants,
					date: action.data.date,
				}
			],
		});

	case 'DELETE_SCHEDULE':
		const targetDeleteIndex = action.targetIndex;
		const deleted = 
					{
						schedules: state.schedules.filter(n => n.id !== targetDeleteIndex),
					};
		return Object.assign({}, state, deleted);

	default:
		return state;
	}
};
