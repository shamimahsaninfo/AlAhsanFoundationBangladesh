import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";

const EMPTY = { income: 0, expense: 0, projects: 0, completed: 0, districts: 0 };

export function usePublicStats() {
  const [stats, setStats] = useState(EMPTY);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    const load = async () => {
      try {
        const [ledger, projects, completed, locations] = await Promise.all([
          base44.entities.LedgerEntry.aggregate({ groupBy: "entry_type", sum: ["amount"] }),
          base44.entities.Activity.count({ is_published: true }),
          base44.entities.Activity.count({ is_published: true, status: "completed" }),
          base44.entities.Activity.list({ distinct: "location" }),
        ]);
        if (!alive) return;
        const rows = ledger.rows || [];
        const income = rows.find((r) => r.entry_type === "income")?.sum_amount || 0;
        const expense = rows.find((r) => r.entry_type === "expense")?.sum_amount || 0;
        const districts = (locations.items || []).filter(Boolean).length;
        setStats({ income, expense, projects, completed, districts });
      } catch {
        /* keep zeros */
      } finally {
        if (alive) setLoading(false);
      }
    };

    load();
    return () => {
      alive = false;
    };
  }, []);

  return { stats, loading };
}