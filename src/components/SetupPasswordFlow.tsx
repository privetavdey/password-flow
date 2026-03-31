import React, { useState, useEffect, useRef } from 'react';
import { BORDER_RADIUS, SPACING } from '../constants/styles';
import { useThemeColors } from '../constants/ThemeContext';
import shieldLogo from '../assets/shield-logo.svg';
import diamondMarker from '../assets/diamond-marker.svg';
import eyeRevealIcon from '../assets/eye-reveal-icon.svg';
import checkIcon from '../assets/check-icon.svg';
import buttonBg from '../assets/button-bg.svg';
import dice01 from '../assets/dice01.svg';
import dice02 from '../assets/dice02.svg';
import dice03 from '../assets/dice03.svg';
import dice04 from '../assets/dice04.svg';
import dice05 from '../assets/dice05.svg';
import dice06 from '../assets/dice06.svg';

const DICE_ICONS = [dice01, dice02, dice03, dice04, dice05, dice06];
const AVATAR_GRADIENTS = [
  'linear-gradient(225deg, rgb(0, 212, 255) 0%, rgb(9, 9, 121) 100%)',
  'linear-gradient(225deg, rgb(255, 154, 0) 0%, rgb(121, 9, 9) 100%)',
  'linear-gradient(225deg, rgb(0, 255, 136) 0%, rgb(9, 68, 121) 100%)',
  'linear-gradient(225deg, rgb(255, 0, 212) 0%, rgb(72, 9, 121) 100%)',
  'linear-gradient(225deg, rgb(255, 230, 0) 0%, rgb(121, 56, 9) 100%)',
  'linear-gradient(225deg, rgb(136, 0, 255) 0%, rgb(9, 9, 121) 100%)',
  'linear-gradient(225deg, rgb(255, 82, 82) 0%, rgb(121, 9, 56) 100%)',
  'linear-gradient(225deg, rgb(0, 255, 255) 0%, rgb(9, 121, 89) 100%)',
];
import spinny from '../assets/spinny.svg';
import backArrow from '../assets/back-arrow.svg';
import copyIcon from '../assets/copy-icon.svg';
import hatchPattern from '../assets/hatch-pattern.svg';

interface SetupPasswordFlowProps {
  onComplete: () => void;
}

type Step = 'splash' | 'phrase' | 'appearance' | 'setup' | 'confirm' | 'analytics';

interface ValidationState {
  minLength: boolean;
  capital: boolean;
  special: boolean;
  number: boolean;
}

const TRANSITION_DURATION = 400;

const SEED_WORDS = [
  'bright', 'calm', 'jumbo', 'swift', 'crisp', 'clean',
  'zebra', 'small', 'royal', 'lucky', 'brave', 'giant',
];

function validatePassword(pw: string): ValidationState {
  return {
    minLength: pw.length >= 8,
    capital: /[A-Z]/.test(pw),
    special: /[^A-Za-z0-9]/.test(pw),
    number: /[0-9]/.test(pw),
  };
}

