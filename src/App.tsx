import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Calendar from './components/Calendar';
import { DefaultTheme } from 'styled-components';
import RoleInput from './components/RoleInput';
import NameInput from './components/NameInput';
import RoleAssignment from './components/RoleAssignment';
import UnavailableDates from './components/UnavailableDates';
import RotationTable from './components/RotationTable';
import RandomAssignButton from './components/RandomAssignButton';
import ExcelDownloadButton from './components/ExcelDownloadButton';
import { autoAssign } from './utils/rotation';
const XLSX = require('xlsx');

const Container = styled.div<{ theme: DefaultTheme }>`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 0;

  @media (max-width: 600px) {
    padding: 16px 0;
  }
`;

const Card = styled.div<{ theme: DefaultTheme }>`
  background: ${({ theme }) => theme.colors.card};
  border-radius: 24px;
  box-shadow: 0 4px 32px rgba(0,0,0,0.25);
  padding: 40px 48px;
  min-width: 900px;
  max-width: 1200px;
  margin-bottom: 32px;

  @media (max-width: 900px) {
    min-width: 0;
    max-width: 100vw;
    padding: 32px 8px;
  }
  @media (max-width: 600px) {
    padding: 16px 2vw;
    width: 98vw;
    min-width: 0;
    max-width: 100vw;
  }
`;

const Title = styled.h1<{ theme: DefaultTheme }>`
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;
  margin-bottom: 16px;
`;

const Guide = styled.h4<{ theme: DefaultTheme }>`
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  margin-bottom: 16px;
`;

const Footer = styled.footer`
  width: 100%;
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 1rem;
  margin-top: 48px;
  margin-bottom: 16px;
`;

const StyledCalendar = styled(Calendar)`
  width: 100%;
  max-width: 400px;
  min-width: 0;
  overflow-x: auto;
  @media (max-width: 500px) {
    max-width: 98vw;
    font-size: 0.9rem;
    padding: 8px;
  }
`;

const loadJSON = <T,>(key: string, fallback: T): T => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? (JSON.parse(saved) as T) : fallback;
  } catch {
    return fallback;
  }
};

