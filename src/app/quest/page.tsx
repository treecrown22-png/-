'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useQuestStore, getXPForLevel, getTitle, getSkillEffect, SKILLS, SHOP_ITEMS, ACHIEVEMENTS, DAILY_CHALLENGES, todayStr } from '@/store/quest-store';
import './quest.css';

const AudioCtx = typeof window !== 'undefined' ? (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext) : null;
let audioCtx: AudioContext | null = null;
function initAudio() { if (!audioCtx && AudioCtx) audioCtx = new AudioCtx(); }
function playSound(t: string) {
  initAudio(); if (!audioCtx) return;
  const o = audioCtx.createOscillator(), g = audioCtx.createGain();
  o.connect(g); g.connect(audioCtx.destination); g.gain.value = 0.08;
  const n = audioCtx.currentTime;
  switch (t) {
    case 'complete': o.type = 'sine'; o.frequency.setValueAtTime(523, n); o.frequency.setValueAtTime(659, n + 0.1); o.frequency.setValueAtTime(784, n + 0.2); g.gain.exponentialRampToValueAtTime(0.001, n + 0.4); o.start(n); o.stop(n + 0.4); break;
    case 'levelup': o.type = 'sine'; [523, 659, 784, 1047].forEach((f, i) => o.frequency.setValueAtTime(f, n + i * 0.15)); g.gain.exponentialRampToValueAtTime(0.001, n + 0.8); o.start(n); o.stop(n + 0.8); break;
    case 'buy': o.type = 'sine'; o.frequency.setValueAtTime(600, n); o.frequency.setValueAtTime(800, n + 0.1); g.gain.exponentialRampToValueAtTime(0.001, n + 0.25); o.start(n); o.stop(n + 0.25); break;
    case 'achievement': o.type = 'sine'; [784, 988, 1175, 1568].forEach((f, i) => o.frequency.setValueAtTime(f, n + i * 0.12)); g.gain.exponentialRampToValueAtTime(0.001, n + 0.7); o.start(n); o.stop(n + 0.7); break;
    case 'boss': o.type = 'sawtooth'; o.frequency.setValueAtTime(100, n); o.frequency.linearRampToValueAtTime(200, n + 0.3); o.frequency.linearRampToValueAtTime(80, n + 0.6); g.gain.exponentialRampToValueAtTime(0.001, n + 0.8); o.start(n); o.stop(n + 0.8); break;
  }
}

function getComboMult(combo: number) { return Math.round((1 + Math.floor(combo / 3) * 0.5) * 10) / 10; }

interface ToastItem { id: number; icon: string; title: string; desc: string; cls: string; }

