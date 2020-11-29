import { Column, PrimaryGeneratedColumn, Entity, Generated } from 'typeorm';

@Entity("conversation")
export class ConversationEntity {

  @PrimaryGeneratedColumn('increment')
  id: number

  @Generated('uuid')
  @Column()
  conversationId: string

  @Column("simple-array", { nullable: true })
  member: string[]

  @Column()
  roomName: string

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createAt: string

}
