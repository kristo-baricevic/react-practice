"use client";
import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";

type TicketStatus = "new" | "in_review" | "approved" | "rejected";
type Ticket = {
  id: string;
  title: string;
  status: TicketStatus;
  assignee?: string | null;
  updatedAt: string;
};

const seed: Ticket[] = [
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

let db = [...seed];

function delay(ms: number) {
  return new Promise<void>((res) => setTimeout(res, ms));
}

function App() {
  // STATE

  // EFFECT: load tickets
  useEffect(() => {}, []);

  console.log("db ==> ", db);

  // FILTERED VIEW

  // ACTION RUNNER (optimistic; rollback on failure)

  // RENDER

  return (
    <div
      style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "1rem" }}
    >
      <h1>Tickets</h1>

      {/* TODO: filter input */}
      <label>
        Search
        <input
          value={"search"}
          onChange={(e) => {
            console.log(e);
          }}
          aria-label="Filter by title"
          className="ml-2 bg-amber-50 rounded-sm text-blue-700 px-2 py-[2px]"
        />
      </label>

      {/* TODO: list with empty state */}

      <h2>Details</h2>

      {/* TODO: details panel w/ actions */}

      {/* TODO: success/error notice */}
    </div>
  );
}

export default App;
