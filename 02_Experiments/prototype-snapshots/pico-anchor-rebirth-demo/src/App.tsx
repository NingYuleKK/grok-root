import { useEffect, useState } from "react";
import { HomePage } from "./routes/HomePage";
import { RoomPage } from "./routes/RoomPage";
import { StreamerProfilePage } from "./routes/StreamerProfilePage";
import { SponsorProfilePage } from "./routes/SponsorProfilePage";
import { MaterialsPage } from "./routes/MaterialsPage";

function usePathname() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  return path;
}

export function navigate(path: string) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export default function App() {
  const path = usePathname();

  if (path === "/room") return <RoomPage />;
  if (path === "/profile/streamer") return <StreamerProfilePage />;
  if (path === "/profile/sponsor") return <SponsorProfilePage />;
  if (path === "/materials") return <MaterialsPage />;
  return <HomePage />;
}
