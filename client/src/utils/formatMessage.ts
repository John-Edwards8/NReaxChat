import { Message } from '../types/Message';

export function formatMessage(raw: any): Message {
  const rawTime = typeof raw.timestamp === "string"
      ? raw.timestamp.endsWith("Z") || raw.timestamp.includes("+")
          ? raw.timestamp
          : raw.timestamp + "Z"
      : raw.timestamp;

  return {
    id: raw.id ?? raw._id,
    content: raw.content ?? raw.text ?? String(raw),
    sender: raw.sender,
    timestamp: new Date(rawTime),
    type: raw.type?.toUpperCase() ?? "NEW"
  };
}