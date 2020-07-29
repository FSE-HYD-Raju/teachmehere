import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { changeProfileUrl, changePasswordUrl } from '../urls';
import { storeAsyncData } from '../../components/common/asyncStorage';

export const initialState = {
    loading: false,
    changeProfileResponse: '',
    changeProfileUsername: '',
    changeProfileDescription: '',
    changeProfileError: '',
    changeProfileUsernameError: '',
    DescriptionError: '',
    changePasswordResponse: '',
    oldPassword: '',
    newPassword: '',
    oldPasswordError: '',
    newPasswordError: '',
    changePasswordError: '',
    displayImage: '',
    displayImageError: ''



};

const changeProfileSlice = createSlice({
    name: 'changeProfile',
    initialState,
    reducers: {
        changeProfileStarted: state => {
            state.loading = true;
        },
        changePasswordStarted: state => {
            state.loading = true;
        },
        changeProfileSuccess: (state, { payload }) => {
            state.changeProfileResponse = payload;
            state.loading = false;
            state.changeProfileError = '';
            state.changeProfileUsernameError = '';
            state.DescriptionError = '';
        },
        changeProfileUsernameChanged: (state, { payload }) => {
            state.changeProfileError = '';
            state.changeProfileUsernameError = '';
            state.DescriptionError = '';
            state.changeProfileUsername = payload
        },
        changeProfileDescriptionChanged: (state, { payload }) => {
            state.changeProfileError = '';
            state.changeProfileUsernameError = '';
            state.DescriptionError = '';
            state.changeProfileDescription = payload
        },
        changeProfileFailure: state => {
            state.loading = false;
            state.changeProfileError = 'Something went wrong, please try again later!';
        },
        usernameIncorrect: (state, { payload }) => {
            state.changeProfileUsernameError = payload
            state.loading = false;
        },
        descriptionIncorrect: (state, { payload }) => {
            state.DescriptionError = payload
            state.loading = false;
        },
        oldPasswordChanged: (state, { payload }) => {
            state.changePasswordError = '';
            state.newPasswordError = '';
            state.changePasswordError = '';
            state.oldPassword = payload
        },
        newPasswordChanged: (state, { payload }) => {
            state.changePasswordError = '';
            state.newPasswordError = '';
            state.changePasswordError = '';
            state.newPassword = payload
        },
        changePasswordSuccess: (state, { payload }) => {
            state.changePasswordResponse = payload;
            state.loading = false;
            state.oldPasswordError = '';
            state.newPasswordError = '';
            state.changePasswordError = ''
        },
        changePasswordFailure: state => {
            state.loading = false;
            state.changePasswordError = 'Something went wrong, please try again later!';
        },
        clearProfileErrors: state => {
            state.changeProfileError = '';
            state.changeProfileUsernameError = '';
            state.changeProfileDescriptionError = '';
        },
        clearPasswordErrors: state => {
            state.changePasswordError = '';
            state.oldPasswordError = '';
            state.newPasswordError = '';
        },
        oldPasswordIncorrect: (state, { payload }) => {
            state.oldPasswordError = payload
            state.loading = false;
        },
        newPasswordIncorrect: (state, { payload }) => {
            state.oldPasswordError = payload
            state.loading = false;
        },
        changeDisplayImage: (state, { payload }) => {
            state.displayImage = payload
            state.loading = false;
        },
        changeDisplayImageError: (state, { payload }) => {
            state.displayImageError = 'Something went wrong, please try again later!';
            state.loading = false;
        },

    },
});

export const {
    changeProfileStarted,
    changeProfileSuccess,
    changeProfileUsernameChanged,
    changeProfileDescriptionChanged,
    changeProfileFailure,
    usernameIncorrect,
    descriptionIncorrect,
    oldPasswordChanged,
    newPasswordChanged,
    changePasswordSuccess,
    changePasswordFailure,
    clearProfileErrors,
    clearPasswordErrors,
    oldPasswordIncorrect,
    newPasswordIncorrect,
    changePasswordStarted,
    changeDisplayImage,
    changeDisplayImageError
} = changeProfileSlice.actions;

export const changeProfileSelector = state => state.changeProfile;

export default changeProfileSlice.reducer;

export function onChangeProfilePressed(param) {

    return async (dispatch, state) => {
        dispatch(changeProfileStarted());

        try {
            console.log("insdie try")
            const response = await axios.post(changeProfileUrl, {
                devicetoken: "ctOFt562a0I:APA91bF4WphQBqewerR2p9_pwYxzOXZPT5zH2iWM1L-suCgBRRWop9uqoUJsGfjS2kgWT3bRSxTzPUrpHeK4d_v4PrsC_HCN8KTMS_Uhf5-7FMw7RmJjuSzEkvS0HRzkD8-_EjyXdywu",
                username: param.username,
                _id: param.id,
                description: param.description
            });
            console.log(response.data)
            if (response) {
                if (response.data["status"] === "404") {
                    if (response.data["field"] == 'username') {
                        dispatch(usernameIncorrect(response.data["error"]));
                    }
                }
                else {
                    dispatch(changeProfileSuccess(response.data[0]));
                    storeAsyncData('userInfo', response.data[0]);
                    param.onSuccess();
                }

            }
            else {
                dispatch(changeProfileFailure());
            }
        } catch (error) {
            dispatch(changeProfileFailure());
        }
    };
}


export function onChangePasswordPressed(param) {
    console.log("insideonlogin")

    return async (dispatch, state) => {
        dispatch(changePasswordStarted());

        try {
            const response = await axios.post(changePasswordUrl, {
                devicetoken: "ctOFt562a0I:APA91bF4WphQBqewerR2p9_pwYxzOXZPT5zH2iWM1L-suCgBRRWop9uqoUJsGfjS2kgWT3bRSxTzPUrpHeK4d_v4PrsC_HCN8KTMS_Uhf5-7FMw7RmJjuSzEkvS0HRzkD8-_EjyXdywu",
                _id: param.id,
                oldpassword: param.oldpassword,
                password: param.newpassword,
            });
            console.log(response.data)
            if (response) {
                if (response.data["status"] === "404") {
                    dispatch(oldPasswordIncorrect(response.data["error"]));
                }
                else {

                    const responsestatus = JSON.stringify(response.data.status)
                    dispatch(changePasswordSuccess(responsestatus));
                    param.onSuccess();
                }

            }
            else {
                dispatch(changePasswordFailure());
            }
        } catch (error) {
            dispatch(changePasswordFailure());
        }
    };
}

export function onChangeImagePressed(param) {
    return async (dispatch, state) => {
        console.log("in image apiiiiiii")
        dispatch(changeDisplayImage());

        try {
            const response = await axios.post(changeProfileUrl, {
                devicetoken: "ctOFt562a0I:APA91bF4WphQBqewerR2p9_pwYxzOXZPT5zH2iWM1L-suCgBRRWop9uqoUJsGfjS2kgWT3bRSxTzPUrpHeK4d_v4PrsC_HCN8KTMS_Uhf5-7FMw7RmJjuSzEkvS0HRzkD8-_EjyXdywu",
                displaypic: param.displaypic,
                _id: param.userId,
            });

            console.log(response.data)
            if (response) {
                // if (response.data["status"] === "404") {
                //     dispatch(oldPasswordIncorrect(response.data["error"]));
                // }
                // else {
                dispatch(changeProfileSuccess(response.data[0]));
                storeAsyncData('userInfo', response.data[0]);
                param.onSuccess();
                // }

            }
            else {
                dispatch(changeDisplayImageError());
            }
        } catch (error) {
            dispatch(changePasswordFailure());
        }
    };
}
