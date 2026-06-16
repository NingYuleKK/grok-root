import { chapters } from "../data/chapters";
import { themeTokens } from "../data/themeTokens";
import { getChapterMaterials } from "../generated/materials/manifest";

export function MaterialGallery() {
  return (
    <div className="material-gallery">
      {chapters.map((chapter) => {
        const assets = getChapterMaterials(chapter.chapterId);
        const theme = themeTokens[chapter.chapterId as keyof typeof themeTokens];
        return (
          <section className="material-chapter" key={chapter.chapterId}>
            <div className="section-title">
              <p>{chapter.chapterName}</p>
              <strong>{chapter.identityTitle}</strong>
            </div>
            <div className="material-row hero-assets">
              <img src={assets.poster} alt={`${chapter.chapterName}海报`} />
              <img src={assets.identityCard} alt={`${chapter.chapterName}身份卡`} />
              <img src={assets.certificate} alt={`${chapter.chapterName}证书`} />
              <img src={assets.avatarFrame} alt={`${chapter.chapterName}头像框`} />
            </div>
            <div className="token-box">
              <span style={{ background: theme.primaryColor }} />
              <span style={{ background: theme.secondaryColor }} />
              <span style={{ background: theme.accentColor }} />
              <p>{theme.typographyMood}</p>
            </div>
            <div className="material-icons">
              {chapter.gifts.map((gift) => (
                <img key={gift.giftId} src={assets.gifts[gift.giftId]} alt={gift.giftName} />
              ))}
              <img src={assets.emperorSet} alt={chapter.emperorSet.name} />
              {chapter.souvenirs.map((souvenir) => (
                <img key={souvenir.souvenirId} src={assets.souvenirs[souvenir.souvenirId]} alt={souvenir.name} />
              ))}
            </div>
            <p className="material-copy">{chapter.shortStory}</p>
          </section>
        );
      })}
    </div>
  );
}