export const SetupPasswordFlow: React.FC<SetupPasswordFlowProps> = ({ onComplete }) => {
  const C = useThemeColors();
  const [step, setStep] = useState<Step>('splash');
  const [fadeIn, setFadeIn] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [pwToggleAnim, setPwToggleAnim] = useState(false);
  const [confirmToggleAnim, setConfirmToggleAnim] = useState(false);
  const [pwFocused, setPwFocused] = useState(false);
  const [pwHovered, setPwHovered] = useState(false);
  const [confirmFocused, setConfirmFocused] = useState(false);
  const [confirmHovered, setConfirmHovered] = useState(false);
  const [pwBtnHovered, setPwBtnHovered] = useState(false);
  const [confirmBtnHovered, setConfirmBtnHovered] = useState(false);
  const [spinFast, setSpinFast] = useState(false);
  const [analyticsExiting, setAnalyticsExiting] = useState(false);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);

  const [phraseRevealed, setPhraseRevealed] = useState(false);
  const [phraseCopied, setPhraseCopied] = useState(false);
  const [copyAnim, setCopyAnim] = useState(false);
  const [revealHovered, setRevealHovered] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [stepAnim, setStepAnim] = useState(false); // triggers stagger-in for current step
  const [diceIndex, setDiceIndex] = useState(0);
  const [diceAnim, setDiceAnim] = useState(false);
  const [diceHovered, setDiceHovered] = useState(false);
  const [diceShaking, setDiceShaking] = useState(false);
  const [avatarGradient, setAvatarGradient] = useState(0);

  const handleDiceRoll = () => {
    setDiceAnim(true);
    setDiceShaking(true);
    setTimeout(() => setDiceShaking(false), 400);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          // Pick a different dice and gradient
          let newDice = diceIndex;
          while (newDice === diceIndex) newDice = Math.floor(Math.random() * DICE_ICONS.length);
          setDiceIndex(newDice);
          let newGrad = avatarGradient;
          while (newGrad === avatarGradient) newGrad = Math.floor(Math.random() * AVATAR_GRADIENTS.length);
          setAvatarGradient(newGrad);
          requestAnimationFrame(() => {
            requestAnimationFrame(() => setDiceAnim(false));
          });
        }, 180);
      });
    });
  };

  const handleTogglePasswords = () => {
    setPwToggleAnim(true);
    if (step === 'confirm') setConfirmToggleAnim(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          setShowPasswords(p => !p);
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              setPwToggleAnim(false);
              setConfirmToggleAnim(false);
            });
          });
        }, 180);
      });
    });
  };

  const validation = validatePassword(password);
  const allValid = validation.minLength && validation.capital && validation.special && validation.number;
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;

  // Splash auto-advance -> phrase
  useEffect(() => {
    setFadeIn(true);
    const t = setTimeout(() => {
      setTransitioning(true);
      setTimeout(() => {
        setStep('phrase');
        setTransitioning(false);
        setFadeIn(true);
        setSlideDir('up');
        requestAnimationFrame(() => {
          requestAnimationFrame(() => setStepAnim(true));
        });
      }, 300);
    }, 300);
    return () => clearTimeout(t);
  }, []);

  // Blinking cursor for appearance screen
  useEffect(() => {
    if (step === 'appearance') {
      const interval = setInterval(() => setCursorVisible(v => !v), 530);
      return () => clearInterval(interval);
    }
  }, [step]);

  // Focus input when entering setup step
  useEffect(() => {
    if (stepAnim && step === 'setup') {
      setTimeout(() => passwordRef.current?.focus(), 150);
    }
  }, [stepAnim, step]);

  // Focus confirm input on step change
  useEffect(() => {
    if (step === 'confirm') {
      setTimeout(() => confirmRef.current?.focus(), TRANSITION_DURATION + 100);
    }
  }, [step]);

  // Revert to setup if password no longer meets requirements while on confirm
  useEffect(() => {
    if (step === 'confirm' && !allValid) {
      setStep('setup');
      setConfirmPassword('');
    }
  }, [step, allValid]);

  // Track transition direction for slide animations
  const [slideDir, setSlideDir] = useState<'left' | 'right' | 'up'>('up');

  // Unified step transition — fade out current, fade in next
  const goToStep = (next: Step, direction: 'left' | 'right' | 'up' = 'left') => {
    setSlideDir(direction);
    setStepAnim(false);
    setSpinFast(true);
    setTimeout(() => {
      setStep(next);
      setSpinFast(false);
      // Incoming content comes from the opposite direction
      setSlideDir(direction === 'left' ? 'right' : direction === 'right' ? 'left' : 'up');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setStepAnim(true));
      });
    }, 300);
  };

  // Stagger for any step's elements — slides horizontally for phrase/appearance/setup transitions
  const stepStagger = (index: number): React.CSSProperties => {
    const offset = slideDir === 'left' ? '-16px' : slideDir === 'right' ? '16px' : '0';
    const offsetY = slideDir === 'up' ? '16px' : '0';
    return {
      opacity: stepAnim ? 1 : 0,
      transform: stepAnim ? 'translate(0, 0)' : `translate(${offset}, ${offsetY})`,
      transition: `opacity 300ms ease ${index * 60}ms, transform 300ms ease ${index * 60}ms`,
    };
  };

  // --- Navigation handlers ---
  const handlePhraseContinue = () => goToStep('appearance', 'left');
  const handleAppearanceContinue = () => goToStep('setup', 'left');
  const handleAppearanceBack = () => goToStep('phrase', 'right');
  const handleSetupBack = () => goToStep('appearance', 'right');

  const handleConfirmBack = () => {
    setStep('setup');
    setConfirmPassword('');
    setTimeout(() => passwordRef.current?.focus(), 100);
  };

  const handleAnalyticsBack = () => {
    setStep('confirm');
    setTimeout(() => confirmRef.current?.focus(), 100);
  };

  const handleCopySeed = () => {
    if (phraseCopied) return;
    navigator.clipboard.writeText(SEED_WORDS.join(' ')).catch(() => {});
    setCopyAnim(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          setPhraseCopied(true);
          requestAnimationFrame(() => {
            requestAnimationFrame(() => setCopyAnim(false));
          });
          setTimeout(() => {
            setCopyAnim(true);
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                setTimeout(() => {
                  setPhraseCopied(false);
                  requestAnimationFrame(() => {
                    requestAnimationFrame(() => setCopyAnim(false));
                  });
                }, 180);
              });
            });
          }, 2000);
        }, 180);
      });
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'Enter') return;
    if (step === 'setup') handleSetupContinue();
    else if (step === 'confirm') handleConfirmContinue();
  };

  const handleSetupContinue = () => {
    if (!allValid) return;
    setSpinFast(true);
    setStep('confirm');
    setPwFocused(false);
    setTimeout(() => {
      setSpinFast(false);
      confirmRef.current?.focus();
    }, TRANSITION_DURATION);
  };

  const handleConfirmContinue = () => {
    if (!passwordsMatch) return;
    setSpinFast(true);
    setStep('analytics');
    setTimeout(() => setSpinFast(false), TRANSITION_DURATION);
  };

  const handleAnalyticsChoice = () => {
    setSpinFast(true);
    setAnalyticsExiting(true);
    setTimeout(() => onComplete(), 500);
  };

  const requirements = [
    { key: 'minLength' as const, label: 'At least 8 characters' },
    { key: 'capital' as const, label: 'Capital letter' },
    { key: 'special' as const, label: 'Special character' },
    { key: 'number' as const, label: 'Number' },
  ];

  const contentOpacity = (fadeIn && !transitioning) ? 1 : 0;
  const contentTransform = (fadeIn && !transitioning) ? 'translateY(0)' : 'translateY(12px)';

  // Stagger helper for initial enter animation
  const enterStagger = (index: number): React.CSSProperties => ({
    opacity: stepAnim ? 1 : 0,
    transform: stepAnim ? 'translateY(0)' : 'translateY(16px)',
    transition: `opacity 300ms ease ${index * 60}ms, transform 300ms ease ${index * 60}ms`,
  });

  // Stagger helper for analytics exit
  const exitStagger = (index: number): React.CSSProperties => ({
    opacity: analyticsExiting ? 0 : 1,
    transform: analyticsExiting ? 'translateY(-12px)' : 'translateY(0)',
    transition: `opacity 300ms ease ${index * 60}ms, transform 300ms ease ${index * 60}ms`,
  });

  // Which steps show the spinny/shield bg
  const showBg = step === 'setup' || step === 'confirm' || step === 'analytics';

  return (
    <div
      className="relative size-full overflow-hidden"
      style={{
        backgroundColor: C.BACKGROUND,
      }}
    >
      {/* Keyframes for spinny + cursor blink */}
      <style>{`
        @keyframes shakeY {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          15%, 55%, 85% { transform: translateX(-50%) translateY(-3px); }
          35%, 70% { transform: translateX(-50%) translateY(3px); }
        }
        @keyframes spinSlow {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes spinFast {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `}</style>

      {/* Spinny background — lowest z-index */}
      {showBg && (
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

      {/* Background gradient ellipse (visible on password steps) */}
      {showBg && (
        <div
          style={{
            position: 'absolute',
            top: '110px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '381px',
            height: '381px',
            opacity: contentOpacity,
            transition: `opacity ${TRANSITION_DURATION}ms ease-out`,
            pointerEvents: 'none',
          }}
        >
          <img
            src={shieldLogo}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              opacity: 0.06,
              filter: 'blur(40px)',
            }}
          />
        </div>
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

      {/* PHRASE SCREEN */}
      {step === 'phrase' && (
        <div
          className="absolute inset-0 flex flex-col"
          style={{
            backgroundColor: '#090707',
            zIndex: 10,
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          <div style={{ padding: '20px', paddingBottom: '88px', display: 'flex', flexDirection: 'column', flex: 1, minHeight: '100%' }}>
            {/* Back arrow */}
            <button
              onClick={() => {}}
              style={{
                width: '20px', height: '20px', background: 'none', border: 'none',
                cursor: 'default', padding: 0, marginBottom: '16px',
                transform: 'rotate(90deg)',
                opacity: 0.2,
              }}
            >
              <img src={backArrow} alt="Back" className="size-full" />
            </button>

            {/* Title */}
            <div style={stepStagger(0)}>
            <p
              className="font-innovator"
              style={{
                fontSize: '32px',
                fontWeight: 600,
                lineHeight: 1.12,
                letterSpacing: '-0.64px',
                color: C.TEXT_PRIMARY,
                marginBottom: '12px',
              }}
            >
              Your secret phrase
            </p>
            </div>

            {/* Subheading */}
            <div style={stepStagger(1)}>
            <p
              className="font-innovator"
              style={{
                fontSize: '15px',
                fontWeight: 500,
                lineHeight: 1.4,
                color: C.TEXT_QUATERNARY,
                marginBottom: '20px',
              }}
            >
              Write it down in order and keep it safe — this is the only way to recover your wallet.
            </p>
            </div>

            {/* Red warning banner + grid + copy — wrapped in stagger */}
            <div style={stepStagger(2)}>
            <div
              style={{
                background: 'linear-gradient(180deg, rgba(255,38,38,0.12) 0%, transparent 100%)',
                borderRadius: '16px 16px 0 0',
                padding: '12px 16px',
                marginBottom: '0px',
              }}
            >
              <p
                className="font-diatype"
                style={{
                  fontSize: '11px',
                  fontWeight: 500,
                  lineHeight: 1.4,
                  letterSpacing: '0.33px',
                  textTransform: 'uppercase',
                  color: '#ff2626',
                  textAlign: 'center',
                }}
              >
                Don't screenshot this and never share with anyone
              </p>
            </div>

            {/* Seed phrase grid */}
            <div
              style={{
                position: 'relative',
                backgroundColor: 'rgba(255,255,255,0.08)',
                borderRadius: '16px',
                padding: '20px',
                paddingBottom: '32px',
                marginBottom: '0px',
              }}
            >
              {/* Blur overlay + hatch pattern + reveal button */}
              {!phraseRevealed && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 2,
                    borderRadius: '16px',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {/* Hatch pattern overlay */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      opacity: 0.5,
                      backgroundImage: `url(${hatchPattern})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                  {/* Reveal button */}
                  <button
                    onClick={() => setPhraseRevealed(true)}
                    onMouseEnter={() => setRevealHovered(true)}
                    onMouseLeave={() => setRevealHovered(false)}
                    style={{
                      position: 'relative',
                      zIndex: 3,
                      height: '32px',
                      paddingLeft: '12px',
                      paddingRight: '8px',
                      backgroundColor: revealHovered ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.08)',
                      backdropFilter: 'blur(24px)',
                      transition: 'background-color 150ms ease',
                      borderRadius: BORDER_RADIUS.full,
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                    }}
                  >
                    <p
                      className="font-diatype"
                      style={{
                        fontSize: '13px',
                        fontWeight: 700,
                        letterSpacing: '0.39px',
                        textTransform: 'uppercase',
                        color: C.TEXT_QUINARY,
                        lineHeight: 1,
                      }}
                    >
                      Reveal
                    </p>
                    <img src={eyeRevealIcon} alt="" style={{ width: '20px', height: '20px' }} />
                  </button>
                </div>
              )}

              {/* Two-column grid */}
              <div
                style={{
                  display: 'flex',
                  gap: '0px',
                  filter: phraseRevealed ? 'blur(0px)' : 'blur(18px)',
                  transition: 'filter 300ms ease',
                }}
              >
                {/* Left column: words 1-6 */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {SEED_WORDS.slice(0, 6).map((word, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span
                        className="font-innovator"
                        style={{
                          fontSize: '15px',
                          fontWeight: 500,
                          lineHeight: 1.4,
                          color: C.TEXT_QUATERNARY,
                          width: '20px',
                          textAlign: 'right',
                        }}
                      >
                        {i + 1}
                      </span>
                      <span
                        className="font-innovator"
                        style={{
                          fontSize: '15px',
                          fontWeight: 600,
                          lineHeight: 1.4,
                          color: C.TEXT_PRIMARY,
                        }}
                      >
                        {word}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Divider line */}
                <div
                  style={{
                    width: '1px',
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    margin: '0 4px',
                  }}
                />

                {/* Right column: words 7-12 */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'flex-end' }}>
                  {SEED_WORDS.slice(6, 12).map((word, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span
                        className="font-innovator"
                        style={{
                          fontSize: '15px',
                          fontWeight: 500,
                          lineHeight: 1.4,
                          color: C.TEXT_QUATERNARY,
                          width: '20px',
                          textAlign: 'right',
                        }}
                      >
                        {i + 7}
                      </span>
                      <span
                        className="font-innovator"
                        style={{
                          fontSize: '15px',
                          fontWeight: 600,
                          lineHeight: 1.4,
                          color: C.TEXT_PRIMARY,
                        }}
                      >
                        {word}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Copy button — overlaps grid bottom */}
              <div style={{
                position: 'absolute',
                bottom: '-28px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 3,
              }}>
                <button
                  onClick={handleCopySeed}
                  style={{
                    width: '136px',
                    height: '28px',
                    padding: 0,
                    background: `url(${buttonBg}) center/contain no-repeat`,
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '4px', height: '16px' }}>
                    {/* Copy state */}
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '4px',
                      position: phraseCopied ? 'absolute' : 'relative',
                      opacity: (!phraseCopied && !copyAnim) ? 1 : 0,
                      filter: copyAnim ? 'blur(4px)' : 'blur(0px)',
                      transform: (phraseCopied || copyAnim) ? 'translateY(-8px)' : 'translateY(0)',
                      transition: 'opacity 150ms ease, filter 150ms ease, transform 150ms ease',
                    }}>
                      <p className="font-diatype" style={{
                        fontSize: '13px', fontWeight: 700, letterSpacing: '0.39px',
                        textTransform: 'uppercase', color: C.TEXT_QUINARY, lineHeight: 1,
                      }}>Copy</p>
                      <img src={copyIcon} alt="" style={{ width: '16px', height: '16px' }} />
                    </div>
                    {/* Copied state */}
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '4px',
                      position: !phraseCopied ? 'absolute' : 'relative',
                      opacity: (phraseCopied && !copyAnim) ? 1 : 0,
                      filter: copyAnim ? 'blur(4px)' : 'blur(0px)',
                      transform: (!phraseCopied || copyAnim) ? 'translateY(8px)' : 'translateY(0)',
                      transition: 'opacity 150ms ease, filter 150ms ease, transform 150ms ease',
                    }}>
                      <p className="font-diatype" style={{
                        fontSize: '13px', fontWeight: 700, letterSpacing: '0.39px',
                        textTransform: 'uppercase', color: C.TEXT_QUINARY, lineHeight: 1,
                      }}>Copied</p>
                      <img src={checkIcon} alt="" style={{ width: '16px', height: '16px' }} />
                    </div>
                  </div>
                </button>
              </div>
            </div>
            </div>{/* end stagger wrapper for banner+grid+copy */}

          </div>

          {/* Continue button — fixed at bottom */}
          <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px', ...stepStagger(3) }}>
            <button
              onClick={handlePhraseContinue}
              style={{
                width: '100%', height: '48px',
                backgroundColor: C.TEXT_PRIMARY,
                borderRadius: BORDER_RADIUS.full, border: 'none',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '0 12px',
              }}
            >
              <p className="font-diatype" style={{
                color: C.BACKGROUND, fontSize: '15px', fontWeight: 700,
                letterSpacing: '0.45px', textTransform: 'uppercase', lineHeight: 1,
              }}>Continue</p>
            </button>
          </div>
        </div>
      )}

      {/* APPEARANCE SCREEN */}
      {step === 'appearance' && (
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: '#090707',
            overflow: 'hidden',
          }}
        >
          {/* Spinny bg for appearance */}
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
              opacity: stepAnim ? 0.8 : 0,
              transition: 'opacity 400ms ease',
              animation: spinFast ? 'spinFast 0.4s ease-in-out forwards' : 'spinSlow 120s linear infinite',
            }}
          />

          {/* Back arrow — absolute */}
          <button
            onClick={handleAppearanceBack}
            style={{
              position: 'absolute',
              top: '20px', left: '20px',
              width: '20px', height: '20px', background: 'none', border: 'none',
              cursor: 'pointer', padding: 0,
              transform: 'rotate(90deg)',
              zIndex: 1,
            }}
          >
            <img src={backArrow} alt="Back" className="size-full" />
          </button>

          {/* Centered content */}
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            zIndex: 1,
            pointerEvents: 'none',
            ...stepStagger(0),
          }}>
            {/* Avatar + dice button container */}
            <div style={{ position: 'relative', marginBottom: '20px', pointerEvents: 'auto' }}>
              {/* Blue gradient circle avatar */}
              <div
                style={{
                  width: '96px',
                  height: '96px',
                  borderRadius: '50%',
                  background: AVATAR_GRADIENTS[avatarGradient],
                  boxShadow: 'inset 0px 6px 20px rgba(255,255,255,0.25), inset 0px 0px 4px rgba(255,255,255,0.25)',
                  transition: 'background 400ms ease',
                }}
              />

              {/* Dice button — overlaps circle bottom */}
              <button
                onClick={handleDiceRoll}
                onMouseEnter={() => setDiceHovered(true)}
                onMouseLeave={() => setDiceHovered(false)}
                style={{
                  position: 'absolute',
                  bottom: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '44px',
                  height: '32px',
                  backgroundColor: diceHovered ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(24px)',
                  borderRadius: BORDER_RADIUS.full,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  transition: 'background-color 150ms ease',
                  animation: diceShaking ? 'shakeY 0.4s ease-in-out' : 'none',
                }}
              >
                <img
                  src={DICE_ICONS[diceIndex]}
                  alt=""
                  style={{
                    width: '20px',
                    height: '20px',
                    opacity: diceAnim ? 0 : 1,
                    filter: diceAnim ? 'blur(4px)' : 'blur(0px)',
                    transform: diceAnim ? 'translateY(-8px)' : 'translateY(0)',
                    transition: 'opacity 150ms ease, filter 150ms ease, transform 150ms ease',
                  }}
                />
              </button>
            </div>

            {/* Account name with blinking cursor */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px', marginTop: '8px' }}>
              <p
                className="font-innovator"
                style={{
                  fontSize: '24px',
                  fontWeight: 600,
                  lineHeight: 1.18,
                  letterSpacing: '-0.48px',
                  color: C.TEXT_PRIMARY,
                }}
              >
                Account 1
              </p>
              <div
                style={{
                  width: '2px',
                  height: '24px',
                  backgroundColor: C.TEXT_PRIMARY,
                  opacity: cursorVisible ? 1 : 0,
                  transition: 'opacity 100ms ease',
                }}
              />
            </div>
          </div>

          {/* Continue button — fixed at bottom */}
          <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px', zIndex: 1, ...stepStagger(1) }}>
            <button
              onClick={handleAppearanceContinue}
              style={{
                width: '100%', height: '48px',
                backgroundColor: C.TEXT_PRIMARY,
                borderRadius: BORDER_RADIUS.full, border: 'none',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '0 12px',
              }}
            >
              <p className="font-diatype" style={{
                color: C.BACKGROUND, fontSize: '15px', fontWeight: 700,
                letterSpacing: '0.45px', textTransform: 'uppercase', lineHeight: 1,
              }}>Continue</p>
            </button>
          </div>
        </div>
      )}

      {/* SETUP + CONFIRM + ANALYTICS (unified view) */}
      {(step === 'setup' || step === 'confirm' || step === 'analytics') && (
        <div
          className="absolute inset-0"
          style={{
            opacity: contentOpacity,
            transform: contentTransform,
            transition: `opacity ${TRANSITION_DURATION}ms ease-out, transform ${TRANSITION_DURATION}ms ease-out`,
          }}
        >
          {/* Back arrow for setup/confirm/analytics */}
          <button
            onClick={
              step === 'setup' ? handleSetupBack :
              step === 'confirm' ? handleConfirmBack :
              step === 'analytics' ? handleAnalyticsBack :
              undefined
            }
            style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              width: '20px',
              height: '20px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              zIndex: 5,
            }}
          >
            <img src={backArrow} alt="Back" className="size-full" style={{ transform: 'rotate(90deg)' }} />
          </button>

          {/* All password content — fades out on analytics */}
          <div style={{
            position: 'absolute', inset: 0,
            opacity: step === 'analytics' ? 0 : 1,
            transform: step === 'analytics' ? 'translateY(-12px)' : 'translateY(0)',
            transition: 'opacity 300ms ease, transform 300ms ease',
            pointerEvents: step === 'analytics' ? 'none' : 'auto',
          }}>

          {/* Top section: title + subheading */}
          <div style={{ position: 'absolute', top: '58px', left: '20px', right: '20px' }}>

          {/* Title — blur reroll letter by letter */}
          <div style={{ position: 'relative', height: '36px', marginBottom: '12px', ...enterStagger(0) }}>
            {/* "Set up password" */}
            <div style={{ position: 'absolute', top: 0, left: 0, display: 'flex', overflow: 'hidden' }}>
              {'Set up password'.split('').map((char, i) => (
                <span
                  key={`setup-${i}`}
                  className="font-innovator"
                  style={{
                    display: 'inline-block',
                    fontSize: '32px',
                    fontWeight: 600,
                    lineHeight: 1.12,
                    letterSpacing: '-0.64px',
                    color: C.TEXT_PRIMARY,
                    whiteSpace: 'pre',
                    opacity: step === 'setup' ? 1 : 0,
                    filter: step === 'setup' ? 'blur(0px)' : 'blur(4px)',
                    transform: step === 'setup' ? 'translateY(0)' : 'translateY(-110%)',
                    transition: `opacity ${TRANSITION_DURATION}ms ease ${i * 15}ms, filter ${TRANSITION_DURATION}ms ease ${i * 15}ms, transform ${TRANSITION_DURATION}ms ease ${i * 15}ms`,
                  }}
                >
                  {char}
                </span>
              ))}
            </div>
            {/* "Confirm password" */}
            <div style={{ position: 'absolute', top: 0, left: 0, display: 'flex', overflow: 'hidden' }}>
              {'Confirm password'.split('').map((char, i) => (
                <span
                  key={`confirm-${i}`}
                  className="font-innovator"
                  style={{
                    display: 'inline-block',
                    fontSize: '32px',
                    fontWeight: 600,
                    lineHeight: 1.12,
                    letterSpacing: '-0.64px',
                    color: C.TEXT_PRIMARY,
                    whiteSpace: 'pre',
                    opacity: step === 'confirm' ? 1 : 0,
                    filter: step === 'confirm' ? 'blur(0px)' : 'blur(4px)',
                    transform: step === 'confirm' ? 'translateY(0)' : (step === 'analytics' ? 'translateY(-110%)' : 'translateY(110%)'),
                    transition: `opacity 300ms ease ${i * 15}ms, filter 300ms ease ${i * 15}ms, transform 300ms ease ${i * 15}ms`,
                  }}
                >
                  {char}
                </span>
              ))}
            </div>
          </div>

          {/* Subheading — static, always visible */}
          <div
            className="font-innovator"
            style={{
              fontSize: '15px',
              fontWeight: 500,
              lineHeight: 1.4,
              color: C.TEXT_QUATERNARY,
              marginBottom: '16px',
              ...enterStagger(2),
            }}
          >
            <p>Make sure it's something you remember.</p>
            <p>Shield team can't recover it for you.</p>
          </div>

          </div>{/* end top section */}

          {/* Input section — first input anchored at vertical center */}
          <div style={{
            position: 'absolute', left: '20px', right: '20px',
            top: 'calc(50% - 36px)',
            display: 'flex', flexDirection: 'column',
          }}>

          {/* Password input — stays in place, loses focus border on confirm */}
          <div style={enterStagger(3)}>
          <div
            onMouseEnter={() => setPwHovered(true)}
            onMouseLeave={() => setPwHovered(false)}
            style={{
              position: 'relative',
              height: '53px',
              backgroundColor: (pwFocused || pwHovered) ? 'rgba(255,255,255,0.12)' : C.BG_SUBTLE,
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              borderRadius: BORDER_RADIUS.sm,
              border: 'none',
              boxShadow: pwFocused ? `inset 0 0 0 2px ${C.TEXT_PRIMARY}` : `inset 0 0 0 1px rgba(255,255,255,0)`,
              display: 'flex',
              alignItems: 'center',
              padding: `0 ${SPACING.md}`,
              marginBottom: '12px',
              transition: 'background-color 150ms ease, box-shadow 150ms ease',
            }}
          >
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden', height: '21px' }}>
              <input
                ref={passwordRef}
                type={showPasswords ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
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
          </div>{/* end password input stagger wrapper */}

          {/* Confirm input — slides down from behind the first input */}
          <div
            onMouseEnter={() => setConfirmHovered(true)}
            onMouseLeave={() => setConfirmHovered(false)}
            style={{
              position: 'relative',
              height: step === 'confirm' ? '56px' : '0px',
              opacity: step === 'confirm' ? 1 : 0,
              marginBottom: step === 'confirm' ? '12px' : '0px',
              backgroundColor: (confirmFocused || confirmHovered) ? 'rgba(255,255,255,0.12)' : C.BG_SUBTLE,
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              borderRadius: BORDER_RADIUS.sm,
              border: 'none',
              boxShadow: confirmFocused ? `inset 0 0 0 2px ${C.TEXT_PRIMARY}` : `inset 0 0 0 1px rgba(255,255,255,0)`,
              display: 'flex',
              alignItems: 'center',
              padding: `0 ${SPACING.md}`,
              overflow: 'hidden',
              transition: `height ${TRANSITION_DURATION}ms ease, opacity ${TRANSITION_DURATION}ms ease, margin-bottom ${TRANSITION_DURATION}ms ease, background-color 150ms ease, border-color 150ms ease`,
            }}
          >
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden', height: '21px' }}>
              <input
                ref={confirmRef}
                type={showPasswords ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onFocus={() => setConfirmFocused(true)}
                onBlur={() => setConfirmFocused(false)}
                onKeyDown={handleKeyDown}
                className="font-innovator"
                style={{
                  position: 'absolute', inset: 0, width: '100%', backgroundColor: 'transparent',
                  border: 'none', outline: 'none',
                  color: confirmToggleAnim ? 'transparent' : C.TEXT_PRIMARY,
                  fontSize: '15px', fontWeight: 500, lineHeight: 1.4,
                  caretColor: confirmToggleAnim ? 'transparent' : C.TEXT_PRIMARY,
                }}
              />
              <span className="font-innovator" aria-hidden style={{
                position: 'absolute', top: 0, left: 0, fontSize: '15px', fontWeight: 500, lineHeight: 1.4,
                color: C.TEXT_PRIMARY, pointerEvents: 'none', whiteSpace: 'nowrap',
                filter: (showPasswords ? !confirmToggleAnim : confirmToggleAnim) ? 'blur(4px)' : 'blur(0px)',
                transform: (showPasswords ? !confirmToggleAnim : confirmToggleAnim) ? 'translateY(-8px)' : 'translateY(0)',
                opacity: (showPasswords ? !confirmToggleAnim : confirmToggleAnim) ? 0 : 1,
                transition: 'filter 150ms ease, transform 150ms ease, opacity 150ms ease',
              }}>{'•'.repeat(confirmPassword.length)}</span>
              <span className="font-innovator" aria-hidden style={{
                position: 'absolute', top: 0, left: 0, fontSize: '15px', fontWeight: 500, lineHeight: 1.4,
                color: C.TEXT_PRIMARY, pointerEvents: 'none', whiteSpace: 'nowrap',
                filter: (showPasswords ? confirmToggleAnim : !confirmToggleAnim) ? 'blur(4px)' : 'blur(0px)',
                transform: (showPasswords ? confirmToggleAnim : !confirmToggleAnim) ? 'translateY(8px)' : 'translateY(0)',
                opacity: (showPasswords ? confirmToggleAnim : !confirmToggleAnim) ? 0 : 1,
                transition: 'filter 150ms ease, transform 150ms ease, opacity 150ms ease',
              }}>{confirmPassword}</span>
            </div>
            <button
              onClick={handleTogglePasswords}
              onMouseEnter={() => setConfirmBtnHovered(true)}
              onMouseLeave={() => setConfirmBtnHovered(false)}
              style={{
                position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                height: '32px', backgroundColor: confirmBtnHovered ? 'rgba(255,255,255,0.16)' : C.BG_SUBTLE,
                backdropFilter: 'blur(24px)', borderRadius: BORDER_RADIUS.full, border: 'none',
                cursor: 'pointer', transition: 'background-color 150ms ease',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '0 12px', overflow: 'hidden',
              }}
            >
              <div style={{ position: 'relative', width: '40px', height: '14px' }}>
                <span className="font-diatype" style={{
                  position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '13px', fontWeight: 700, letterSpacing: '0.39px', textTransform: 'uppercase',
                  color: C.TEXT_PRIMARY, lineHeight: 1,
                  filter: (showPasswords ? !confirmToggleAnim : confirmToggleAnim) ? 'blur(4px)' : 'blur(0px)',
                  transform: (showPasswords ? !confirmToggleAnim : confirmToggleAnim) ? 'translateY(-8px)' : 'translateY(0)',
                  opacity: (showPasswords ? !confirmToggleAnim : confirmToggleAnim) ? 0 : 1,
                  transition: 'filter 150ms ease, transform 150ms ease, opacity 150ms ease',
                }}>Show</span>
                <span className="font-diatype" style={{
                  position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '13px', fontWeight: 700, letterSpacing: '0.39px', textTransform: 'uppercase',
                  color: C.TEXT_PRIMARY, lineHeight: 1,
                  filter: (showPasswords ? confirmToggleAnim : !confirmToggleAnim) ? 'blur(4px)' : 'blur(0px)',
                  transform: (showPasswords ? confirmToggleAnim : !confirmToggleAnim) ? 'translateY(8px)' : 'translateY(0)',
                  opacity: (showPasswords ? confirmToggleAnim : !confirmToggleAnim) ? 0 : 1,
                  transition: 'filter 150ms ease, transform 150ms ease, opacity 150ms ease',
                }}>Hide</span>
              </div>
            </button>
          </div>

          {/* Validation / Strength — slides out down on confirm */}
          <div style={{ ...enterStagger(4) }}>
          <div style={{
            position: 'relative',
            opacity: step === 'confirm' ? 0 : 1,
            transform: step === 'confirm' ? 'translateY(12px)' : 'translateY(0)',
            maxHeight: step === 'confirm' ? '0px' : '200px',
            overflow: 'hidden',
            transition: `opacity ${TRANSITION_DURATION}ms ease-in-out, transform ${TRANSITION_DURATION}ms ease-in-out, max-height ${TRANSITION_DURATION}ms ease`,
          }}>
            <div style={{
              display: 'flex', flexDirection: 'column', gap: SPACING.sm,
              opacity: (allValid && step === 'setup') ? 0 : (step === 'confirm') ? 0 : 1,
              transform: (allValid && step === 'setup') ? 'translateX(20px)' : 'translateX(0)',
              transition: (step === 'confirm') ? 'none' : 'opacity 300ms ease-in-out, transform 300ms ease-in-out',
            }}>
              {requirements.map(({ key, label }) => {
                const met = validation[key];
                return (
                  <div key={key} style={{
                    display: 'flex', alignItems: 'center', gap: SPACING.sm,
                    opacity: met ? 0.5 : 1, transition: 'opacity 200ms ease',
                  }}>
                    <img src={diamondMarker} alt="" style={{ width: '5.66px', height: '5.66px' }} />
                    <p className="font-diatype" style={{
                      fontSize: '13px', fontWeight: 500, lineHeight: 1, letterSpacing: '0.39px',
                      textTransform: 'uppercase', color: C.TEXT_PRIMARY,
                      textDecoration: met ? 'line-through' : 'none', transition: 'all 200ms ease',
                    }}>{label}</p>
                  </div>
                );
              })}
            </div>
            <p className="font-diatype" style={{
              position: 'absolute', top: 0, left: 0, fontSize: '13px', fontWeight: 500, lineHeight: 1,
              letterSpacing: '0.39px', textTransform: 'uppercase', color: C.TEXT_PRIMARY,
              opacity: allValid ? 1 : 0, transform: allValid ? 'translateX(0)' : 'translateX(-16px)',
              transition: 'opacity 300ms ease-in-out, transform 300ms ease-in-out', pointerEvents: 'none',
            }}>That's a great password</p>
          </div>
          </div>{/* end validation stagger wrapper */}

          </div>{/* end centered input section */}

          </div>{/* end all password content wrapper */}

          {/* Analytics — absolutely centered block */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '20px',
            right: '20px',
            transform: step === 'analytics' ? 'translateY(-50%)' : 'translateY(calc(-50% + 20px))',
            opacity: step === 'analytics' ? 1 : 0,
            transition: 'opacity 300ms ease, transform 300ms ease',
            pointerEvents: step === 'analytics' ? 'auto' : 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
          }}>
            <p
              className="font-innovator"
              style={{
                fontSize: '32px',
                fontWeight: 600,
                lineHeight: 1.12,
                letterSpacing: '-0.64px',
                color: C.TEXT_PRIMARY,
                textAlign: 'center',
                ...exitStagger(0),
              }}
            >
              Help improve Shield?
            </p>
            <p
              className="font-innovator"
              style={{
                fontSize: '15px',
                fontWeight: 500,
                lineHeight: 1.4,
                color: C.TEXT_PRIMARY,
                textAlign: 'center',
                width: '313px',
                ...exitStagger(1),
              }}
            >
              Help improve Shield by sharing anonymous diagnostics and data. It can not be used to track you and does not affect your privacy.
            </p>
          </div>

          {/* Bottom group */}
          <div style={{
            position: 'absolute', bottom: '20px', left: '20px', right: '20px',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: '0px',
            ...enterStagger(5),
          }}>
            {/* TOS — only on confirm */}
            <div className="font-innovator" style={{
              fontSize: '13px', fontWeight: 500, lineHeight: 1.4, color: C.TEXT_QUATERNARY,
              letterSpacing: '0.13px', textAlign: 'left', width: '100%',
              opacity: step === 'confirm' ? 1 : 0,
              maxHeight: step === 'confirm' ? '50px' : '0px',
              marginBottom: step === 'confirm' ? '16px' : '0px',
              overflow: 'hidden',
              transform: step === 'confirm' ? 'translateY(0)' : 'translateY(8px)',
              transition: 'opacity 300ms ease, transform 300ms ease, max-height 300ms ease, margin-bottom 300ms ease',
            }}>
              <p>By clicking "Continue", you agree to Aleo wallet's{' '}
                <span style={{ textDecoration: 'underline' }}>User&nbsp;Notice</span>
                {' '}and{' '}
                <span style={{ textDecoration: 'underline' }}>Privacy Policy</span>
              </p>
            </div>
            {/* Main CTA button — always present, label changes */}
            <div style={{ width: '100%', ...exitStagger(2) }}>
            <button
              onClick={
                step === 'analytics' ? handleAnalyticsChoice :
                step === 'confirm' ? (passwordsMatch ? handleConfirmContinue : undefined) :
                (allValid ? handleSetupContinue : undefined)
              }
              style={{
                width: '100%', height: '48px',
                backgroundColor: (
                  step === 'analytics' ? true :
                  step === 'confirm' ? passwordsMatch :
                  allValid
                ) ? C.TEXT_PRIMARY : 'rgba(255,255,255,0.48)',
                backdropFilter: 'blur(24px)', borderRadius: BORDER_RADIUS.full, border: 'none',
                cursor: (
                  step === 'analytics' ? true :
                  step === 'confirm' ? passwordsMatch :
                  allValid
                ) ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '0 12px',
                transition: 'background-color 200ms ease',
              }}
            >
              <p className="font-diatype" style={{
                color: C.BACKGROUND, fontSize: '15px', fontWeight: 700,
                letterSpacing: '0.45px', textTransform: 'uppercase', lineHeight: 1,
              }}>
                {step === 'analytics' ? 'Share analytics' :
                 step === 'confirm' && !passwordsMatch ? 're-enter password' : 'Continue'}
              </p>
            </button>
            </div>{/* end CTA exit stagger */}
            {/* Don't share — slides in from bottom on analytics */}
            <div style={{ width: '100%', ...exitStagger(3) }}>
            <button
              onClick={step === 'analytics' ? handleAnalyticsChoice : undefined}
              style={{
                width: '100%', height: '48px',
                backgroundColor: C.BG_SUBTLE,
                backdropFilter: 'blur(24px)',
                borderRadius: BORDER_RADIUS.full, border: 'none',
                cursor: step === 'analytics' ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: step === 'analytics' ? 1 : 0,
                maxHeight: step === 'analytics' ? '48px' : '0px',
                marginTop: step === 'analytics' ? '8px' : '0px',
                overflow: 'hidden',
                transform: step === 'analytics' ? 'translateY(0)' : 'translateY(12px)',
                transition: 'opacity 300ms ease, transform 300ms ease, max-height 300ms ease, margin-top 300ms ease',
              }}
            >
              <p className="font-diatype" style={{
                color: C.TEXT_PRIMARY, fontSize: '13px', fontWeight: 700,
                letterSpacing: '0.39px', textTransform: 'uppercase', lineHeight: 1,
              }}>
                Don't share
              </p>
            </button>
            </div>{/* end Don't share exit stagger */}
          </div>
        </div>
      )}
    </div>
  );
};
