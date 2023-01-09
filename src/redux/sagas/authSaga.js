import { all, take, call, put, fork } from "redux-saga/effects";

import { authStart, authSuccess, authError } from "../slices/auth";
import { loginUser } from "../../utils/api";
import { getNotifications } from "../slices/notifications";
import { getRequests } from "../slices/requests";

function* login(payload) {
  try {
    const response = yield call(loginUser, payload);
    if (response.data.twoFA) {
      window.location = `/twofactor?${payload.email}`;
    }
    yield put(authSuccess(response.data.user));
    yield put(getNotifications(response.data.notifications));
    yield put(getRequests(response.data.requests));
  } catch (err) {
    if (err.response?.data) {
      yield put(authError(err.response.data));
    }
  }
}

function* authWatcher() {
  while (true) {
    const { payload } = yield take(authStart);
    yield fork(login, payload);
  }
}

export default function* authSaga() {
  yield all([authWatcher()]);
}
