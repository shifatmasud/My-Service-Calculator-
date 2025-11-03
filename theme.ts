const createColorTokens = (base: { [key: string]: string }) => ({
  base: {
    surface: { 1: base.background, 2: base.surface, 3: base.overlay },
    content: { 1: base.content1, 2: base.content2, 3: base.content3 },
  },
  primary: {
    surface: { 1: base.primary },
    content: { 1: base.onPrimary },
  },
  feedback: {
    success: { surface: { 1: base.green }, content: { 1: '#FFFFFF' } },
    warning: { surface: { 1: base.orange }, content: { 1: '#FFFFFF' } },
    error: { surface: { 1: base.red }, content: { 1: '#FFFFFF' } },
    focus: { surface: { 1: base.blue }, content: { 1: '#FFFFFF' } },
  },
});

const lightPalette = {
  background: '#F5F5F5', // Off-white
  surface: '#FFFFFF',    // White
  overlay: '#EAEAEA',    // Light Silver
  content1: '#111111',    // Black
  content2: '#555555',    // Dark Silver
  content3: '#888888',    // Silver
  primary: '#F56D00',    // Safe Orange
  onPrimary: '#FFFFFF',
  green: '#10B981', orange: '#F59E0B', red: '#EF4444', blue: '#3B82F6',
};

const darkPalette = {
  background: '#111111',    // Near Black
  surface: '#181818',    // Darker Gray (for better contrast)
  overlay: '#2A2A2A',    // Darker Silver
  content1: '#FFFFFF',    // White
  content2: '#AFAFAF',    // Silver
  content3: '#777777',    // Gray
  primary: '#FF7A00',    // Safe Orange
  onPrimary: '#FFFFFF',
  green: '#34D399', orange: '#FBBF24', red: '#F87171', blue: '#60A5FA',
};


const baseSpacing = 4;
const baseRadius = 4;
const baseDuration = 100;

const theme = {
  spacing: {
    xs: baseSpacing,       // 4px
    s: baseSpacing * 2,    // 8px
    m: baseSpacing * 3,    // 12px
    l: baseSpacing * 4,    // 16px
    xl: baseSpacing * 6,   // 24px
    xxl: baseSpacing * 8,  // 32px
  },
  radius: {
    s: baseRadius * 2,     // 8px
    m: baseRadius * 3,     // 12px
    l: baseRadius * 5,     // 20px
    xl: baseRadius * 6,    // 24px
    full: '9999px',
  },
  typography: {
    body: {
      l: { fontSize: '16px', fontWeight: 400, lineHeight: 1.6 },
      m: { fontSize: '14px', fontWeight: 400, lineHeight: 1.5 },
      s: { fontSize: '12px', fontWeight: 500, lineHeight: 1.5 },
    },
    label: {
      l: { fontSize: '16px', fontWeight: 500, lineHeight: 1.3 },
      m: { fontSize: '14px', fontWeight: 600, lineHeight: 1.2 },
      s: { fontSize: '12px', fontWeight: 500, lineHeight: 1.2, letterSpacing: '0.05em' },
    },
    title: {
      l: { fontSize: '24px', fontWeight: 700, lineHeight: 1.2 },
      m: { fontSize: '20px', fontWeight: 700, lineHeight: 1.2 },
      s: { fontSize: '18px', fontWeight: 600, lineHeight: 1.2 },
    },
    headline: {
      l: { fontSize: '48px', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em' },
      m: { fontSize: '36px', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em' },
    },
    display: {
      l: { fontSize: '60px', fontWeight: 700, lineHeight: 1.0, letterSpacing: '-0.03em' },
    }
  },
  motion: {
    duration: {
      subtle: 150,
      standard: 300,
    },
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  effects: {
    shadow: {
      soft: (color: string) => `0 4px 6px -1px ${color}, 0 2px 4px -2px ${color}`,
      medium: (color: string) => `0 10px 15px -3px ${color}, 0 4px 6px -4px ${color}`,
    }
  },
  colors: {
    light: createColorTokens(lightPalette),
    dark: createColorTokens(darkPalette),
  }
};

export type Theme = typeof theme & { colors: typeof theme.colors.light };

export default theme;