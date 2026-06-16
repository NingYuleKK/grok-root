import { MaterialGallery } from "../components/MaterialGallery";
import { NavBar } from "../components/NavBar";

export function MaterialsPage() {
  return (
    <main className="app-shell materials-shell">
      <NavBar />
      <section className="panel">
        <p className="eyebrow">阶段 A 物料库</p>
        <h1>叙事物料库已一次性生成，并被 demo 消费</h1>
        <p>这里展示 9 个章节的海报、身份卡、证书、头像框、礼物 icon、伴手礼 icon、视觉 token 和文案摘要。</p>
      </section>
      <MaterialGallery />
    </main>
  );
}
