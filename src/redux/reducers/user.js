import { ADD_USER, DELETE_USER, UPDATE_USER } from "../actionTypes";

const initialState = [];

export default function user(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case ADD_USER:
            return [...state, payload.data];
        
        case UPDATE_USER:
            return state;
        
        case DELETE_USER:
            return state;
        
        default:
            return state;
    }
}