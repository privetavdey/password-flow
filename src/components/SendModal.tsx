import React, { useEffect, useState } from 'react';
import { useRive, useStateMachineInput, Layout, Fit, Alignment } from '@rive-app/react-webgl2';
import { BORDER_RADIUS, SPACING } from '../constants/styles';
import { useThemeColors } from '../constants/ThemeContext';
import transactionRiv from '../assets/transaction.riv';

interface RiveInputs {
  isDone: boolean;
  isShield: boolean;
  isSwap: boolean;
  isSend: boolean;
  isDark: boolean;
}

interface SendModalProps {
  isOpen: boolean;
  onClose: () => void;
  riveInputs: RiveInputs;
}

const STATE_MACHINE_NAME = 'Main';
const STAGGER_BASE = 200;
const STAGGER_STEP = 80;

export const SendModal: React.FC<SendModalProps> = ({ isOpen, onClose, riveInputs }) => {
  const C = useThemeColors();
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const { rive, RiveComponent } = useRive({
    src: transactionRiv,
    stateMachines: STATE_MACHINE_NAME,
    autoplay: true,
    layout: new Layout({
      fit: Fit.FitWidth,
      alignment: Alignment.TopCenter,
    }),
  });

  const doneInput = useStateMachineInput(rive, STATE_MACHINE_NAME, 'Done');
  const shieldInput = useStateMachineInput(rive, STATE_MACHINE_NAME, 'isShield');
  const swapInput = useStateMachineInput(rive, STATE_MACHINE_NAME, 'isSwap');
  const sendInput = useStateMachineInput(rive, STATE_MACHINE_NAME, 'isSend');
  const darkInput = useStateMachineInput(rive, STATE_MACHINE_NAME, 'isDark');

  useEffect(() => {
    if (doneInput) doneInput.value = riveInputs.isDone;
  }, [riveInputs.isDone, doneInput]);

  useEffect(() => {
    if (shieldInput) shieldInput.value = riveInputs.isShield;
  }, [riveInputs.isShield, shieldInput]);

  useEffect(() => {
    if (swapInput) swapInput.value = riveInputs.isSwap;
  }, [riveInputs.isSwap, swapInput]);

  useEffect(() => {
    if (sendInput) sendInput.value = riveInputs.isSend;
  }, [riveInputs.isSend, sendInput]);

  useEffect(() => {
    if (darkInput) darkInput.value = riveInputs.isDark;
  }, [riveInputs.isDark, darkInput]);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsAnimating(true));
      });
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const activeAction = riveInputs.isShield ? 'shield' : riveInputs.isSwap ? 'swap' : 'send';
  const isDone = riveInputs.isDone;

  const headlines: Record<string, { pending: string; done: string; pendingSub: React.ReactNode; doneSub: React.ReactNode }> = {
    send:   { pending: 'Sending...', done: 'Sent', pendingSub: <>Should take a moment,<br />you can close this now</>, doneSub: <>It might take a few minutes to arrive,<br />you can close this now</> },
    swap:   { pending: 'Swapping...', done: 'Swapped', pendingSub: <>Should take a moment,<br />you can close this now</>, doneSub: <>It might take a few minutes to arrive,<br />you can close this now</> },
    shield: { pending: 'Shielding...', done: 'Shielded', pendingSub: <>Should take a moment,<br />you can close this now</>, doneSub: <>Your assets are now fully protected,<br />you can close this now</> },
  };

  const stagger = (index: number, maxOpacity = 1): React.CSSProperties => ({
    opacity: isAnimating ? maxOpacity : 0,
    transform: `translateY(${isAnimating ? '0px' : '12px'})`,
    transition: `opacity 400ms ease-out ${STAGGER_BASE + index * STAGGER_STEP}ms, transform 400ms ease-out ${STAGGER_BASE + index * STAGGER_STEP}ms`,
  });

  if (!isVisible) return null;

  return (
    <div className="absolute inset-0" style={{ zIndex: 50 }}>
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: C.BACKDROP,
          backdropFilter: 'blur(5px)',
          WebkitBackdropFilter: 'blur(5px)',
          opacity: isAnimating ? 1 : 0,
          transition: 'opacity 300ms ease-out',
        }}
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div
        className="absolute left-0 w-full overflow-hidden"
        style={{
          bottom: 0,
          height: '520px',
          backgroundColor: C.SHEET_BG,
          borderTopLeftRadius: BORDER_RADIUS.lg,
          borderTopRightRadius: BORDER_RADIUS.lg,
          transform: isAnimating ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 300ms ease-out',
        }}
      >
        {/* Rive Animation */}
        <div
          style={{
            width: '100%',
            height: '320px',
            position: 'relative',
          }}
        >
          <RiveComponent style={{ width: '100%', height: '100%' }} />
          {/* Handle (overlaid) */}
          <div
            className="absolute top-0 left-0 w-full flex items-center justify-center"
            style={{ height: '27px', padding: `12px ${SPACING.md}`, zIndex: 1 }}
          >
            <div
              style={{
                width: '24px',
                height: '3px',
                backgroundColor: C.HANDLE,
                borderRadius: BORDER_RADIUS.full,
              }}
            />
          </div>
        </div>

        {/* Text Content */}
        <div
          className="flex flex-col items-center text-center"
          style={{ gap: SPACING.sm, padding: `0 ${SPACING.xl}` }}
        >
          <div
            style={{
              position: 'relative',
              height: '36px',
              width: '100%',
              ...stagger(1),
            }}
          >
            {/* Pending text (shimmer) */}
            <p
              className="font-innovator"
              style={{
                fontSize: '32px',
                fontWeight: 600,
                lineHeight: 1.12,
                letterSpacing: '-0.64px',
                background: `linear-gradient(90deg, ${C.SHIMMER_BASE} 0%, ${C.SHIMMER_BASE} 40%, ${C.SHIMMER_HIGHLIGHT} 50%, ${C.SHIMMER_BASE} 60%, ${C.SHIMMER_BASE} 100%)`,
                backgroundSize: '200% 100%',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: isDone ? 'none' : 'shimmer 2.5s linear infinite',
                opacity: isDone ? 0 : 1,
                transform: isDone ? 'translateY(-10px)' : 'translateY(0)',
                transition: 'opacity 300ms ease-out, transform 300ms ease-out',
                position: 'absolute',
                left: 0,
                right: 0,
              }}
            >
              {headlines[activeAction].pending}
            </p>
            {/* Done text */}
            <p
              className="font-innovator"
              style={{
                fontSize: '32px',
                fontWeight: 600,
                lineHeight: 1.12,
                letterSpacing: '-0.64px',
                color: C.TEXT_PRIMARY,
                opacity: isDone ? 1 : 0,
                transform: isDone ? 'translateY(0)' : 'translateY(8px)',
                transition: 'opacity 300ms ease-out 100ms, transform 300ms ease-out 100ms',
                position: 'absolute',
                left: 0,
                right: 0,
              }}
            >
              {headlines[activeAction].done}
            </p>
          </div>
          <div
            style={{
              position: 'relative',
              height: '42px',
              width: '100%',
              ...stagger(2, 0.5),
            }}
          >
            <p
              className="font-innovator"
              style={{
                fontSize: '15px',
                fontWeight: 500,
                lineHeight: 1.4,
                color: C.TEXT_PRIMARY,
                opacity: isDone ? 0 : 1,
                transform: isDone ? 'translateY(-10px)' : 'translateY(0)',
                transition: 'opacity 300ms ease-out, transform 300ms ease-out',
                position: 'absolute',
                left: 0,
                right: 0,
              }}
            >
              {headlines[activeAction].pendingSub}
            </p>
            <p
              className="font-innovator"
              style={{
                fontSize: '15px',
                fontWeight: 500,
                lineHeight: 1.4,
                color: C.TEXT_PRIMARY,
                opacity: isDone ? 1 : 0,
                transform: isDone ? 'translateY(0)' : 'translateY(8px)',
                transition: 'opacity 300ms ease-out 100ms, transform 300ms ease-out 100ms',
                position: 'absolute',
                left: 0,
                right: 0,
              }}
            >
              {headlines[activeAction].doneSub}
            </p>
          </div>
        </div>

        {/* Done Button */}
        <div
          className="absolute left-1/2 flex items-center justify-center"
          style={{
            bottom: '20px',
            transform: `translateX(-50%) translateY(${isAnimating ? '0px' : '12px'})`,
            width: '320px',
            height: '48px',
            backgroundColor: C.TEXT_PRIMARY,
            borderRadius: BORDER_RADIUS.full,
            cursor: 'pointer',
            opacity: isAnimating ? 1 : 0,
            transition: `opacity 400ms ease-out ${STAGGER_BASE + 3 * STAGGER_STEP}ms, transform 400ms ease-out ${STAGGER_BASE + 3 * STAGGER_STEP}ms`,
          }}
          onClick={onClose}
        >
          <p
            className="font-diatype"
            style={{
              color: C.BACKGROUND,
              fontSize: '15px',
              fontWeight: 700,
              letterSpacing: '0.45px',
              textTransform: 'uppercase',
              lineHeight: 1,
            }}
          >
            Done
          </p>
        </div>
      </div>
    </div>
  );
};
