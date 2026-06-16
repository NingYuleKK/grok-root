import { chapters, defaultChapterId } from "../data/chapters";
import { createInitialDemoState, STORAGE_KEY } from "../data/demoState";
import { DEMO_RESET_TOKEN } from "../generated/resetToken";
import type {
  ActivityEvent,
  ActivityState,
  Gift,
  GiftTier,
  GrantedSouvenir,
  SponsorStanding,
} from "../types/activity";

type StoreOptions = { persist?: boolean; storageKey?: string };
type Listener = () => void;

const chapter = chapters.find((item) => item.chapterId === defaultChapterId)!;

const clone = <T>(value: T): T => structuredClone(value);
const stamp = () => new Date().toISOString();
const makeId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
const canUseStorage = () => typeof window !== "undefined" && "localStorage" in window;

function pushUnique<T>(list: T[], item: T) {
  if (!list.includes(item)) list.push(item);
}

function buildEvent(type: ActivityEvent["type"], copy: string): ActivityEvent {
  return { id: makeId("event"), type, copy, timestamp: stamp() };
}

function sourceCopy(souvenirName: string): string {
  return `由主播 桃桃 于《${chapter.chapterName}》通关后亲赠。`;
}

function loadState(storageKey: string): ActivityState | undefined {
  if (!canUseStorage()) return undefined;
  const raw = window.localStorage.getItem(storageKey);
  if (!raw) return undefined;
  try {
    return JSON.parse(raw) as ActivityState;
  } catch {
    return undefined;
  }
}

function saveState(storageKey: string, state: ActivityState, persist: boolean) {
  if (persist && canUseStorage()) window.localStorage.setItem(storageKey, JSON.stringify(state));
}

function rankSponsors(state: ActivityState): SponsorStanding[] {
  const totals = new Map<string, SponsorStanding>();
  for (const record of state.contributions) {
    const current = totals.get(record.senderId) ?? {
      userId: record.senderId,
      nickname: record.senderName,
      diamondValue: 0,
      litCount: 0,
    };
    current.diamondValue += record.diamondValue;
    current.litCount += 1;
    totals.set(record.senderId, current);
  }

  return [...totals.values()].sort((a, b) => b.diamondValue - a.diamondValue || b.litCount - a.litCount);
}

function ensureSouvenirPool(state: ActivityState) {
  if (state.streamer.souvenirsToGive.length > 0) return;
  state.streamer.souvenirsToGive = chapter.souvenirs.map((souvenir) => ({
    souvenirId: souvenir.souvenirId,
    souvenirName: souvenir.name,
    chapterId: chapter.chapterId,
    sourceCopy: sourceCopy(souvenir.name),
  }));
}

function completeArchive(state: ActivityState) {
  const standing = rankSponsors(state)[0];
  const archive = state.streamer.archiveCards.find((item) => item.chapterId === chapter.chapterId);
  if (archive) {
    archive.status = state.wall.isGrandSlam ? "大满贯" : "已通关";
    archive.completedAt = archive.completedAt ?? stamp();
    archive.chiefSponsorId = standing?.userId;
    archive.grantedSouvenirCount = state.users.reduce((sum, user) => sum + user.receivedSouvenirs.length, 0);
  }
}

function syncMilestones(state: ActivityState) {
  const progress = state.wall.litGiftIds.length;
  for (const milestone of chapter.milestones) {
    const key = String(milestone);
    const status = state.wall.milestoneStatus[key];
    if (progress >= milestone && !status.isUnlocked) {
      status.isUnlocked = true;
      status.unlockedAt = stamp();
      const copy =
        milestone === 4
          ? "桃桃的玫瑰沙龙已完成 4/12，入席小动效已解锁"
          : milestone === 8
            ? "桃桃的玫瑰沙龙已完成 8/12，女主人头像贴纸已解锁"
            : "桃桃的玫瑰沙龙全席点亮";
      state.wall.recentEvents.unshift(buildEvent(milestone === 12 ? "completed" : "milestone", copy));
    }
  }
}

function maybeComplete(state: ActivityState, finalizerId?: string) {
  if (state.wall.litGiftIds.length < chapter.wallSize || state.wall.isCompleted) return;
  state.wall.isCompleted = true;
  state.wall.finalizerId = finalizerId;
  pushUnique(state.streamer.completedChapterIds, chapter.chapterId);
  state.streamer.certificates.unshift({
    chapterId: chapter.chapterId,
    title: chapter.certificateTitle,
    grantedAt: stamp(),
    chiefSponsorId: rankSponsors(state)[0]?.userId,
  });
  ensureSouvenirPool(state);
  completeArchive(state);
  state.wall.recentEvents.unshift(buildEvent("completed", "主播获封：玫瑰沙龙会客厅主人"));
  state.wall.recentEvents.unshift(buildEvent("completed", "桃桃获得 4 份限定伴手礼，可亲赠本关赞助人"));
}

