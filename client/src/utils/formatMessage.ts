import { Message } from '../types/Message';

export function formatMessage(raw: any): Message {
  return {
    id: raw.id ?? raw._id,
    content: raw.content ?? raw.text ?? String(raw),
    sender: raw.sender,
    timestamp: raw.timestamp
  };
}