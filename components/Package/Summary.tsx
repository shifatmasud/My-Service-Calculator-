
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Service, AddOn } from '../../types';
import { useTheme } from '../../ThemeProvider';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../Core/Icon';
import { CaretUp, CaretDown, PaperPlaneTilt, CircleNotch } from '@phosphor-icons/react';
import AnimatedCounter from '../Core/AnimatedCounter';
import html2canvas from 'html2canvas';
import { useWindowSize } from '../../hooks/useWindowSize';

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
  const [isSending, setIsSending] = useState(false);
  const [captureRequest, setCaptureRequest] = useState<SummaryProps | null>(null);
  const captureRef = useRef<HTMLDivElement>(null);
  const { width } = useWindowSize();
  const isWrapping = width ? width < 620 : false;

  const { effectiveDays, effectiveHours } = useMemo(() => {
    let hours = totalHours;
    let days = totalDays;

    if (hours >= 8) {
        days += Math.floor(hours / 8);
        hours = hours % 8;
    }
    return { effectiveDays: days, effectiveHours: hours };
  }, [totalHours, totalDays]);
  
  const handleSendEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (totalPrice === 0 || isSending) {
      return;
    }
    setIsSending(true);
    setCaptureRequest({ selectedItems, totalPrice, totalHours, totalDays });
  };
  
  useEffect(() => {
    if (!captureRequest || !captureRef.current) return;

    const generateSnapshot = async () => {
      if (!captureRef.current) return;
      try {
        const canvas = await html2canvas(captureRef.current, {
          backgroundColor: theme.colors.base.surface[2],
          useCORS: true,
          scale: 2, // Increase resolution for better quality
        });
        
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'summary-snapshot.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
  
        const summaryText = Array.from(captureRequest.selectedItems.values())
          .map(({ item, quantity }) => {
            const quantityStr = quantity > 1 ? ` (x${quantity})` : '';
            const price = item.price_bdt * quantity;
            return `${item.name}${quantityStr}: BDT ${price.toLocaleString()}`;
          })
          .join('\n');
  
        // Recalculate time for the text body based on capture data
        let hours = captureRequest.totalHours;
        let days = captureRequest.totalDays;
        if (hours >= 8) {
            days += Math.floor(hours / 8);
            hours = hours % 8;
        }

        const totalsText = `\n--------------------\nTotal Price: BDT ${captureRequest.totalPrice.toLocaleString()}\nEstimated Time: ${days}d ${hours}h`;
        const emailSubject = 'Service Quote Summary';
        const emailBody = `Hello,\n\nHere is the summary of the service quote:\n\n${summaryText}${totalsText}\n\nPlease attach the downloaded summary image ('summary-snapshot.png') to this email.\n\nBest regards,`;
  
        const mailtoLink = `mailto:shifatmasud@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
        window.location.href = mailtoLink;
  
      } catch (error) {
        console.error("Failed to capture or share summary:", error);
        alert("Sorry, we couldn't generate the summary image. Please try again.");
      } finally {
        setIsSending(false);
        setCaptureRequest(null);
      }
    };

    // A small delay ensures the off-screen element is fully painted before we capture it.
    const timer = setTimeout(generateSnapshot, 100);

    return () => clearTimeout(timer);

  }, [captureRequest, theme]);

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
      display: 'flex',
      flexDirection: 'column',
    } as React.CSSProperties,
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: `${theme.spacing.m}px ${theme.spacing.l}px`,
      cursor: 'pointer',
      flexShrink: 0,
      flexWrap: 'wrap',
      gap: theme.spacing.m,
    } as React.CSSProperties,
    totals: {
      display: 'flex',
      alignItems: 'baseline',
      gap: theme.spacing.s,
      flex: '1',
      minWidth: '280px',
    },
    rightTotals: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.m,
      color: theme.colors.base.content[2],
      flex: '1',
      justifyContent: isWrapping ? 'space-between' : 'flex-end',
      minWidth: '280px',
    },
    timeDisplay: {
      display: 'flex',
      alignItems: 'baseline',
      gap: theme.spacing.s,
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
    emptyText: { ...theme.typography.body.m, color: theme.colors.base.content[3], textAlign: 'center', paddingTop: theme.spacing.xl },
    sendButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: theme.colors.base.content[2],
      padding: theme.spacing.s,
      borderRadius: theme.radius.full,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: `all ${theme.motion.duration.subtle}ms`,
      width: '36px',
      height: '36px',
    } as React.CSSProperties,
    captureContainer: {
        position: 'fixed',
        left: '-9999px',
        top: 0,
        zIndex: -1,
    } as React.CSSProperties,
    captureContent: {
      width: '800px',
      backgroundColor: theme.colors.base.surface[2],
      borderRadius: theme.radius.xl,
      border: `1px solid ${theme.colors.base.surface[3]}`,
      color: theme.colors.base.content[1],
      display: 'flex',
      flexDirection: 'column',
      padding: theme.spacing.xl
    } as React.CSSProperties,
  };
  
  const selectedItemsArray = Array.from(selectedItems.values());

  const CaptureComponent = ({ data }: { data: SummaryProps }) => {
    const { effectiveDays: capDays, effectiveHours: capHours } = useMemo(() => {
        let hours = data.totalHours;
        let days = data.totalDays;
        if (hours >= 8) {
            days += Math.floor(hours / 8);
            hours = hours % 8;
        }
        return { effectiveDays: days, effectiveHours: hours };
    }, [data.totalHours, data.totalDays]);
    const itemsArray = Array.from(data.selectedItems.values());

    return (
        <div ref={captureRef} style={styles.captureContent}>
            <header style={{...styles.header, cursor: 'default', height: 'auto', padding: `0 0 ${theme.spacing.l}px 0`, borderBottom: `1px solid ${theme.colors.base.surface[3]}`, marginBottom: theme.spacing.l }}>
                <div style={styles.totals}>
                    <span style={styles.totalLabel}>Total:</span>
                    <div style={styles.totalPriceContainer}>
                        <span style={styles.totalCurrency}>BDT</span>
                        <div style={styles.totalValue}>{data.totalPrice.toLocaleString()}</div>
                    </div>
                </div>
                <div style={styles.rightTotals}>
                    <div style={styles.timeDisplay}>
                        <span style={styles.totalLabel}>Time:</span>
                        <div style={styles.timeValueContainer}>
                            {capDays > 0 && <div style={styles.timeValueContainer}><div style={styles.timeValue}>{capDays}</div><span style={styles.timeUnit}>d</span></div>}
                            {capHours > 0 && <div style={styles.timeValueContainer}><div style={styles.timeValue}>{capHours}</div><span style={styles.timeUnit}>h</span></div>}
                            {data.totalPrice > 0 && capDays === 0 && capHours === 0 && <div style={styles.timeValue}>0h</div>}
                        </div>
                    </div>
                </div>
            </header>
            <div style={{ ...styles.content, padding: 0, overflowY: 'visible' }}>
                <ul style={styles.list}>
                    {itemsArray.map(({ item, quantity }, index) => (
                        <li key={`${item.name}-${index}`} style={styles.listItem}>
                            <span style={styles.itemName}><Icon name={item.icon} size={18} /> {item.name} {quantity > 1 ? `(x${quantity})` : ''}</span>
                            <span style={styles.itemPrice}>{item.price_bdt === 0 ? 'Free' : `BDT ${(item.price_bdt * quantity).toLocaleString()}`}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {totalPrice > 0 && (
          <motion.div
            style={styles.dock}
            layout
            initial={{ y: '150%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '150%', opacity: 0 }}
            transition={{
              y: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
              opacity: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
              layout: { type: 'spring', stiffness: 350, damping: 35 },
            }}
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
                    <div style={styles.timeDisplay}>
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
                    <div style={{display: 'flex', alignItems: 'center', gap: theme.spacing.s}}>
                        <AnimatePresence>
                            {totalPrice > 0 && (
                            <motion.button
                                style={{ ...styles.sendButton, cursor: isSending ? 'wait' : 'pointer' }}
                                onClick={handleSendEmail}
                                aria-label="Send summary by email"
                                title="Send summary by email"
                                disabled={isSending}
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                whileHover={!isSending ? { color: theme.colors.primary.surface[1], backgroundColor: theme.colors.base.surface[3] } : {}}
                                whileTap={!isSending ? { scale: 0.9 } : {}}
                            >
                                {isSending ? (
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                                >
                                    <CircleNotch size={20} weight="bold" />
                                </motion.div>
                                ) : (
                                <PaperPlaneTilt size={20} weight="bold" />
                                )}
                            </motion.button>
                            )}
                        </AnimatePresence>
                        {isExpanded ? <CaretDown size={20} weight="bold" /> : <CaretUp size={20} weight="bold" />}
                    </div>
                </div>
            </header>
            <AnimatePresence>
                {isExpanded && (
                <motion.div
                    style={{ overflow: 'hidden' }}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 35 }}
                >
                    <div style={{...styles.content, maxHeight: '40vh'}}>
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
                    </div>
                </motion.div>
                )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
      {captureRequest && (
        <div style={styles.captureContainer}>
            <CaptureComponent data={captureRequest} />
        </div>
      )}
    </>
  );
};

export default Summary;