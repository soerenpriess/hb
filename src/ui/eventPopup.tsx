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
  container: {
    textAlign: 'center',
  },
  header: {
    fontSize: '3rem', // Größerer Text für den Header
    color: 'red', // Roter Text
    marginBottom: '1rem', // Abstand zum Haupttext
    animationName: {
      '0%': {
        opacity: 0,
        transform: 'scale(0.8)',
      },
      '25%': {
        opacity: 1,
        transform: 'scale(1)',
      },
      '75%': {
        opacity: 1,
        transform: 'scale(1)',
      },
      '100%': {
        opacity: 0,
        transform: 'scale(0.8)',
      },
    },
    animationDuration: '4s', // Gesamtdauer der Animation
    animationTimingFunction: 'ease-in-out',
    animationFillMode: 'forwards',
  },
  text: {
    fontSize: '2rem',
    color: '#fff',
    animationName: {
      '0%': {
        opacity: 0,
        transform: 'scale(0.8)',
      },
      '25%': {
        opacity: 1,
        transform: 'scale(1)',
      },
      '75%': {
        opacity: 1,
        transform: 'scale(1)',
      },
      '100%': {
        opacity: 0,
        transform: 'scale(0.8)',
      },
    },
    animationDuration: '4s', // Gesamtdauer der Animation
    animationTimingFunction: 'ease-in-out',
    animationFillMode: 'forwards',
  },
  imageContainer: {
    marginTop: '1rem', // Abstand zum Text
    animationName: {
      '0%': {
        opacity: 0,
        transform: 'scale(0.8)',
      },
      '25%': {
        opacity: 1,
        transform: 'scale(1)',
      },
      '75%': {
        opacity: 1,
        transform: 'scale(1)',
      },
      '100%': {
        opacity: 0,
        transform: 'scale(0.8)',
      },
    },
    animationDuration: '4s', // Gesamtdauer der Animation
    animationTimingFunction: 'ease-in-out',
    animationFillMode: 'forwards',
  },
});

interface AnimatedModalProps {
  headerText?: string; // Optionaler Header-Text
  text?: string; // Haupttext
  visible?: boolean; // Steuert die Sichtbarkeit des Modals
}

const EventPopup = ({ headerText, text, visible, imageSrc }: AnimatedModalProps) => {
  if (!visible) return null; // Wenn nicht sichtbar, nichts zurückgeben

  return (
    <div className={css(styles.overlay)}>
      <div className={css(styles.container)}>
        {headerText && <div className={css(styles.header)}>{headerText}</div>}
        {text && <div className={css(styles.text)}>{text}</div>}
      </div>
    </div>
  );
};

export default EventPopup;
