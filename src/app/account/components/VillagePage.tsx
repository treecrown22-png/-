'use client';

import { useState } from 'react';
import { BUILDINGS, getBuildingEvolution, CATEGORY_BUILDING_MAP, CATEGORIES, type Building, type Citizen } from '@/store/account-store';
import { createConfetti } from './utils';

interface VillagePageProps {
  buildings: Building[];
  villageLevel: number;
  citizens: number;
  citizenList: Citizen[];
  coins: number;
  thiefEvent: { buildingId: string; damage: number; active: boolean } | null;
  reducedCategories: string[];
  onBuyBuilding: (id: string) => void;
  onShowToast: (icon: string, msg: string) => void;
  onGenerateCitizen: () => Citizen | null;
  onHireCitizen: (id: string) => void;
  onAssignCitizen: (citizenId: string, buildingId: string) => void;
  onFireCitizen: (id: string) => void;
  onToggleReducedCategory: (cat: string) => void;
  onRepairBuilding: () => void;
  onTriggerThiefEvent: () => void;
  onForceThiefEvent: () => void;
  onDismissCitizen: (id: string) => void;
  onAddCoins: (amount: number) => void;
  onRecordWork: (name: string, amount: number, memo?: string) => void;
}

const POSITIONS = [
  { x: 15, y: 55 }, { x: 30, y: 52 }, { x: 50, y: 55 },
  { x: 70, y: 52 }, { x: 85, y: 55 }, { x: 20, y: 72 },
  { x: 40, y: 75 }, { x: 60, y: 70 }, { x: 80, y: 75 },
  { x: 25, y: 88 }, { x: 50, y: 88 }, { x: 75, y: 88 },
];

const STAT_LABELS: Record<string, { label: string; icon: string }> = {
  cooking: { label: '요리', icon: '🍳' },
  cleaning: { label: '청소', icon: '🧹' },
  service: { label: '서비스', icon: '💁' },
  luck: { label: '운', icon: '🍀' },
  charm: { label: '매력', icon: '✨' },
};

function StatBar({ value, max = 10 }: { value: number; max?: number }) {
  return (
    <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      {Array.from({ length: max }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 6,
            height: 12,
            borderRadius: 2,
            background: i < value ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
          }}
        />
      ))}
      <span style={{ fontSize: '0.7em', color: 'var(--text-light)', marginLeft: 4 }}>{value}</span>
    </div>
  );
}

