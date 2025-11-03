
import React, { useState, useMemo } from 'react';
import { Service, AddOn } from '../../types';
import { useTheme } from '../../ThemeProvider';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../Core/Icon';
import { CaretUp, CaretDown } from '@phosphor-icons/react';
import AnimatedCounter from '../Core/AnimatedCounter';

type SelectedItemValue = { item: Service | AddOn; quantity: number };

interface SummaryProps {
  selectedItems: Map<string, SelectedItemValue>;
  totalPrice: number;
  totalHours: number;
  totalDays: number;
}

const Summary: React.FC<SummaryProps> = ({ selectedItems, totalPrice, totalHours, totalDays }) => {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  const { effectiveDays, effectiveHours } = useMemo(() => {
    let hours = totalHours;
    let days = totalDays;

    if (hours >= 8) {
        days += Math.floor(hours / 8);
        hours = hours % 8;
    }
    return { effectiveDays: days, effectiveHours: hours };
  }, [totalHours, totalDays]);


  const dockVariants = {
    collapsed: { height: '80px' },
    expanded: { height: '40vh' },
  };

  const styles = {
    dock: {
      position: 'fixed',
      bottom: '24px',
      left: '24px',
      right: '24px',
      backgroundColor: theme.colors.base.surface[2],
      borderRadius: theme.radius.xl,
      border: `1px solid ${theme.colors.base.surface[3]}`,
      boxShadow: theme.effects.shadow.medium('rgba(0,0,0,0.25)'),
      color: theme.colors.base.content[1],
      zIndex: 100,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    } as React.CSSProperties,
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: `0 ${theme.spacing.l}px`,
      cursor: 'pointer',
      flexShrink: 0,
      height: '80px',
    },
    totals: {
      display: 'flex',
      alignItems: 'baseline',
      gap: theme.spacing.s,
    },
    rightTotals: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.m,
      color: theme.colors.base.content[2],
    },
    totalLabel: { ...theme.typography.body.l, color: theme.colors.base.content[2], fontWeight: 500 },
    totalPriceContainer: {
        display: 'flex',
        alignItems: 'baseline',
        gap: theme.spacing.s,
        color: theme.colors.primary.surface[1],
    },
    totalCurrency: {
      ...theme.typography.title.s,
      fontWeight: 600,
    },
    totalValue: {
        fontSize: '28px',
        fontWeight: 700,
        lineHeight: 1,
    },
    timeValueContainer: {
        display: 'flex',
        alignItems: 'baseline',
        gap: theme.spacing.xs,
    },
    timeValue: { 
        fontSize: '22px', 
        color: theme.colors.base.content[1], 
        fontWeight: 700,
        marginLeft: theme.spacing.s,
    },
    timeUnit: {
        ...theme.typography.body.l,
        color: theme.colors.base.content[1],
        fontWeight: 700,
        paddingLeft: '2px',
    },
    content: {
      padding: `0 ${theme.spacing.l}px ${theme.spacing.l}px`,
      overflowY: 'auto',
      flexGrow: 1,
    } as React.CSSProperties,
    list: { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: theme.spacing.m },
    listItem: { ...theme.typography.body.m, display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: theme.colors.base.content[2] },
    itemName: { display: 'flex', alignItems: 'center', gap: theme.spacing.s },
    itemPrice: { ...theme.typography.label.m, color: theme.colors.base.content[1], flexShrink: 0 },
    emptyText: { ...theme.typography.body.m, color: theme.colors.base.content[3], textAlign: 'center', paddingTop: theme.spacing.xl }
  };
  
  const selectedItemsArray = Array.from(selectedItems.values());

  return (
    <motion.div
      style={styles.dock}
      variants={dockVariants}
      initial="collapsed"
      animate={isExpanded ? 'expanded' : 'collapsed'}
      transition={{ duration: theme.motion.duration.standard / 1000, ease: theme.motion.easing }}
    >
      <header style={styles.header} onClick={() => setIsExpanded(!isExpanded)}>
        <div style={styles.totals}>
          <span style={styles.totalLabel}>Total:</span>
          <div style={styles.totalPriceContainer}>
              <span style={styles.totalCurrency}>BDT</span>
              <div style={styles.totalValue}>
                <AnimatedCounter value={totalPrice} />
              </div>
          </div>
        </div>
        <div style={styles.rightTotals}>
          <div style={styles.totals}>
            <span style={styles.totalLabel}>Time:</span>
            <div style={styles.timeValueContainer}>
                {effectiveDays > 0 && (
                  <div style={{...styles.timeValueContainer, gap: '2px'}}>
                    <div style={styles.timeValue}><AnimatedCounter value={effectiveDays} /></div>
                    <span style={styles.timeUnit}>d</span>
                  </div>
                )}
                {effectiveHours > 0 && (
                  <div style={{...styles.timeValueContainer, gap: '2px'}}>
                    <div style={styles.timeValue}><AnimatedCounter value={effectiveHours} /></div>
                    <span style={styles.timeUnit}>h</span>
                  </div>
                )}
                {totalPrice > 0 && effectiveDays === 0 && effectiveHours === 0 && (
                    <div style={styles.timeValue}>0h</div>
                )}
            </div>
          </div>
          {isExpanded ? <CaretDown size={20} weight="bold" /> : <CaretUp size={20} weight="bold" />}
        </div>
      </header>
      <div style={styles.content}>
        <AnimatePresence>
        {isExpanded && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.15 } }}
                exit={{ opacity: 0 }}
            >
                {selectedItemsArray.length > 0 ? (
                    <ul style={styles.list}>
                    {selectedItemsArray.map(({ item, quantity }, index) => (
                        <li key={`${item.name}-${index}`} style={styles.listItem}>
                        <span style={styles.itemName}><Icon name={item.icon} size={18} /> {item.name} {quantity > 1 ? `(x${quantity})` : ''}</span>
                        <span style={styles.itemPrice}>{item.price_bdt === 0 ? 'Free' : `BDT ${(item.price_bdt * quantity).toLocaleString()}`}</span>
                        </li>
                    ))}
                    </ul>
                ) : (
                    <p style={styles.emptyText}>Select items to build your estimate.</p>
                )}
            </motion.div>
        )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Summary;
