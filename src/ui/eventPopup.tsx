import * as React from 'react';
import { css, StyleSheet } from 'aphrodite';

const styles = StyleSheet.create({
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  text: {
    fontSize: '2rem',
    color: '#fff',
    textAlign: 'center',
    animationName: {
      '0%': {
        opacity: 0,
        transform: 'scale(0.8)',
      },
      '50%': {
        opacity: 1,
        transform: 'scale(1)',
      },
      '100%': {
        opacity: 0,
        transform: 'scale(0.8)',
      },
    },
    animationDuration: '2s', // Gesamtdauer der Animation
    animationTimingFunction: 'ease-in-out',
    animationFillMode: 'forwards', // Behalte den letzten Zustand der Animation bei
  },
});

interface AnimatedModalProps {
  text: string; // Der anzuzeigende Text
  visible: boolean; // Steuert die Sichtbarkeit des Modals
}

const EventPopup = ({ text, visible }: AnimatedModalProps) => {
  if (!visible) return null; // Wenn nicht sichtbar, nichts zurückgeben

  return (
    <div className={css(styles.overlay)}>
      <div className={css(styles.text)}>
        {text}
      </div>
    </div>
  );
};

export default EventPopup;
