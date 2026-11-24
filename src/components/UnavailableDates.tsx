import React from 'react';
import styled from 'styled-components';
import Select from 'react-select';
import CheckboxOption from './CheckboxOption';

const Row = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

const Name = styled.span`
  min-width: 60px;
  color: ${({ theme }) => theme.colors.text};
  margin-right: 12px;
`;

const formatDate = (date: Date) =>
  date.toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit', weekday: 'short' });

const ALL = '__ALL__';

interface UnavailableDatesProps {
  names: string[];
  dates: Date[];
  unavailable: { [name: string]: Date[] };
  onChange: (name: string, dates: Date[]) => void;
}

const UnavailableDates: React.FC<UnavailableDatesProps> = ({ names, dates, unavailable, onChange }) => {
  const options = [
    { value: ALL, label: '전체' },
    ...dates.map(date => ({
      value: date.toISOString(),
      label: formatDate(date),
    })),
  ];

  return (
    <div>
      <h4>❌ 참여 불가능한 날짜</h4>
      {names.map(name => {
        const current = unavailable[name] || [];
        const currentKeys = current.map(d => d.toISOString());
        const allSelected =
          dates.length > 0 && dates.every(d => currentKeys.includes(d.toISOString()));
        return (
        <Row key={name}>
          <Name>{name}</Name>
          <Select
            isMulti
            options={options}
            value={current.map(d => ({
              value: d.toISOString(),
              label: formatDate(d),
            }))}
            isOptionSelected={(option, selectValue) =>
              option.value === ALL
                ? allSelected
                : selectValue.some(s => s.value === option.value)
            }
            onChange={(selected, actionMeta) => {
              if (actionMeta.option?.value === ALL) {
                onChange(name, actionMeta.action === 'select-option' ? [...dates] : []);
                return;
              }
              onChange(
                name,
                selected.filter(s => s.value !== ALL).map(s => new Date(s.value))
              );
            }}
            placeholder="날짜 선택"
            components={{ Option: CheckboxOption }}
            closeMenuOnSelect={false}
            hideSelectedOptions={false}
            styles={{
              container: base => ({ ...base, minWidth: 200 }),
              control: base => ({ ...base, background: '#232323', borderColor: '#333', color: '#fff' }),
              menu: base => ({ ...base, background: '#232323', color: '#fff' }),
              option: (base, state) => ({
                ...base,
                background: state.isFocused ? '#333' : 'transparent',
                color: '#fff',
                ':active': { background: '#3a3a3a' },
              }),
              multiValue: base => ({ ...base, background: '#ffb74d', color: '#232323' }),
            }}
          />
        </Row>
        );
      })}
    </div>
  );
};

export default UnavailableDates;
