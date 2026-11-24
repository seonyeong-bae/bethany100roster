import React, { useCallback } from 'react';
import styled from 'styled-components';
import CalendarLib from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const CalendarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${({ theme }) => theme.colors.card};
  border-radius: 24px;
  padding: 32px 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 32px rgba(0,0,0,0.25);
`;

const MonthNav = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
`;

const ArrowButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 2rem;
  cursor: pointer;
  margin: 0 16px;
  &:hover {
    opacity: 0.8;
  }
`;

const MonthText = styled.span`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.text};
  font-weight: bold;
`;

const StyledCalendar = styled(CalendarLib)`
  width: 100%;
  max-width: 400px;
  background: ${({ theme }) => theme.colors.surface};
  border: none;
  border-radius: 12px;
  padding: 16px;

  .react-calendar__month-view__weekdays {
    text-align: center;
    text-transform: none;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
  }
  .react-calendar__month-view__weekdays__weekday {
    text-decoration: none !important;
    border-bottom: none !important;
  }
  .react-calendar__tile {
    padding: 12px;
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.surface};
    border-radius: 8px;
    transition: background 0.2s;
    &:hover {
      background: ${({ theme }) => theme.colors.selected}33;
    }
    &--active, &.selected {
      background: ${({ theme }) => theme.colors.primary} !important;
      color: #fff !important;
    }
    &.react-calendar__tile--neighboringMonth {
      color: #888 !important;
      background: ${({ theme }) => theme.colors.surface};
      pointer-events: none;
      opacity: 0.4;
    }
  }

  .react-calendar__navigation button {
    color: ${({ theme }) => theme.colors.text};
    min-width: 44px;
    background: none;
    font-size: 16px;
    &:hover {
      background: ${({ theme }) => theme.colors.primary}20;
    }
  }
`;

interface CalendarProps {
  // 선택된 날짜
  selectedDates: Date[];
  setSelectedDates: React.Dispatch<React.SetStateAction<Date[]>>;
  // 현재 월
  currentMonth: Date;
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
}

const Calendar: React.FC<CalendarProps> = ({
  selectedDates,
  setSelectedDates,
  currentMonth,
  setCurrentMonth,
}) => {
  // 월 이동
  const handlePrevMonth = () => {
    const prev = new Date(currentMonth);
    prev.setMonth(prev.getMonth() - 1);
    setCurrentMonth(prev);
  };
  const handleNextMonth = () => {
    const next = new Date(currentMonth);
    next.setMonth(next.getMonth() + 1);
    setCurrentMonth(next);
  };

  // 날짜 복수 선택
  const handleDateClick = useCallback((date: Date) => {
    if (date.getMonth() !== currentMonth.getMonth()) return;
    setSelectedDates(prev => {
      const exists = prev.some(d => d.toDateString() === date.toDateString());
      if (exists) {
        return prev.filter(d => d.toDateString() !== date.toDateString());
      } else {
        return [...prev, date];
      }
    });
  }, [currentMonth, setSelectedDates]);

  // 타일에 선택 표시
  const tileClassName = useCallback(({ date }: { date: Date; view: string }) => {
      const isNeighboringMonth = date.getMonth() !== currentMonth.getMonth();
      const isSelected = selectedDates.some(d => d.toDateString() === date.toDateString());

      if (isSelected) {
        return 'selected';
      }
      if (isNeighboringMonth) {
        return 'react-calendar__tile--neighboringMonth';
      }
      return 'react-calendar__tile';
    },
    [selectedDates, currentMonth]
  );

  return (
    <CalendarWrapper>
      <MonthNav>
        <ArrowButton onClick={handlePrevMonth}>{'<'}</ArrowButton>
        <MonthText>
          {currentMonth.getFullYear()}년 {currentMonth.getMonth() + 1}월
        </MonthText>
        <ArrowButton onClick={handleNextMonth}>{'>'}</ArrowButton>
      </MonthNav>

      <StyledCalendar
        key={currentMonth.toString() + selectedDates.map(d => d.toDateString()).join()}
        locale="ko-KR"
        calendarType="gregory"
        activeStartDate={currentMonth}
        onActiveStartDateChange={({ activeStartDate }) => {
          if (activeStartDate) setCurrentMonth(activeStartDate);
        }}
        onClickDay={handleDateClick}
        tileClassName={tileClassName}
      />
    </CalendarWrapper>
  );
};

export default Calendar;
