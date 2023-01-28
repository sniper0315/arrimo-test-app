import { deleteCookie } from "cookies-next";
import {
  AUTHENTICATE,
  DEAUTHENTICATE,
  RESTORE_AUTH_STATE,
} from "../actionTypes";

export const loginUser = (user) => async (dispatch) => {
  dispatch({ type: AUTHENTICATE, payload: user });
};

export const logoutUser = () => async (dispatch) => {
  deleteCookie("user_token");
  dispatch({ type: DEAUTHENTICATE });
};

export const checkLogin = (user) => async (dispatch) => {
  dispatch({ type: RESTORE_AUTH_STATE, payload: user });
};
