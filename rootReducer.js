
import {combineReducers} from  'redux';
import {ifSaveEmail} from './reducers/ifSaveEmail';
import {schedules} from './reducers/schedules';
import { user } from './reducers/user';
import navReducer from './reducers/navReducer';

const reducers = combineReducers({
	ifSaveEmail: ifSaveEmail,
	schedules: schedules,
	user: user,
	nav: navReducer,
});

export default reducers;