import React from 'react';
import styled from 'styled-components';

const Button = styled.button`
  background: ${({ theme }) => theme.colors.secondary};
  color: #232323;
  border: none;
  border-radius: 8px;
  padding: 12px 32px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  margin-left: 16px;
  margin-top: 24px;
  height: 48px;
  display: flex;
  align-items: center;
  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: #fff;
  }
`;

interface ExcelDownloadButtonProps {
  onClick: () => void;
}

const ExcelDownloadButton: React.FC<ExcelDownloadButtonProps> = ({ onClick }) => (
  <Button onClick={onClick}>엑셀 다운로드</Button>
);

export default ExcelDownloadButton;
