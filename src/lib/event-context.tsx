"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Event } from "@/lib/types";

interface EventContextValue {
  currentEvent: Event | null;
  events: Event[];
  loading: boolean;
  setCurrentEventId: (id: string) => void;
  refresh: () => Promise<void>;
}

const EventContext = createContext<EventContextValue>({
  currentEvent: null,
  events: [],
  loading: true,
  setCurrentEventId: () => {},
  refresh: async () => {},
});

export function EventProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchEvents = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) {
      const evts = data as Event[];
      setEvents(evts);
      return evts;
    }
    return [];
  }, []);

  const setCurrentEventId = useCallback((id: string) => {
    const found = events.find((e) => e.id === id);
    if (found) setCurrentEvent(found);
  }, [events]);

  const refresh = useCallback(async () => {
    await fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    fetchEvents().then((data) => {
      if (data.length > 0) {
        setCurrentEvent(data[0]);
      }
      setLoading(false);
    });
  }, []);

  return (
    <EventContext.Provider value={{ currentEvent, events, loading, setCurrentEventId, refresh }}>
      {children}
    </EventContext.Provider>
  );
}

export function useEvent() {
  return useContext(EventContext);
}
