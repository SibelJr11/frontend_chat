import { configureStore } from "@reduxjs/toolkit";
import messageReducer from "../features/messageSlice";

const store = configureStore({ reducer: { messages: messageReducer } });

export default store;
