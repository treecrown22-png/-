 import { create } from 'zustand';

let _nextId = Date.now();
function nextExpenseId(): number {
  return ++_nextId;
}

export interface NightEatRecord {
  id: number;
  food: string;
  quantity: string;
  time: string;
  reason: string;
  emotion: string;
  date: string;
}

export interface Expense {
  id: number;
  name: string;
  amount: number;
  category: string;
  memo: string;
  date: string;
  time: string;
}

export interface Building {
  id: string;
  level: number;
}

export interface Evolution {
  name: string;
  icon: string;
}

// 시민 캐릭터 스탯
export interface Citizen {
  id: string;
  name: string;
  icon: string;
  stats: {
    cooking: number;    // 요리 (0-10)
    cleaning: number;   // 청소 (0-10)
    service: number;    // 서비스 (0-10)
    luck: number;       // 운 (0-10)
    charm: number;      // 매력 (0-10)
  };
  assignedBuilding: string | null;
  hired: boolean;
}

// 도둑 이벤트 상태
export interface ThiefEvent {
  buildingId: string;
  damage: number;       // 복구 비용
  active: boolean;
}

export interface AccountState {
  expenses: Expense[];
  coins: number;
  gems: number;
  streak: number;
  nightStreak: number;
  lastNightCheck: string | null;
  lastNightEat: string | null;
  totalRecords: number;
  stickers: string[];
  drawProgress: number;
  buildings: Building[];
  citizens: number;
  citizenList: Citizen[];
  villageLevel: number;
  monthlyOtaku: number;
  monthlyOtakuMonth: number;
  nightCheckHistory: Record<string, boolean>;
  lastOpenDate: string | null;
  praisedToday: boolean;
  nightEatRecords: NightEatRecord[];
  thiefEvent: ThiefEvent | null;
  reducedCategories: string[];

  addExpense: (name: string, amount: number, category: string, memo?: string) => void;
  addExpenseNoBuilding: (name: string, amount: number, category: string, memo?: string) => void;
  levelUpBuildingForCategory: (category: string) => void;
  editExpense: (id: number, name: string, amount: number, category: string, memo?: string) => void;
  deleteExpense: (id: number) => void;
  drawSticker: () => void;
  buyBuilding: (id: string) => void;
  recordNightEat: () => void;
  recordNightEatWithDetails: (food: string, quantity: string, time: string, reason: string, emotion: string) => void;
  checkNightSnack: () => void;
  generateCitizen: () => Citizen | null;
  hireCitizen: (citizenId: string) => void;
  assignCitizen: (citizenId: string, buildingId: string) => void;
  fireCitizen: (citizenId: string) => void;
  dismissCitizen: (citizenId: string) => void;
  toggleReducedCategory: (category: string) => void;
  triggerThiefEvent: () => void;
  forceThiefEvent: () => void;
  repairBuilding: () => void;
  addCoins: (amount: number) => void;
  recordWork: (name: string, amount: number, memo?: string) => void;
}

export const MAX_BUILDING_LEVEL = 5;

