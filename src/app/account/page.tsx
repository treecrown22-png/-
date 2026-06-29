'use client';

import { useState, useEffect, useRef } from 'react';
import { useAccountStore, PRAISE_MESSAGES, NIGHT_EAT_MESSAGES, STICKERS, BUILDINGS, getCategory, CATEGORIES, CATEGORY_BUILDING_MAP, type Building } from '@/store/account-store';
import { createConfetti } from './components/utils';
import type { Toast as ToastType, PageType, ModalType, ReceiptData, StickerResult } from './components/types';
import { Toast } from './components/Toast';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomePage } from './components/HomePage';
import { LedgerPage } from './components/LedgerPage';
import { StickerPage } from './components/StickerPage';
import { VillagePage } from './components/VillagePage';
import { MyPage } from './components/MyPage';
import { ExpenseModal } from './components/ExpenseModal';
import { StickerResultModal } from './components/StickerResultModal';
import { ReceiptModal } from './components/ReceiptModal';
import { PraiseModal } from './components/PraiseModal';
import { NightEatModal } from './components/NightEatModal';
import './account.css';

export default function AccountPage() {
  const store = useAccountStore();
  const [mounted, setMounted] = useState(false);
  const [page, setPage] = useState<PageType>('home');
  const [toast, setToast] = useState<ToastType | null>(null);
  const [modal, setModal] = useState<ModalType>(null);
  const [stickerResult, setStickerResult] = useState<StickerResult | null>(null);
  const [praiseShow, setPraiseShow] = useState(false);
  const [praiseSuccess, setPraiseSuccess] = useState(true);
  const [receiptLoading, setReceiptLoading] = useState(false);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [nightEatModalOpen, setNightEatModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setMounted(true), []);

  const showToast = (icon: string, msg: string) => {
    const id = Date.now();
    setToast({ id, icon, msg });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (!mounted) return;
    store.checkNightSnack();
    if (store.nightStreak >= 1 && !store.praisedToday) {
      setPraiseSuccess(true);
      setPraiseShow(true);
    }
  }, [mounted, store]);

  useEffect(() => {
    if (!mounted || store.buildings.length === 0) return;
    const iv = setInterval(() => {
      let income = 0;
      store.buildings.forEach((building: Building) => {
        const bDef = BUILDINGS.find((x) => x.id === building.id);
        if (bDef) income += bDef.income * building.level;
      });
      if (income > 0) {
        const s = JSON.parse(localStorage.getItem('pocketAccount') || '{}');
        s.coins = (s.coins || 0) + Math.floor(income / 60);
        localStorage.setItem('pocketAccount', JSON.stringify(s));
      }
    }, 60000);
    return () => clearInterval(iv);
  }, [mounted, store.buildings]);

  const handleSaveExpense = (name: string, amountStr: string, category: string, memo: string) => {
    if (!name.trim() || !amountStr) {
      showToast('⚠️', '내용과 금액을 입력해주세요');
      return;
    }
    const amount = parseInt(amountStr);
    store.addExpense(name.trim(), amount, category, memo);
    const coinReward = Math.floor(amount / 1000) + 1;
    showToast('✅', `${name.trim()} 기록 완료! +${coinReward}코인`);
    createConfetti();
    setModal(null);
    if (store.drawProgress >= 4) {
      setTimeout(() => showToast('🎁', '스티커 뽑기 가능!'), 1000);
    }
  };

  const handleDrawSticker = () => {
    if (store.drawProgress < 5) return;
    store.drawSticker();
    const roll = Math.random() * 100;
    const rarity = roll < 3 ? 'legendary' : roll < 15 ? 'epic' : roll < 40 ? 'rare' : 'common';
    const pool = STICKERS.filter((s) => s.rarity === rarity);
    const sticker = pool[Math.floor(Math.random() * pool.length)];
    const isNew = !store.stickers.includes(sticker.id);
    if (sticker.rarity === 'epic') showToast('💎', '보너스 젬 1개!');
    if (sticker.rarity === 'legendary') showToast('🌟', '레전더리!');
    setStickerResult({ sticker, isNew });
    createConfetti();
  };

  const handleRecordNightEat = () => {
    store.recordNightEat();
    showToast('🌙', '야식 기록됨');
    setPraiseSuccess(false);
    setPraiseShow(true);
  };

  const handleReceiptScan = async (file: File) => {
    setReceiptLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        try {
          const res = await fetch('/api/receipt', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageBase64: base64 }),
          });
          if (!res.ok) throw new Error('API error');
          const data = await res.json();
          setReceiptData(data);
          setModal('receipt');
        } catch (err) {
          console.error(err);
          showToast('⚠️', '영수증 인식에 실패했습니다');
        } finally {
          setReceiptLoading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      showToast('⚠️', '파일 읽기에 실패했습니다');
      setReceiptLoading(false);
    }
  };

  const handleReceiptSave = () => {
    if (!receiptData) return;
    const categoriesUsed = new Set<string>();
    if (receiptData.items && receiptData.items.length > 0) {
      receiptData.items.forEach((item) => {
        const category = item.category && CATEGORIES[item.category] ? item.category : getCategory(item.name);
        store.addExpenseNoBuilding(item.name, item.amount, category, receiptData.store || '');
        categoriesUsed.add(category);
      });
      showToast('✅', `${receiptData.items.length}개 항목 기록 완료!`);
    } else if (receiptData.total) {
      store.addExpenseNoBuilding(receiptData.store || '영수증', receiptData.total, 'etc', '');
      showToast('✅', '영수증 기록 완료!');
    }
    // 저장된 카테고리당 건물 1회만 레벨업 (중복 없이)
    const updatedCategories = new Set<string>();
    categoriesUsed.forEach((cat) => {
      if (!updatedCategories.has(cat) && CATEGORY_BUILDING_MAP[cat]) {
        store.levelUpBuildingForCategory(cat);
        updatedCategories.add(cat);
      }
    });
    createConfetti();
    setReceiptData(null);
    setModal(null);
  };

  const handleDeleteExpense = (id: number) => {
    store.deleteExpense(id);
    showToast('🗑️', '내역이 삭제되었습니다');
  };

  const openEditModal = (expense: { id: number; name: string; amount: number; category: string; memo?: string }) => {
    setModal('edit');
  };

  if (!mounted) return null;

  return (
    <div className="acct-container">
      <Header coins={store.coins} gems={store.gems} nightStreak={store.nightStreak} />

      {page === 'home' && (
        <div className="acct-page active">
          <HomePage
            expenses={store.expenses}
            nightStreak={store.nightStreak}
            receiptLoading={receiptLoading}
            onOpenModal={(m) => setModal(m as ModalType)}
            onReceiptScan={handleReceiptScan}
            onOpenEditModal={openEditModal}
            onDeleteExpense={handleDeleteExpense}
          />
        </div>
      )}

      {page === 'ledger' && (
        <div className="acct-page active">
          <LedgerPage
            expenses={store.expenses}
            onOpenEditModal={openEditModal}
            onDeleteExpense={handleDeleteExpense}
          />
        </div>
      )}

      {page === 'sticker' && (
        <div className="acct-page active">
          <StickerPage
            collectedStickers={store.stickers}
            drawProgress={store.drawProgress}
            monthlyOtaku={store.monthlyOtaku}
            onDrawSticker={handleDrawSticker}
          />
        </div>
      )}

      {page === 'village' && (
        <div className="acct-page active">
          <VillagePage
            buildings={store.buildings}
            villageLevel={store.villageLevel}
            citizens={store.citizens}
            citizenList={store.citizenList}
            coins={store.coins}
            thiefEvent={store.thiefEvent}
            reducedCategories={store.reducedCategories}
            onBuyBuilding={(id) => store.buyBuilding(id)}
            onShowToast={showToast}
            onGenerateCitizen={() => store.generateCitizen()}
            onHireCitizen={(id) => store.hireCitizen(id)}
            onAssignCitizen={(cid, bid) => store.assignCitizen(cid, bid)}
            onFireCitizen={(id) => store.fireCitizen(id)}
            onToggleReducedCategory={(cat) => store.toggleReducedCategory(cat)}
            onRepairBuilding={() => store.repairBuilding()}
            onTriggerThiefEvent={() => store.triggerThiefEvent()}
            onForceThiefEvent={() => store.forceThiefEvent()}
            onDismissCitizen={(id) => store.dismissCitizen(id)}
            onAddCoins={(amount) => store.addCoins(amount)}
            onRecordWork={(name, amount, memo) => store.recordWork(name, amount, memo)}
          />
        </div>
      )}

      {page === 'mypage' && (
        <div className="acct-page active">
          <MyPage
            totalRecords={store.totalRecords}
            nightStreak={store.nightStreak}
            stickers={store.stickers}
            expenses={store.expenses}
            nightEatRecords={store.nightEatRecords}
            onOpenNightEatModal={() => setNightEatModalOpen(true)}
          />
        </div>
      )}

      <BottomNav currentPage={page} onPageChange={setPage} />
      <Toast toast={toast} />

      {(modal === 'add' || modal === 'edit') && (
        <ExpenseModal
          mode={modal}
          onSave={handleSaveExpense}
          onClose={() => setModal(null)}
        />
      )}

      {stickerResult && (
        <StickerResultModal result={stickerResult} onClose={() => setStickerResult(null)} />
      )}

      {praiseShow && (
        <PraiseModal
          success={praiseSuccess}
          messages={praiseSuccess ? PRAISE_MESSAGES : NIGHT_EAT_MESSAGES}
          onClose={() => setPraiseShow(false)}
        />
      )}

      {modal === 'receipt' && receiptData && (
        <ReceiptModal data={receiptData} onSave={handleReceiptSave} onClose={() => { setModal(null); setReceiptData(null); }} />
      )}

      {nightEatModalOpen && (
        <NightEatModal
          onSave={(food, quantity, time, reason, emotion) => {
            store.recordNightEatWithDetails(food, quantity, time, reason, emotion);
            showToast('🌙', '야식 기록 완료!');
            setNightEatModalOpen(false);
          }}
          onClose={() => setNightEatModalOpen(false)}
        />
      )}
    </div>
  );
}
