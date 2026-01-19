import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle<{ isRTL: boolean }>`
  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
  }

  body {
    font-family: ${({ isRTL }) => 
      isRTL 
        ? "'Cairo', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
        : "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    };
    background-color: ${({ theme }) => theme.colors.bg.primary};
    color: ${({ theme }) => theme.colors.text.primary};
    line-height: 1.5;
    direction: ${({ isRTL }) => (isRTL ? 'rtl' : 'ltr')};
    transition: background-color 0.3s ease, color 0.3s ease;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    min-height: 100vh;
  }

  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    line-height: 1.2;
    margin-bottom: 0.5em;
  }

  h1 { font-size: 2.5rem; }
  h2 { font-size: 2rem; }
  h3 { font-size: 1.75rem; }
  h4 { font-size: 1.5rem; }
  h5 { font-size: 1.25rem; }
  h6 { font-size: 1rem; }

  p {
    margin-bottom: 1rem;
  }

  a {
    color: ${({ theme }) => theme.colors.elegant.emerald};
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: ${({ theme }) => theme.colors.elegant.emeraldDark};
    }
  }

  button {
    cursor: pointer;
    font-family: inherit;
    border: none;
    background: none;
  }

  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
  }

  ul, ol {
    list-style: none;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.bg.tertiary};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.elegant.emeraldDark};
    border-radius: 4px;
    
    &:hover {
      background: ${({ theme }) => theme.colors.elegant.emerald};
    }
  }

  /* Selection */
  ::selection {
    background-color: ${({ theme }) => theme.colors.elegant.emerald + '40'};
    color: ${({ theme }) => theme.colors.text.primary};
  }

  /* Focus styles */
  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.elegant.emerald};
    outline-offset: 2px;
  }

  /* Utility classes */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
`;
