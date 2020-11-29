import React from "react";
import { useRecoilValue } from "recoil";
import { useHistory } from "react-router-dom";

import { conversationSelector } from "../../../store/conversationStore";
import { Button, Col, Container, Row } from "react-bootstrap";
import { joinConversation } from "../../../services/conversationService";
import { uuuuId } from "../../../store/id";

export const Conversations = () => {
  const onJoinConversation = async (conversationId, username) => {
    const response = await joinConversation(conversationId, username);
    const roomId = response.data.conversationId;
    if (roomId) {
      history.push(`room/${conversationId}`);
    } else {
      alert("Errors");
    }
  };
  const history = useHistory();

  const conversations = useRecoilValue(conversationSelector);
  const { data } = conversations;
  return (
    <div>
      {data.map((conversation, index) => (
        <div key={index}>
          <Container key={index} className="p-2">
            <Row className="justify-content-md-start">
              <Col md="auto">{conversation.conversationId}</Col>
              <Col xs lg="2">
                {/* <Link to={`/room/${conversation.conversationId}`}> */}
                <Button
                  onClick={() =>
                    onJoinConversation(conversation.conversationId, uuuuId)
                  }
                  variant="primary"
                >
                  Join Room
                </Button>
                {/* </Link> */}
              </Col>
            </Row>
          </Container>
        </div>
      ))}
    </div>
  );
};
