import { createStore, combineReducers } from 'redux';
import {
    setLogin,
    setUserID,
    setUserInfo
} from './reducer';

const rootReducer = combineReducers({
    setLogin,
    setUserID,
    setUserInfo
})

const store = createStore(rootReducer);

export default store;