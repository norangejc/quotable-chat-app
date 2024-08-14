import {configureStore} from "@reduxjs/toolkit"
import chatReducer from "./slices/chatSlice"
import messageReducer from "./slices/messageSlice"

const store = configureStore({
    reducer: {
        chat: chatReducer,
        message: messageReducer,
    }
})

export default store;