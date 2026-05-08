"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useStore } from "@/lib/store";

export function useSync() {
  const { data: session, status } = useSession();
  const hydrate = useStore((state) => state.hydrate);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const fetchData = async () => {
        try {
          const res = await fetch("/api/user/data");
          if (res.ok) {
            const data = await res.json();
            hydrate({
              accounts: data.accounts,
              categories: data.categories,
              transactions: data.transactions,
              budgets: data.budgets,
              user: {
                displayName: session.user.name || "User",
                email: session.user.email || "",
                isGoogleConnected: !!(session as any).isGoogle, // Optional check
                avatar: session.user.image || undefined,
              }
            });
          }
        } catch (error) {
          console.error("Failed to sync data from DB", error);
        }
      };

      fetchData();
    }
  }, [status, session, hydrate]);
}
