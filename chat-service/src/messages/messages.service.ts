import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageRequest } from 'src/request/message.request';
import { SendMessageRequest } from 'src/request/send.message.request';
import { SocketService } from 'src/socket/socket.service';
import { Repository, getManager } from 'typeorm';

import { MessagesEntity } from './../entity/messages.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(MessagesEntity)
    private readonly messagesRepository: Repository<MessagesEntity>,
    private socketService: SocketService
  ) { }

  async sendMessage(messageReq: MessageRequest) {
    try {
      const msg = new MessagesEntity();
      msg.conversationId = messageReq.conversationId;
      msg.message = messageReq.message;
      msg.userId = messageReq.userId;
      const res = await this.messagesRepository.save(msg)
      // send socket
      const request = new SendMessageRequest();
      request.conversationId = messageReq.conversationId;
      request.message = msg.message;
      request.userId = msg.userId;
      this.socketService.sendMessage(request);
      return res
    } catch (e) {
      throw e
    }
  }

  async getByConversationId(id: string): Promise<MessagesEntity[]> {
    try {
      console.log(id)
      const res = await getManager()
        .createQueryBuilder(MessagesEntity, "message")
        .where('message.conversationId = :id', { id })
        .getMany();
      return res
    } catch (e) {
      throw e
    }
  }


}
