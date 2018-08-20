
import {combineReducers} from  'redux';
import {ifSavePassword} from './reducers/ifSavePassword';
import {schedules} from './reducers/schedules';
import { user } from './reducers/user';
import navReducer from './reducers/navReducer';

const reducers = combineReducers({
	ifSavePassword: ifSavePassword,
	schedules: schedules,
	user: user,
	nav: navReducer,
});

export default reducers;