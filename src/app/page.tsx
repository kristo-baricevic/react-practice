"use client";
import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { Ticket } from "./types/types";

function delay(ms: number) {
  return new Promise<void>((res) => setTimeout(res, ms));
}

async function fetchTickets(signal?: AbortSignal): Promise<Ticket[]> {
  await delay(400);
  const res = await fetch("/api/tickets");
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function App() {
  // STATE
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [list, setList] = useState<Ticket[] | null>(null);
  const [selected, setSelected] = useState<Ticket | null>(null);
  const [assigned, setAssigned] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [busyId, setBusyId] = useState<string>("");
  const [notice, setNotice] = useState<{ msg: string; kind: "ok" | "err" }>({
    msg: "",
    kind: "ok",
  });

  const [q, setQ] = useState<string>("");

  // EFFECT: load tickets
  useEffect(() => {
    let ctrl = new AbortController();
    setLoading(true);
    setList(null);
    setError("");
    fetchTickets(ctrl.signal)
      .then(setList)
      .catch((e) => {
        if ((e as any).name !== "AbortError") setError((e as Error).message);
      })
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, []);

  console.log(list);

  // FILTERED VIEW
  const filtered = useMemo(() => {
    if (!list) return [];
    const s = q.trim().toLowerCase();
    return s ? list.filter((t) => t.title.toLowerCase().includes(s)) : list;
  }, [list, q]);

  async function apiPatch(id: string, patch: Partial<Ticket>): Promise<Ticket> {
    await delay(400);
    if (Math.random() < 0.15) throw new Error("Random server error");
    const i = list?.findIndex((t) => t.id === id);
    if (i === -1) throw new Error("Not found");
    list
      ? (list[i as number] = {
          ...list[i as number],
          ...patch,
          updatedAt: new Date().toISOString(),
        })
      : [];
    return JSON.parse(JSON.stringify(list ? list[i as number] : []));
  }

  // ACTION RUNNER (optimistic; rollback on failure)
  async function runAction(
    id: string,
    patch: Partial<Ticket>,
    successMsg: string
  ) {
    if (!list) return;
    setNotice({ msg: "", kind: "ok" });
    setBusyId(id);

    const prev = list;
    const optimistic = prev.map((t) => (t.id === id ? { ...t, ...patch } : t));
    setList(optimistic);
    if (selected && selected.id === id) setSelected({ ...selected, ...patch });

    try {
      const saved = await apiPatch(id, patch);
      setList((cur) => (cur || []).map((t) => (t.id === id ? saved : t)));
      if (selected && selected.id === id) setSelected(saved);
      setNotice({ msg: successMsg, kind: "ok" });
    } catch (e: any) {
      setList(prev);
      if (selected && selected.id === id)
        setSelected(prev.find((t) => t.id === id) || null);
      setNotice({ msg: String(e.message || e), kind: "err" });
    } finally {
      setBusyId("");
    }
  }

  // RENDER
  if (!list || loading) return <div aria-live="polite">Loading...</div>;
  if (error) return <div role="alert">Error</div>;

  return (
    <div className="flex flex-col px-4 text-black">
      <div className="flex flex-col mb-2">
        <h1 className="ml-4 mt-4 mb-2 text-2xl font-semibold">Tickets</h1>

        {/* TODO: filter input */}
        <label className="ml-4 mb-2 text-lg font-semibold">
          Search
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
            }}
            aria-label="Filter by title"
            className="ml-2 bg-amber-50 border-2 border-amber-800 rounded-lg text-amber-950 px-2 py-[2px]"
          />
        </label>
      </div>
      <div className="flex flex-row space-x-5">
        {/* TODO: list with empty state */}
        {filtered.length > 0 ? (
          <div className="flex flex-col w-full ml-8">
            {filtered.map((i) => (
              <div key={i.id} onClick={() => setSelected(i)}>
                <li className="flex flex-col mb-4 max-w-md bg-amber-100 rounded-xl text-black p-4">
                  <div className="flex">{i.title}</div>
                  <div className="flex">{i.status}</div>
                  <div className="flex">{i.assignee}</div>
                </li>
              </div>
            ))}
          </div>
        ) : (
          <>No results 😢😢😢😢😢😢😢😢 </>
        )}
        <div className="flex flex-col ">
          <div className="bg-amber-300 max-h-48 w-[300px] rounded-2xl flex flex-col mr-12 mb-4 p-4">
            <h2 className="flex">Details</h2>
            {/* TODO: details panel w/ actions */}
            {selected ? (
              <div className="flex flex-col h-full">
                <div className="flex">{selected?.title}</div>
                <div>
                  Updated: {new Date(selected.updatedAt).toLocaleString()}
                </div>

                <div className="mt-auto flex flex-row items-center text-sm gap-2 pt-2">
                  <button
                    disabled={busyId === selected.id}
                    className="items-center h-full flex px-2 py-0.5 cursor-pointer bg-slate-200 hover:bg-slate-300 rounded-2xl border-2 border-slate-400"
                    onClick={() =>
                      runAction(selected.id, { status: "approved" }, "Approved")
                    }
                  >
                    Approve
                  </button>
                  <button
                    disabled={busyId === selected.id}
                    className="items-center h-full flex px-2 py-0.5 cursor-pointer bg-slate-200 hover:bg-slate-300 rounded-2xl border-2 border-slate-400"
                    onClick={() => {
                      runAction(
                        selected.id,
                        { status: "rejected" },
                        "Rejected"
                      );

                      setStatus("rejected");
                    }}
                  >
                    Reject
                  </button>
                  <button
                    disabled={busyId === selected.id}
                    className="items-center h-full flex px-2 py-0.5 cursor-pointer bg-slate-200 hover:bg-slate-300 rounded-2xl border-2 border-slate-400"
                    onClick={() =>
                      runAction(
                        selected.id,
                        { assignee: "me" },
                        "Assigned to you"
                      )
                    }
                  >
                    Assign to Me
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex">Select a ticket</div>
            )}
          </div>

          {/* TODO: success/error notice */}
          <div
            className="flex bg-amber-200 h-[100px] w-[300px] p-8 rounded-2xl justify-center"
            role={notice.kind === "err" ? "alert" : undefined}
            aria-live="polite"
          >
            {notice.msg ? <div>{notice.msg}</div> : <div></div>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
