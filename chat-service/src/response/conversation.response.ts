export class ConversationResponse {
  public conversationId: number
  public status: boolean
}

export class ConversationListResponse {
  public conversationId: string
  public status: {
    read?: boolean,
    readBy?: string
  }
  public message: {
    body?: string,
    userId?: string,
    createAt?: string
  }
  public member: string[]
  public createAt: string
}