export const CATEGORIES: Record<string, { name: string; icon: string; color: string; cls: string; keywords: string[] }> = {
  restaurant: { name: '식당', icon: '🍽️', color: '#D4956B', cls: 'cat-food', keywords: ['김밥','밥','식사','점심','저녁','아침','치킨','피자','빵','라면','국밥','분식','고기','회','초밥','떡볶이','마라탕','짬뽕','탕수육','칼국수','비빔밥','정식','백반','우동','덮밥','카레','파스타','스테이크','삼겹살','닭갈비','불고기','갈비','족발','보쌈','설렁탕','곰탕','된장찌개','김치찌개','순두부찌개','부대찌개'] },
  convenience: { name: '편의점', icon: '🏪', color: '#8EBB8E', cls: 'cat-convenience', keywords: ['편의점','GS25','CU','세븐일레븐','이마트24','미니ストップ','PB','도시락','삼각김밥','컵라면','과자','음료수','생수','우유','계란','햄','소시지'] },
  cafe: { name: '카페', icon: '☕', color: '#C9A961', cls: 'cat-cafe', keywords: ['카페','커','스타벅스','투썸','이디야','메가','컴포즈','할메니','음료','주스','스무디','베이커리'] },
  beauty: { name: '뷰티', icon: '💄', color: '#E8B5B5', cls: 'cat-beauty', keywords: ['올리브영','올영','세화','뷰티','화장품','스킨케어','선크림','립','파운데이션','쿠션','마스크팩'] },
  transport: { name: '교통', icon: '🚇', color: '#A5CCE0', cls: 'cat-transport', keywords: ['지하철','버스','택시','카카오T','티머니','교통','KTX','SRT','기차','주유소','주차'] },
  otaku: { name: '덕질', icon: '🎭', color: '#C4A0C7', cls: 'cat-otaku', keywords: ['굿즈','키링','포카','앨범','티셔츠','_md','콜라보','한정','위츄','엔시티위시','nct wish','nctwish','wish','포켓몬','피카츄','캐릭터','애니','피규어','아크릴','스티커','띠부띠부','일회용 카메라','필름 카메라','기획팩','특전','랜덤','덕질'] },
  shopping: { name: '쇼핑', icon: '🛍️', color: '#D4A878', cls: 'cat-shopping', keywords: ['쿠팡','네이버','쇼핑','옷','신발','가방','전자','기기','액세서리','다이소','무인'] },
  health: { name: '건강', icon: '💪', color: '#8AAA8A', cls: 'cat-health', keywords: ['헬스','운동','병원','치과','안과','건강','보약','한약'] },
  pharmacy: { name: '약국', icon: '💊', color: '#88CC88', cls: 'cat-pharmacy', keywords: ['약','약국','처방','조제','의약품','상비약','진통제','감기약','소화제','영양제','비타민'] },
  leisure: { name: '여가', icon: '🎬', color: '#B8B8E8', cls: 'cat-leisure', keywords: ['영화','CGV','LOTTE','맥도날드','노래방','게임','놀이공원','테마파크','볼링','당구','PC방','컴퓨터','콘서트','공연','전시','뮤지컬'] },
  gift: { name: '선물', icon: '🎁', color: '#F0A0B0', cls: 'cat-gift', keywords: ['선물','꽃배달','생일','기념일','졸업식','입학식','어버이날','스승의날','발렌타인','화이트데이','추석','설날','선물하기','기프티콘'] },
  travel: { name: '여행', icon: '✈️', color: '#88CCEE', cls: 'cat-travel', keywords: ['항공','비행기','호텔','숙박','에어비앤비','여행','패키지','해외','국내여행','게스트하우스','리조트'] },
  work: { name: '근무', icon: '💼', color: '#FFD700', cls: 'cat-work', keywords: ['알바','근무','출근','퇴근','월급','급여','시급','일당','주급','연봉','인센티브','보너스','수당','야간수당','잔업'] },
  etc: { name: '기타', icon: '', color: '#A09880', cls: 'cat-etc', keywords: [] },
};

export const STICKERS = [
  { id: 'pikachu', name: '피카츄', icon: '', rarity: 'common' },
  { id: 'charmander', name: '리자몽', icon: '🔥', rarity: 'common' },
  { id: 'squirtle', name: '꼬부기', icon: '💧', rarity: 'common' },
  { id: 'bulbasaur', name: '이상해씨', icon: '🌿', rarity: 'common' },
  { id: 'jigglypuff', name: '푸린', icon: '', rarity: 'common' },
  { id: 'eevee', name: '이브이', icon: '🦊', rarity: 'rare' },
  { id: 'snorlax', name: '잠만보', icon: '', rarity: 'rare' },
  { id: 'dragonite', name: '망나뇽', icon: '🐉', rarity: 'rare' },
  { id: 'mew', name: '뮤', icon: '✨', rarity: 'epic' },
  { id: 'lucario', name: '루카리오', icon: '🥊', rarity: 'epic' },
  { id: 'gardevoir', name: '가디안', icon: '💃', rarity: 'epic' },
  { id: 'mimikyu', name: '따라큐', icon: '👻', rarity: 'epic' },
  { id: 'wichu1', name: '위츄 하트', icon: '💚', rarity: 'common' },
  { id: 'wichu2', name: '위츄 스타', icon: '⭐', rarity: 'common' },
  { id: 'wichu3', name: '위츄 윙크', icon: '😉', rarity: 'rare' },
  { id: 'wichu4', name: '위츄 브이', icon: '️', rarity: 'rare' },
  { id: 'wichu5', name: '위 골드', icon: '👑', rarity: 'epic' },
  { id: 'wichu6', name: '위츄 레인보우', icon: '🌈', rarity: 'legendary' },
  { id: 'pika_gold', name: '골드 피카츄', icon: '🌟', rarity: 'legendary' },
  { id: 'pika_flying', name: '날아다니는 피카츄', icon: '🎈', rarity: 'legendary' },
  { id: 'wichu_special', name: '위츄 스페셜', icon: '💫', rarity: 'legendary' },
  { id: 'pika_rainbow', name: '무지개 피카츄', icon: '🦄', rarity: 'legendary' },
  { id: 'heart', name: '하트', icon: '❤️', rarity: 'common' },
  { id: 'star', name: '별', icon: '🌟', rarity: 'common' },
  { id: 'flower', name: '꽃', icon: '', rarity: 'common' },
  { id: 'cat', name: '고양이', icon: '🐱', rarity: 'common' },
  { id: 'dog', name: '강아지', icon: '🐶', rarity: 'common' },
  { id: 'rabbit', name: '토끼', icon: '🐰', rarity: 'rare' },
  { id: 'panda', name: '판다', icon: '🐼', rarity: 'rare' },
  { id: 'unicorn', name: '유니콘', icon: '🦄', rarity: 'epic' },
  { id: 'phoenix', name: '불사조', icon: '', rarity: 'epic' },
];

