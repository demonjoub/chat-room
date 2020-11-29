import React, { Component, Suspense } from "react";
import { useRecoilState } from "recoil";

import { conversationAtom } from "./../../store/conversationStore";
import { Conversations } from "./common/Conversation";
import { Users } from "./common/Users";

const Home = () => {
  const [currentId] = useRecoilState(conversationAtom);
  return (
    <div>
      <h2>Contacts</h2>
      <Suspense fallback>
        <Users />
      </Suspense>

      <h2>Conversations</h2>
      <Suspense fallback>
        <Conversations />
      </Suspense>
    </div>
  );
};

export default Home;
