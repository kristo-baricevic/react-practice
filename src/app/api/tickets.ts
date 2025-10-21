import { Ticket } from "../types/types";
import type { NextApiRequest, NextApiResponse } from 'next';

export const seed: Ticket[] = [
    {
      id: "1",
      title: "Onboard Acme Inc",
      status: "new",
      assignee: null,
      updatedAt: "2025-10-18T12:00:00Z",
    },
    {
      id: "2",
      title: "SAML setup for Globex",
      status: "in_review",
      assignee: "jane",
      updatedAt: "2025-10-18T14:10:00Z",
    },
    {
      id: "3",
      title: "Billing discrepancy Q4",
      status: "new",
      assignee: null,
      updatedAt: "2025-10-17T09:30:00Z",
    },
    {
      id: "4",
      title: "Role mapping audit",
      status: "approved",
      assignee: "mark",
      updatedAt: "2025-10-16T16:45:00Z",
    },
    {
      id: "5",
      title: "Quota increase request",
      status: "rejected",
      assignee: null,
      updatedAt: "2025-10-16T08:20:00Z",
    },
  ];


export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(seed);
}
