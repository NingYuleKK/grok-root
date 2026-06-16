export type GiftTier = "low" | "mid" | "high";
export type EventType =
  | "gift"
  | "milestone"
  | "completed"
  | "emperor"
  | "grandSlam"
  | "souvenir";

export type Gift = {
  giftId: string;
  giftName: string;
  tier: GiftTier;
  diamondValue: number;
};

export type EmperorSet = {
  emperorSetId: string;
  name: string;
  diamondValue: number;
};

export type Souvenir = {
  souvenirId: string;
  name: string;
  sourceCopyTemplate: string;
};

export type Chapter = {
  chapterId: string;
  chapterName: string;
  identityTitle: string;
  identityTagline: string;
  shortStory: string;
  posterTitle: string;
  posterSubtitle: string;
  certificateTitle: string;
  certificateCopy: string;
  avatarFrameName: string;
  shareCopy: string;
  wallSize: 12;
  milestones: number[];
  gifts: Gift[];
  emperorSet: EmperorSet;
  souvenirs: Souvenir[];
  sponsorTitles: string[];
  flyBannerCopies: Record<string, string>;
};

export type DemoUser = {
  id: string;
  nickname: string;
  role: "streamer" | "user" | "fan" | "boss" | "finalizer";
  avatar: string;
  receivedSouvenirs: GrantedSouvenir[];
};

export type Certificate = {
  chapterId: string;
  title: string;
  grantedAt: string;
  chiefSponsorId?: string;
};

export type ArchiveCard = {
  chapterId: string;
  status: "未开始" | "进行中" | "已通关" | "大满贯";
  completedAt?: string;
  chiefSponsorId?: string;
  grantedSouvenirCount: number;
};

export type Streamer = {
  id: string;
  nickname: string;
  avatar: string;
  level: string;
  currentChapterId: string;
  completedChapterIds: string[];
  certificates: Certificate[];
  souvenirsToGive: GrantedSouvenir[];
  archiveCards: ArchiveCard[];
  hallPassCount: number;
};

export type ContributionRecord = {
  giftId: string;
  giftName: string;
  tier: GiftTier | "emperor";
  senderId: string;
  senderName: string;
  count: number;
  diamondValue: number;
  timestamp: string;
};

export type GiftProgress = {
  giftId: string;
  count: number;
  isLit: boolean;
  lastSenderId?: string;
  lastSenderName?: string;
  justLitAt?: string;
};

export type MilestoneStatus = {
  milestoneId: "4" | "8" | "12";
  title: string;
  reward: string;
  isUnlocked: boolean;
  unlockedAt?: string;
};

export type ActivityEvent = {
  id: string;
  type: EventType;
  copy: string;
  timestamp: string;
};

export type SponsorStanding = {
  userId: string;
  nickname: string;
  diamondValue: number;
  litCount: number;
};

export type GiftWallState = {
  chapterId: string;
  giftProgress: Record<string, GiftProgress>;
  litGiftIds: string[];
  milestoneStatus: Record<string, MilestoneStatus>;
  isCompleted: boolean;
  isGrandSlam: boolean;
  emperorSetCount: number;
  sponsorRanking: SponsorStanding[];
  recentEvents: ActivityEvent[];
  finalizerId?: string;
};

export type GrantedSouvenir = {
  souvenirId: string;
  souvenirName: string;
  chapterId: string;
  sourceCopy: string;
  receiverId?: string;
  receiverName?: string;
  grantedAt?: string;
};

export type ActivityState = {
  streamer: Streamer;
  users: DemoUser[];
  wall: GiftWallState;
  contributions: ContributionRecord[];
};
