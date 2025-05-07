import { Message } from '../types/Message';

export function formatMessage(raw: Message, /*currentUser: string*/) {
  return {
    text: raw.text,
    sender: raw.sender === 'User1' ? 'me' : 'other',
    // sender: raw.sender === currentUser ? 'me' : 'other',
  };
}