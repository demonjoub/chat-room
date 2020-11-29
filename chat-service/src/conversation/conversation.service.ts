import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { CreateConversationRequest } from 'src/request/conversation.request';
import { getConnection, getManager, Repository } from 'typeorm';
import { cloneDeep, get } from 'lodash'

import { ConversationEntity } from '../entity/conversation.entity';
import { SocketService } from '../socket/socket.service';
import { ConversationListResponse, ConversationResponse } from 'src/response/conversation.response';
import { JoinRequest } from 'src/request/join.request';
import { ReadEntity } from 'src/entity/read.entity';
import { MessagesEntity } from 'src/entity/messages.entity';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(ConversationEntity)
    private readonly conversationRepository: Repository<ConversationEntity>,
    @InjectRepository(ReadEntity)
    private readonly readRepository: Repository<ReadEntity>,
    private socketService: SocketService) { }

  public async create(conversation: CreateConversationRequest): Promise<ConversationEntity> {
    const info = new ConversationEntity();
    const member = conversation.member;
    info.member = member;
    info.roomName = conversation.roomName;
    const room = await getManager()
      .createQueryBuilder(ConversationEntity, "conversationEntity")
      .where('conversationEntity.member = :member0', { member0: `${member[0]},${member[1]}` })
      .orWhere('conversationEntity.member = :member1', { member1: `${member[1]},${member[0]}` })
      .getOne();
    if (room) {
      const { conversationId } = room
      this.socketService.createRoom(conversationId.toString(), member[0])
      return room
    }
    try {
      const res = await this.conversationRepository.save(info)
      const { conversationId } = res
      this.socketService.createRoom(conversationId.toString(), member[0])
      return res;
    } catch (e) {
      console.error("ConversationService.Insert Error", e)
      throw e
    }
  }

  public async join(request: JoinRequest): Promise<ConversationResponse> {
    const conversationId = request.conversationId;
    const userId = request.userId;
    const response = new ConversationResponse();
    response.conversationId = conversationId;
    response.status = true;
    const res = await this.getById(conversationId)
    if (this.socketService.connected && res) {
      this.socketService.createRoom(conversationId.toString(), userId)
    } else {
      response.conversationId = 0;
      response.status = false;
    }
    return response;
  }

  private async insert(conversations: ConversationEntity[]): Promise<ConversationEntity[]> {
    try {
      const res = await this.conversationRepository.save(conversations)
      return res;
    } catch (e) {
      console.error("ConversationService.Insert Error", e)
      throw e
    }
  }

  public async getById(conversationId: number): Promise<ConversationEntity> {
    try {
      const room = await getManager()
        .createQueryBuilder(ConversationEntity, "conversationEntity")
        .where("conversationEntity.conversationId = :id", { id: conversationId })
        .getOne();
      return room;
    } catch (e) {
      console.error(`ConversationService.getById ${conversationId} Error`, e)
      throw e
    }
  }

  public async getAll(params: string): Promise<ConversationListResponse[]> {
    const userId = get(params, 'userId', '')
    const res = []
    try {
      const rooms = await getConnection().getRepository(ConversationEntity)
        .createQueryBuilder("CV")
        .getMany();

      for (let i = 0; i < rooms.length; i++) {
        const messages = await getManager()
          .createQueryBuilder(MessagesEntity, "msg")
          .where("msg.conversationId = :conversationId", { conversationId: rooms[i].conversationId })
          .orderBy("createAt", "DESC")
          .getOne()
        const read = await getManager()
          .createQueryBuilder(ReadEntity, "read")
          .where("read.conversationId = :conversationId", { conversationId: rooms[i].conversationId })
          .getOne()
        const conversation = new ConversationListResponse();
        conversation.conversationId = rooms[i].conversationId;
        conversation.member = rooms[i].member;
        conversation.createAt = get(messages, 'createAt', '') || rooms[i].createAt;
        conversation.message = {}
        conversation.status = {}
        if (messages) {
          conversation.message = {
            body: messages.message,
            userId: messages.userId,
            createAt: messages.createAt
          }
        }
        if (read) {
          console.log(userId, messages.userId)
          conversation.status = {
            read: userId == messages.userId ? true : (userId == read.readBy ? read.read : false),
            // readBy: read.readBy
          }
        }
        res.push(conversation)
      }

      return res
      // const res = cloneDeep(rooms)
      // for (let i = 0; i < res.length; i++) {
      //   for (let j = 0; j < reads.length; j++) {
      //     if (!res[i].read) {
      //       res[i].read = new ReadEntity()
      //     }
      //     if (res[i].conversationId == reads[j].conversationId) {
      //       res[i].read = { ...reads[j] }
      //     }
      //   }
      // }
      // return res;
    } catch (e) {
      throw e
    }
  }
}
