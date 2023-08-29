import { createSlice } from '@reduxjs/toolkit';
// Slice
interface RoomInfo {
  roomTimeline: any;
  eventId: string | null;
}
const initialState: RoomInfo = {
  roomTimeline: null,
  eventId: null,
};
export const roomInfoSlice = createSlice({
  name: 'roomInfo',
  initialState: initialState,
  reducers: {
    setRoomInfo: (state: any, action: any) => {
      state.roomTimeline = action.payload.roomTimeline;
      state.eventId = action.payload.eventId;
    },
  },
});

// Actions

export const { setRoomInfo } = roomInfoSlice.actions;
