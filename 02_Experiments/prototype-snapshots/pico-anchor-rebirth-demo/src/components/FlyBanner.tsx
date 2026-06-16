import type { ActivityEvent } from "../types/activity";

export function FlyBanner({ events }: { events: ActivityEvent[] }) {
  return (
    <div className="fly-track" aria-live="polite">
      {events.slice(0, 4).map((event, index) => (
        <div className={`fly-banner fly-${index}`} key={event.id}>
          <span>{event.type === "emperor" || event.type === "grandSlam" ? "加冕" : "飘屏"}</span>
          {event.copy}
        </div>
      ))}
    </div>
  );
}
