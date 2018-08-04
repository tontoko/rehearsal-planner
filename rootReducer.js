
import {combineReducers} from  'redux';
import {savePassword} from './reducers/savePassword';
import navReducer from './reducers/navReducer'

const reducers = combineReducers({
    savePassword: savePassword,
    nav: navReducer,
})

export default reducers;