export default function QuestPage() {
  const s = useQuestStore();
  const [tab, setTab] = useState('quests');
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [input, setInput] = useState('');
  const [diff, setDiff] = useState('medium');
  const [due, setDue] = useState('');
  const [fStatus, setFStatus] = useState('all');
  const [fDiff, setFDiff] = useState('all');
  const [lvlUp, setLvlUp] = useState(false);
  const [tut, setTut] = useState(false);
  const prevLv = useRef(s.level);

  useEffect(() => { if (!s.tutorialSeen) setTut(true); }, [s.tutorialSeen]);

  useEffect(() => {
    if (!s.bossQuest) return;
    const iv = setInterval(() => s.tickBoss(), 1000);
    return () => clearInterval(iv);
  }, [s.bossQuest, s.tickBoss]);

  useEffect(() => {
    if (s.level > prevLv.current) {
      playSound('levelup');
      setLvlUp(true);
      addToast('🎉', '레벨 업!', `Lv.${s.level} ${getTitle(s.level)}`);
    }
    prevLv.current = s.level;
  }, [s.level]);

  function addToast(icon: string, title: string, desc: string, cls = '') {
    const id = Date.now();
    setToasts(p => [...p, { id, icon, title, desc, cls }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000);
  }

  const cm = getComboMult(s.combo);
  const daily = DAILY_CHALLENGES.find(d => d.id === s.dailyChallengeId);
  const dailyPct = daily ? Math.min(s.dailyProgress, daily.target) / daily.target * 100 : 0;
  const xpNeed = getXPForLevel(s.level);
  const xpPct = (s.xp / xpNeed) * 100;

  const dl: Record<string, string> = { easy: '쉬움', medium: '보통', hard: '어려움', legendary: '전설' };
  const xpBase: Record<string, number> = { easy: 15, medium: 30, hard: 60, legendary: 120 };

  const filtered = s.tasks.filter(t => {
    if (fStatus === 'active' && t.completed) return false;
    if (fStatus === 'completed' && !t.completed) return false;
    if (fDiff !== 'all' && t.difficulty !== fDiff) return false;
    return true;
  });
  const doneCount = s.tasks.filter(t => t.completed).length;

  const tabs = [
    { id: 'quests', label: '📋 퀘스트', icon: '📋' },
    { id: 'skills', label: '⚡ 스킬', icon: '⚡' },
    { id: 'achievements', label: '🏆 업적', icon: '🏆' },
    { id: 'shop', label: '🛒 상점', icon: '🛒' },
    { id: 'stats', label: '📊 기록', icon: '📊' },
  ];

  const today = todayStr();

  return (
    <>
      <div className="quest-bg" />
      <div className="quest-vignette" />
      <div className="quest-particles">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="quest-particle" style={{ left: `${(i * 5) + 2}%`, animationDelay: `${i * 0.4}s` }} />
        ))}
      </div>

      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.cls}`}><span className="t-icon">{t.icon}</span><div><div className="t-title">{t.title}</div><div className="t-desc">{t.desc}</div></div></div>
        ))}
      </div>

      <div className="game-container">
        {/* TOP */}
        <div className="top-bar rpg-panel rpg-panel-gold">
          <div className="corner-ornament corner-tl" /><div className="corner-ornament corner-tr" />
          <div className="corner-ornament corner-bl" /><div className="corner-ornament corner-br" />
          <Link href="/" style={{ textDecoration: 'none' }}><div className="game-title" style={{ cursor: 'pointer' }}>⚔️ 과제 퀘스트 RPG</div></Link>
          <div className="top-bar-stats">
            <div className="top-stat" title="코인">🪙 <span className="val">{s.coins}</span></div>
            <div className="top-stat" title="젬">💎 <span className="val">{s.gems}</span></div>
            <div className="top-stat" title="연속"><span className="streak-flame">🔥</span> <span className="val">{s.streak}</span></div>
            <div className="top-stat" title="콤보">⚡ <span className="val">x{cm}</span></div>
          </div>
        </div>

        {/* LEFT */}
        <div className="left-panel">
          <div className="char-panel rpg-panel rpg-panel-gold">
            <div className="corner-ornament corner-tl" /><div className="corner-ornament corner-tr" />
            <div className="corner-ornament corner-bl" /><div className="corner-ornament corner-br" />
            <div className="section-title"><span className="icon">👤</span> 캐릭터</div>
            <div className="char-header">
              <div className="char-avatar">{s.avatar}{s.pet && <div className="pet">{s.pet}</div>}</div>
              <div className="char-info">
                <div className="char-name">Lv.{s.level} {getTitle(s.level)}</div>
                <div className="char-class">{getTitle(s.level)} 길드</div>
              </div>
            </div>
            <div className="bar-group">
              <div className="bar-row">
                <div className="bar-label" style={{ color: 'var(--xp-green)' }}>XP</div>
                <div className="bar-track"><div className="bar-fill xp" style={{ width: `${xpPct}%` }}><span className="bar-text">{s.xp} / {xpNeed}</span></div></div>
              </div>
            </div>
            <div className="stats-grid">
              <div className="stat-cell"><div className="s-icon">⚔️</div><div className="s-val">{s.level}</div><div className="s-label">레벨</div></div>
              <div className="stat-cell"><div className="s-icon">📋</div><div className="s-val">{s.totalCompleted}</div><div className="s-label">완료</div></div>
              <div className="stat-cell"><div className="s-icon">⚡</div><div className="s-val">{s.skillPoints}</div><div className="s-label">SP</div></div>
              <div className="stat-cell"><div className="s-icon">🏆</div><div className="s-val">{s.unlockedAchievements.length}</div><div className="s-label">업적</div></div>
            </div>
          </div>
          <div className="rpg-panel" style={{ padding: 0 }}>
            <div className="section-title"><span className="icon">🎒</span> 장비</div>
            <div className="equip-grid">
              <div className="equip-slot filled">{s.avatar}<div className="slot-label">아바타</div></div>
              <div className={`equip-slot ${s.pet ? 'filled' : ''}`}>{s.pet || '—'}<div className="slot-label">펫</div></div>
              <div className={`equip-slot ${s.themeColor ? 'filled' : ''}`}>🎨<div className="slot-label">테마</div></div>
            </div>
          </div>
        </div>

        {/* CENTER */}
        <div className="center-panel">
          <div className="rpg-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div className="rpg-tabs">
              {tabs.map(t => (
                <button key={t.id} className={`rpg-tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>{t.label}</button>
              ))}
            </div>
            <div className="tab-body">
              {/* QUESTS */}
              <div className="tab-content" style={{ display: tab === 'quests' ? 'block' : 'none' }}>
                <div className="add-quest">
                  <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && input.trim()) { s.addTask(input.trim(), diff, due || null); setInput(''); playSound('buy'); } }} placeholder="✨ 새로운 퀘스트를 입력하세요..." />
                  <div className="add-row">
                    <select value={diff} onChange={e => setDiff(e.target.value)}>
                      <option value="easy">🟢 쉬움 (15 XP)</option>
                      <option value="medium">🟡 보통 (30 XP)</option>
                      <option value="hard">🔴 어려움 (60 XP)</option>
                      <option value="legendary">🟣 전설 (120 XP)</option>
                    </select>
                    <input type="date" value={due} onChange={e => setDue(e.target.value)} />
                    <button className="btn-rpg" onClick={() => { if (input.trim()) { s.addTask(input.trim(), diff, due || null); setInput(''); playSound('buy'); } }}>➕ 의뢰 등록</button>
                  </div>
                </div>
                <div className="filter-row">
                  <select value={fStatus} onChange={e => setFStatus(e.target.value)}>
                    <option value="all">전체</option><option value="active">진행 중</option><option value="completed">완료</option>
                  </select>
                  <select value={fDiff} onChange={e => setFDiff(e.target.value)}>
                    <option value="all">전체 난이도</option><option value="easy">🟢 쉬움</option><option value="medium">🟡 보통</option><option value="hard">🔴 어려움</option><option value="legendary">🟣 전설</option>
                  </select>
                  <span className="quest-count">{doneCount}/{s.tasks.length}</span>
                </div>
                <div style={{ padding: 10 }}>
                  {filtered.length === 0 ? (
                    <div className="empty"><div className="e-icon">📭</div><p>{s.tasks.length === 0 ? '모험가 길드에 의뢰를 등록하세요!' : '해당 퀘스트 없음'}</p></div>
                  ) : filtered.map(t => {
                    const tcm = getComboMult(s.combo);
                    const txp = Math.floor(xpBase[t.difficulty] * tcm * (t.dueDate ? getSkillEffect('time_mgmt', s.skills) : 1));
                    const ov = t.dueDate && !t.completed && new Date(t.dueDate) < new Date(new Date().toDateString());
                    return (
                      <div key={t.id} className={`quest-item ${t.completed ? 'completed' : ''}`}>
                        <button className="q-check" onClick={() => { s.toggleTask(t.id); playSound('complete'); }}>{t.completed ? '✓' : ''}</button>
                        <div className="q-body">
                          <div className="q-name">{t.name}</div>
                          <div className="q-meta">
                            <span className={`q-badge ${t.difficulty}`}>{dl[t.difficulty]}</span>
                            <span className="q-xp">+{txp}XP</span>
                            {t.dueDate && <span className={`q-due ${ov ? 'overdue' : ''}`}>📅 {t.dueDate}</span>}
                            {tcm > 1 && !t.completed && <span style={{ fontSize: '0.75em', color: 'var(--gold-light)' }}>🔥x{tcm}</span>}
                          </div>
                        </div>
                        <button className="q-del" onClick={() => s.deleteTask(t.id)}>🗑️</button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SKILLS */}
              <div className="tab-content" style={{ display: tab === 'skills' ? 'block' : 'none' }}>
                {s.skillPoints > 0 && <div className="sp-banner">보유 SP: {s.skillPoints}</div>}
                <div className="skill-grid">
                  {SKILLS.map(sk => {
                    const lv = s.skills[sk.id] || 0;
                    return (
                      <div key={sk.id} className={`skill-card ${lv >= sk.maxLv ? 'maxed' : ''}`} onClick={() => { s.upgradeSkill(sk.id); playSound('buy'); }}>
                        <div className="sk-icon">{sk.icon}</div>
                        <div className="sk-name">{sk.name}</div>
                        <div className="sk-desc">{sk.desc}</div>
                        <div className="sk-lv">{lv >= sk.maxLv ? 'MAX' : `Lv.${lv}/${sk.maxLv}`}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ACHIEVEMENTS */}
              <div className="tab-content" style={{ display: tab === 'achievements' ? 'block' : 'none' }}>
                <div className="ach-grid">
                  {ACHIEVEMENTS.map(ach => {
                    const u = s.unlockedAchievements.includes(ach.id);
                    const statMap: Record<string, number> = { totalCompleted: s.totalCompleted, streak: s.streak, level: s.level, hardCompleted: s.hardCompleted, legendaryCompleted: s.legendaryCompleted, totalCoins: s.totalCoins, totalGems: s.totalGems, bossCompleted: s.bossCompleted, maxCombo: s.maxCombo, dailyCompleted: s.dailyCompleted, totalSkillPoints: s.totalSkillPoints };
                    const cur = statMap[ach.type] ?? 0;
                    const p = Math.min(cur / ach.target * 100, 100);
                    return (
                      <div key={ach.id} className={`ach-card ${u ? 'unlocked' : 'locked'}`}>
                        <div className="a-icon">{ach.icon}</div>
                        <div className="a-name">{ach.name}</div>
                        <div className="a-desc">{ach.desc}</div>
                        {!u ? <><div className="a-bar"><div className="a-bar-fill" style={{ width: `${p}%` }} /></div><div className="a-prog">{cur}/{ach.target}</div></> : <div style={{ color: 'var(--gold)', marginTop: 4, fontSize: '0.75em', fontWeight: 700 }}>✅ 달성!</div>}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SHOP */}
              <div className="tab-content" style={{ display: tab === 'shop' ? 'block' : 'none' }}>
                <div className="shop-grid">
                  {SHOP_ITEMS.map(item => {
                    const owned = s.ownedItems.includes(item.id);
                    return (
                      <div key={item.id} className={`shop-card ${owned ? 'owned' : ''}`} onClick={() => { if (!owned) { s.buyItem(item.id); playSound('buy'); } }}>
                        <div className="sh-icon">{item.icon}</div>
                        <div className="sh-name">{item.name}</div>
                        {item.effect && <div className="sh-effect">{item.effect}</div>}
                        {owned ? <div className="sh-price" style={{ color: 'var(--success)' }}>보유</div> : <div className="sh-price">🪙 {item.price}</div>}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* STATS */}
              <div className="tab-content" style={{ display: tab === 'stats' ? 'block' : 'none' }}>
                <div style={{ textAlign: 'center', fontSize: '0.85em', color: 'var(--text-dim)', marginBottom: 10 }}>최근 90일 활동</div>
                <div className="heatmap">
                  {Array.from({ length: 90 }).map((_, i) => {
                    const d = new Date(Date.now() - (89 - i) * 86400000).toISOString().slice(0, 10);
                    const c = s.heatmap[d] || 0;
                    let l = c >= 4 ? 'l4' : c >= 3 ? 'l3' : c >= 2 ? 'l2' : c >= 1 ? 'l1' : '';
                    return <div key={d} className={`hm-day ${l} ${d === today ? 'today' : ''}`} title={`${d}: ${c}`} />;
                  })}
                </div>
                <div className="stats-cards">
                  {[
                    { l: '총 완료', v: s.totalCompleted, i: '✅' }, { l: '스트릭', v: `${s.streak}일`, i: '🔥' },
                    { l: '최대 콤보', v: `x${s.maxCombo}`, i: '⚡' }, { l: '보스 처치', v: s.bossCompleted, i: '⚔️' },
                    { l: '총 코인', v: s.totalCoins, i: '🪙' }, { l: '총 젬', v: s.totalGems, i: '💎' },
                    { l: '업적', v: `${s.unlockedAchievements.length}/${ACHIEVEMENTS.length}`, i: '🏆' }, { l: '출석', v: `${s.attendance.length}일`, i: '📅' },
                  ].map((item, i) => (
                    <div key={i} className="sc"><div className="sc-icon">{item.i}</div><div className="sc-val">{item.v}</div><div className="sc-label">{item.l}</div></div>
                  ))}
                </div>
                <div style={{ textAlign: 'center', marginTop: 24, fontSize: '0.9em', fontWeight: 700, color: 'var(--gold)' }}>📅 출석 보상</div>
                <div className="att-grid">
                  {Array.from({ length: 28 }).map((_, i) => {
                    const d = new Date(Date.now() - (27 - i) * 86400000).toISOString().slice(0, 10);
                    return <div key={d} className={`att-d ${s.attendance.includes(d) ? 'checked' : ''} ${d === today ? 'today' : ''}`}>{new Date(d).getDate()}</div>;
                  })}
                </div>
                <div style={{ textAlign: 'center', marginTop: 10 }}>
                  <button className="btn-rpg" onClick={() => { s.claimAttendance(); playSound('achievement'); }}>
                    {s.lastAttendance === today ? '✅ 출석 완료' : '📅 출석 체크'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="right-panel">
          <div className={`daily-panel rpg-panel ${daily && s.dailyClaimed ? 'completed' : ''}`} style={{ padding: 0 }}>
            <div className="section-title"><span className="icon">📜</span> 일일 도전</div>
            <div className="daily-content">
              {daily && <>
                <div className="daily-quest-name">{daily.icon} {daily.desc}</div>
                <div className="daily-quest-desc">진행도: {Math.min(s.dailyProgress, daily.target)}/{daily.target}</div>
                <div className="daily-reward-text">보상: {daily.reward.xp}XP, {daily.reward.coins}🪙{daily.reward.gems ? ` +${daily.reward.gems}💎` : ''}</div>
                <div className="daily-bar"><div className="daily-bar-fill" style={{ width: `${dailyPct}%` }} /></div>
                <div className="daily-progress-text">{s.dailyClaimed ? '✅ 완료!' : `${Math.min(s.dailyProgress, daily.target)}/${daily.target}`}</div>
              </>}
            </div>
          </div>

          {s.bossQuest && s.bossStartTime && (() => {
            const el = Math.floor((Date.now() - s.bossStartTime) / 1000);
            const rem = Math.max(0, s.bossQuest.time - el);
            const m = Math.floor(rem / 60), sec = rem % 60;
            return (
              <div className="rpg-panel" style={{ padding: 0 }}>
                <div className="section-title" style={{ color: 'var(--legendary)' }}><span className="icon">⚔️</span> 보스 등장!</div>
                <div className="boss-content">
                  <div className="boss-name">{s.bossQuest.icon} {s.bossQuest.name}</div>
                  <div className="boss-desc">{s.bossQuest.desc}</div>
                  <div className="boss-timer">⏰ {String(m).padStart(2, '0')}:{String(sec).padStart(2, '0')}</div>
                  <div className="boss-reward-text">🏆 보상: {s.bossQuest.reward.xp}XP, {s.bossQuest.reward.coins}🪙, {s.bossQuest.reward.gems}💎</div>
                </div>
              </div>
            );
          })()}

          <div className="log-panel rpg-panel" style={{ padding: 0 }}>
            <div className="section-title"><span className="icon">📝</span> 모험 일지</div>
            <div className="log-body">
              {s.logs.slice(0, 20).map((l, i) => (
                <div key={i} className={`log-entry ${l.cls}`}><span className="log-time">{l.time}</span>{l.msg}</div>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="bottom-bar">
          <div className="quick-slots rpg-panel">
            {tabs.map((t, i) => (
              <div key={t.id} className={`quick-slot ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)} title={t.label}>
                <span className="qs-key">{i + 1}</span>{t.icon}
              </div>
            ))}
            <div style={{ width: 1, height: 30, background: 'var(--panel-border)', margin: '0 6px' }} />
            <div className="quick-slot" onClick={() => { s.claimAttendance(); playSound('achievement'); }} title="출석">
              <span className="qs-key">Q</span>📅
            </div>
          </div>
        </div>
      </div>

      {/* Level Up */}
      {lvlUp && (
        <div className="overlay" onClick={() => { setLvlUp(false); s.clearLevelUp(); }}>
          <div className="modal-box">
            <div className="m-icon">🎉</div>
            <h2>레벨 업!</h2>
            <p>Lv.{s.level} {getTitle(s.level)}</p>
            <div className="m-rewards"><div className="m-reward">+1 ⚡ SP</div></div>
            <button className="btn-rpg" onClick={() => { setLvlUp(false); s.clearLevelUp(); }}>확인</button>
          </div>
        </div>
      )}

      {/* Tutorial */}
      {tut && (
        <div className="tutorial-overlay">
          <div className="tutorial-box">
            <h1>⚔️ 과제 퀘스트 RPG에 오신 것을 환영합니다!</h1>
            <p style={{ color: 'var(--text-dim)', marginBottom: 20 }}>실생활 과제를 게임처럼 즐기며 습관을 만들어보세요</p>
            <div className="tutorial-steps">
              <div className="tutorial-step"><span className="step-icon">📋</span><div className="step-text"><strong>1. 퀘스트 등록</strong><br />해야 할 과제를 난이도별로 등록하세요</div></div>
              <div className="tutorial-step"><span className="step-icon">✅</span><div className="step-text"><strong>2. 퀘스트 완료</strong><br />과제를 완료하면 체크박스를 클릭!</div></div>
              <div className="tutorial-step"><span className="step-icon">⚡</span><div className="step-text"><strong>3. 콤보 & 스트릭</strong><br />연속으로 완료하면 콤보 보너스!</div></div>
              <div className="tutorial-step"><span className="step-icon">⚔️</span><div className="step-text"><strong>4. 보스 등장</strong><br />퀘스트 3개 완료 후 랜덤 보스 등장</div></div>
              <div className="tutorial-step"><span className="step-icon">🛒</span><div className="step-text"><strong>5. 성장</strong><br />코인으로 아이템 구매, 스킬 업그레이드</div></div>
            </div>
            <button className="btn-rpg" style={{ padding: '12px 30px', fontSize: '1em', marginTop: 10 }} onClick={() => { s.setTutorialSeen(); setTut(false); }}>🎮 모험 시작!</button>
          </div>
        </div>
      )}
    </>
  );
}