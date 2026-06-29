import { create } from 'zustand';

export interface Task {
  id: number;
  name: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'legendary';
  dueDate: string | null;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
}

export interface LogEntry {
  msg: string;
  cls: string;
  time: string;
}

interface DailyChallenge {
  id: string;
  desc: string;
  icon: string;
  target: number;
  type: string;
  reward: { xp: number; coins: number; gems?: number };
  claimed?: boolean;
}

interface BossQuest {
  name: string;
  icon: string;
  desc: string;
  time: number;
  req: { type: string; count: number };
  reward: { xp: number; coins: number; gems: number };
}

export interface QuestState {
  tasks: Task[];
  xp: number;
  level: number;
  coins: number;
  totalCoins: number;
  gems: number;
  totalGems: number;
  streak: number;
  lastCompletedDate: string | null;
  totalCompleted: number;
  hardCompleted: number;
  legendaryCompleted: number;
  bossCompleted: number;
  maxCombo: number;
  dailyCompleted: number;
  totalSkillPoints: number;
  combo: number;
  lastComboTime: number | null;
  unlockedAchievements: string[];
  ownedItems: string[];
  avatar: string;
  pet: string | null;
  themeColor: string | null;
  skills: Record<string, number>;
  skillPoints: number;
  dailyChallengeId: string | null;
  dailyProgress: number;
  dailyDate: string | null;
  dailyClaimed: boolean;
  bossQuest: BossQuest | null;
  bossStartTime: number | null;
  bossProgress: Record<string, boolean>;
  attendance: string[];
  lastAttendance: string | null;
  heatmap: Record<string, number>;
  logs: LogEntry[];
  tutorialSeen: boolean;
  levelUpPending: boolean;

  addTask: (name: string, difficulty: string, dueDate: string | null) => void;
  toggleTask: (id: number) => void;
  deleteTask: (id: number) => void;
  upgradeSkill: (id: string) => void;
  buyItem: (itemId: string) => void;
  claimAttendance: () => void;
  setTutorialSeen: () => void;
  tickBoss: () => void;
  clearLevelUp: () => void;
}

export const XP_TABLE: Record<string, number> = { easy: 15, medium: 30, hard: 60, legendary: 120 };
export const COIN_TABLE: Record<string, number> = { easy: 8, medium: 15, hard: 30, legendary: 60 };

export const TITLES = [
  { level: 1, title: '견습생' },
  { level: 3, title: '수련생' },
  { level: 5, title: '모험가' },
  { level: 8, title: '베테랑' },
  { level: 10, title: '영웅' },
  { level: 15, title: '전설' },
  { level: 20, title: '마스터' },
  { level: 30, title: '그랜드마스터' },
  { level: 50, title: '신화' },
];

export const SKILLS = [
  { id: 'focus', name: '집중력', icon: '🎯', desc: 'XP +10%/Lv', maxLv: 5, effect: (l: number) => 1 + l * 0.1 },
  { id: 'luck', name: '행운', icon: '🍀', desc: '보상 확률 +8%/Lv', maxLv: 5, effect: (l: number) => l * 0.08 },
  { id: 'streak_master', name: '끈기', icon: '🔥', desc: '스트릭 보너스 +15%/Lv', maxLv: 5, effect: (l: number) => 1 + l * 0.15 },
  { id: 'coin_master', name: '재테크', icon: '💰', desc: '코인 +12%/Lv', maxLv: 5, effect: (l: number) => 1 + l * 0.12 },
  { id: 'time_mgmt', name: '시간관리', icon: '⏰', desc: '마감일 XP +15%/Lv', maxLv: 5, effect: (l: number) => 1 + l * 0.15 },
  { id: 'combo_master', name: '연쇄', icon: '⚡', desc: '콤보 유지 +10%/Lv', maxLv: 5, effect: (l: number) => l * 0.1 },
  { id: 'boss_slayer', name: '보스 슬레이어', icon: '🐉', desc: '보스 보상 +20%/Lv', maxLv: 5, effect: (l: number) => 1 + l * 0.2 },
  { id: 'gem_finder', name: '젬 파인더', icon: '💎', desc: '젬 드롭 +5%/Lv', maxLv: 5, effect: (l: number) => l * 0.05 },
];

