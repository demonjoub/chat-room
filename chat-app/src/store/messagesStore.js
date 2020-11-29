import { atom, selector } from "recoil";
import _get from "lodash/get";

const messagesAtom = atom({
  key: "messages",
  default: [],
});

const messageSelector = selector({
  key: "messageSelector",
  get: async ({ get }) => {
    const message = get(messagesAtom);
    return message;
  },
});

export { messagesAtom, messageSelector };
