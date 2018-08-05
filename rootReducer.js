
import {combineReducers} from  'redux';
import {ifSavePassword} from './reducers/ifSavePassword';
import navReducer from './reducers/navReducer'

const reducers = combineReducers({
    ifSavePassword: ifSavePassword,
    nav: navReducer,
})

export default reducers;