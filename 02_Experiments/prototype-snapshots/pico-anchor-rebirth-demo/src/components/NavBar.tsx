import { navigate } from "../App";

export function NavBar() {
  return (
    <nav className="nav-bar" aria-label="页面导航">
      <button onClick={() => navigate("/")}>入口</button>
      <button onClick={() => navigate("/room")}>直播间</button>
      <button onClick={() => navigate("/profile/streamer")}>主播页</button>
      <button onClick={() => navigate("/profile/sponsor")}>老板页</button>
      <button onClick={() => navigate("/materials")}>物料库</button>
    </nav>
  );
}
