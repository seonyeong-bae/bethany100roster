import React from 'react';
import styled from 'styled-components';

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

const Label = styled.label`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 1rem;
  margin-right: 12px;
`;

const Comment = styled.label`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 1rem;
  margin-right: 12px;
`;

const Input = styled.input`
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-size: 1rem;
  width: 330px;
`;

interface RoleInputProps {
  value: string;
  onChange: (value: string) => void;
}

const RoleInput: React.FC<RoleInputProps> = ({ value, onChange }) => (
  <InputWrapper>
    <Label>✔️ 역할</Label>
    <Input
      type="text"
      placeholder="예: DT, SW, CAM, CG, ENG1, ENG2, 사진"
      value={value}
      onChange={e => onChange(e.target.value)}
    />
    &nbsp;&nbsp;&nbsp;&nbsp;
    <Comment>예시: DT, SW, CAM, CG, ENG1, ENG2, 사진</Comment>
  </InputWrapper>
);

export default RoleInput;