// 건물 정의 + 레벨별 진화 데이터 (LV1~LV5)
// 각 건물은 고유한 아이콘을 가짐 (중복 없음)
export const BUILDINGS: Array<{ id: string; name: string; icon: string; cost: number; income: number; evolutions: Evolution[] }> = [
  { id: 'convenience', name: '편의점', icon: '🏪', cost: 0, income: 5, evolutions: [
    { name: '편의점', icon: '🏪' }, { name: '마트', icon: '🛒' }, { name: '슈퍼마켓', icon: '🏬' }, { name: '메가마트', icon: '🏗' }, { name: '유왕국', icon: '🏙' },
  ]},
  { id: 'cafe', name: '카페', icon: '☕', cost: 100, income: 8, evolutions: [
    { name: '카페', icon: '☕' }, { name: '티하우스', icon: '🍵' }, { name: '디저트 궁전', icon: '' }, { name: '카페 제국', icon: '👑' }, { name: '맛의 성소', icon: '🏰' },
  ]},
  { id: 'restaurant', name: '식당', icon: '️', cost: 200, income: 12, evolutions: [
    { name: '식당', icon: '🍽️' }, { name: '레스토랑', icon: '🍳' }, { name: '파인 다이닝', icon: '🥘' }, { name: '미슐랭 식당', icon: '⭐' }, { name: '요리 전당', icon: '🏯' },
  ]},
  { id: 'beauty_shop', name: '뷰티샵', icon: '💄', cost: 300, income: 15, evolutions: [
    { name: '뷰티샵', icon: '💄' }, { name: '에스테 살롱', icon: '💅' }, { name: '뷰티 스파', icon: '🧖' }, { name: '미의 전당', icon: '👸' }, { name: '아프로디테 신전', icon: '' },
  ]},
  { id: 'station', name: '역', icon: '🚉', cost: 350, income: 12, evolutions: [
    { name: '역', icon: '🚉' }, { name: '기차역', icon: '🚂' }, { name: '고속철역', icon: '🚄' }, { name: '교통 허브', icon: '🚅' }, { name: '마법 관문', icon: '🌐' },
  ]},
  { id: 'hospital', name: '병원', icon: '🏥', cost: 400, income: 14, evolutions: [
    { name: '병원', icon: '🏥' }, { name: '클리닉', icon: '💊' }, { name: '종합병원', icon: '' }, { name: '메디컬 센터', icon: '🧬' }, { name: '치유의 신전', icon: '✨' },
  ]},
  { id: 'pharmacy', name: '약국', icon: '💊', cost: 350, income: 13, evolutions: [
    { name: '약국', icon: '💊' }, { name: '조제약국', icon: '🧪' }, { name: '메디컬 약국', icon: '⚕️' }, { name: '약학 연구소', icon: '🔬' }, { name: '생명의 약방', icon: '🌿' },
  ]},
  { id: 'piggybank', name: '저금통', icon: '🐷', cost: 0, income: 3, evolutions: [
    { name: '저금통', icon: '🐷' }, { name: '금고', icon: '🔒' }, { name: '은행', icon: '🏦' }, { name: '투자 회사', icon: '📈' }, { name: '금융 제국', icon: '💎' },
  ]},
  { id: 'gym', name: '헬스장', icon: '💪', cost: 450, income: 16, evolutions: [
    { name: '헬스장', icon: '💪' }, { name: '피트니스 센터', icon: '🏋️' }, { name: '스포츠 컴플렉스', icon: '' }, { name: '스포츠센터', icon: '🏟' }, { name: '전사의 성역', icon: '⚔️' },
  ]},
  { id: 'cinema', name: '영화관', icon: '🎬', cost: 500, income: 18, evolutions: [
    { name: '영화관', icon: '🎬' }, { name: '멀티플렉스', icon: '🎥' }, { name: 'IMAX 극장', icon: '📽️' }, { name: '엔터테인먼트 센터', icon: '' }, { name: '환상의 전당', icon: '🎪' },
  ]},
  { id: 'otaku_shop', name: '취미의 전당', icon: '', cost: 600, income: 22, evolutions: [
    { name: '취미의 전당', icon: '' }, { name: '컬렉션 홀', icon: '🏰' }, { name: '덕후 성지', icon: '⛩️' }, { name: '서브컬처 제국', icon: '🌟' }, { name: '창조 전당', icon: '🔮' },
  ]},
  { id: 'department', name: '백화점', icon: '', cost: 800, income: 28, evolutions: [
    { name: '백화점', icon: '🏬' }, { name: '쇼핑몰', icon: '🛍️' }, { name: '메가 쇼핑몰', icon: '🏢' }, { name: '쇼핑 왕국', icon: '👑' }, { name: '상업 제국', icon: '💎' },
  ]},
  { id: 'gift_shop', name: '기적의 선물상자', icon: '🎁', cost: 550, income: 20, evolutions: [
    { name: '기적의 선물상자', icon: '🎁' }, { name: '소원 공방', icon: '🎀' }, { name: '축복의 보물상자', icon: '💝' }, { name: '기적의 원', icon: '🌈' }, { name: '마법의 선물 전당', icon: '🔮' },
  ]},
  { id: 'airport', name: '공항', icon: '✈️', cost: 1200, income: 35, evolutions: [
    { name: '공항', icon: '✈️' }, { name: '국제공항', icon: '🛫' }, { name: '항공 허브', icon: '🛬' }, { name: '스카이 포트', icon: '🌤️' }, { name: '하늘 제국', icon: '️' },
  ]},
  { id: 'port', name: '항구', icon: '⚓', cost: 1000, income: 30, evolutions: [
    { name: '항구', icon: '' }, { name: '무역항', icon: '🚢' }, { name: '크루즈 터미널', icon: '🛳️' }, { name: '해양 기지', icon: '🌊' }, { name: '바다의 성채', icon: '🏰' },
  ]},
  { id: 'portal', name: '마법진', icon: '', cost: 1800, income: 45, evolutions: [
    { name: '마법진', icon: '🌀' }, { name: '차원의 문', icon: '🔮' }, { name: '포탈 게이트', icon: '⚡' }, { name: '공간 이동기', icon: '💫' }, { name: '우주의 관문', icon: '🌌' },
  ]},
  { id: 'tower', name: '마법의 탑', icon: '🗼', cost: 2500, income: 60, evolutions: [
    { name: '마법의 탑', icon: '🗼' }, { name: '마법사의 탑', icon: '🏰' }, { name: '현자의 탑', icon: '🔯' }, { name: '대마법사의 성', icon: '👑' }, { name: '신들의 전당', icon: '️' },
  ]},
];

