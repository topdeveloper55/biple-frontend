import { createSlice } from '@reduxjs/toolkit'

// Slice

const initialState = {
    loading: false,
    data: [],
    current: null
}
export const communtySlice = createSlice({
    name: 'community',
    initialState: initialState,
    reducers: {
        loadingServerAction: (state: any, action: any) => {
            state.loading = action.payload
        },
        getServersSuccess: (state: any, action: any) => {
            state.loading = false
            state.data = action.payload
        },
        createServerSuccess: (state: any, action: any) => {
            state.loading = false
        },
        selectCommunity: (state: any, action: any) => {
            state.current = action.payload ? action.payload : null
        }
    },
});

// Actions

export const { loadingServerAction, getServersSuccess, createServerSuccess, selectCommunity } = communtySlice.actions