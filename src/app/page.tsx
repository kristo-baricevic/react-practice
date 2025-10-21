"use client";
import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { Ticket } from "./types/types";
import { seed } from "./api/tickets";

function delay(ms: number) {
  return new Promise<void>((res) => setTimeout(res, ms));
}

async function fetchTickets(): Promise<Ticket[]> {
  await delay(400);
  // add loading status, error handling
  console.log("running fetch tickets", seed);
  return seed;
}

function App() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [list, setList] = useState<Ticket[] | null>(null);

  // STATE

  // EFFECT: load tickets
  useEffect(() => {
    let alive = true;
    setLoading(true);
    setList(null);
    setError("");
    fetchTickets()
      .then((d) => {
        if (alive) setList(d);
      })
      .catch((e) => {
        if (alive) setError(e);
      });

    //error handling and loading
    //list needs to go in state

    return () => {
      alive = false;
    };
  }, []);

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
