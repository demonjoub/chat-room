import { atom, selector } from "recoil";
import { fetchUsers } from "../services/userService";

const userAtom = atom({
  key: "users",
  default: {
    data: [],
  },
});

const userSelector = selector({
  key: "usersSelector",
  get: async ({ get }) => {
    const response = await fetchUsers();
    return response;
  },
});

export { userAtom, userSelector };
