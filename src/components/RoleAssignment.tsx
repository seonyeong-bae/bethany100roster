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

const ALL = '__ALL__';

interface RoleAssignmentProps {
  names: string[];
  roles: string[];
  assignments: { [name: string]: string[] };
  onChange: (name: string, roles: string[]) => void;
}

const RoleAssignment: React.FC<RoleAssignmentProps> = ({ names, roles, assignments, onChange }) => {
  const options = [
    { value: ALL, label: '전체' },
    ...roles.map(role => ({ value: role, label: role })),
  ];

  return (
    <div>
      <h4>😀 역할담당</h4>
      {names.map(name => {
        const current = assignments[name] || [];
        const allSelected = roles.length > 0 && roles.every(r => current.includes(r));
        return (
        <Row key={name}>
          <Name>{name}</Name>
          <Select
            isMulti
            options={options}
            value={current.map(r => ({ value: r, label: r }))}
            isOptionSelected={(option, selectValue) =>
              option.value === ALL
                ? allSelected
                : selectValue.some(s => s.value === option.value)
            }
            onChange={(selected, actionMeta) => {
              if (actionMeta.option?.value === ALL) {
                onChange(name, actionMeta.action === 'select-option' ? [...roles] : []);
                return;
              }
              onChange(name, selected.map(s => s.value).filter(v => v !== ALL));
            }}
            placeholder="선택"
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

export default RoleAssignment;
