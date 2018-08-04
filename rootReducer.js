
import {combineReducers} from  'redux';
import {savePassword} from './reducers/savePassword';
import navReducer from './reducers/navReducer'
import test from './reducers/testReducer';

const reducers = combineReducers({
    savePassword: savePassword,
    nav: navReducer,
    test: test,
})

export default reducers;