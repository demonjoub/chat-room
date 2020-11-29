import { atom, selector } from "recoil";

import { fetchConversations } from "../services/conversationService";

const conversationAtom = atom({
  key: "conversation",
  default: {
    data: [],
    id: undefined,
  },
});

const conversationSelector = selector({
  key: "conversationSelector",
  get: async ({ get }) => {
    const conversation = get(conversationAtom);
    const response = await fetchConversations(conversation.id);
    return response;
  },
});

export { conversationAtom, conversationSelector };
