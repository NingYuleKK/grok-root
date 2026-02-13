export type NewsletterMode = "redirect" | "placeholder";

export interface NewsletterConfig {
  providerName: string;
  mode: NewsletterMode;
  actionUrl: string;
  sourceLabel: string;
}

const modeValue = (import.meta.env.PUBLIC_NEWSLETTER_MODE || "placeholder").toLowerCase();
const mode: NewsletterMode = modeValue === "redirect" ? "redirect" : "placeholder";

export const newsletterConfig: NewsletterConfig = {
  providerName: import.meta.env.PUBLIC_NEWSLETTER_PROVIDER || "not-configured",
  mode,
  actionUrl: import.meta.env.PUBLIC_NEWSLETTER_ACTION_URL || "",
  sourceLabel: import.meta.env.PUBLIC_NEWSLETTER_SOURCE || "litchi-notes"
};

