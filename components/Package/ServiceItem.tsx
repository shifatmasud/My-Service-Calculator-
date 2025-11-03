
import React from 'react';
import { Service, AddOn } from '../../types';
import { useTheme } from '../../ThemeProvider';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../Core/Icon';
import { Minus, Plus } from '@phosphor-icons/react';
import AnimatedCounter from '../Core/AnimatedCounter';

type SelectedItemValue = { item: Service | AddOn; quantity: number };

interface ServiceItemProps {
  item: Service;
  selectedItems: Map<string, SelectedItemValue>;
  onToggleItem: (item: Service | AddOn, parent?: Service) => void;
  onUpdateQuantity: (key: string, delta: number) => void;
}

const ServiceItem: React.FC<ServiceItemProps> = ({ item, selectedItems, onToggleItem, onUpdateQuantity }) => {
  const { theme } = useTheme();
  const selectedValue = selectedItems.get(item.name);
  const isSelected = !!selectedValue;
  const quantity = selectedValue?.quantity || 0;

  const hasAddOns = item.add_ons && item.add_ons.length > 0;

  const formatPrice = (price: number) => {
    if (price === 0) return 'Free';
    if (price < 1000) return `BDT ${price}`;
    const thousands = price / 1000;
    return `BDT ${thousands.toLocaleString('en-US', { maximumFractionDigits: 1 })}K`;
  }

  const handleQuantityClick = (e: React.MouseEvent, delta: number) => {
    e.stopPropagation();
    onUpdateQuantity(item.name, delta);
  };

  const styles = {
    wrapper: {
        backgroundColor: theme.colors.base.surface[2],
        borderRadius: theme.radius.l,
        border: `1.5px solid ${isSelected ? theme.colors.primary.surface[1] : theme.colors.base.surface[3]}`,
        transition: `border-color ${theme.motion.duration.standard}ms`,
        overflow: 'hidden',
        position: 'relative',
    },
    mainCard: {
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.s,
      padding: theme.spacing.l,
      aspectRatio: '1 / 1',
      textAlign: 'center',
      position: 'relative',
    } as React.CSSProperties,
    icon: {
      color: isSelected ? theme.colors.primary.surface[1] : theme.colors.base.content[2],
      transition: `color ${theme.motion.duration.subtle}ms`,
    },
    name: { 
      ...theme.typography.label.m, 
      color: theme.colors.base.content[1],
      height: '2.5em',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    price: { 
      ...theme.typography.label.s,
      backgroundColor: theme.colors.base.surface[1],
      color: theme.colors.base.content[2],
      padding: `${theme.spacing.xs}px ${theme.spacing.s}px`,
      borderRadius: theme.radius.full,
    },
    quantityCounter: {
      position: 'absolute',
      top: theme.spacing.s,
      right: theme.spacing.s,
      backgroundColor: theme.colors.base.surface[1],
      borderRadius: theme.radius.full,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.s,
      padding: `${theme.spacing.xs}px`,
      color: theme.colors.base.content[1],
      boxShadow: theme.effects.shadow.soft('rgba(0,0,0,0.1)'),
      zIndex: 2,
    } as React.CSSProperties,
    quantityButton: {
      width: '28px',
      height: '28px',
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.base.surface[3],
      border: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      color: theme.colors.base.content[2],
    },
    quantityValue: {
      ...theme.typography.label.m,
      minWidth: '20px',
      textAlign: 'center',
    },
    addOnsContainer: {
        padding: `0 ${theme.spacing.l}px ${theme.spacing.l}px ${theme.spacing.l}px`,
        display: 'flex',
        flexDirection: 'column' as 'column',
        gap: theme.spacing.m,
    },
    addOnItem: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: theme.spacing.m,
        minHeight: '40px',
        cursor: isSelected ? 'pointer' : 'not-allowed',
        opacity: isSelected ? 1 : 0.6,
        transition: `all ${theme.motion.duration.subtle}ms`,
    } as React.CSSProperties,
    addOnLeftContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.m,
    },
    addOnCheckbox: {
        width: '24px',
        height: '24px',
        border: `1.5px solid ${theme.colors.base.content[3]}`,
        borderRadius: theme.radius.full, // Circular checkbox
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        backgroundColor: theme.colors.base.surface[1],
        transition: 'border-color 0.2s',
    },
    addOnCheckIcon: {
        width: '12px',
        height: '12px',
        backgroundColor: theme.colors.primary.surface[1],
        borderRadius: theme.radius.full,
    },
    addOnName: {
        ...theme.typography.body.m,
        color: theme.colors.base.content[2],
    },
    addOnPrice: {
        ...theme.typography.label.m,
        color: theme.colors.base.content[1],
        textAlign: 'right' as 'right',
        minWidth: '70px',
        flexShrink: 0,
    }
  };

  return (
    <motion.div style={styles.wrapper} layout transition={{ type: 'spring', stiffness: 350, damping: 35 }}>
        <motion.div
            style={styles.mainCard}
            onClick={() => onToggleItem(item)}
            whileHover={{ backgroundColor: theme.colors.base.surface[3] }}
        >
            <AnimatePresence>
                {isSelected && item.allow_quantity && (
                    <motion.div 
                        style={styles.quantityCounter}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                    >
                        <button style={styles.quantityButton} onClick={(e) => handleQuantityClick(e, -1)} disabled={quantity <= 1}>
                            <Minus size={16} />
                        </button>
                        <div style={styles.quantityValue}>
                            <AnimatedCounter value={quantity} useFormatting={false} />
                        </div>
                        <button style={styles.quantityButton} onClick={(e) => handleQuantityClick(e, 1)}>
                            <Plus size={16} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div style={styles.icon}><Icon name={item.icon} size={48} weight="light"/></div>
            <h3 style={styles.name}>{item.name}</h3>
            <div style={styles.price}><span>{formatPrice(item.price_bdt)}</span></div>
        </motion.div>

        <AnimatePresence initial={false}>
        {hasAddOns && isSelected && (
            <motion.div
                key="addons"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                style={{ overflow: 'hidden' }}
            >
                <div style={styles.addOnsContainer}>
                    {item.add_ons!.map(addOn => {
                        const addOnKey = `${item.name}-${addOn.name}`;
                        const isAddOnSelected = selectedItems.has(addOnKey);
                        return (
                            <motion.div 
                                key={addOn.name} 
                                style={styles.addOnItem}
                                onClick={() => isSelected && onToggleItem(addOn, item)}
                                whileHover={{ backgroundColor: isSelected ? theme.colors.base.surface[1] + '80' : 'transparent' }}
                            >
                                <div style={styles.addOnLeftContainer}>
                                    <div style={{...styles.addOnCheckbox, borderColor: isAddOnSelected ? theme.colors.primary.surface[1] : theme.colors.base.content[3] }}>
                                        <AnimatePresence>
                                        {isAddOnSelected && 
                                            <motion.div 
                                                style={styles.addOnCheckIcon} 
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                exit={{ scale: 0 }}
                                            />
                                        }
                                        </AnimatePresence>
                                    </div>
                                    <span style={styles.addOnName}>{addOn.name}</span>
                                </div>
                                <span style={styles.addOnPrice}>{formatPrice(addOn.price_bdt)}</span>
                            </motion.div>
                        )
                    })}
                </div>
            </motion.div>
        )}
        </AnimatePresence>
    </motion.div>
  );
};

export default ServiceItem;