export const ACHIEVEMENTS = [
  { id: 'first_quest', name: '첫 걸음', desc: '첫 퀘스트 완료', icon: '🎯', target: 1, type: 'totalCompleted' },
  { id: 'quest_10', name: '퀘스트 마스터', desc: '퀘스트 10개 완료', icon: '⭐', target: 10, type: 'totalCompleted' },
  { id: 'quest_50', name: '퀘스트 전설', desc: '퀘스트 50개 완료', icon: '🌟', target: 50, type: 'totalCompleted' },
  { id: 'quest_100', name: '퀘스트 신화', desc: '퀘스트 100개 완료', icon: '💫', target: 100, type: 'totalCompleted' },
  { id: 'streak_3', name: '3일 연속', desc: '3일 연속 완료', icon: '🔥', target: 3, type: 'streak' },
  { id: 'streak_7', name: '일주일 전사', desc: '7일 연속 완료', icon: '⚡', target: 7, type: 'streak' },
  { id: 'streak_30', name: '한 달의 끈기', desc: '30일 연속 완료', icon: '💪', target: 30, type: 'streak' },
  { id: 'level_5', name: '성장하는 모험가', desc: '레벨 5 달성', icon: '📈', target: 5, type: 'level' },
  { id: 'level_10', name: '영웅의 길', desc: '레벨 10 달성', icon: '🏅', target: 10, type: 'level' },
  { id: 'level_20', name: '전설의 반열', desc: '레벨 20 달성', icon: '👑', target: 20, type: 'level' },
  { id: 'hard_5', name: '어려움 정복자', desc: '어려움 5개 완료', icon: '💎', target: 5, type: 'hardCompleted' },
  { id: 'legendary_1', name: '전설의 사냥꾼', desc: '전설 1개 완료', icon: '🐉', target: 1, type: 'legendaryCompleted' },
  { id: 'boss_1', name: '보스 처치', desc: '보스 1회 처치', icon: '⚔️', target: 1, type: 'bossCompleted' },
  { id: 'boss_10', name: '보스 슬레이어', desc: '보스 10회 처치', icon: '🗡️', target: 10, type: 'bossCompleted' },
  { id: 'combo_5', name: '콤보 마스터', desc: 'x5 콤보 달성', icon: '🔗', target: 5, type: 'maxCombo' },
  { id: 'combo_10', name: '연쇄의 제왕', desc: 'x10 콤보 달성', icon: '⚡', target: 10, type: 'maxCombo' },
  { id: 'daily_5', name: '일일 도전자', desc: '일일 도전 5회 완료', icon: '📜', target: 5, type: 'dailyCompleted' },
  { id: 'coins_500', name: '재벌', desc: '코인 500개 누적', icon: '🏦', target: 500, type: 'totalCoins' },
  { id: 'gems_10', name: '보석 수집가', desc: '젬 10개 누적', icon: '💎', target: 10, type: 'totalGems' },
  { id: 'skills_5', name: '스킬 마스터', desc: '스킬 5개 포인트 투자', icon: '⚡', target: 5, type: 'totalSkillPoints' },
];