// 레벨에 따른 건물 진화 정보 반환
export function getBuildingEvolution(buildingId: string, level: number): Evolution {
  const building = BUILDINGS.find(b => b.id === buildingId);
  if (!building) return { name: buildingId, icon: '' };
  const idx = Math.max(0, Math.min(level - 1, building.evolutions.length - 1));
  return building.evolutions[idx];
}

export const CATEGORY_BUILDING_MAP: Record<string, string> = {
  restaurant: 'restaurant',
  convenience: 'convenience',
  cafe: 'cafe',
  beauty: 'beauty_shop',
  transport: 'station',
  otaku: 'otaku_shop',
  shopping: 'department',
  health: 'gym',
  pharmacy: 'pharmacy',
  leisure: 'cinema',
  gift: 'gift_shop',
  travel: 'airport',
  work: 'piggybank',
};

export const PRAISE_MESSAGES = [
  '어제 야식 안 먹었구나! 의지력이 점점 강해지고 있는 게 느껴져. 정말 대단해! 🧡',
  '또 참았구나! 너는 정말 강한 사람이야. 내가 다 뿌듯해! ⭐',
  '하루하루 성장하는 너의 모습, 내가 항상 보고 있어. 자랑스럽다! 💪',
  '어제도 이겨냈네! 이 흐름이면 곧 완전히 자유로워질 수 있을 거야! 🌟',
  '참는 게 쉽지 않은데, 해냈잖아? 너 진짜 대단한 사람이다! 🏆',
  '오늘도 네 자신을 잘 컨트롤하고 있구나. 이대로 쭉 가보자! 💚',
];
export const NIGHT_EAT_MESSAGES = [
  '기록한 것만으로도 이미 달라지고 있어. 스스로를 돌보려는 마음이 중요해. ',
  '괜찮아, 내일 다시 시작하면 돼. 너의 노력은 절대 사라지지 않아. 💚',
  '기록해줘서 고마워. 알아차리는 것 자체가 큰 변화야. 🌱',
  '오늘은 좀 힘들었구나. 내일은 좀 더 편한 하루가 되길 바라. ☀️',
];
export const MIND_CARE_MESSAGES = [
  '오늘 하루도 수고했어. 너는 충분히 잘하고 있어. 🧡',
  '쉬어도 돼. 멈춰도 돼. 중요한 건 다시 일어나는 거야. 💚',
  '너의 감정은 모두 소중해. 슬퍼도, 기뻐도, 다 괜찮아. 🌈',
  '혼자가 아니야. 내가 항상 여기 있을게. 🤗',
  '작은 성공도 성공이야. 오늘 기록한 것, 다 의미 있어. ',
];
export const HEALTH_TIPS = [
  '💡 가공식품 대신 자연식을 선해보세요. 몸이 가벼워질 거예요!',
  '💡 물을 하루 8잔 마시면 피부도 좋아지고 소비도 줄어요.',
  ' 마트 갈 때 리스트를 적어가면 충동구매가 30% 줄어든대요.',
  '💡 간식이 당길 땐 견과류나 과일을 대신 먹어보세요.',
  '💡 한 달 소비를 기록하면 평균 15% 절약할 수 있어요!',
];
export const EVENTS = [
  { title: '덕질 지출 1회 기록 시', desc: '위츄 골드 스티커 획득!', target: 1, type: 'otaku', reward: 'wichu5' },
  { title: '야식 2일 참기', desc: '피카 골드 스티커 획득!', target: 2, type: 'night', reward: 'pika_gold' },
  { title: '기록 3개 달성', desc: '타워 해금!', target: 3, type: 'record', reward: 'tower' },
];

