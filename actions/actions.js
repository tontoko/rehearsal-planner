
export const togleSaveEmail = () => {
	return {
		type: 'TOGLE_SAVE_EMAIL',
	};
}; 

export const saveEmail = (email) => {
	return {
		type: 'SAVE_EMAIL',
		email
	};
};

export const createSchedule = (data) => {
	return {
		type: 'CREATE_SCHEDULE',
		data
	};
};

export const editSchedule = (data) => {
	return {
		type: 'EDIT_SCHEDULE',
		data
	};
};

export const deleteSchedule = (targetIndex) => {
	return {
		type: 'DELETE_SCHEDULE',
		targetIndex,
	};
};

export const logIn = (user) => {
	return {
		type: 'USER_LOGIN',
		user,
	};
}; 

export const logOut = () => {
	return {
		type: 'USER_LOGOUT',
	};
};

export const setUserName = (name) => {
	return {
		type: 'SET_USER_NAME',
		name,
	};
};