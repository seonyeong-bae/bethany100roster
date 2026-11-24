import React from 'react';
import styled from 'styled-components';
import Select from 'react-select';
import { canTake, countAssignments } from '../utils/rotation';

const TableWrapper = styled.div`
  width: 100%;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
`;

const Th = styled.th`
  background: ${({ theme }) => theme.colors.card};
  color: ${({ theme }) => theme.colors.primary};
  padding: 8px;
  border-bottom: 2px solid ${({ theme }) => theme.colors.border};
`;

const Td = styled.td`
  padding: 8px;
  text-align: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Warn = styled.div`
  color: #ff6b6b;
  font-size: 0.75rem;
  margin-top: 4px;
`;

const Summary = styled.div`
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.9rem;
`;

const Chip = styled.span`
  background: #232323;
  border: 1px solid #333;
  border-radius: 999px;
  padding: 4px 12px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 32px 0 0 0;
  gap: 16px;
  flex-wrap: wrap;
`;

interface RotationTableProps {
  dates: Date[];
  roles: string[];
  assignments: { [name: string]: string[] };
  unavailable: { [name: string]: Date[] };
  table: { [date: string]: { [role: string]: string } };
  names: string[];
  onChange: (date: string, role: string, name: string) => void;
  randomButton?: React.ReactNode;
}

const RotationTable: React.FC<RotationTableProps> = ({
  dates, roles, assignments, unavailable, table, names, onChange, randomButton
}) => {
  // 날짜 오름차순 정렬
  const sortedDates = [...dates].sort((a, b) => a.getTime() - b.getTime());
  const constraints = { names, assignments, unavailable };
  const counts = countAssignments(table);

  return (
    <TableWrapper>
      <Table>
        <thead>
          <tr>
            <Th>로테이션 배정</Th>
            {sortedDates.map(date => (
              <Th key={date.toISOString()}>
                {date.toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit', weekday: 'short' })}
              </Th>
            ))}
          </tr>
        </thead>
        <tbody>
          {roles.map(role => {
            const roleOwners = names.filter(n => assignments[n]?.includes(role));
            return (
            <tr key={role}>
              <Td>{role}</Td>
              {sortedDates.map(date => {
                const dateStr = date.toISOString();
                const current = table[dateStr]?.[role] || '';
                // 같은 날짜의 다른 역할에 이미 배정된 사람
                const usedElsewhere = new Set(
                  Object.entries(table[dateStr] || {})
                    .filter(([r, n]) => r !== role && n)
                    .map(([, n]) => n)
                );
                // 후보자: 역할담당 O, 불가 날짜 X, 같은 날 다른 역할 X
                const candidates = names.filter(
                  name => canTake(name, role, date, constraints) && !usedElsewhere.has(name)
                );
                const invalid = !!current && !candidates.includes(current);
                const noOptionsMessage = () =>
                  roleOwners.length === 0
                    ? `${role} 담당자가 없어요. 역할담당에서 지정해 주세요.`
                    : '이 날 가능한 담당자가 없어요.';

                return (
                  <Td key={dateStr}>
                    <Select
                      options={candidates.map(n => ({ value: n, label: n }))}
                      formatOptionLabel={(opt, { context }) =>
                        context === 'menu' ? `${opt.label} · ${counts[opt.value] || 0}회` : opt.label
                      }
                      value={current ? { value: current, label: current } : null}
                      onChange={selected => onChange(dateStr, role, selected?.value || '')}
                      isClearable
                      placeholder="선택"
                      noOptionsMessage={noOptionsMessage}
                      menuPortalTarget={document.body}
                      styles={{
                        container: base => ({ ...base, minWidth: 110 }),
                        control: base => ({
                          ...base,
                          background: '#232323',
                          borderColor: invalid ? '#ff6b6b' : '#333',
                          color: '#fff',
                          minHeight: 32,
                        }),
                        menuPortal: base => ({ ...base, zIndex: 1000 }),
                        menu: base => ({ ...base, background: '#232323', color: '#fff' }),
                        option: (base, state) => ({
                          ...base,
                          background: state.isFocused ? '#333' : 'transparent',
                          color: '#fff',
                          fontWeight: state.isSelected ? 700 : 400,
                          ':active': { background: '#3a3a3a' },
                        }),
                        noOptionsMessage: base => ({ ...base, color: '#aaa', fontSize: '0.85rem' }),
                        singleValue: base => ({ ...base, color: '#fff' }),
                      }}
                    />
                    {invalid && <Warn>조건 불일치</Warn>}
                  </Td>
                );
              })}
            </tr>
            );
          })}
        </tbody>
      </Table>
      {names.length > 0 && (
        <Summary>
          <span>👥 배정 횟수</span>
          {names.map(n => (
            <Chip key={n}>
              {n} {counts[n] || 0}회
            </Chip>
          ))}
        </Summary>
      )}
      {randomButton && <ButtonWrapper>{randomButton}</ButtonWrapper>}
    </TableWrapper>
  );
};

export default RotationTable;
