export type Ticket = {
    id: string;
    title: string;
    status: TicketStatus;
    assignee?: string | null;
    updatedAt: string;
  };

export type TicketStatus = "new" | "in_review" | "approved" | "rejected";
