import { ADD_USER, DELETE_USER, UPDATE_USER } from "../actionTypes"

export const addUser = (user) => async (dispatch) => {
    dispatch({ type: ADD_USER, payload: user });
}

export const updateUser = (user) => async (dispatch) => {
    dispatch({ type: UPDATE_USER, payload: user });
}

export const deleteUser = (user) => async (dispatch) => {
    dispatch({ type: DELETE_USER, payload: user });
}