import { takeEvery, put, call, takeLatest } from "redux-saga/effects";

import {
  GET_USER,
  ADD_USER,
  DELETE_USER,
  UPDATE_USER,
  GET_USERS,
} from "./actionTypes";

import {
  getUsersSuccess,
  getUsersFail,
  getUserSuccess,
  getUserFail,
  addUserFail,
  addUserSuccess,
  updateUserFail,
  updateUserSuccess,
  deleteUserFail,
  deleteUserSuccess,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getUsers,
  getUser,
  addUser,
  updateUser,
  deleteUser,
} from "../../helpers/backend_helper";

function* fetchUsers() {
  try {
    const response = yield call(getUsers);
    yield put(getUsersSuccess(response));
  } catch (error) {
    yield put(getUsersFail(error));
  }
}

function* onGetUser() {
  try {
    const response = yield call(getUser);
    yield put(getUserSuccess(response));
  } catch (error) {
    yield put(getUserFail(error));
  }
}

function* onAddUser({ payload: user }) {
  try {
    const response = yield call(addUser, user);
    yield put(addUserSuccess(response));
  } catch (error) {
    yield put(addUserFail(error.response));
  }
}

function* onUpdateUser({ payload: user }) {
  try {
    const response = yield call(updateUser, user);
    yield put(updateUserSuccess(response));
  } catch (error) {
    yield put(updateUserFail(error));
  }
}

function* onDeleteUser({ payload: userId }) {
  try {
    const response = yield call(deleteUser, userId);
    yield put(deleteUserSuccess(response));
  } catch (error) {
    yield put(deleteUserFail(error));
  }
}

function* userSaga() {
  yield takeEvery(GET_USERS, fetchUsers);
  yield takeEvery(GET_USER, onGetUser);
  yield takeEvery(ADD_USER, onAddUser);
  yield takeEvery(UPDATE_USER, onUpdateUser);
  yield takeEvery(DELETE_USER, onDeleteUser);
}

export default userSaga;
