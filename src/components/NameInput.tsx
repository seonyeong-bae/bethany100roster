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

interface NameInputProps {
  value: string;
  onChange: (value: string) => void;
}

const NameInput: React.FC<NameInputProps> = ({ value, onChange }) => (
  <InputWrapper>
    <Label>✔️ 이름</Label>
    <Input
      type="text"
      placeholder="예: 은지, 승렬"
      value={value}
      onChange={e => onChange(e.target.value)}
    />
    &nbsp;&nbsp;&nbsp;&nbsp;
    <Comment>현재 멤버: 은지, 승렬, 상윤, 선영, 영훈, 은진, 기찬, 태희, 현종, 은재, 찬영, 유진, 다영</Comment>
  </InputWrapper>
);

export default NameInput;
