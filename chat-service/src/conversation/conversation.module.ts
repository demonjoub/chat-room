import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm"

import { ConversationController } from './conversation.controller'
import { ConversationService } from './conversation.service'
import { ConversationEntity, } from './../entity/conversation.entity'
import { SocketModule } from '../socket/socket.module';
import { ReadEntity } from './../entity/read.entity';
import { MessagesEntity } from 'src/entity/messages.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ConversationEntity, ReadEntity, MessagesEntity]),
    SocketModule,
  ],
  controllers: [ConversationController],
  providers: [ConversationService]
})
export class ConversationModule { }
