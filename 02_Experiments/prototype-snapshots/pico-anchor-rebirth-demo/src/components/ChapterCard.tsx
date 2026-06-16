import type { Chapter } from "../types/activity";
import { getChapterMaterials } from "../generated/materials/manifest";

type Props = {
  chapter: Chapter;
  active?: boolean;
};

export function ChapterCard({ chapter, active = false }: Props) {
  const assets = getChapterMaterials(chapter.chapterId);

  return (
    <article className={`chapter-card ${active ? "active" : ""}`}>
      <img src={assets.banner} alt={chapter.chapterName} />
      <div>
        <p>{active ? "当前任务包" : "重生章节"}</p>
        <h3>{chapter.chapterName}</h3>
        <span>{chapter.identityTagline}</span>
      </div>
    </article>
  );
}
