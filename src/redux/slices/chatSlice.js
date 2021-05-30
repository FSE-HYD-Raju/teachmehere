import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { chatUrl } from '../urls';
import { storeAsyncData, getAsyncData, clearAsyncData } from '../../components/common/asyncStorage';
import firestore from '@react-native-firebase/firestore';


export const initialState = {
    chatResults: [],
    searchChatResults: [],
    loading: false,
    hasErrors: false,
    newChatList: [],
    currentOpenedChat: {},
    getChatsEventCalled: false,
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        getChats: state => {
            state.loading = true;
            state.chatResults = [];
            state.searchChatResults = [];
            state.getChatsEventCalled = true
        },
        getChatsSuccess: (state, { payload }) => {
            state.chatResults = payload;
            state.searchChatResults = payload;
            state.loading = false;
            state.hasErrors = false;
        },
        getChatsFailure: state => {
            state.loading = false;
            state.hasErrors = true;
            state.chatResults = [];
            state.searchChatResults = [];
        },
        setChatResults: (state, { payload }) => {
            state.searchChatResults = payload;
        },
        clearData: (state) => {
            state.loading = false;
            state.chatResults = [];
            state.searchChatResults = [];
            state.getChatsEventCalled = false
        },
        setLoading: (state, { payload }) => {
            state.loading = payload;
        },
        setNewChatList: (state, { payload }) => {
            state.newChatList = payload
        },
        setCurrentOpenedChat: (state, { payload }) => {
            state.currentOpenedChat = payload
        },
    },
});

export const {
    getChats,
    getChatsSuccess,
    getChatsFailure,
    setChatResults,
    clearData,
    setLoading,
    setNewChatList,
    setCurrentOpenedChat
} = chatSlice.actions;

export const chatSelector = state => state.chat;
export default chatSlice.reducer;

export function fetchChats(userInfo) {
    return async (dispatch, getState) => {
        if (getState().chat.getChatsEventCalled) return;

        dispatch(getChats());
        try {
            firestore()
                .collection('THREADS')
                .where("ids", "array-contains", userInfo._id)
                // .where("deletedids", "array-contains", userInfo._id)
                .orderBy('latestMessage.createdAt', 'desc')
                .onSnapshot(querySnapshot => {
                    var res = []
                    if (querySnapshot) {
                        for (var i in querySnapshot.docs) {
                            const documentSnapshot = querySnapshot.docs[i]
                            // res = querySnapshot.docs.map(documentSnapshot => {
                            data = documentSnapshot.data();
                            senderDetails = data.userDetails.find(o => o.id != userInfo._id);
                            didBlock = data.blockedIds && data.blockedIds.indexOf(senderDetails._id) > -1
                            if ((data.deletedIds && !data.deletedIds.length) || (data.deletedIds && data.deletedIds.indexOf(userInfo._id) == -1)) {
                                res.push({
                                    _id: documentSnapshot.id,
                                    name: (senderDetails && senderDetails.name) ? senderDetails.name : "",
                                    displaypic: (senderDetails && senderDetails.displaypic) ? senderDetails.displaypic : "",
                                    latestMessage: {
                                        text: ''
                                    },
                                    senderDetailsId: (senderDetails && senderDetails._id) ? senderDetails._id : "",
                                    ...data,
                                    didBlock: didBlock
                                })
                            }

                            // });
                        }
                    }
                    console.log("res0")
                    // console.log(JSON.stringify(res))
                    dispatch(getChatsSuccess(res));
                });
        } catch (error) {
            dispatch(getChatsFailure());
        }
    };
}


export function checkChatExists() {
    return async dispatch => {
        alert(JSON.stringify("khkh"))
        // dispatch(enableLoading());
        // try {
        //     firestore().collection('THREADS').
        //         where("ids", "array-contains", props.userInfo._id).
        //         get().then(querySnapshot => {
        //             querySnapshot.forEach(documentSnapshot => {
        //                 data = documentSnapshot.data();
        //                 if (data["ids"].indexOf(props.item._id) > -1) {
        //                     exists = true;

        //                     item = {
        //                         ...props.item,
        //                         _id: documentSnapshot.id,
        //                         name: props.item.username
        //                     }
        //                 }
        //             })
        //             alert(exists)
        //             dispatch(disableLoading());
        //             if (!exists) {
        //                 props.sendMessage()
        //             } else {
        //                 props.navigatefun()
        //             }
        //         });

        // } catch (error) {
        //     dispatch(disableLoading());
        // }
    };
}