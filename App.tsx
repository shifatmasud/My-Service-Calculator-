

import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { serviceData } from './data';
import { Service, AddOn } from './types';
import ServiceCategory from './components/Section/ServiceCategory';
import Summary from './components/Package/Summary';
import Header from './components/Section/Header';
import ThemeSwitcher from './components/Core/ThemeSwitcher';
import { useTheme } from './ThemeProvider';

type SelectedItemValue = { item: Service | AddOn; quantity: number };

const App: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<Map<string, SelectedItemValue>>(new Map());
  const { theme } = useTheme();

  const handleToggleItem = useCallback((item: Service | AddOn, parent?: Service) => {
    setSelectedItems(prev => {
      const newSelected = new Map(prev);
      const key = parent ? `${parent.name}-${item.name}` : item.name;

      if (newSelected.has(key)) {
        newSelected.delete(key);
        // If un-selecting a parent, also un-select its add-ons
        if ('add_ons' in item && item.add_ons) {
          item.add_ons.forEach(addOn => {
            const addOnKey = `${item.name}-${addOn.name}`;
            if (newSelected.has(addOnKey)) {
              newSelected.delete(addOnKey);
            }
          });
        }
      } else {
        newSelected.set(key, { item, quantity: 1 });
        // If selecting an add-on, ensure its parent is also selected
        if (parent) {
          if (!prev.has(parent.name)) {
            newSelected.set(parent.name, { item: parent, quantity: 1 });
          }
        }
      }
      return newSelected;
    });
  }, []);

  const handleUpdateQuantity = useCallback((key: string, delta: number) => {
    // FIX: Add explicit type for 'prev' to fix TypeScript inference issue.
    setSelectedItems((prev: Map<string, SelectedItemValue>) => {
      const newSelected = new Map(prev);
      const current = newSelected.get(key);
      if (current) {
        const newQuantity = current.quantity + delta;
        if (newQuantity >= 1) {
          newSelected.set(key, { ...current, quantity: newQuantity });
        }
      }
      return newSelected;
    });
  }, []);


  const { totalPrice, totalHours, totalDays } = useMemo(() => {
    let price = 0;
    let hours = 0;
    let days = 0;
    selectedItems.forEach(({ item, quantity }) => {
      price += item.price_bdt * quantity;
      if (item.time_hours) hours += item.time_hours * quantity;
      if ('time_days' in item && item.time_days) days += item.time_days * quantity;
    });
    return { totalPrice: price, totalHours: hours, totalDays: days };
  }, [selectedItems]);

  const styles = {
    appContainer: {
      backgroundColor: theme.colors.base.surface[1],
      color: theme.colors.base.content[2],
      minHeight: '100vh',
      transition: `background-color ${theme.motion.duration.standard}ms ease-in-out`,
      padding: `${theme.spacing.xl}px`,
      paddingBottom: '160px', // Space for the summary dock
    },
    mainContent: {
      maxWidth: '1000px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column' as 'column',
      gap: theme.spacing.xxl,
    },
  };

  return (
    <div style={styles.appContainer}>
      <ThemeSwitcher />
      <div style={styles.mainContent}>
        <Header />
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ServiceCategory
              title="Pages"
              items={serviceData.pages}
              selectedItems={selectedItems}
              onToggleItem={handleToggleItem}
              onUpdateQuantity={handleUpdateQuantity}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <ServiceCategory
              title="Codes"
              items={serviceData.custom_code}
              selectedItems={selectedItems}
              onToggleItem={handleToggleItem}
              onUpdateQuantity={handleUpdateQuantity}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <ServiceCategory
              title="Extras"
              items={serviceData.extras}
              selectedItems={selectedItems}
              onToggleItem={handleToggleItem}
              onUpdateQuantity={handleUpdateQuantity}
            />
          </motion.div>
        </AnimatePresence>
      </div>
      <Summary
        selectedItems={selectedItems}
        totalPrice={totalPrice}
        totalHours={totalHours}
        totalDays={totalDays}
      />
    </div>
  );
};

export default App;