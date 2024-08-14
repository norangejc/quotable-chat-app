import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_LINK = "http://localhost:3001/api/v1/chats";

export const fetchChats = createAsyncThunk("chat/fetchChats", async (searchQuery = "") => {
  const response = await fetch(`${API_LINK}?search=${searchQuery}`);
  const data = await response.json();
  return data.data.chats;
});

export const fetchChatById = createAsyncThunk(
  "chat/fetchChatById",
  async (chatId) => {
    const response = await fetch(`${API_LINK}/${chatId}`);
    const data = await response.json();
    return data.data.chat;
  }
);

export const createChat = createAsyncThunk("chat/createChat", async (chat) => {
  const response = await fetch(API_LINK, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(chat),
  });
  const data = await response.json();
  return data.data.chat;
});

export const deleteChat = createAsyncThunk(
  "chat/deleteChat",
  async (chatId) => {
    await fetch(`${API_LINK}/${chatId}`, { method: "DELETE" });
    return chatId;
  }
);

export const editChat = createAsyncThunk(
  "chat/editChat",
  async ({chatId, updatedData }) => {
    const response = await fetch(`${API_LINK}/${chatId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });
    const data = await response.json();
    return data.data.chat;
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chats: [],
    selectedChat: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchChats.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.chats = action.payload;
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchChatById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedChat = action.payload;
      })
      .addCase(createChat.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.chats.unshift(action.payload);
      })
      .addCase(deleteChat.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.chats = state.chats.filter((chat) => chat._id !== action.payload);
      })
      .addCase(editChat.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updatedChat = action.payload;
        const existingChat = state.chats.find(
          (chat) => chat._id === updatedChat._id
        );
        if (existingChat) {
          existingChat.firstName = updatedChat.firstName;
          existingChat.lastName = updatedChat.lastName;
        }
      });
  },
});

export default chatSlice.reducer;
