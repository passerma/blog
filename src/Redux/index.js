import { createStore, combineReducers } from 'redux';
import {
    setLogin,
    setUserID,
    setUserInfo,
    setUserCenter
} from './reducer';

const rootReducer = combineReducers({
    setLogin,
    setUserID,
    setUserInfo,
    setUserCenter
})

const store = createStore(rootReducer);

export default store;