export interface SendRequestDTO {
  receiverId: string;
}

export interface RespondRequestDTO {
  requestId: string;
  action: 'ACCEPT' | 'REJECT';
}