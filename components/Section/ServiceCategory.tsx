
import React from 'react';
import { Service, AddOn } from '../../types';
import ServiceItem from '../Package/ServiceItem';
import { useTheme } from '../../ThemeProvider';
import { motion } from 'framer-motion';
import { useWindowSize } from '../../hooks/useWindowSize';

type SelectedItemValue = { item: Service | AddOn; quantity: number };

interface ServiceCategoryProps {
  title: string;
  items: Service[];
  selectedItems: Map<string, SelectedItemValue>;
  onToggleItem: (item: Service | AddOn, parent?: Service) => void;
  onUpdateQuantity: (key: string, delta: number) => void;
}

const ServiceCategory: React.FC<ServiceCategoryProps> = ({ title, items, selectedItems, onToggleItem, onUpdateQuantity }) => {
  const { theme } = useTheme();
  const { width } = useWindowSize();
  const isMobile = width < 768;

  const styles = {
    section: {
      backgroundColor: theme.colors.base.surface[2],
      borderRadius: theme.radius.xl,
      padding: isMobile ? theme.spacing.l : theme.spacing.xl,
      display: 'flex',
      flexDirection: 'column' as 'column',
      gap: theme.spacing.l,
    },
    title: {
      ...theme.typography.title.l,
      color: theme.colors.base.content[1],
      margin: 0,
    },
    list: {
      display: 'grid',
      gap: theme.spacing.l,
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(200px, 1fr))',
    },
  };

  return (
    <motion.section style={styles.section} layout>
      <h2 style={styles.title}>{title}</h2>
      <div style={styles.list}>
        {items.map((item) => (
          <ServiceItem
            key={item.name}
            item={item}
            selectedItems={selectedItems}
            onToggleItem={onToggleItem}
            onUpdateQuantity={onUpdateQuantity}
          />
        ))}
      </div>
    </motion.section>
  );
};

export default ServiceCategory;