export function createConfetti() {
  const colors = ['#C9A961', '#D4A5A5', '#7BA7BC', '#8AAA8A', '#8B6F8E', '#C4885B'];
  for (let i = 0; i < 30; i++) {
    const c = document.createElement('div');
    c.className = 'confetti';
    c.style.cssText = `left:${Math.random() * 100}%;background:${colors[Math.floor(Math.random() * colors.length)]};animation-delay:${Math.random() * 0.5}s;animation-duration:${2 + Math.random() * 2}s;border-radius:${Math.random() > 0.5 ? '50%' : '2px'};width:${6 + Math.random() * 8}px;height:${6 + Math.random() * 8}px`;
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 4000);
  }
}

export function getNightMessage(streak: number, messages: string[]): string {
  if (streak >= 7) return '일주일 연속! 너는 정말 강한 사람이야!';
  if (streak >= 3) return '3일 연속 성공! 이 흐름 그대로 가보자!';
  if (streak >= 1) return messages[Math.floor(Math.random() * messages.length)];
  return '오늘부터 시작해볼까? 내가 응원할게!';
}

export function calculateTodayStats(expenses: Array<{ date: string; amount: number; category: string }>) {
  const today = new Date().toISOString().slice(0, 10);
  const todayExpenses = expenses.filter((e) => e.date === today);
  const todayTotal = todayExpenses.reduce((s, e) => s + e.amount, 0);
  const todayByCategory: Record<string, number> = {};
  todayExpenses.forEach((e) => {
    todayByCategory[e.category] = (todayByCategory[e.category] || 0) + e.amount;
  });
  return { todayExpenses, todayTotal, todayByCategory };
}

export function calculateMonthStats(expenses: Array<{ date: string; amount: number; category: string }>) {
  const now = new Date();
  const monthExpenses = expenses.filter((e) => {
    const d = new Date(e.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const monthTotal = monthExpenses.reduce((s, e) => s + e.amount, 0);
  
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastTotal = expenses
    .filter((e) => {
      const d = new Date(e.date);
      return d.getMonth() === lastMonth.getMonth() && d.getFullYear() === lastMonth.getFullYear();
    })
    .reduce((s, e) => s + e.amount, 0);

  const monthByCategory: Record<string, number> = {};
  monthExpenses.forEach((e) => {
    monthByCategory[e.category] = (monthByCategory[e.category] || 0) + e.amount;
  });

  return { monthExpenses, monthTotal, lastTotal, monthByCategory };
}

export function calculateAllCategoryStats(expenses: Array<{ amount: number; category: string }>) {
  const allByCategory: Record<string, number> = {};
  expenses.forEach((e) => {
    allByCategory[e.category] = (allByCategory[e.category] || 0) + e.amount;
  });
  const allTotal = Object.values(allByCategory).reduce((s, v) => s + v, 0) || 1;
  return { allByCategory, allTotal };
}