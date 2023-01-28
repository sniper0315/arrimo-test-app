import { getCookie } from "cookies-next";
import {
  AUTHENTICATE,
  DEAUTHENTICATE,
  RESTORE_AUTH_STATE,
} from "../actionTypes";

const initialState = getCookie("user_token")
  ? {
      isLoggedIn: true,
      user: {},
    }
  : {
      isLoggedIn: false,
      user: {},
    };

export default function auth(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case AUTHENTICATE:
    case RESTORE_AUTH_STATE:
      return { ...state, isLoggedIn: true, user: payload };

    case DEAUTHENTICATE:
      return { ...state, isLoggedIn: false, user: {} };

    default:
      return state;
  }
}
