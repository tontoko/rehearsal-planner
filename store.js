import {createStore, applyMiddleware, combineReducers, compose} from 'redux';
import rootReducer from './rootReducer';
import {
    reduxifyNavigator,
    createReactNavigationReduxMiddleware,
} from 'react-navigation-redux-helpers';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web and AsyncStorage for react-native

const persistConfig = {
    key: 'root',
    storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

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

export default store = createStore(persistedReducer, applyMiddleware(middleware))
export const persistor = persistStore(store)
