import { combineReducers } from '@reduxjs/toolkit';
import { authSlice, communtySlice, roomInfoSlice } from 'slices';

const rootReducer = combineReducers({
	auth: authSlice.reducer,
	community: communtySlice.reducer,
	roomInfo: roomInfoSlice.reducer
});

export default rootReducer;