const App: React.FC = () => {
  // 로컬스토리지에서 날짜 관련 값 복원 (ISO 문자열 → Date)
  const [selectedDates, setSelectedDates] = useState<Date[]>(() =>
    loadJSON<string[]>('selectedDates', []).map(s => new Date(s))
  );
  const [currentMonth, setCurrentMonth] = useState<Date>(() => {
    const saved = localStorage.getItem('currentMonth');
    return saved ? new Date(saved) : new Date();
  });

  // 역할/이름 입력값
  const [roleInput, setRoleInput] = useState('');
  const [nameInput, setNameInput] = useState('');

  // 역할/이름 배열
  const roles = roleInput.split(',').map(r => r.trim()).filter(Boolean);
  const names = nameInput.split(',').map(n => n.trim()).filter(Boolean);

  const [assignments, setAssignments] = useState<{ [name: string]: string[] }>({});
  const [unavailable, setUnavailable] = useState<{ [name: string]: Date[] }>(() => {
    const saved = loadJSON<{ [name: string]: string[] }>('unavailable', {});
    const restored: { [name: string]: Date[] } = {};
    Object.entries(saved).forEach(([name, dates]) => {
      restored[name] = dates.map(s => new Date(s));
    });
    return restored;
  });
  const [rotationTable, setRotationTable] = useState<{ [date: string]: { [role: string]: string } }>({});

  // --- 로컬스토리지에서 불러오기 ---
  useEffect(() => {
    const savedRoleInput = localStorage.getItem('roleInput');
    const savedNameInput = localStorage.getItem('nameInput');
    if (savedRoleInput) setRoleInput(savedRoleInput);
    if (savedNameInput) setNameInput(savedNameInput);
  }, []);

  useEffect(() => {
    const savedAssignments = localStorage.getItem('assignments');
    const savedNameInput = localStorage.getItem('nameInput');
    if (savedAssignments && savedNameInput) {
      const parsedNames = savedNameInput.split(',').map(n => n.trim()).filter(Boolean);
      if (parsedNames.length > 0) {
        setAssignments(JSON.parse(savedAssignments));
      }
    }
  }, []);

  // --- 값이 바뀔 때마다 저장 ---
  useEffect(() => {
    localStorage.setItem('roleInput', roleInput);
  }, [roleInput]);
  useEffect(() => {
    localStorage.setItem('nameInput', nameInput);
  }, [nameInput]);
  useEffect(() => {
    localStorage.setItem('assignments', JSON.stringify(assignments));
  }, [assignments]);
  useEffect(() => {
    localStorage.setItem('selectedDates', JSON.stringify(selectedDates.map(d => d.toISOString())));
  }, [selectedDates]);
  useEffect(() => {
    localStorage.setItem('currentMonth', currentMonth.toISOString());
  }, [currentMonth]);
  useEffect(() => {
    const serialized: { [name: string]: string[] } = {};
    Object.entries(unavailable).forEach(([name, dates]) => {
      serialized[name] = dates.map(d => d.toISOString());
    });
    localStorage.setItem('unavailable', JSON.stringify(serialized));
  }, [unavailable]);

  const handleRoleAssign = (name: string, roles: string[]) => {
    setAssignments(prev => ({ ...prev, [name]: roles }));
  };

  const handleUnavailable = (name: string, dates: Date[]) => {
    setUnavailable(prev => ({ ...prev, [name]: dates }));
  };

  const handleTableChange = (dateStr: string, role: string, name: string) => {
    setRotationTable(prev => ({
      ...prev,
      [dateStr]: { ...prev[dateStr], [role]: name }
    }));
  };

  const canAutoAssign = () => {
    if (selectedDates.length === 0) {
      alert('캘린더에서 날짜를 먼저 선택해 주세요.');
      return false;
    }
    if (roles.length === 0 || names.length === 0) {
      alert('역할과 이름을 모두 입력해 주세요.');
      return false;
    }
    const hasRoleAssignment = names.some(name => assignments[name] && assignments[name].length > 0);
    if (!hasRoleAssignment) {
      alert('역할담당에서 최소 한 명 이상 역할을 지정해 주세요.');
      return false;
    }
    return true;
  };

  const runAutoAssign = (keepExisting: boolean) => {
    if (!canAutoAssign()) return;
    const newTable = autoAssign(
      selectedDates,
      roles,
      { names, assignments, unavailable },
      rotationTable,
      keepExisting
    );
    setRotationTable(newTable);

    const emptyCount = Object.values(newTable).reduce(
      (sum, row) => sum + roles.filter(r => !row[r]).length,
      0
    );
    if (emptyCount > 0) {
      alert(`가능한 담당자가 없어 비어 있는 칸이 ${emptyCount}개 있어요. 역할담당이나 불가능한 날짜를 확인해 주세요.`);
    }
  };

  // 수동 배정은 유지하고 빈 칸만 채움
  const handleAutoFill = () => runAutoAssign(true);
  // 전부 새로 배정
  const handleRandomAssign = () => runAutoAssign(false);
  const handleReset = () => {
    if (window.confirm('배정표를 모두 비울까요?')) setRotationTable({});
  };

  const handleExcelDownload = () => {
    if (selectedDates.length === 0) {
      alert('캘린더에서 날짜를 먼저 선택해 주세요.');
      return;
    }
    // 로테이션 표에 한 명도 배정되지 않은 경우 체크
    const hasAnyAssignment = Object.values(rotationTable).some(dateObj =>
      Object.values(dateObj).some(name => name && name.trim() !== '')
    );
    if (!hasAnyAssignment) {
      alert('로테이션 배정표에 한 명 이상 배정되어야 다운로드할 수 있습니다.');
      return;
    }
    // 헤더: 날짜(가로) 배열
    const sortedDates = [...selectedDates].sort((a, b) => a.getTime() - b.getTime());
    const dateHeaders = sortedDates.map(date =>
      date.toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit', weekday: 'short' })
    );

    // 데이터: 역할별로 이름을 매칭
    const data = roles.map(role => {
      const row: any = { 역할: role };
      sortedDates.forEach(date => {
        const dateStr = date.toISOString();
        row[date.toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit', weekday: 'short' })] =
          rotationTable[dateStr]?.[role] || '';
      });
      return row;
    });

    // 시트 생성
    const ws = XLSX.utils.json_to_sheet(data, { header: ['역할', ...dateHeaders] });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '로테이션표');

    // 파일 저장
    // 예: 2026_멀티팀_11월_로테이션.xlsx (저장하는 시점의 년/월)
    const now = new Date();
    XLSX.writeFile(wb, `${now.getFullYear()}_멀티팀_${now.getMonth() + 1}월_로테이션.xlsx`);
  };

  return (
    <>
      <Container>
        <Card>
          <Title>📸 멀티팀 로테이션 스케줄러 📸</Title>
          <Guide> 👇🏻 배정 날짜를 아래에서 선택해주세요.</Guide>
          <StyledCalendar
            selectedDates={selectedDates}
            setSelectedDates={setSelectedDates}
            currentMonth={currentMonth}
            setCurrentMonth={setCurrentMonth}
          />
        </Card>
        <Card>
          <RoleInput value={roleInput} onChange={setRoleInput} />
          <NameInput value={nameInput} onChange={setNameInput} />
          <RoleAssignment
            names={names}
            roles={roles}
            assignments={assignments}
            onChange={handleRoleAssign}
          />
          <UnavailableDates
            names={names}
            dates={selectedDates}
            unavailable={unavailable}
            onChange={handleUnavailable}
          />
        </Card>
        <Card>
          <RotationTable
            dates={selectedDates}
            roles={roles}
            assignments={assignments}
            unavailable={unavailable}
            table={rotationTable}
            names={names}
            onChange={handleTableChange}
            randomButton={
              <>
                <RandomAssignButton variant="ghost" label="초기화" onClick={handleReset} />
                <RandomAssignButton
                  variant="ghost"
                  label="빈 칸 자동 배정"
                  title="수동으로 지정한 칸은 그대로 두고 빈 칸만 채워요"
                  onClick={handleAutoFill}
                />
                <RandomAssignButton
                  label="전체 랜덤 배치"
                  title="모든 칸을 새로 배정해요"
                  onClick={handleRandomAssign}
                />
                <ExcelDownloadButton onClick={handleExcelDownload} />
              </>
            }
          />
        </Card>
      </Container>
      <Footer>
        <p>© 2025 베다니교회 청년부 젊은백성</p>
        <p>@bethany.100cast by 멀티팀 All rights reserved. v1.0.0</p>
      </Footer>
    </>
  );
};

export default App;
