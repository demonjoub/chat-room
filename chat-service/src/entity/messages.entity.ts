import { Column, PrimaryGeneratedColumn, Entity, Index } from 'typeorm';

@Entity("messages")
export class MessagesEntity {

  @PrimaryGeneratedColumn('increment')
  id: number

  @Index()
  @Column()
  conversationId: string

  // message body
  @Column({ charset: "utf8mb4", collation: "utf8mb4_unicode_ci" })
  message: string

  // user 
  @Column()
  userId: string

  // createAt
  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createAt: string
}
