import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_LINK = "http://localhost:3001/api/v1/messages";

export const fetchMessagesByChatId = createAsyncThunk(
  "message/fetchMessagesByChatId",
  async (chatId) => {
    const response = await fetch(`${API_LINK}/${chatId}`);
    const data = await response.json();
    return { chatId, messages: data.data.messages };
  }
);

export const sendMessage = createAsyncThunk(
  "message/sendMessage",
  async ({chatId, message}) => {
    const response = await fetch(`${API_LINK}/${chatId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    });
    const data = await response.json();
    return data.data.message;
  }
);

export const editMessage = createAsyncThunk(
  "messages/editMessage",
  async ({messageId, updatedData}) => {
    const response = await fetch(`${API_LINK}/${messageId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });
    const data = await response.json();
    return data.data.message;
  }
);

const messageSlice = createSlice({
  name: "message",
  initialState: {
    messages: {},
    selectedMessage: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessagesByChatId.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMessagesByChatId.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchMessagesByChatId.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.messages[action.payload.chatId] = action.payload.messages;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updatedMessage = action.payload;
        const existingMessages = state.messages[updatedMessage.chatId] || [];
        state.messages[updatedMessage.chatId] = [
          ...existingMessages,
          updatedMessage,
        ];
      });
  },
});

export default messageSlice.reducer;
