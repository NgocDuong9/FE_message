export const MCP_CONFIG = {
  // Figma file ID của bạn
  fileId: process.env.NEXT_PUBLIC_FIGMA_FILE_ID,

  // Access token của Figma
  accessToken: process.env.NEXT_PUBLIC_FIGMA_ACCESS_TOKEN,

  // Các node IDs cần thiết
  nodes: {
    // Thêm các node IDs của bạn ở đây
    button: 'button-node-id',
    input: 'input-node-id',
    card: 'card-node-id',
    // ... thêm các nodes khác
  },

  // Các styles mặc định
  defaultStyles: {
    colors: {
      primary: '#007AFF',
      secondary: '#5856D6',
      success: '#34C759',
      danger: '#FF3B30',
      warning: '#FF9500',
      info: '#5856D6',
      light: '#F2F2F7',
      dark: '#1C1C1E',
    },
    typography: {
      fontFamily:
        'SF Pro Text, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
      fontSize: {
        xs: '12px',
        sm: '14px',
        base: '16px',
        lg: '18px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '30px',
        '4xl': '36px',
      },
    },
    spacing: {
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px',
      '2xl': '48px',
    },
    borderRadius: {
      none: '0',
      sm: '4px',
      md: '8px',
      lg: '12px',
      xl: '16px',
      full: '9999px',
    },
  },
};