export function VillagePage({
  buildings,
  villageLevel,
  citizens,
  citizenList,
  coins,
  thiefEvent,
  reducedCategories,
  onBuyBuilding,
  onShowToast,
  onGenerateCitizen,
  onHireCitizen,
  onAssignCitizen,
  onFireCitizen,
  onToggleReducedCategory,
  onRepairBuilding,
  onTriggerThiefEvent,
  onForceThiefEvent,
  onDismissCitizen,
  onAddCoins,
  onRecordWork,
}: VillagePageProps) {
  const [tab, setTab] = useState<'buildings' | 'citizens' | 'defense' | 'work'>('buildings');
  const [assignModal, setAssignModal] = useState<string | null>(null);
  const [workName, setWorkName] = useState('');
  const [workAmount, setWorkAmount] = useState('');
  const [workMemo, setWorkMemo] = useState('');

  const maxCitizens = villageLevel * 2;
  const hiredCitizens = citizenList.filter(c => c.hired);
  const availableBuildings = BUILDINGS.filter((b) => {
    const owned = buildings.find((ob) => ob.id === b.id);
    return !owned || owned.level < 5;
  });

  const handleGenerate = () => {
    const c = onGenerateCitizen();
    if (!c) {
      onShowToast('⚠️', '고용 슬롯이 가득 찼습니다!');
    } else {
      onShowToast('🎲', `${c.icon} ${c.name} 등장!`);
      createConfetti();
    }
  };

  return (
    <>
      {/* 도둑 이벤트 배너 */}
      {thiefEvent?.active && (
        <div className="acct-card" style={{ background: 'linear-gradient(135deg, rgba(200,50,50,0.3), rgba(150,30,30,0.2))', border: '2px solid rgba(255,100,100,0.4)' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2em', marginBottom: 8 }}>🦹 도둑 등장!</div>
            <div style={{ fontSize: '0.9em', color: 'var(--text-light)', marginBottom: 12 }}>
              {getBuildingEvolution(thiefEvent.buildingId, buildings.find(b => b.id === thiefEvent.buildingId)?.level || 1).name}에 도둑이 들었습니다!
            </div>
            <div style={{ fontSize: '1.2em', fontWeight: 900, color: '#ff6b6b', marginBottom: 12 }}>
              복구 비용: {thiefEvent.damage}코인
            </div>
            <button
              className="btn btn-primary"
              onClick={() => {
                if (coins < thiefEvent.damage) {
                  onShowToast('⚠️', '코인이 부족해요!');
                  return;
                }
                onRepairBuilding();
                onShowToast('🔧', '건물 복구 완료!');
                createConfetti();
              }}
            >
              🔧 복구하기 ({thiefEvent.damage}코인)
            </button>
          </div>
        </div>
      )}

      {/* 마을 장면 */}
      <div className="acct-card" style={{ padding: 8 }}>
        <div className="village-scene">
          <div className="village-ground" />
          <div className="village-banner">✨ 나니아의 숲 ✨</div>
          {buildings.map((building: Building, i: number) => {
            const evo = getBuildingEvolution(building.id, building.level);
            if (i >= POSITIONS.length) return null;
            const pos = POSITIONS[i];
            const assignedCitizens = hiredCitizens.filter(c => c.assignedBuilding === building.id);
            return (
              <div
                key={building.id}
                className="village-building"
                style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%,-100%)' }}
              >
                <div className="b-icon">{evo.icon}</div>
                <div className="b-name">
                  {evo.name}
                  {building.level > 1 && (
                    <span style={{ color: '#FFD700', marginLeft: 4 }}>LV.{building.level}</span>
                  )}
                </div>
                {assignedCitizens.length > 0 && (
                  <div style={{ display: 'flex', gap: 2, justifyContent: 'center', marginTop: 2 }}>
                    {assignedCitizens.map(c => (
                      <span key={c.id} style={{ fontSize: '0.7em' }}>{c.icon}</span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 마을 정보 */}
      <div className="acct-card">
        <div className="card-title">🏘️ 마을 정보</div>
        <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '1.5em', fontWeight: 900, color: 'var(--primary-light)' }}>{villageLevel}</div>
            <div style={{ fontSize: '0.75em', color: 'var(--text-light)' }}>마을 레벨</div>
          </div>
          <div>
            <div style={{ fontSize: '1.5em', fontWeight: 900, color: 'var(--primary-light)' }}>{buildings.length}</div>
            <div style={{ fontSize: '0.75em', color: 'var(--text-light)' }}>건물 수</div>
          </div>
          <div>
            <div style={{ fontSize: '1.5em', fontWeight: 900, color: 'var(--primary-light)' }}>{hiredCitizens.length}/{maxCitizens}</div>
            <div style={{ fontSize: '0.75em', color: 'var(--text-light)' }}>시민 (고용/최대)</div>
          </div>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
      {(['buildings', 'citizens', 'work', 'defense'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1,
              padding: '10px 0',
              borderRadius: 12,
              border: 'none',
              background: tab === t ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
              color: tab === t ? '#000' : 'var(--text)',
              fontWeight: tab === t ? 900 : 400,
              cursor: 'pointer',
              fontSize: '0.85em',
            }}
          >
            {t === 'buildings' ? '🏪 건물' : t === 'citizens' ? '👥 시민' : t === 'work' ? '💼 근무' : '🛡️ 방어'}
          </button>
        ))}
      </div>

      {/* 건물 탭 */}
      {tab === 'buildings' && (
        <div className="acct-card">
          <div className="card-title">🏪 사용 가능한 건물</div>
          {availableBuildings.slice(0, 6).map((b) => {
            const owned = buildings.find((ob) => ob.id === b.id);
            const isUpgrade = !!owned;
            return (
              <div
                key={b.id}
                className="expense-item"
                onClick={() => {
                  if (coins < b.cost) {
                    onShowToast('⚠️', '코인이 부족해요!');
                    return;
                  }
                  onBuyBuilding(b.id);
                  const nextLevel = isUpgrade ? owned.level + 1 : 1;
                  const evo = getBuildingEvolution(b.id, nextLevel);
                  onShowToast('🏗️', isUpgrade ? `${evo.name}(으)로 진화!` : `${evo.name} 건설 완료!`);
                  createConfetti();
                }}
              >
                <div className="expense-icon">{isUpgrade ? getBuildingEvolution(b.id, owned.level + 1).icon : b.icon}</div>
                <div className="expense-info">
                  <div className="expense-name">
                    {isUpgrade ? `${owned.level}→${owned.level + 1} 진화` : b.name}
                  </div>
                  <div className="expense-meta">
                    {isUpgrade ? getBuildingEvolution(b.id, owned.level + 1).name : `수익: +${b.income}코인/시간`}
                  </div>
                </div>
                <div className="expense-amount" style={{ color: 'var(--primary)' }}>
                  {b.cost}코인
                </div>
              </div>
            );
          })}
          {availableBuildings.length === 0 && (
            <div style={{ textAlign: 'center', padding: 20, color: 'var(--text-light)' }}>
              모든 건물이 최대 레벨입니다! 🎉
            </div>
          )}
        </div>
      )}

      {/* 시민 탭 */}
      {tab === 'citizens' && (
        <>
          <div className="acct-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div className="card-title" style={{ margin: 0 }}>🎲 시민 뽑기 (50코인)</div>
              <button className="btn btn-secondary" onClick={handleGenerate} style={{ fontSize: '0.85em', padding: '6px 12px' }}>
                🎲 뽑기
              </button>
            </div>
            <div style={{ fontSize: '0.8em', color: 'var(--text-light)' }}>
              고용 가능: {hiredCitizens.length}/{maxCitizens}명 (마을 레벨 {villageLevel} × 2)
            </div>
          </div>

          {/* 미고용 시민 */}
          {citizenList.filter(c => !c.hired).length > 0 && (
            <div className="acct-card">
              <div className="card-title">📋 고용 대기 중</div>
              {citizenList.filter(c => !c.hired).map((c) => (
                <div key={c.id} style={{ padding: 12, background: 'rgba(255,255,255,0.03)', borderRadius: 12, marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <div style={{ fontWeight: 700 }}>{c.icon} {c.name}</div>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button
                        className="btn btn-primary"
                        style={{ fontSize: '0.8em', padding: '4px 12px' }}
                        onClick={() => {
                          onHireCitizen(c.id);
                          onShowToast('✅', `${c.name} 고용 완료!`);
                        }}
                      >
                        고용 (50코인)
                      </button>
                      <button
                        className="btn btn-secondary"
                        style={{ fontSize: '0.8em', padding: '4px 12px', color: '#ff6b6b' }}
                        onClick={() => {
                          onDismissCitizen(c.id);
                          onShowToast('👋', `${c.name} 퇴출됨`);
                        }}
                      >
                        퇴출
                      </button>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
                    {Object.entries(c.stats).map(([key, val]) => (
                      <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8em' }}>
                        <span>{STAT_LABELS[key]?.icon}</span>
                        <span style={{ color: 'var(--text-light)', width: 36 }}>{STAT_LABELS[key]?.label}</span>
                        <StatBar value={val} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 고용된 시민 */}
          <div className="acct-card">
            <div className="card-title">👥 고용된 시민</div>
            {hiredCitizens.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 20, color: 'var(--text-light)' }}>
                고용된 시민이 없습니다
              </div>
            ) : (
              hiredCitizens.map((c) => {
                const assignedBuilding = c.assignedBuilding ? buildings.find(b => b.id === c.assignedBuilding) : null;
                const assignedEvo = assignedBuilding ? getBuildingEvolution(assignedBuilding.id, assignedBuilding.level) : null;
                return (
                  <div key={c.id} style={{ padding: 12, background: 'rgba(255,255,255,0.03)', borderRadius: 12, marginBottom: 8, border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <div style={{ fontWeight: 700 }}>{c.icon} {c.name}</div>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button
                          className="btn btn-secondary"
                          style={{ fontSize: '0.75em', padding: '4px 8px' }}
                          onClick={() => setAssignModal(c.id)}
                        >
                          📍 배치
                        </button>
                        <button
                          className="btn btn-secondary"
                          style={{ fontSize: '0.75em', padding: '4px 8px', color: '#ff6b6b' }}
                          onClick={() => {
                            onFireCitizen(c.id);
                            onShowToast('👋', `${c.name} 해고됨`);
                          }}
                        >
                          해고
                        </button>
                      </div>
                    </div>
                    {assignedEvo && (
                      <div style={{ fontSize: '0.85em', color: 'var(--primary-light)', marginBottom: 4 }}>
                        📍 배치: {assignedEvo.icon} {assignedEvo.name}
                      </div>
                    )}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
                      {Object.entries(c.stats).map(([key, val]) => (
                        <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8em' }}>
                          <span>{STAT_LABELS[key]?.icon}</span>
                          <span style={{ color: 'var(--text-light)', width: 36 }}>{STAT_LABELS[key]?.label}</span>
                          <StatBar value={val} />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* 배치 모달 */}
          {assignModal && (
            <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setAssignModal(null)}>
              <div className="modal">
                <button className="modal-close" onClick={() => setAssignModal(null)}>✕</button>
                <div className="modal-title">📍 건물 배치</div>
                {buildings.map((b) => {
                  const evo = getBuildingEvolution(b.id, b.level);
                  return (
                    <div
                      key={b.id}
                      className="expense-item"
                      onClick={() => {
                        onAssignCitizen(assignModal, b.id);
                        onShowToast('📍', `${evo.name}에 배치 완료!`);
                        setAssignModal(null);
                      }}
                    >
                      <div className="expense-icon">{evo.icon}</div>
                      <div className="expense-info">
                        <div className="expense-name">{evo.name}</div>
                        <div className="expense-meta">LV.{b.level}</div>
                      </div>
                    </div>
                  );
                })}
                {buildings.length === 0 && (
                  <div style={{ textAlign: 'center', padding: 20, color: 'var(--text-light)' }}>
                    배치할 건물이 없습니다
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* 근무 탭 */}
      {tab === 'work' && (
        <div className="acct-card">
          <div className="card-title">💼 근무 기록 (알바/회사)</div>
          <div style={{ fontSize: '0.85em', color: 'var(--text-light)', marginBottom: 12, lineHeight: 1.6 }}>
            알바나 회사 근무로 번 수익을 기록하세요.<br/>
            기록할 때마다 <span style={{ color: '#FFD700' }}>저금통 → 금고 → 은행 → 투자회사 → 금융제국</span>으로 성장합니다!
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
            <input
              type="text"
              placeholder="회사명 / 알바처 (예: GS25 알바)"
              value={workName}
              onChange={(e) => setWorkName(e.target.value)}
              style={{
                padding: '10px 12px',
                borderRadius: 10,
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.05)',
                color: 'var(--text)',
                fontSize: '0.9em',
              }}
            />
            <input
              type="number"
              placeholder="수익 금액 (예: 50000)"
              value={workAmount}
              onChange={(e) => setWorkAmount(e.target.value)}
              style={{
                padding: '10px 12px',
                borderRadius: 10,
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.05)',
                color: 'var(--text)',
                fontSize: '0.9em',
              }}
            />
            <input
              type="text"
              placeholder="메모 (선택)"
              value={workMemo}
              onChange={(e) => setWorkMemo(e.target.value)}
              style={{
                padding: '10px 12px',
                borderRadius: 10,
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.05)',
                color: 'var(--text)',
                fontSize: '0.9em',
              }}
            />
          </div>
          <button
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px 0' }}
            onClick={() => {
              if (!workName.trim() || !workAmount) {
                onShowToast('️', '회사명과 금액을 입력해주세요');
                return;
              }
              const amount = parseInt(workAmount);
              if (amount <= 0) {
                onShowToast('️', '올바른 금액을 입력해주세요');
                return;
              }
              onRecordWork(workName.trim(), amount, workMemo.trim());
              onShowToast('💰', `${workName.trim()} ${amount.toLocaleString()}원 기록!`);
              createConfetti();
              setWorkName('');
              setWorkAmount('');
              setWorkMemo('');
            }}
          >
            💼 근무 기록하기
          </button>

          {/* 저금통 진화 안내 */}
          <div style={{ marginTop: 16, padding: 12, background: 'rgba(255,215,0,0.1)', borderRadius: 12, border: '1px solid rgba(255,215,0,0.3)' }}>
            <div style={{ fontWeight: 700, marginBottom: 8, color: '#FFD700' }}> 저금통 진화 단계</div>
            <div style={{ fontSize: '0.85em', color: 'var(--text-light)', lineHeight: 1.8 }}>
              <div>LV.1 🐷 저금통 → LV.2 🔒 금고</div>
              <div>LV.2 🔒 금고 → LV.3 🏦 은행</div>
              <div>LV.3 🏦 은행 → LV.4 📈 투자 회사</div>
              <div>LV.4 📈 투자 회사 → LV.5 💎 금융 제국</div>
            </div>
          </div>
        </div>
      )}

      {/* 방어 탭 */}
      {tab === 'defense' && (
        <div className="acct-card">
          <div className="card-title">🛡️ 지출 방어 설정</div>
          <div style={{ fontSize: '0.85em', color: 'var(--text-light)', marginBottom: 12, lineHeight: 1.6 }}>
            지출을 줄이고 싶은 카테고리를 선택하세요.<br/>
            선택된 카테고리는 <span style={{ color: '#ff6b6b' }}>20% 확률</span>로 도둑이 들어<br/>
            복구 비용을 지불해야 건물을 운영할 수 있습니다.
          </div>
          {Object.entries(CATEGORIES).filter(([k]) => CATEGORY_BUILDING_MAP[k]).map(([key, cat]) => {
            const isReduced = reducedCategories.includes(key);
            const hasBuilding = buildings.some(b => b.id === CATEGORY_BUILDING_MAP[key]);
            return (
              <div
                key={key}
                className="expense-item"
                onClick={() => {
                  if (!hasBuilding) {
                    onShowToast('⚠️', '먼저 건물을 지어주세요!');
                    return;
                  }
                  onToggleReducedCategory(key);
                }}
                style={{ opacity: hasBuilding ? 1 : 0.4 }}
              >
                <div className="expense-icon">{cat.icon}</div>
                <div className="expense-info">
                  <div className="expense-name">{cat.name}</div>
                  <div className="expense-meta">
                    {isReduced ? '🔴 지출 감소 목표' : hasBuilding ? '🟢 정상 운영' : '건물 필요'}
                  </div>
                </div>
                <div style={{ fontSize: '1.2em' }}>
                  {isReduced ? '✅' : hasBuilding ? '○' : '🔒'}
                </div>
              </div>
            );
          })}

          <div style={{ marginTop: 16, textAlign: 'center', display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              className="btn btn-secondary"
              onClick={() => {
                const targetBuildings = buildings.filter(b => 
                  reducedCategories.some(cat => CATEGORY_BUILDING_MAP[cat] === b.id)
                );
                if (targetBuildings.length === 0) {
                  onShowToast('⚠️', '먼저 지출 감소 카테고리를 설정하고 건물을 지어주세요!');
                  return;
                }
                const target = targetBuildings[Math.floor(Math.random() * targetBuildings.length)];
                const damage = Math.floor(Math.random() * 100) + 50;
                onForceThiefEvent();
                onShowToast('🦹', `${getBuildingEvolution(target.id, buildings.find(b => b.id === target.id)?.level || 1).name}에 도둑이 들었습니다!`);
              }}
            >
              🎲 도둑 이벤트 테스트
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => {
                onAddCoins(10000);
                onShowToast('💰', '10,000코인 충전!');
              }}
            >
              💰 +10,000코인
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => {
                onAddCoins(50000);
                onShowToast('💰', '50,000코인 충전!');
              }}
            >
              💰 +50,000코인
            </button>
          </div>
        </div>
      )}
    </>
  );
}