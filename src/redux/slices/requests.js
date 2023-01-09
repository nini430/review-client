import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  requests: [],
  adminPin: null,
};
const requestSlice = createSlice({
  name: "request",
  initialState,
  reducers: {
    getRequests: (state, action) => {
      state.requests = action.payload;
    },
    clearRequest: (state) => {
      state.requests = [];
      state.adminPin = null;
    },
    addRequest: (state, { payload }) => {
      state.requests = [...state.requests, payload.request];
      state.adminPin = payload.adminPin;
    },
  },
});
export const { getRequests, clearRequest, addRequest } = requestSlice.actions;
export default requestSlice.reducer;