export const SHOP_ITEMS: Array<{ id: string; name: string; icon: string; price: number; type: string; value: string; effect?: string }> = [
  { id: 'avatar_1', name: '전사', icon: '⚔️', price: 50, type: 'avatar', value: '⚔️' },
  { id: 'avatar_2', name: '방패', icon: '🛡️', price: 50, type: 'avatar', value: '🛡️' },
  { id: 'avatar_3', name: '궁수', icon: '🏹', price: 50, type: 'avatar', value: '🏹' },
  { id: 'avatar_4', name: '엘프', icon: '🧝', price: 80, type: 'avatar', value: '🧝' },
  { id: 'avatar_5', name: '히어로', icon: '🦸', price: 80, type: 'avatar', value: '🦸' },
  { id: 'avatar_6', name: '드래곤', icon: '🐉', price: 150, type: 'avatar', value: '🐉' },
  { id: 'avatar_7', name: '왕관', icon: '👑', price: 200, type: 'avatar', value: '👑' },
  { id: 'pet_cat', name: '행운의 고양이', icon: '🐱', price: 100, type: 'pet', value: '🐱', effect: 'XP +5%' },
  { id: 'pet_dog', name: '충직한 강아지', icon: '🐶', price: 100, type: 'pet', value: '🐶', effect: '코인 +5%' },
  { id: 'pet_dragon', name: '미니 드래곤', icon: '🐲', price: 250, type: 'pet', value: '🐲', effect: 'XP +10%' },
  { id: 'pet_phoenix', name: '불사조', icon: '🦅', price: 400, type: 'pet', value: '🦅', effect: '전체 +8%' },
  { id: 'theme_blue', name: '파란 테마', icon: '🔵', price: 80, type: 'theme', value: '#2980b9' },
  { id: 'theme_red', name: '빨강 테마', icon: '🔴', price: 80, type: 'theme', value: '#c0392b' },
  { id: 'theme_green', name: '초록 테마', icon: '🟢', price: 80, type: 'theme', value: '#27ae60' },
  { id: 'theme_pink', name: '분홍 테마', icon: '🩷', price: 80, type: 'theme', value: '#e84393' },
  { id: 'theme_gold', name: '골드 테마', icon: '🟡', price: 150, type: 'theme', value: '#f39c12' },
];

export const DAILY_CHALLENGES: DailyChallenge[] = [
  { id: 'c2', desc: '퀘스트 2개 완료', icon: '📋', target: 2, type: 'dailyComplete', reward: { xp: 40, coins: 15 } },
  { id: 'c3', desc: '퀘스트 3개 완료', icon: '📋', target: 3, type: 'dailyComplete', reward: { xp: 60, coins: 25 } },
  { id: 'c5', desc: '퀘스트 5개 완료', icon: '📋', target: 5, type: 'dailyComplete', reward: { xp: 100, coins: 40 } },
  { id: 'h1', desc: '어려움 이상 1개 완료', icon: '🔴', target: 1, type: 'dailyHard', reward: { xp: 50, coins: 20 } },
  { id: 's1', desc: '오늘 스트릭 달성', icon: '🔥', target: 1, type: 'dailyStreak', reward: { xp: 30, coins: 10 } },
  { id: 'l1', desc: '전설 퀘스트 1개 완료', icon: '🟣', target: 1, type: 'dailyLegendary', reward: { xp: 120, coins: 60, gems: 1 } },
];

export const BOSS_QUESTS: BossQuest[] = [
  { name: '슬라임 킹', icon: '🟢', desc: '아무 퀘스트 2개를 10분 내에!', time: 600, req: { type: 'any', count: 2 }, reward: { xp: 150, coins: 50, gems: 1 } },
  { name: '거대 골렘', icon: '🗿', desc: '보통 이상 2개를 20분 내에!', time: 1200, req: { type: 'medium', count: 2 }, reward: { xp: 250, coins: 80, gems: 2 } },
  { name: '그림자 군주', icon: '👤', desc: '퀘스트 3개를 15분 내에!', time: 900, req: { type: 'any', count: 3 }, reward: { xp: 200, coins: 60, gems: 1 } },
  { name: '드래곤 로드', icon: '🐉', desc: '어려움 1개를 15분 내에!', time: 900, req: { type: 'hard', count: 1 }, reward: { xp: 400, coins: 150, gems: 3 } },
  { name: '카오스 타이탄', icon: '💀', desc: '어려움 3개를 30분 내에!', time: 1800, req: { type: 'hard', count: 3 }, reward: { xp: 500, coins: 200, gems: 4 } },
];

export function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export function getXPForLevel(lv: number) {
  return Math.floor(100 * Math.pow(1.3, lv - 1));
}

export function getTitle(lv: number) {
  let t = '견습생';
  for (const x of TITLES) if (lv >= x.level) t = x.title;
  return t;
}

export function getSkillEffect(id: string, skills: Record<string, number>) {
  const s = SKILLS.find((x) => x.id === id);
  return s ? s.effect(skills[id] || 0) : 1;
}

