import { Message } from '../types/Message';

export function formatMessage(raw: any): Message {
  return {
    text: raw.content ?? raw.text ?? String(raw),
    sender: raw.sender,
  };
}