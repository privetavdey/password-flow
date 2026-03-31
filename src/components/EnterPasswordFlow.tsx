import React, { useState, useEffect, useRef } from 'react';
import { BORDER_RADIUS, SPACING } from '../constants/styles';
import { useThemeColors } from '../constants/ThemeContext';
import shieldLogo from '../assets/shield-logo.svg';
import spinny from '../assets/spinny.svg';
import deviceIcon from '../assets/device-icon.svg';
import recoveryIcon from '../assets/recovery-icon.svg';
import backArrow from '../assets/back-arrow.svg';

interface EnterPasswordFlowProps {
  onComplete: () => void;
}

type Step = 'splash' | 'enter' | 'forgot' | 'reset';

const TRANSITION_DURATION = 400;
const CORRECT_PASSWORD = 'Password123!!!';
const MAX_ATTEMPTS = 3;
const LOCKOUT_SECONDS = 60;

export const EnterPasswordFlow: React.FC<EnterPasswordFlowProps> = ({ onComplete }) => {
  const C = useThemeColors();
  const [step, setStep] = useState<Step>('splash');
  const [fadeIn, setFadeIn] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [enterAnim, setEnterAnim] = useState(false);
  const [password, setPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [pwToggleAnim, setPwToggleAnim] = useState(false);
  const [pwFocused, setPwFocused] = useState(false);
  const [pwHovered, setPwHovered] = useState(false);
  const [pwBtnHovered, setPwBtnHovered] = useState(false);
  const [spinFast, setSpinFast] = useState(false);
  const [error, setError] = useState('');
  const [shaking, setShaking] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(0);
  const [lockCountdown, setLockCountdown] = useState(0);
  const [lockProgress, setLockProgress] = useState(0);
  const lockStartRef = useRef(0);
  const [exiting, setExiting] = useState(false);
  const [forgotVisible, setForgotVisible] = useState(false);
  const [forgotIn, setForgotIn] = useState(false);
  const passwordRef = useRef<HTMLInputElement>(null);

  const isLocked = lockCountdown > 0;

  // Splash auto-advance
  useEffect(() => {
    setFadeIn(true);
    const t = setTimeout(() => {
      setTransitioning(true);
      setTimeout(() => {
        setStep('enter');
        setTransitioning(false);
        setFadeIn(true);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => setEnterAnim(true));
        });
      }, 300);
    }, 300);
    return () => clearTimeout(t);
  }, []);

  // Focus input when enter animation starts
  useEffect(() => {
    if (enterAnim) {
      setTimeout(() => passwordRef.current?.focus(), 150);
    }
  }, [enterAnim]);

  // Lockout countdown with smooth progress
  useEffect(() => {
    if (lockedUntil <= Date.now()) { setLockCountdown(0); setLockProgress(0); return; }
    const duration = LOCKOUT_SECONDS * 1000;
    const start = lockStartRef.current;
    let raf: number;
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      setLockProgress(progress);
      const remaining = Math.ceil((lockedUntil - Date.now()) / 1000);
      if (remaining <= 0) { setLockCountdown(0); setLockProgress(1); }
      else { setLockCountdown(remaining); raf = requestAnimationFrame(tick); }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [lockedUntil]);

  const handleTogglePasswords = () => {
    setPwToggleAnim(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          setShowPasswords(p => !p);
          requestAnimationFrame(() => {
            requestAnimationFrame(() => setPwToggleAnim(false));
          });
        }, 180);
      });
    });
  };

  const handleSubmit = () => {
    if (isLocked || !password) return;
    if (password === CORRECT_PASSWORD) {
      setError('');
      setSpinFast(true);
      setExiting(true);
      setTimeout(() => onComplete(), 500);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setError('Incorrect password');
      setShaking(true);
      setTimeout(() => {
        setShaking(false);
        passwordRef.current?.focus();
      }, 400);
      if (newAttempts >= MAX_ATTEMPTS) {
        lockStartRef.current = Date.now();
        const until = Date.now() + LOCKOUT_SECONDS * 1000;
        setLockedUntil(until);
        setLockCountdown(LOCKOUT_SECONDS);
        setLockProgress(0);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  const handleForgotPassword = () => {
    setForgotVisible(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setForgotIn(true));
    });
  };

  const [forgotStep, setForgotStep] = useState<'forgot' | 'reset'>('forgot');
  const [resetCountdown, setResetCountdown] = useState(0);
  const [resetProgress, setResetProgress] = useState(0);
  const resetStartRef = useRef(0);

  const handleResetWallet = () => {
    setForgotStep('reset');
    setResetCountdown(3);
    setResetProgress(0);
    resetStartRef.current = Date.now();
  };

  // Reset countdown with smooth progress
  useEffect(() => {
    if (resetCountdown <= 0) return;
    const duration = 3000;
    const start = resetStartRef.current;
    let raf: number;
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      setResetProgress(progress);
      if (progress >= 1) {
        setResetCountdown(0);
      } else {
        raf = requestAnimationFrame(tick);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [resetCountdown]);

  const handleBack = () => {
    if (forgotStep === 'reset') {
      setForgotStep('forgot');
      setResetCountdown(0);
    } else if (forgotIn) {
      setForgotIn(false);
      setTimeout(() => { setForgotVisible(false); setForgotStep('forgot'); }, 300);
    }
  };

  const handleConfirmReset = () => {
    setExiting(true);
    setTimeout(() => onComplete(), 500);
  };

  const contentOpacity = (fadeIn && !transitioning) ? 1 : 0;
  const contentTransform = (fadeIn && !transitioning) ? 'translateY(0)' : 'translateY(12px)';

  const enterStagger = (index: number): React.CSSProperties => ({
    opacity: enterAnim ? 1 : 0,
    transform: enterAnim ? 'translateY(0)' : 'translateY(16px)',
    transition: `opacity 300ms ease ${index * 60}ms, transform 300ms ease ${index * 60}ms`,
  });

  const exitStagger = (index: number): React.CSSProperties => ({
    opacity: exiting ? 0 : 1,
    transform: exiting ? 'translateY(-12px)' : 'translateY(0)',
    transition: `opacity 300ms ease ${index * 60}ms, transform 300ms ease ${index * 60}ms`,
  });

  return (
    <div
      className="relative size-full overflow-hidden"
      style={{ backgroundColor: C.BACKGROUND }}
    >
      {/* Keyframes for spinny */}
      <style>{`
        @keyframes spinSlow { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(360deg); } }
        @keyframes spinFast { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(360deg); } }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 50%, 90% { transform: translateX(-6px); }
          30%, 70% { transform: translateX(6px); }
        }
      `}</style>

      {/* Spinny */}
      {step !== 'splash' && (
        <img
          src={spinny}
          alt=""
          style={{
            position: 'absolute',
            top: 'calc(50% + 14px)',
            left: '50%',
            width: '1150px',
            height: '1150px',
            minWidth: '1150px',
            minHeight: '1150px',
            maxWidth: 'none',
            pointerEvents: 'none',
            zIndex: 0,
            opacity: contentOpacity,
            transition: `opacity ${TRANSITION_DURATION}ms ease-out`,
            animation: spinFast
              ? 'spinFast 0.4s ease-in-out forwards'
              : 'spinSlow 120s linear infinite',
          }}
        />
      )}

      {/* SPLASH */}
      {step === 'splash' && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            opacity: transitioning ? 0 : (fadeIn ? 1 : 0),
            transition: 'opacity 300ms ease-out',
          }}
        >
          <div style={{ width: '72px', height: '86px' }}>
            <img src={shieldLogo} alt="Shield" className="size-full object-contain" />
          </div>
        </div>
      )}

      {/* ENTER PASSWORD */}
      {step === 'enter' && (
        <div
          className="absolute inset-0 flex flex-col justify-center"
          style={{
            padding: '0 20px',
            marginTop: '-20px',
            opacity: contentOpacity,
            transform: contentTransform,
            transition: `opacity ${TRANSITION_DURATION}ms ease-out, transform ${TRANSITION_DURATION}ms ease-out`,
          }}
        >
          {/* Title */}
          <div style={enterStagger(0)}>
            <p
              className="font-innovator"
              style={{
                fontSize: '32px',
                fontWeight: 600,
                lineHeight: 1.12,
                letterSpacing: '-0.64px',
                color: C.TEXT_PRIMARY,
                marginBottom: '16px',
                textAlign: 'center',
              }}
            >
              Enter password
            </p>
          </div>

          {/* Input */}
          <div style={{ position: 'relative', ...enterStagger(1) }}>
            <div
              onMouseEnter={() => setPwHovered(true)}
              onMouseLeave={() => setPwHovered(false)}
              style={{
                position: 'relative',
                height: '56px',
                backgroundColor: error ? 'rgba(255,38,38,0.08)' : (pwFocused || pwHovered) ? 'rgba(255,255,255,0.12)' : C.BG_SUBTLE,
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                borderRadius: BORDER_RADIUS.sm,
                border: 'none',
                boxShadow: error
                  ? 'inset 0 0 0 1px #ff2626'
                  : pwFocused ? `inset 0 0 0 2px ${C.TEXT_PRIMARY}` : 'inset 0 0 0 1px rgba(255,255,255,0)',
                animation: shaking ? 'shake 0.4s ease-in-out' : 'none',
                display: 'flex',
                alignItems: 'center',
                padding: `0 ${SPACING.md}`,
                transition: 'background-color 150ms ease, box-shadow 150ms ease',
              }}
            >
              <div style={{ flex: 1, position: 'relative', overflow: 'hidden', height: '21px' }}>
                <input
                  ref={passwordRef}
                  type={showPasswords ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); if (error) setError(''); }}
                  onFocus={() => setPwFocused(true)}
                  onBlur={() => setPwFocused(false)}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  className="font-innovator"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    backgroundColor: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: pwToggleAnim ? 'transparent' : C.TEXT_PRIMARY,
                    fontSize: '15px',
                    fontWeight: 500,
                    lineHeight: 1.4,
                    caretColor: pwToggleAnim ? 'transparent' : C.TEXT_PRIMARY,
                  }}
                />
                <span className="font-innovator" aria-hidden style={{
                  position: 'absolute', top: 0, left: 0, fontSize: '15px', fontWeight: 500, lineHeight: 1.4,
                  color: C.TEXT_PRIMARY, pointerEvents: 'none', whiteSpace: 'nowrap',
                  filter: (showPasswords ? !pwToggleAnim : pwToggleAnim) ? 'blur(4px)' : 'blur(0px)',
                  transform: (showPasswords ? !pwToggleAnim : pwToggleAnim) ? 'translateY(-8px)' : 'translateY(0)',
                  opacity: (showPasswords ? !pwToggleAnim : pwToggleAnim) ? 0 : 1,
                  transition: 'filter 150ms ease, transform 150ms ease, opacity 150ms ease',
                }}>{'•'.repeat(password.length)}</span>
                <span className="font-innovator" aria-hidden style={{
                  position: 'absolute', top: 0, left: 0, fontSize: '15px', fontWeight: 500, lineHeight: 1.4,
                  color: C.TEXT_PRIMARY, pointerEvents: 'none', whiteSpace: 'nowrap',
                  filter: (showPasswords ? pwToggleAnim : !pwToggleAnim) ? 'blur(4px)' : 'blur(0px)',
                  transform: (showPasswords ? pwToggleAnim : !pwToggleAnim) ? 'translateY(8px)' : 'translateY(0)',
                  opacity: (showPasswords ? pwToggleAnim : !pwToggleAnim) ? 0 : 1,
                  transition: 'filter 150ms ease, transform 150ms ease, opacity 150ms ease',
                }}>{password}</span>
              </div>
              <button
                onClick={handleTogglePasswords}
                onMouseEnter={() => setPwBtnHovered(true)}
                onMouseLeave={() => setPwBtnHovered(false)}
                style={{
                  position: 'absolute', right: '11px', top: '50%', transform: 'translateY(-50%)',
                  height: '32px', backgroundColor: pwBtnHovered ? 'rgba(255,255,255,0.16)' : C.BG_SUBTLE,
                  backdropFilter: 'blur(24px)', borderRadius: BORDER_RADIUS.full, border: 'none',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '0 12px', transition: 'background-color 150ms ease', overflow: 'hidden',
                }}
              >
                <div style={{ position: 'relative', width: '40px', height: '14px' }}>
                  <span className="font-diatype" style={{
                    position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '13px', fontWeight: 700, letterSpacing: '0.39px', textTransform: 'uppercase',
                    color: C.TEXT_PRIMARY, lineHeight: 1,
                    filter: (showPasswords ? !pwToggleAnim : pwToggleAnim) ? 'blur(4px)' : 'blur(0px)',
                    transform: (showPasswords ? !pwToggleAnim : pwToggleAnim) ? 'translateY(-8px)' : 'translateY(0)',
                    opacity: (showPasswords ? !pwToggleAnim : pwToggleAnim) ? 0 : 1,
                    transition: 'filter 150ms ease, transform 150ms ease, opacity 150ms ease',
                  }}>Show</span>
                  <span className="font-diatype" style={{
                    position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '13px', fontWeight: 700, letterSpacing: '0.39px', textTransform: 'uppercase',
                    color: C.TEXT_PRIMARY, lineHeight: 1,
                    filter: (showPasswords ? pwToggleAnim : !pwToggleAnim) ? 'blur(4px)' : 'blur(0px)',
                    transform: (showPasswords ? pwToggleAnim : !pwToggleAnim) ? 'translateY(8px)' : 'translateY(0)',
                    opacity: (showPasswords ? pwToggleAnim : !pwToggleAnim) ? 0 : 1,
                    transition: 'filter 150ms ease, transform 150ms ease, opacity 150ms ease',
                  }}>Hide</span>
                </div>
              </button>
            </div>

          </div>

          {/* Bottom group */}
          <div style={{
            position: 'absolute', bottom: '20px', left: '20px', right: '20px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0px',
            ...enterStagger(2),
          }}>
            {/* Forgot password — shows after first failed attempt */}
            <button
              onClick={attempts > 0 ? handleForgotPassword : undefined}
              style={{
                width: '100%', height: '48px',
                backgroundColor: 'transparent',
                borderRadius: BORDER_RADIUS.full, border: 'none',
                cursor: attempts > 0 ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: attempts > 0 ? 1 : 0,
                maxHeight: attempts > 0 ? '48px' : '0px',
                marginBottom: attempts > 0 ? '8px' : '0px',
                overflow: 'hidden',
                transition: 'opacity 300ms ease, max-height 300ms ease, margin-bottom 300ms ease',
              }}
            >
              <p className="font-diatype" style={{
                color: C.TEXT_PRIMARY, fontSize: '15px', fontWeight: 700,
                letterSpacing: '0.45px', textTransform: 'uppercase', lineHeight: 1,
              }}>
                Forgot password?
              </p>
            </button>

            {/* CTA button */}
            <div style={{ width: '100%', ...exitStagger(0) }}>
              <button
                onClick={(!isLocked && password) ? handleSubmit : undefined}
                style={{
                  width: '100%', height: '48px',
                  backgroundColor: (!isLocked && password) ? C.TEXT_PRIMARY : 'rgba(255,255,255,0.48)',
                  backdropFilter: 'blur(24px)', borderRadius: BORDER_RADIUS.full, border: 'none',
                  cursor: (!isLocked && password) ? 'pointer' : 'default',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '0 20px',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'background-color 200ms ease',
                }}
              >
                {/* "Continue" text — blurs out when locked */}
                <p className="font-diatype" style={{
                  color: C.BACKGROUND, fontSize: '15px', fontWeight: 700,
                  letterSpacing: '0.45px', textTransform: 'uppercase', lineHeight: 1,
                  position: isLocked ? 'absolute' : 'relative',
                  opacity: isLocked ? 0 : 1,
                  filter: isLocked ? 'blur(4px)' : 'blur(0px)',
                  transform: isLocked ? 'translateY(-8px)' : 'translateY(0)',
                  transition: 'opacity 150ms ease, filter 150ms ease, transform 150ms ease',
                }}>Continue</p>
                {/* "Too many attempts" + spinner — blurs in when locked */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  position: !isLocked ? 'absolute' : 'relative',
                  opacity: isLocked ? 1 : 0,
                  filter: isLocked ? 'blur(0px)' : 'blur(4px)',
                  transform: isLocked ? 'translateY(0)' : 'translateY(8px)',
                  transition: 'opacity 150ms ease, filter 150ms ease, transform 150ms ease',
                }}>
                  <p className="font-diatype" style={{
                    color: C.BACKGROUND, fontSize: '15px', fontWeight: 700,
                    letterSpacing: '0.45px', textTransform: 'uppercase', lineHeight: 1,
                  }}>Too many attempts</p>
                  <svg width="16" height="16" viewBox="0 0 16 16" style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
                    <circle cx="8" cy="8" r="6.5" fill="none" stroke="rgba(9,7,7,0.2)" strokeWidth="1.5" />
                    <circle cx="8" cy="8" r="6.5" fill="none" stroke={C.BACKGROUND} strokeWidth="1.5"
                      strokeDasharray={`${2 * Math.PI * 6.5}`}
                      strokeDashoffset={`${2 * Math.PI * 6.5 * (1 - lockProgress)}`}
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FORGOT / RESET — unified slide-in page */}
      {forgotVisible && (
        <div
          className="absolute inset-0 flex flex-col"
          style={{
            padding: '20px',
            backgroundColor: '#090707',
            zIndex: 10,
            transform: forgotIn ? 'translateX(0)' : 'translateX(100%)',
            transition: 'transform 300ms ease',
          }}
        >
          {/* Back arrow */}
          <button
            onClick={handleBack}
            style={{
              width: '20px', height: '20px', background: 'none', border: 'none',
              cursor: 'pointer', padding: 0, marginBottom: '16px',
              transform: 'rotate(90deg)',
            }}
          >
            <img src={backArrow} alt="Back" className="size-full" />
          </button>

          {/* Title — crossfade */}
          <div style={{ position: 'relative', height: '36px', marginBottom: '16px' }}>
            <p className="font-innovator" style={{
              position: 'absolute', top: 0, left: 0,
              fontSize: '32px', fontWeight: 600, lineHeight: 1.12, letterSpacing: '-0.64px',
              color: C.TEXT_PRIMARY, whiteSpace: 'nowrap',
              opacity: forgotStep === 'forgot' ? 1 : 0,
              transform: forgotStep === 'forgot' ? 'translateX(0)' : 'translateX(-16px)',
              transition: 'opacity 300ms ease, transform 300ms ease',
            }}>Forgot password?</p>
            <p className="font-innovator" style={{
              position: 'absolute', top: 0, left: 0,
              fontSize: '32px', fontWeight: 600, lineHeight: 1.12, letterSpacing: '-0.64px',
              color: C.TEXT_PRIMARY, whiteSpace: 'nowrap',
              opacity: forgotStep === 'reset' ? 1 : 0,
              transform: forgotStep === 'reset' ? 'translateX(0)' : 'translateX(16px)',
              transition: 'opacity 300ms ease, transform 300ms ease',
            }}>Reset wallet?</p>
          </div>

          {/* Content area — relative wrapper */}
          <div style={{ position: 'relative', flex: 1 }}>

          {/* Forgot content — slides out left */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0,
            opacity: forgotStep === 'forgot' ? 1 : 0,
            transform: forgotStep === 'forgot' ? 'translateX(0)' : 'translateX(-16px)',
            transition: 'opacity 300ms ease, transform 300ms ease',
            pointerEvents: forgotStep === 'forgot' ? 'auto' : 'none',
          }}>
            <p className="font-innovator" style={{
              fontSize: '15px', fontWeight: 500, lineHeight: 1.4,
              color: C.TEXT_PRIMARY, marginBottom: '16px',
            }}>
              Shield can't recover your password for you, but here's what you can do.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{
                backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: '20px',
                padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px',
              }}>
                <div style={{ width: '40px', height: '40px' }}>
                  <img src={deviceIcon} alt="" className="size-full" />
                </div>
                <p className="font-innovator" style={{
                  fontSize: '15px', fontWeight: 500, lineHeight: 1.4, color: C.TEXT_PRIMARY,
                }}>
                  Log into Shield on any other device (maybe using Face ID), open Settings and back up your recovery phrase.
                </p>
              </div>
              <div style={{
                backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: '20px',
                padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px',
              }}>
                <div style={{ width: '40px', height: '40px' }}>
                  <img src={recoveryIcon} alt="" className="size-full" />
                </div>
                <p className="font-innovator" style={{
                  fontSize: '15px', fontWeight: 500, lineHeight: 1.4, color: C.TEXT_PRIMARY,
                }}>
                  If you have your recovery phrase, you can reset and reimport your wallet.
                </p>
              </div>
            </div>
          </div>

          {/* Reset content — slides in from right */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0,
            opacity: forgotStep === 'reset' ? 1 : 0,
            transform: forgotStep === 'reset' ? 'translateX(0)' : 'translateX(16px)',
            transition: 'opacity 300ms ease, transform 300ms ease',
            pointerEvents: forgotStep === 'reset' ? 'auto' : 'none',
          }}>
            <div className="font-innovator" style={{
              fontSize: '15px', fontWeight: 500, lineHeight: 1.4, color: C.TEXT_PRIMARY,
              display: 'flex', flexDirection: 'column', gap: '16px',
            }}>
              <p style={{ fontWeight: 600 }}>Shield team can't restore your wallet for you.</p>
              <p>Your wallet data will be erased from this device and it can not be undone.</p>
              <p>Make sure you have recovery phrase to restore your wallet.</p>
            </div>
          </div>

          </div>{/* end content area wrapper */}

          {/* Bottom button — always present, label changes */}
          <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px' }}>
            <button
              onClick={
                forgotStep === 'forgot' ? handleResetWallet :
                resetCountdown > 0 ? undefined :
                handleConfirmReset
              }
              style={{
                width: '100%', height: '48px',
                backgroundColor: (forgotStep === 'reset' && resetCountdown > 0) ? 'rgba(255,38,38,0.32)' : '#ff2626',
                borderRadius: BORDER_RADIUS.full, border: 'none',
                cursor: (forgotStep === 'reset' && resetCountdown > 0) ? 'default' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
                transition: 'background-color 200ms ease',
              }}
            >
              {/* Circular progress — visible during countdown */}
              <div style={{
                position: 'absolute',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: (forgotStep === 'reset' && resetCountdown > 0) ? 1 : 0,
                filter: (forgotStep === 'reset' && resetCountdown > 0) ? 'blur(0px)' : 'blur(4px)',
                transform: (forgotStep === 'reset' && resetCountdown > 0) ? 'translateY(0)' : 'translateY(8px)',
                transition: 'opacity 150ms ease, filter 150ms ease, transform 150ms ease',
              }}>
                <svg width="16" height="16" viewBox="0 0 16 16" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="8" cy="8" r="6.5" fill="none" stroke="rgba(255,38,38,0.4)" strokeWidth="1.5" />
                  <circle cx="8" cy="8" r="6.5" fill="none" stroke="#ff2626" strokeWidth="1.5"
                    strokeDasharray={`${2 * Math.PI * 6.5}`}
                    strokeDashoffset={`${2 * Math.PI * 6.5 * (1 - resetProgress)}`}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              {/* Text labels */}
              <div style={{ position: 'relative', overflow: 'hidden' }}>
                {/* "Reset wallet" */}
                <p className="font-diatype" style={{
                  color: '#ffffff', fontSize: '15px', fontWeight: 700,
                  letterSpacing: '0.45px', textTransform: 'uppercase', lineHeight: 1,
                  opacity: forgotStep === 'forgot' ? 1 : 0,
                  filter: forgotStep === 'forgot' ? 'blur(0px)' : 'blur(4px)',
                  transform: forgotStep === 'forgot' ? 'translateY(0)' : 'translateY(-8px)',
                  transition: 'opacity 150ms ease, filter 150ms ease, transform 150ms ease',
                  position: forgotStep === 'forgot' ? 'relative' as const : 'absolute' as const,
                  top: 0, left: 0, whiteSpace: 'nowrap',
                }}>Reset wallet</p>
                {/* "I understand, reset wallet" */}
                <p className="font-diatype" style={{
                  color: '#ffffff', fontSize: '15px', fontWeight: 700,
                  letterSpacing: '0.45px', textTransform: 'uppercase', lineHeight: 1,
                  opacity: (forgotStep === 'reset' && resetCountdown <= 0) ? 1 : 0,
                  filter: (forgotStep === 'reset' && resetCountdown <= 0) ? 'blur(0px)' : 'blur(4px)',
                  transform: (forgotStep === 'reset' && resetCountdown <= 0) ? 'translateY(0)' : 'translateY(8px)',
                  transition: 'opacity 150ms ease, filter 150ms ease, transform 150ms ease',
                  position: (forgotStep === 'reset' && resetCountdown <= 0) ? 'relative' as const : 'absolute' as const,
                  top: 0, left: 0, whiteSpace: 'nowrap',
                }}>I understand, reset wallet</p>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