export function todayFn() { return new Date().toISOString().slice(0, 10); }
export function formatMoney(n: number) { return '₩' + n.toLocaleString(); }
export function getCategory(text: string) {
  const lower = text.toLowerCase();
  for (const [key, cat] of Object.entries(CATEGORIES)) {
    if (cat.keywords.some(k => lower.includes(k.toLowerCase()))) return key;
  }
  return 'etc';
}

function defaultAcctState() {
  return {
    expenses: [] as Expense[],
    coins: 0, gems: 0, streak: 0, nightStreak: 0,
    lastNightCheck: null as string | null,
    lastNightEat: null as string | null,
    totalRecords: 0, stickers: [] as string[],
    drawProgress: 0, buildings: [] as Building[],
    citizens: 0, citizenList: [] as Citizen[], villageLevel: 1,
    monthlyOtaku: 0, monthlyOtakuMonth: new Date().getMonth(),
    nightCheckHistory: {} as Record<string, boolean>,
    lastOpenDate: null as string | null,
    praisedToday: false,
    nightEatRecords: [] as NightEatRecord[],
    thiefEvent: null as ThiefEvent | null,
    reducedCategories: [] as string[],
  };
}

function loadAcctState() {
  if (typeof window === 'undefined') return defaultAcctState();
  try {
    const s = localStorage.getItem('pocketAccount');
    if (s) {
      const parsed = JSON.parse(s);
      if (Array.isArray(parsed.buildings) && typeof parsed.buildings[0] === 'string') {
        parsed.buildings = parsed.buildings.map((id: string) => ({ id, level: 1 }));
      }
      if (Array.isArray(parsed.expenses) && parsed.expenses.length > 0) {
        const idMap = new Map<number, number>();
        parsed.expenses.forEach((exp: { id: number }, index: number) => {
          if (idMap.has(exp.id)) {
            parsed.expenses[index] = { ...exp, id: nextExpenseId() };
          } else {
            idMap.set(exp.id, index);
          }
        });
      }
      return { ...defaultAcctState(), ...parsed };
    }
  } catch { /* empty */ }
  return defaultAcctState();
}

function persistAcct(s: AccountState) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('pocketAccount', JSON.stringify({
      expenses: s.expenses, coins: s.coins, gems: s.gems, streak: s.streak,
      nightStreak: s.nightStreak, lastNightCheck: s.lastNightCheck, lastNightEat: s.lastNightEat,
      totalRecords: s.totalRecords, stickers: s.stickers, drawProgress: s.drawProgress,
      buildings: s.buildings, citizens: s.citizens, citizenList: s.citizenList, villageLevel: s.villageLevel,
      monthlyOtaku: s.monthlyOtaku, monthlyOtakuMonth: s.monthlyOtakuMonth,
      nightCheckHistory: s.nightCheckHistory, lastOpenDate: s.lastOpenDate, praisedToday: s.praisedToday,
      nightEatRecords: s.nightEatRecords, thiefEvent: s.thiefEvent, reducedCategories: s.reducedCategories,
    }));
  }
}

