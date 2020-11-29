import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { useRecoilValue } from "recoil";

import { userSelector } from "../../../store/userStore";
import { createConversation } from "../../../services/conversationService";

export const Users = () => {
  const onCreateConversation = async (member0, member1) => {
    const response = await createConversation(member0, member1);
    const { conversationId } = response.data;
    history.push(`room/${conversationId}`);
  };
  const history = useHistory();
  const users = useRecoilValue(userSelector);
  const { data } = users;
  return (
    <div>
      {data.map((user, index) => (
        <div key={index}>
          <Container key={index} className="p-2">
            <Row className="justify-content-md-start">
              <Col md="auto">{user.username}</Col>
              <Col xs lg="2">
                <Button
                  onClick={() => onCreateConversation(user.username, "kkkkk")}
                  variant="primary"
                >
                  Create Room
                </Button>
              </Col>
            </Row>
          </Container>
        </div>
      ))}
    </div>
  );
};
