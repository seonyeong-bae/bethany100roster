export type RotationTableData = { [date: string]: { [role: string]: string } };

interface Constraints {
  names: string[];
  assignments: { [name: string]: string[] };
  unavailable: { [name: string]: Date[] };
}

/** 해당 사람이 그 날짜에 그 역할을 맡을 수 있는지 (역할담당 O, 불가 날짜 X) */
export const canTake = (
  name: string,
  role: string,
  date: Date,
  { assignments, unavailable }: Constraints
) =>
  !!assignments[name]?.includes(role) &&
  !unavailable[name]?.some(d => d.toDateString() === date.toDateString());

/** 사람별 배정 횟수 */
export const countAssignments = (table: RotationTableData) => {
  const counts: { [name: string]: number } = {};
  Object.values(table).forEach(row =>
    Object.values(row).forEach(name => {
      if (name) counts[name] = (counts[name] || 0) + 1;
    })
  );
  return counts;
};

/**
 * 자동 배정
 * - keepExisting=true: 이미 채워진(수동 배정 포함) 칸은 유지하고 빈 칸만 채움
 * - 같은 날짜에 한 사람은 한 역할만
 * - 후보가 적은 역할부터 채우고, 배정 횟수가 적은 사람을 우선 (동률이면 랜덤)
 */
export const autoAssign = (
  dates: Date[],
  roles: string[],
  constraints: Constraints,
  existing: RotationTableData,
  keepExisting: boolean
): RotationTableData => {
  const sortedDates = [...dates].sort((a, b) => a.getTime() - b.getTime());
  const table: RotationTableData = {};

  if (keepExisting) {
    sortedDates.forEach(date => {
      const key = date.toISOString();
      table[key] = {};
      roles.forEach(role => {
        const name = existing[key]?.[role];
        if (name && canTake(name, role, date, constraints)) table[key][role] = name;
      });
    });
  }
  const counts = countAssignments(table);

  sortedDates.forEach(date => {
    const key = date.toISOString();
    const row = (table[key] = table[key] || {});
    const used = new Set(Object.values(row).filter(Boolean));

    const emptyRoles = roles.filter(role => !row[role]);
    const candidatesOf = (role: string) =>
      constraints.names.filter(n => !used.has(n) && canTake(n, role, date, constraints));

    // 후보가 적은 역할부터 채워서 배정 실패를 줄임
    const ordered = [...emptyRoles].sort(
      (a, b) => candidatesOf(a).length - candidatesOf(b).length
    );

    ordered.forEach(role => {
      const candidates = candidatesOf(role);
      if (candidates.length === 0) {
        row[role] = '';
        return;
      }
      const min = Math.min(...candidates.map(n => counts[n] || 0));
      const pool = candidates.filter(n => (counts[n] || 0) === min);
      const pick = pool[Math.floor(Math.random() * pool.length)];
      row[role] = pick;
      used.add(pick);
      counts[pick] = (counts[pick] || 0) + 1;
    });
  });

  return table;
};