// 랜덤 시민 생성
const CITIZEN_NAMES = ['민수', '지영', '철수', '영희', '준호', '수진', '동현', '하늘', '태양', '별이', '구름', '바다', '산들', '하람', '나래'];
const CITIZEN_SURNAMES = ['김', '이', '박', '최', '정', '강', '조', '윤', '장', '임', '한', '오', '서', '신', '권'];
const CITIZEN_ICONS = ['👦', '', '', '👩', '', '👱', '🧒', '', '🤴', '🧙', '🧝', '🧚'];

function generateRandomCitizen(existingNames: string[] = []): Citizen {
  let name = CITIZEN_NAMES[Math.floor(Math.random() * CITIZEN_NAMES.length)];
  const icon = CITIZEN_ICONS[Math.floor(Math.random() * CITIZEN_ICONS.length)];
  
  // 이름 중복 체크: 이미 같은 이름이 있으면 성을 추가
  if (existingNames.includes(name)) {
    const surname = CITIZEN_SURNAMES[Math.floor(Math.random() * CITIZEN_SURNAMES.length)];
    name = `${surname}${name}`;
  }
  
  return {
    id: `citizen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    icon,
    stats: {
      cooking: Math.floor(Math.random() * 11),
      cleaning: Math.floor(Math.random() * 11),
      service: Math.floor(Math.random() * 11),
      luck: Math.floor(Math.random() * 11),
      charm: Math.floor(Math.random() * 11),
    },
    assignedBuilding: null,
    hired: false,
  };
}

function applyBuildingUpdate(buildings: Building[], buildingId: string): Building[] {
  const existing = buildings.find(b => b.id === buildingId);
  if (existing) {
    if (existing.level < MAX_BUILDING_LEVEL) {
      return buildings.map(b => b.id === buildingId ? { ...b, level: b.level + 1 } : b);
    }
    return buildings;
  }
  return [...buildings, { id: buildingId, level: 1 }];
}

export const useAccountStore = create<AccountState>((set, get) => {
  const init = loadAcctState();

  return {
    ...init,

    addExpense: (name, amount, category, memo = '') => {
      set((s) => {
        const expenses = [{ id: nextExpenseId(), name, amount, category, memo, date: todayFn(), time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) }, ...s.expenses];
        const cm = new Date().getMonth();
        let mo = s.monthlyOtaku, mom = s.monthlyOtakuMonth;
        if (category === 'otaku') {
          if (s.monthlyOtakuMonth !== cm) { mo = 1; mom = cm; } else { mo++; }
        }
        const newCoins = s.coins + Math.floor(amount / 1000) + 1;
        const newTotalRecords = s.totalRecords + 1;

        let buildings = [...s.buildings];
        const buildingId = CATEGORY_BUILDING_MAP[category];
        if (buildingId) {
          buildings = applyBuildingUpdate(buildings, buildingId);
        }

        let stickers = [...s.stickers];
        EVENTS.forEach(event => {
          let completed = false;
          if (event.type === 'otaku' && mo >= event.target) completed = true;
          if (event.type === 'record' && newTotalRecords >= event.target) completed = true;
          if (event.type === 'night' && s.nightStreak >= event.target) completed = true;
          if (completed && !stickers.includes(event.reward)) {
            stickers.push(event.reward);
          }
        });

        const villageLevel = Math.floor((buildings.length + 1) / 3) + 1;

        const next: AccountState = {
          ...s, expenses,
          totalRecords: newTotalRecords,
          drawProgress: s.drawProgress + 1,
          coins: newCoins,
          buildings,
          villageLevel,
          stickers,
          monthlyOtaku: mo, monthlyOtakuMonth: mom,
        };
        persistAcct(next);
        return next;
      });
    },

    // 건물 업데이트 없이 지출만 추가 (영수증 스캔용)
    addExpenseNoBuilding: (name, amount, category, memo = '') => {
      set((s) => {
        const expenses = [{ id: nextExpenseId(), name, amount, category, memo, date: todayFn(), time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) }, ...s.expenses];
        const newCoins = s.coins + Math.floor(amount / 1000) + 1;
        const next: AccountState = {
          ...s, expenses,
          totalRecords: s.totalRecords + 1,
          drawProgress: s.drawProgress + 1,
          coins: newCoins,
        };
        persistAcct(next);
        return next;
      });
    },

    // 카테고리별 건물 1회 레벨업 (영수증 저장 후 카테고리당 1회 호출)
    levelUpBuildingForCategory: (category) => {
      set((s) => {
        const buildingId = CATEGORY_BUILDING_MAP[category];
        if (!buildingId) return s;
        let buildings = [...s.buildings];
        buildings = applyBuildingUpdate(buildings, buildingId);
        const villageLevel = Math.floor((buildings.length + 1) / 3) + 1;
        const next = { ...s, buildings, villageLevel };
        persistAcct(next);
        return next;
      });
    },

    editExpense: (id, name, amount, category, memo = '') => {
      const s = get();
      const expenses = s.expenses.map(e => e.id === id ? { ...e, name, amount, category, memo } : e);
      set({ expenses });
    },

    deleteExpense: (id) => {
      const s = get();
      const expenses = s.expenses.filter(e => e.id !== id);
      set({ expenses });
    },

    drawSticker: () => {
      const s = get();
      if (s.drawProgress < 5) return;
      const roll = Math.random() * 100;
      const rarity = roll < 3 ? 'legendary' : roll < 15 ? 'epic' : roll < 40 ? 'rare' : 'common';
      const pool = STICKERS.filter(st => st.rarity === rarity);
      const sticker = pool[Math.floor(Math.random() * pool.length)];
      const isNew = !s.stickers.includes(sticker.id);
      let gems = s.gems, coins = s.coins;
      if (sticker.rarity === 'epic') gems++;
      if (sticker.rarity === 'legendary') { gems += 3; coins += 50; }
      const next: AccountState = {
        ...s,
        drawProgress: s.drawProgress - 5,
        stickers: isNew ? [...s.stickers, sticker.id] : s.stickers,
        gems, coins,
      };
      persistAcct(next);
      set(next);
    },

    buyBuilding: (id) => {
      const b = BUILDINGS.find(x => x.id === id);
      if (!b) return;
      set((s) => {
        if (s.coins < b.cost) return s;
        const existingBuilding = s.buildings.find(bi => bi.id === id);
        let buildings: Building[];
        if (existingBuilding) {
          if (existingBuilding.level >= MAX_BUILDING_LEVEL) return s;
          buildings = s.buildings.map(bi => bi.id === id ? { ...bi, level: bi.level + 1 } : bi);
        } else {
          buildings = [...s.buildings, { id, level: 1 }];
        }
        const next: AccountState = {
          ...s, coins: s.coins - b.cost,
          buildings,
          villageLevel: Math.floor((buildings.length + 1) / 3) + 1,
        };
        persistAcct(next);
        return next;
      });
    },

    recordNightEat: () => {
      set((s) => {
        const next: AccountState = {
          ...s, lastNightEat: new Date().toISOString(), nightStreak: 0, praisedToday: false,
        };
        persistAcct(next);
        return next;
      });
    },

    recordNightEatWithDetails: (food, quantity, time, reason, emotion) => {
      set((s) => {
        const record: NightEatRecord = {
          id: nextExpenseId(),
          food,
          quantity,
          time,
          reason,
          emotion,
          date: todayFn(),
        };
        const next: AccountState = {
          ...s,
          lastNightEat: new Date().toISOString(),
          nightStreak: 0,
          praisedToday: false,
          nightEatRecords: [record, ...s.nightEatRecords].slice(0, 50),
        };
        persistAcct(next);
        return next;
      });
    },

    checkNightSnack: () => {
      const todayStr = todayFn();
      set((s) => {
        if (s.lastOpenDate === todayStr) return s;
        let ns = s.nightStreak;
        const le = s.lastNightEat;
        if (le) {
          const eatDate = new Date(le);
          const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
          ns = eatDate.toISOString().slice(0, 10) === yesterday ? 0 : s.nightStreak + 1;
        } else {
          ns++;
        }
        const next: AccountState = { ...s, lastOpenDate: todayStr, nightStreak: ns };
        persistAcct(next);
        return next;
      });
    },

    // 시민 생성 (고용 가능 슬롯이 있을 때만)
    generateCitizen: () => {
      const s = get();
      const maxCitizens = s.villageLevel * 2; // 마을 레벨 * 2명까지 고용 가능
      const hiredCount = s.citizenList.filter(c => c.hired).length;
      if (hiredCount >= maxCitizens) return null;
      
      const existingNames = s.citizenList.map(c => c.name);
      const newCitizen = generateRandomCitizen(existingNames);
      set((s) => {
        const next = { ...s, citizenList: [...s.citizenList, newCitizen] };
        persistAcct(next);
        return next;
      });
      return newCitizen;
    },

    // 고용 대기 중인 시민 삭제 (퇴출)
    dismissCitizen: (citizenId: string) => {
      set((s) => {
        const citizenList = s.citizenList.filter(c => c.id !== citizenId);
        const next = { ...s, citizenList };
        persistAcct(next);
        return next;
      });
    },

    // 시민 고용
    hireCitizen: (citizenId) => {
      set((s) => {
        const maxCitizens = s.villageLevel * 2;
        const hiredCount = s.citizenList.filter(c => c.hired).length;
        if (hiredCount >= maxCitizens) return s;
        
        const hireCost = 50; // 고용 비용
        if (s.coins < hireCost) return s;
        
        const citizenList = s.citizenList.map(c => 
          c.id === citizenId ? { ...c, hired: true } : c
        );
        const next = { ...s, citizenList, coins: s.coins - hireCost, citizens: hiredCount + 1 };
        persistAcct(next);
        return next;
      });
    },

    // 시민을 건물에 배치
    assignCitizen: (citizenId, buildingId) => {
      set((s) => {
        const citizenList = s.citizenList.map(c => 
          c.id === citizenId ? { ...c, assignedBuilding: buildingId } : c
        );
        const next = { ...s, citizenList };
        persistAcct(next);
        return next;
      });
    },

    // 시민 해고
    fireCitizen: (citizenId) => {
      set((s) => {
        const citizenList = s.citizenList.filter(c => c.id !== citizenId);
        const hiredCount = citizenList.filter(c => c.hired).length;
        const next = { ...s, citizenList, citizens: hiredCount };
        persistAcct(next);
        return next;
      });
    },

    // 지출 줄이고 싶은 카테고리 토글
    toggleReducedCategory: (category) => {
      set((s) => {
        const reducedCategories = s.reducedCategories.includes(category)
          ? s.reducedCategories.filter(c => c !== category)
          : [...s.reducedCategories, category];
        const next = { ...s, reducedCategories };
        persistAcct(next);
        return next;
      });
    },

    // 도둑 이벤트 발생 (20% 확률)
    triggerThiefEvent: () => {
      const s = get();
      if (s.thiefEvent?.active) return; // 이미 도둑 이벤트 진행 중
      
      // 지출 감소 설정된 카테고리 중 건물이 있는 곳만 대상
      const targetBuildings = s.buildings.filter(b => 
        s.reducedCategories.some(cat => CATEGORY_BUILDING_MAP[cat] === b.id)
      );
      
      if (targetBuildings.length === 0) return;
      
      // 20% 확률
      if (Math.random() > 0.2) return;
      
      const target = targetBuildings[Math.floor(Math.random() * targetBuildings.length)];
      const damage = Math.floor(Math.random() * 100) + 50; // 50~150 코인 피해
      
      set((s) => {
        const next = { 
          ...s, 
          thiefEvent: { buildingId: target.id, damage, active: true }
        };
        persistAcct(next);
        return next;
      });
    },

    // 강제로 도둑 이벤트 발생 (테스트용)
    forceThiefEvent: () => {
      const s = get();
      const targetBuildings = s.buildings.filter(b => 
        s.reducedCategories.some(cat => CATEGORY_BUILDING_MAP[cat] === b.id)
      );
      if (targetBuildings.length === 0) return;
      const target = targetBuildings[Math.floor(Math.random() * targetBuildings.length)];
      const damage = Math.floor(Math.random() * 100) + 50;
      set((s) => {
        const next = { 
          ...s, 
          thiefEvent: { buildingId: target.id, damage, active: true }
        };
        persistAcct(next);
        return next;
      });
    },

    // 코인 충전 (디버그용)
    addCoins: (amount: number) => {
      set((s) => {
        const next = { ...s, coins: s.coins + amount };
        persistAcct(next);
        return next;
      });
    },

    // 근무 기록 (알바/회사)
    recordWork: (name, amount, memo = '') => {
      set((s) => {
        const expenses = [{ id: nextExpenseId(), name, amount, category: 'work', memo, date: todayFn(), time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) }, ...s.expenses];
        const newCoins = s.coins + Math.floor(amount / 1000) + 1;
        const newTotalRecords = s.totalRecords + 1;

        let buildings = [...s.buildings];
        const buildingId = CATEGORY_BUILDING_MAP['work'];
        if (buildingId) {
          buildings = applyBuildingUpdate(buildings, buildingId);
        }

        const villageLevel = Math.floor((buildings.length + 1) / 3) + 1;

        const next: AccountState = {
          ...s, expenses,
          totalRecords: newTotalRecords,
          drawProgress: s.drawProgress + 1,
          coins: newCoins,
          buildings,
          villageLevel,
        };
        persistAcct(next);
        return next;
      });
    },

    // 도둑 피해 복구
    repairBuilding: () => {
      set((s) => {
        if (!s.thiefEvent?.active) return s;
        if (s.coins < s.thiefEvent.damage) return s;
        
        const next = { 
          ...s, 
          coins: s.coins - s.thiefEvent.damage,
          thiefEvent: null
        };
        persistAcct(next);
        return next;
      });
    },
  };
});