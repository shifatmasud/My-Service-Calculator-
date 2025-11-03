import React from 'react';
import { useTheme } from '../../ThemeProvider';

const Header: React.FC = () => {
    const { theme } = useTheme();

    const styles = {
        header: {
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            marginBottom: theme.spacing.l,
        },
        titleContainer: {
            textAlign: 'left',
        },
        title: {
            ...theme.typography.headline.l,
            color: theme.colors.base.content[1],
            margin: 0,
        },
    };

    return (
        <header style={styles.header}>
            <div style={styles.titleContainer}>
                <h1 style={styles.title}>Service Calculator</h1>
            </div>
        </header>
    );
};

export default Header;