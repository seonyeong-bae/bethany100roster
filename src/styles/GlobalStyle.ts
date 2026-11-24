import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    font-family: 'Pretendard', 'Noto Sans KR', Arial, sans-serif;
    margin: 0;
    padding: 0;
    min-height: 100vh;
  }
  * {
    box-sizing: border-box;
  }
  ::-webkit-scrollbar {
    width: 8px;
    background: ${({ theme }) => theme.colors.surface};
  }
  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.card};
    border-radius: 4px;
  }
`;

export default GlobalStyle;
