import React, { Suspense, useState, useEffect } from "react";
import { useRecoilState, useResetRecoilState } from "recoil";
import { messagesAtom } from "../../store/messagesStore";
import { sendMessage, getMessages } from "../../services/messageService";
import { Messages } from "./Messages";
import io from "socket.io-client";
import "./styles.css";
import { uuuuId } from "../../store/id";

const Room = ({ match }) => {
  const conversationId = match.params.id;
  const [msg, setMsg] = useState("");
  const [message, setMessage] = useRecoilState(messagesAtom);

  useEffect(() => {
    const socket = io("http://127.0.0.1:1234", { withCredentials: true });
    socket.on("connect", (e) => {
      console.log("connected");
      socket.emit("new-user", conversationId, "");
    });
    socket.on("chat-message", (data) => {
      const m = [...message, data];
      setMessage(m);
    });
  }, [conversationId, message, setMessage]);

  useEffect(() => {
    // const s = useResetMessage();
    setMessage([]);
    const fetch = async () => {
      const response = await getMessages(conversationId);
      const { data } = response;
      const m = [...data];
      setMessage(m);
    };
    fetch();
  }, []);

  const updateInput = (evt) => {
    setMsg(evt.target.value);
  };
  const onSendMessage = async () => {
    const response = await sendMessage(msg, conversationId, uuuuId);
    const { data } = response;
    const m = [...message, data];
    setMessage(m);
    setMsg("");
  };
  return (
    <div className="chat-container flex">
      <div className="chat-content">
        <div className="header">
          <h2 className="header-text">Room Id {match.params.id}</h2>
        </div>
        <Suspense fallback="...">
          <Messages />
        </Suspense>
        <div className="form">
          <input
            value={msg}
            onChange={updateInput}
            className="m-1 input"
            aria-describedby="emailHelp"
            placeholder="message"
          />
          <button
            className="m-1 btn btn-send btn-primary"
            onClick={onSendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Room;
