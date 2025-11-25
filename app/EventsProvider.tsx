"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { events as initialEvents } from "@/data/Events";
import type Event from "@/types/Event";

interface EventsContextType {
  events: Event[];
  addEvent: (event: Event) => void;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

const STORAGE_KEY = "events";
const EVENTS_DATA_VERSION = "2025-11-update";

type StoredEvent = Omit<Event, "startDate" | "endDate"> & {
  startDate: string;
  endDate: string;
};

type StoredEventsPayload = {
  version: string;
  events: StoredEvent[];
};

const serializeEvents = (events: Event[]): StoredEvent[] =>
  events.map((ev) => ({
    ...ev,
    startDate: ev.startDate.toISOString(),
    endDate: ev.endDate.toISOString(),
  }));

const reviveStoredEvents = (stored: StoredEvent[]): Event[] =>
  stored.map((ev) => ({
    ...ev,
    startDate: new Date(ev.startDate),
    endDate: new Date(ev.endDate),
  }));

const loadEventsFromStorage = (): Event[] | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return null;
  }

  try {
    const parsed = JSON.parse(stored) as StoredEventsPayload | StoredEvent[];
    const payload: StoredEventsPayload = Array.isArray(parsed)
      ? { version: "legacy", events: parsed }
      : parsed;

    if (payload.version !== EVENTS_DATA_VERSION) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return reviveStoredEvents(payload.events);
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

const storeEvents = (events: Event[]) => {
  if (typeof window === "undefined") {
    return;
  }

  const payload: StoredEventsPayload = {
    version: EVENTS_DATA_VERSION,
    events: serializeEvents(events),
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
};

export const EventsProvider = ({ children }: { children: ReactNode }) => {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [hasRestoredFromStorage, setHasRestoredFromStorage] = useState(false);

  useEffect(() => {
    const storedEvents = loadEventsFromStorage();
    if (storedEvents) {
      setEvents(storedEvents);
    }
    setHasRestoredFromStorage(true);
  }, []);

  useEffect(() => {
    if (!hasRestoredFromStorage) {
      return;
    }

    storeEvents(events);
  }, [events, hasRestoredFromStorage]);

  const addEvent = (event: Event) => setEvents((prev) => [...prev, event]);

  return (
    <EventsContext.Provider value={{ events, addEvent }}>
      {children}
    </EventsContext.Provider>
  );
};

export const useEvents = () => {
  const ctx = useContext(EventsContext);
  if (!ctx) throw new Error("useEvents must be used within an EventsProvider");
  return ctx;
};
