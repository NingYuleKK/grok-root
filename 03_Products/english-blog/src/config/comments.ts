export interface CommentsConfig {
  provider: "giscus";
  repo: string;
  repoId: string;
  category: string;
  categoryId: string;
  mapping: string;
  strict: string;
  reactionsEnabled: string;
  emitMetadata: string;
  inputPosition: "top" | "bottom";
  theme: string;
  lang: string;
}

export const commentsConfig: CommentsConfig = {
  provider: "giscus",
  repo: import.meta.env.PUBLIC_GISCUS_REPO || "",
  repoId: import.meta.env.PUBLIC_GISCUS_REPO_ID || "",
  category: import.meta.env.PUBLIC_GISCUS_CATEGORY || "",
  categoryId: import.meta.env.PUBLIC_GISCUS_CATEGORY_ID || "",
  mapping: import.meta.env.PUBLIC_GISCUS_MAPPING || "pathname",
  strict: import.meta.env.PUBLIC_GISCUS_STRICT || "0",
  reactionsEnabled: import.meta.env.PUBLIC_GISCUS_REACTIONS_ENABLED || "1",
  emitMetadata: import.meta.env.PUBLIC_GISCUS_EMIT_METADATA || "0",
  inputPosition: (import.meta.env.PUBLIC_GISCUS_INPUT_POSITION || "bottom") as "top" | "bottom",
  theme: import.meta.env.PUBLIC_GISCUS_THEME || "preferred_color_scheme",
  lang: import.meta.env.PUBLIC_GISCUS_LANG || "en"
};

export function isCommentsConfigured(config: CommentsConfig): boolean {
  return Boolean(config.repo && config.repoId && config.category && config.categoryId);
}

