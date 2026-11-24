import React from 'react';
import styled from 'styled-components';

const Button = styled.button<{ $variant: 'primary' | 'ghost' }>`
  background: ${({ theme, $variant }) => ($variant === 'primary' ? theme.colors.primary : 'transparent')};
  color: #fff;
  border: ${({ $variant }) => ($variant === 'primary' ? 'none' : '1px solid #555')};
  border-radius: 8px;
  padding: 12px 32px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 24px;
  &:hover {
    background: ${({ theme, $variant }) => ($variant === 'primary' ? theme.colors.secondary : '#333')};
    color: ${({ $variant }) => ($variant === 'primary' ? '#232323' : '#fff')};
  }
`;

interface RandomAssignButtonProps {
  onClick: () => void;
  label?: string;
  variant?: 'primary' | 'ghost';
  title?: string;
}

const RandomAssignButton: React.FC<RandomAssignButtonProps> = ({
  onClick,
  label = '랜덤 배치',
  variant = 'primary',
  title,
}) => (
  <Button onClick={onClick} $variant={variant} title={title}>
    {label}
  </Button>
);

export default RandomAssignButton;
