import React from "react";
import { useRecoilValue } from "recoil";

import { messageSelector } from "../../store/messagesStore";
import "./styles.css";

const renderMessage = (m, index) => {
  return (
    <li key={index}>
      <span className="avatar" />
      <div className="Message-content">
        <div className="username">{m.message}</div>
        {/* <div className="text">{"text"}</div> */}
      </div>
    </li>
  );
};

export const Messages = () => {
  const messages = useRecoilValue(messageSelector);
  return (
    <div className="message-container">
      <div className="message">
        <ul className="Messages-list">
          {messages.map((m, index) => renderMessage(m, index))}
        </ul>
      </div>
    </div>
  );
};
