import { createAppTheme, ColorModeContext } from '@/theme/theme';

describe('Theme', () => {
    it('creates a dark theme', () => {
        const theme = createAppTheme('dark');
        expect(theme.palette.mode).toBe('dark');
        expect(theme.palette.primary.main).toBe('#a78bfa');
        expect(theme.palette.background.default).toBe('#0f0c29');
    });

    it('creates a light theme', () => {
        const theme = createAppTheme('light');
        expect(theme.palette.mode).toBe('light');
        expect(theme.palette.primary.main).toBe('#7c3aed');
        expect(theme.palette.background.default).toBe('#faf5ff');
    });

    it('uses Inter font family', () => {
        const theme = createAppTheme('dark');
        expect(theme.typography.fontFamily).toContain('Inter');
    });

    it('has rounded shape', () => {
        const theme = createAppTheme('dark');
        expect(theme.shape.borderRadius).toBe(16);
    });

    it('exports ColorModeContext with toggleColorMode', () => {
        expect(ColorModeContext).toBeDefined();
    });
});
