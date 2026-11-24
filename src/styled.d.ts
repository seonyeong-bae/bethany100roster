import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string; secondary: string; background: string; surface: string; card: string;
      text: string; textSecondary: string; border: string; selected: string;
      error: string; success: string; warning: string;
    };
    spacing: { xs: string; sm: string; md: string; lg: string; xl: string };
    borderRadius: { sm: string; md: string; lg: string; xl: string };
  }
}
