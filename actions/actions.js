export const IF_SAVE_PASSWORD = 'IF_SAVE_PASSWORD';

export const savePassword = () => {
	return {
		type: 'IF_SAVE_PASSWORD',
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