function applyGift(state: ActivityState, gift: Gift, senderId: string) {
  const sender = state.users.find((user) => user.id === senderId);
  if (!sender) throw new Error(`Unknown sender: ${senderId}`);

  const progress = state.wall.giftProgress[gift.giftId];
  const firstLit = !progress.isLit;
  progress.count += 1;
  progress.isLit = true;
  progress.lastSenderId = sender.id;
  progress.lastSenderName = sender.nickname;
  progress.justLitAt = stamp();
  if (firstLit) state.wall.litGiftIds.push(gift.giftId);

  state.contributions.push({
    giftId: gift.giftId,
    giftName: gift.giftName,
    tier: gift.tier,
    senderId: sender.id,
    senderName: sender.nickname,
    count: 1,
    diamondValue: gift.diamondValue,
    timestamp: stamp(),
  });

  const tierCopy = gift.tier === "high" ? "高档礼物点亮" : gift.tier === "mid" ? "中档礼物点亮" : "普通礼物点亮";
  state.wall.recentEvents.unshift(buildEvent("gift", `${tierCopy}：${sender.nickname} 点亮了 ${gift.giftName}`));
  state.wall.sponsorRanking = rankSponsors(state);
  syncMilestones(state);
  maybeComplete(state, sender.id);
}

export function createActivityStore(initialState = createInitialDemoState(), options: StoreOptions = {}) {
  const persist = options.persist ?? true;
  const storageKey = options.storageKey ?? `${STORAGE_KEY}:${DEMO_RESET_TOKEN}`;
  let state = persist ? (loadState(storageKey) ?? clone(initialState)) : clone(initialState);
  const listeners = new Set<Listener>();

  function commit(next: ActivityState) {
    state = next;
    saveState(storageKey, state, persist);
    listeners.forEach((listener) => listener());
    return state;
  }

  const api = {
    subscribe(listener: Listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getState() {
      return state;
    },
    sendGift(giftId: string, senderId: string) {
      const gift = chapter.gifts.find((item) => item.giftId === giftId);
      if (!gift) throw new Error(`Unknown gift: ${giftId}`);
      const draft = clone(state);
      applyGift(draft, gift, senderId);
      return commit(draft);
    },
    sendRandomGiftByTier(tier: GiftTier, senderId: string) {
      const candidates = chapter.gifts.filter((gift) => gift.tier === tier);
      const unlit = candidates.filter((gift) => !state.wall.giftProgress[gift.giftId]?.isLit);
      const pool = unlit.length > 0 ? unlit : candidates;
      const gift = pool[Math.floor(Math.random() * pool.length)];
      return api.sendGift(gift.giftId, senderId);
    },
    sendEmperorSet(senderId: string) {
      const sender = state.users.find((user) => user.id === senderId);
      if (!sender) throw new Error(`Unknown sender: ${senderId}`);
      const draft = clone(state);
      draft.wall.emperorSetCount += 1;
      draft.contributions.push({
        giftId: chapter.emperorSet.emperorSetId,
        giftName: chapter.emperorSet.name,
        tier: "emperor",
        senderId: sender.id,
        senderName: sender.nickname,
        count: 1,
        diamondValue: chapter.emperorSet.diamondValue,
        timestamp: stamp(),
      });
      draft.wall.recentEvents.unshift(buildEvent("emperor", `首席赞助人：${sender.nickname} 送出 ${chapter.emperorSet.name}`));
      if (draft.wall.isCompleted) {
        draft.wall.isGrandSlam = true;
        draft.streamer.hallPassCount = Math.max(1, draft.streamer.hallPassCount + 1);
        draft.wall.recentEvents.unshift(buildEvent("grandSlam", "桃桃的玫瑰沙龙全席点亮并获得大满贯通行证"));
      }
      draft.wall.sponsorRanking = rankSponsors(draft);
      completeArchive(draft);
      return commit(draft);
    },
    unlockMilestone(milestoneId: string) {
      const draft = clone(state);
      const status = draft.wall.milestoneStatus[milestoneId];
      if (status) {
        status.isUnlocked = true;
        status.unlockedAt = stamp();
        draft.wall.recentEvents.unshift(buildEvent("milestone", `${status.title}已手动解锁`));
      }
      return commit(draft);
    },
    completeChapter() {
      const draft = clone(state);
      for (const gift of chapter.gifts) {
        if (!draft.wall.giftProgress[gift.giftId].isLit) applyGift(draft, gift, "final-light");
      }
      maybeComplete(draft, "final-light");
      return commit(draft);
    },
    grantSouvenir(souvenirId: string, receiverId: string) {
      const draft = clone(state);
      ensureSouvenirPool(draft);
      const souvenir = draft.streamer.souvenirsToGive.find((item) => item.souvenirId === souvenirId);
      const receiver = draft.users.find((user) => user.id === receiverId);
      if (!souvenir || !receiver) throw new Error(`Invalid souvenir or receiver: ${souvenirId}, ${receiverId}`);
      const granted: GrantedSouvenir = {
        ...souvenir,
        receiverId: receiver.id,
        receiverName: receiver.nickname,
        grantedAt: stamp(),
      };
      receiver.receivedSouvenirs.unshift(granted);
      draft.streamer.souvenirsToGive = draft.streamer.souvenirsToGive.filter((item) => item.souvenirId !== souvenirId);
      completeArchive(draft);
      draft.wall.recentEvents.unshift(buildEvent("souvenir", `桃桃把 ${souvenir.souvenirName} 亲赠给 ${receiver.nickname}`));
      return commit(draft);
    },
    resetChapter() {
      return commit(createInitialDemoState());
    },
    resetDemo() {
      if (canUseStorage()) window.localStorage.removeItem(storageKey);
      return commit(createInitialDemoState());
    },
    getSponsorRanking() {
      return rankSponsors(state);
    },
    getCurrentProgress() {
      return { lit: state.wall.litGiftIds.length, total: chapter.wallSize };
    },
    getRecentEvents() {
      return state.wall.recentEvents.slice(0, 20);
    },
  };

  return api;
}

export const activityStore = createActivityStore();