function getComboMultiplier(combo: number) {
  return Math.round((1 + Math.floor(combo / 3) * 0.5) * 10) / 10;
}

function defaultState() {
  return {
    tasks: [] as Task[],
    xp: 0,
    level: 1,
    coins: 0,
    totalCoins: 0,
    gems: 0,
    totalGems: 0,
    streak: 0,
    lastCompletedDate: null as string | null,
    totalCompleted: 0,
    hardCompleted: 0,
    legendaryCompleted: 0,
    bossCompleted: 0,
    maxCombo: 0,
    dailyCompleted: 0,
    totalSkillPoints: 0,
    combo: 0,
    lastComboTime: null as number | null,
    unlockedAchievements: [] as string[],
    ownedItems: [] as string[],
    avatar: '🧙',
    pet: null as string | null,
    themeColor: null as string | null,
    skills: {} as Record<string, number>,
    skillPoints: 0,
    dailyChallengeId: null as string | null,
    dailyProgress: 0,
    dailyDate: null as string | null,
    dailyClaimed: false,
    bossQuest: null as BossQuest | null,
    bossStartTime: null as number | null,
    bossProgress: {} as Record<string, boolean>,
    attendance: [] as string[],
    lastAttendance: null as string | null,
    heatmap: {} as Record<string, number>,
    logs: [] as LogEntry[],
    tutorialSeen: false,
    levelUpPending: false,
  };
}

function loadPersistedState() {
  if (typeof window === 'undefined') return defaultState();
  try {
    const s = localStorage.getItem('questRPG2');
    if (s) return { ...defaultState(), ...JSON.parse(s) };
  } catch { /* empty */ }
  return defaultState();
}

function persistState(s: QuestState) {
  if (typeof window !== 'undefined') {
    const { levelUpPending: _, ...rest } = s;
    void _;
    localStorage.setItem('questRPG2', JSON.stringify(rest));
  }
}

function makeLog(msg: string, cls: string): LogEntry {
  return { msg, cls, time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) };
}

