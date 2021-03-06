import { createAction, handleActions } from 'redux-actions';

import createRequestThunk, { createRequestActionTypes } from '../lib/createRequestThunk';

import * as authCtrl from '../lib/api/auth';
import client from '../lib/api/client';
import storage from '../lib/storage';

const SET_CHECK = 'auth/SET_CHECK';
const SET_AUTH = 'auth/SET_AUTH';
const CLEAR_AUTH = 'auth/CLEAR_AUTH'
const SET_VALUE = 'auth/SET_VALUE';
export const setValue = createAction(SET_VALUE, payload => payload);
export const setCheck = createAction(SET_CHECK, payload => payload);
export const setAuth = createAction(SET_AUTH, payload => payload);
export const clearAuth = createAction(CLEAR_AUTH);

const [ SIGNIN, SIGNIN_SUCCESS, SIGNIN_FAILURE ] = createRequestActionTypes('auth/SIGNIN');
const [ SIGNUP, SIGNUP_SUCCESS, SIGNUP_FAILURE ] = createRequestActionTypes('auth/SIGNUP');
const [ SIGNOUT, SIGNOUT_SUCCESS, SIGNOUT_FAILURE ] = createRequestActionTypes('auth/SIGNOUT');
const [ CHECK, CHECK_SUCCESS, CHECK_FAILURE ] = createRequestActionTypes('auth/CHECK');
export const signIn = createRequestThunk(SIGNIN, authCtrl.signIn);
export const signUp = createRequestThunk(SIGNUP, authCtrl.signUp);
export const signOut = createRequestThunk(SIGNOUT, authCtrl.signOut);
export const check = createRequestThunk(CHECK, authCtrl.check);

const loginMode = async ({ user, token, expiryDate }, dispatch) => {
    try {
        client.defaults.headers.common['Authorization'] = 'JWT ' + token;
        
        await storage.setAsyncStorage({
            token,
            expiryDate: expiryDate.toString(),
        });
    
        //  sugar
        setTimeout(() => {
            dispatch(setAuth({
                user,
                token,
                expiryDate,
            }));
        }, 500);
    } catch(e) {
        throw e;
    }
}

export const signInThunk = ({ username, password }) => async ( dispatch, getState ) => {
    try {
        const response = await dispatch(signIn({
            username,
            password,
        }));

        await loginMode(response, dispatch);
        return response;
    } catch(e) {
        console.dir(e);
    }
};

export const signUpThunk = auth => async ( dispatch, getState ) => {
    try {
        const response = await dispatch(signUp(auth));

        await loginMode(response, dispatch);
        return response;
    } catch(e) {
        console.dir(e);
    }
};

export const signOutThunk = () => async ( dispatch, getState ) => {
    await storage.clearAsyncStorage([ 'token', 'expiryDate' ]);
    dispatch(setCheck(true));
    dispatch(clearAuth());
}

export const autoSignInThunk = () => async ( dispatch, getState ) => {
    const {
        auth: {
            token: stateToken,
            expiryDate: stateExpiryDate
        },
    } = getState();

    try {
        let storageToken, storageExpiryDate;
        if(!stateToken || !stateExpiryDate || new Date(stateExpiryDate) <= new Date()) {
            const [ receivedToken, receivedExpiryDate ] = await storage.getAsyncStorage([ 'token', 'expiryDate' ]);
            storageToken = receivedToken;
            storageExpiryDate = parseInt(receivedExpiryDate);
            if(!storageToken || !storageExpiryDate || new Date(storageExpiryDate) <= new Date()) {
                throw new Error('token is invalid or out of date!');
            }
        }

        const token = stateToken || storageToken;
        client.defaults.headers.common['Authorization'] = 'JWT ' + token;

        const { user, expiryDate } = await dispatch(check());
   
        await loginMode({ user, token, expiryDate }, dispatch);

    } catch(e) {
        console.dir(e);
        throw e;
    }
}

const initialState = {
    username: '',
    password: '',
    
    user: null,
    token: null,
    expiryDate: null,
    check: false,
    loading: false,
};

export default handleActions({
    [SET_CHECK]: (state, { payload: check }) => ({
        ...state,
        check,
    }),
    [SET_AUTH]: (state, { payload: { user, token, expiryDate } }) => ({
        ...state,
        user,
        token,
        expiryDate,
    }),
    [CLEAR_AUTH]: state => ({
        ...state,
        user: initialState.user,
        token: initialState.token,
        expiryDate: initialState.token,
    }),
    [SET_VALUE]: (state, { payload: { key, value } }) => ({
        ...state,
        [key]: value,
    }),
    [CHECK_SUCCESS]: state => state,
    [SIGNIN_SUCCESS]: state => state,
    [SIGNUP_SUCCESS]: state => state,
    [SIGNOUT_SUCCESS]: state => state,
}, initialState);