import React from 'react';
import { components, OptionProps } from 'react-select';

// 커스텀 Option: 체크박스 + 라벨
const CheckboxOption = (props: OptionProps<any, true>) => (
  <components.Option {...props}>
    <input
      type="checkbox"
      checked={props.isSelected}
      onChange={() => {}}
      style={{ marginRight: 8 }}
      tabIndex={-1}
      readOnly
      aria-label={props.label}
    />
    <span>{props.label}</span>
  </components.Option>
);

export default CheckboxOption;
