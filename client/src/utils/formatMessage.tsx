import { Message } from '../types/Message';

export function formatMessage(raw: any, /*currentUser: string*/) : Message {
  return {
    text: raw.content || raw.text || String(raw),
    sender: raw.sender === 'User1' ? 'me' : 'other',
    // sender: raw.sender === currentUser ? 'me' : 'other',
  };
}