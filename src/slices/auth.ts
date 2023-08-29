import { createSlice } from '@reduxjs/toolkit'

// Slice

const initialUser = {
    loading: false,
    accessToken: "",
    user: {
        id: undefined,
        email: undefined,
        userName: undefined,
        referralCode: undefined,
        walletAddress: '',
        showNft: false,
        getAlerted: false,
        otp_auth_url: '',
        otp_enabled: false,
        otp_base32: ''
    }
}
export const authSlice = createSlice({
    name: 'auth',
    initialState: initialUser,
    reducers: {
        actionPending: (state: any, action: any) => {
            state.loading = action.payload
        },
        registerSuccess: (state: any, action: any) => {
            state.loading = false
        },
        registerFailed: (state: any, action: any) => {
            state.loading = false
        },
        loginSuccess: (state: any, action: any) => {
            state.accessToken = action.payload.userData.accessToken
            state.user = action.payload.userData.user
            state.loading = false
        },
        loginFailed: (state: any, action: any) => {
            state.loading = false
        },
        updateSuccess: (state: any, action: any) => {
            state.user = action.payload
        }
    },
});

// Actions

export const { loginSuccess, loginFailed, registerSuccess, registerFailed, actionPending, updateSuccess } = authSlice.actions