import {createStore, applyMiddleware, combineReducers, compose} from 'redux';
import rootReducer from './rootReducer';
import {
    reduxifyNavigator,
    createReactNavigationReduxMiddleware,
} from 'react-navigation-redux-helpers';
// import { createLogger } from 'redux-logger'
// import thunkMiddleware from 'redux-thunk'

// const loggerMiddleware = createLogger({ predicate: (getState, action) => __DEV__ });

// const configureStore = (initialState) => {
//     const enhancer = compose(
//         applyMiddleware(
//             thunkMiddleware,
//             loggerMiddleware,
//         ),
//     );
//     return createStore(rootReducer, initialState, enhancer);
// }

// const store = configureStore;

const middleware = createReactNavigationReduxMiddleware(
    "root",
    state => state.nav,
);
const store = createStore(
    rootReducer,
    applyMiddleware(middleware),
);

export default store;