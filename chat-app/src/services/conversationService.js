import axios from "axios";

import { baseUrl } from "./../constants/endpoint";

export const fetchConversations = async (id = "") => {
  const params = id ? `?id=${id}` : "";
  const url = `${baseUrl}/conversation${params}`;
  try {
    const response = await axios.get(url);
    return response;
  } catch (e) {
    throw e;
  }
};

export const createConversation = async (member0, member1) => {
  const url = `${baseUrl}/conversation/create`;
  try {
    const response = await axios.post(url, {
      member: [member0, member1],
      roomName: `${member0}${member1}`,
    });
    return response;
  } catch (e) {
    throw e;
  }
};

export const joinConversation = async (conversationId, username) => {
  const url = `${baseUrl}/conversation/join`;
  try {
    const response = await axios.post(url, {
      conversationId,
      userId: username,
    });
    return response;
  } catch (e) {
    throw e;
  }
};
