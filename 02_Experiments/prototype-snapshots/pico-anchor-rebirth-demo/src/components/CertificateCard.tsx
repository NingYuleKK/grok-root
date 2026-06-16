import type { Chapter } from "../types/activity";
import { getChapterMaterials } from "../generated/materials/manifest";

export function CertificateCard({ chapter, onClick }: { chapter: Chapter; onClick?: () => void }) {
  const assets = getChapterMaterials(chapter.chapterId);

  return (
    <button className="certificate-card" onClick={onClick}>
      <img src={assets.certificate} alt={chapter.certificateTitle} />
      <span>{chapter.certificateTitle}</span>
    </button>
  );
}