export const useQuestStore = create<QuestState>((set, get) => {
  const init = loadPersistedState();
  const today = todayStr();
  if (init.dailyDate !== today) {
    const seed = parseInt(today.replace(/-/g, ''));
    const idx = seed % DAILY_CHALLENGES.length;
    init.dailyChallengeId = DAILY_CHALLENGES[idx].id;
    init.dailyProgress = 0;
    init.dailyDate = today;
    init.dailyClaimed = false;
  }

  return {
    ...init,

    addTask: (name: string, difficulty: string, dueDate: string | null) => {
      const task: Task = {
        id: Date.now(),
        name,
        difficulty: difficulty as Task['difficulty'],
        dueDate,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      set((s) => {
        const next = { ...s, tasks: [task, ...s.tasks], logs: [makeLog(`📋 새 퀘스트: ${name}`, ''), ...s.logs].slice(0, 50) };
        persistState(next);
        return next;
      });
    },

    toggleTask: (id: number) => {
      const state = get();
      const task = state.tasks.find((t: Task) => t.id === id);
      if (!task) return;

      if (!task.completed) {
        const cm = getComboMultiplier(state.combo);
        const focusEff = getSkillEffect('focus', state.skills);
        const timeEff = task.dueDate ? getSkillEffect('time_mgmt', state.skills) : 1;
        const petMult = state.pet === '🐱' ? 1.05 : state.pet === '🐲' ? 1.1 : state.pet === '🦅' ? 1.08 : 1;
        const baseXP = XP_TABLE[task.difficulty];
        const finXP = Math.floor(baseXP * cm * focusEff * timeEff * petMult);
        const coinMult = getSkillEffect('coin_master', state.skills) * (state.pet === '🐶' ? 1.05 : state.pet === '🦅' ? 1.08 : 1);
        const finCoins = Math.floor(COIN_TABLE[task.difficulty] * coinMult);

        const now = Date.now();
        const comboWindow = 120000 + getSkillEffect('combo_master', state.skills) * 60000;
        const newCombo = state.lastComboTime && now - state.lastComboTime < comboWindow ? state.combo + 1 : 1;
        const newMaxCombo = Math.max(state.maxCombo, newCombo);

        let newXP = state.xp + finXP;
        let newLevel = state.level;
        let newSP = state.skillPoints;
        let didLevelUp = false;
        while (newXP >= getXPForLevel(newLevel)) {
          newXP -= getXPForLevel(newLevel);
          newLevel++;
          newSP++;
          didLevelUp = true;
        }

        const today2 = todayStr();
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        let newStreak = state.streak;
        if (state.lastCompletedDate !== today2) {
          newStreak = state.lastCompletedDate === yesterday ? state.streak + 1 : 1;
        }

        const newLogs = [makeLog(`✅ 퀘스트 완료: ${task.name} (+${finXP}XP)`, 'log-good'), ...state.logs].slice(0, 50);

        // Check daily
        let dp = state.dailyProgress;
        let dc = state.dailyClaimed;
        let dcomp = state.dailyCompleted;
        const dailyCh = DAILY_CHALLENGES.find((d) => d.id === state.dailyChallengeId);
        if (dailyCh && !dc) {
          let inc = false;
          if (dailyCh.type === 'dailyComplete') inc = true;
          else if (dailyCh.type === 'dailyHard') inc = task.difficulty === 'hard' || task.difficulty === 'legendary';
          else if (dailyCh.type === 'dailyLegendary') inc = task.difficulty === 'legendary';
          else if (dailyCh.type === 'dailyStreak') inc = true;
          if (inc) {
            dp++;
            if (dp >= dailyCh.target) {
              dc = true;
              dcomp++;
            }
          }
        }

        // Check boss
        let bq = state.bossQuest;
        let bst = state.bossStartTime;
        let bp = { ...state.bossProgress };
        let bossC = state.bossCompleted;
        if (bq && bst) {
          const req = bq.req;
          let match = req.type === 'any' ||
            (req.type === 'medium' && ['medium', 'hard', 'legendary'].includes(task.difficulty)) ||
            (req.type === 'hard' && ['hard', 'legendary'].includes(task.difficulty)) ||
            (req.type === 'legendary' && task.difficulty === 'legendary');
          if (match) {
            const key = task.difficulty + '_' + task.id;
            if (!bp[key]) {
              bp[key] = true;
              if (Object.keys(bp).length >= req.count) {
                bossC++;
                bq = null;
                bst = null;
                bp = {};
              }
            }
          }
        }

        // Boss spawn check
        if (!bq && state.totalCompleted + 1 >= 3 && Math.random() > 0.7) {
          bq = BOSS_QUESTS[Math.floor(Math.random() * BOSS_QUESTS.length)];
          bst = Date.now();
          bp = {};
        }

        // Check achievements
        const newTotalCompleted = state.totalCompleted + 1;
        const newHardCompleted = state.hardCompleted + (['hard', 'legendary'].includes(task.difficulty) ? 1 : 0);
        const newLegendaryCompleted = state.legendaryCompleted + (task.difficulty === 'legendary' ? 1 : 0);
        const newUnlocked = [...state.unlockedAchievements];
        const statMap: Record<string, number> = {
          totalCompleted: newTotalCompleted, streak: newStreak, level: newLevel,
          hardCompleted: newHardCompleted, legendaryCompleted: newLegendaryCompleted,
          totalCoins: state.totalCoins + finCoins, totalGems: state.totalGems,
          bossCompleted: bossC, maxCombo: newMaxCombo, dailyCompleted: dcomp,
          totalSkillPoints: state.totalSkillPoints,
        };
        for (const ach of ACHIEVEMENTS) {
          if (newUnlocked.includes(ach.id)) continue;
          const cur = statMap[ach.type] ?? 0;
          if (cur >= ach.target) newUnlocked.push(ach.id);
        }

        set({
          tasks: state.tasks.map((t: Task) => (t.id === id ? { ...t, completed: true, completedAt: new Date().toISOString() } : t)),
          xp: newXP, level: newLevel, skillPoints: newSP, coins: state.coins + finCoins,
          totalCoins: state.totalCoins + finCoins, streak: newStreak, lastCompletedDate: today2,
          totalCompleted: newTotalCompleted, hardCompleted: newHardCompleted,
          legendaryCompleted: newLegendaryCompleted, combo: newCombo, lastComboTime: now,
          maxCombo: newMaxCombo, heatmap: { ...state.heatmap, [today2]: (state.heatmap[today2] || 0) + 1 },
          logs: newLogs, dailyProgress: dp, dailyClaimed: dc, dailyCompleted: dcomp,
          bossQuest: bq, bossStartTime: bst, bossProgress: bp, bossCompleted: bossC,
          unlockedAchievements: newUnlocked, levelUpPending: didLevelUp,
        });
        persistState(get());
      } else {
        const next = { ...state, tasks: state.tasks.map((t: Task) => (t.id === id ? { ...t, completed: false } : t)) };
        set(next);
        persistState(next);
      }
    },

    deleteTask: (id: number) => {
      set((s) => {
        const next = { ...s, tasks: s.tasks.filter((t: Task) => t.id !== id) };
        persistState(next);
        return next;
      });
    },

    upgradeSkill: (id: string) => {
      const state = get();
      const sk = SKILLS.find((s) => s.id === id);
      if (!sk) return;
      const lv = state.skills[id] || 0;
      if (lv >= sk.maxLv || state.skillPoints <= 0) return;
      const next = {
        ...state,
        skills: { ...state.skills, [id]: lv + 1 },
        skillPoints: state.skillPoints - 1,
        totalSkillPoints: state.totalSkillPoints + 1,
        logs: [makeLog(`⚡ 스킬: ${sk.name} Lv.${lv + 1}`, 'log-good'), ...state.logs].slice(0, 50),
      };
      set(next);
      persistState(next);
    },

    buyItem: (itemId: string) => {
      const item = SHOP_ITEMS.find((i) => i.id === itemId);
      if (!item) return;
      const state = get();
      if (state.ownedItems.includes(itemId) || state.coins < item.price) return;
      const updates: Partial<QuestState> = {
        coins: state.coins - item.price,
        ownedItems: [...state.ownedItems, itemId],
        logs: [makeLog(`🛒 구매: ${item.name}`, 'log-good'), ...state.logs].slice(0, 50),
      };
      if (item.type === 'avatar') updates.avatar = item.value;
      else if (item.type === 'pet') updates.pet = item.value;
      else if (item.type === 'theme') updates.themeColor = item.value;
      const next = { ...state, ...updates };
      set(next);
      persistState(next);
    },

    claimAttendance: () => {
      const today2 = todayStr();
      const state = get();
      if (state.lastAttendance === today2) return;
      const att = state.attendance.includes(today2) ? state.attendance : [...state.attendance, today2];
      const c = att.length;
      let coins = 10, xp = 20, gems = 0;
      if (c % 7 === 0) { coins = 50; xp = 100; gems = 2; }
      else if (c % 3 === 0) { coins = 25; xp = 50; gems = 1; }
      const next = {
        ...state, lastAttendance: today2, attendance: att,
        coins: state.coins + coins, totalCoins: state.totalCoins + coins,
        gems: state.gems + gems, totalGems: state.totalGems + gems,
        xp: state.xp + xp,
        logs: [makeLog(`📅 출석 ${c}일 연속!`, 'log-great'), ...state.logs].slice(0, 50),
      };
      set(next);
      persistState(next);
    },

    setTutorialSeen: () => {
      const next = { ...get(), tutorialSeen: true };
      set(next);
      persistState(next);
    },

    tickBoss: () => {
      const state = get();
      if (!state.bossQuest || !state.bossStartTime) return;
      if (Math.floor((Date.now() - state.bossStartTime) / 1000) >= state.bossQuest.time) {
        const next = {
          ...state, bossQuest: null, bossStartTime: null, bossProgress: {},
          logs: [makeLog('💀 보스 실패...', 'log-bad'), ...state.logs].slice(0, 50),
        };
        set(next);
        persistState(next);
      }
    },

    clearLevelUp: () => {
      set({ ...get(), levelUpPending: false });
    },
  };
});