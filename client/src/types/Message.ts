export type Message = {
    id: string;
    content: string;
    sender: string;
    timestamp: Date;
    type?: "NEW" | "EDIT" | "DELETE";
};