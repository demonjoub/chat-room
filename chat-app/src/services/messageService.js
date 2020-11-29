import axios from "axios";

import { baseUrl } from "./../constants/endpoint";

export const sendMessage = async (msg, conversationId, userId) => {
  const url = `${baseUrl}/messages`;
  try {
    const response = await axios.post(url, {
      conversationId,
      message: msg,
      userId,
    });
    return response;
  } catch (e) {
    throw e;
  }
};

export const getMessages = async (conversationId) => {
  const url = `${baseUrl}/messages/${conversationId}`;
  try {
    const response = await axios.get(url);
    return response;
  } catch (e) {
    throw e;
  }
};
