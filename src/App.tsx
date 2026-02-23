import { useState } from 'react';
import OnrampOfframp from './components/OnrampOfframp';
import { DARK_COLORS, LIGHT_COLORS } from './constants/styles';
import { ThemeContext } from './constants/ThemeContext';

const TOGGLE_STYLE = {
  base: {
    padding: '10px 20px',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'system-ui, sans-serif',
    transition: 'background-color 200ms ease',
    width: '160px',
    textAlign: 'left' as const,
  },
  on: { backgroundColor: '#13bc80' },
  off: { backgroundColor: '#333' },
};

function App() {
  const [isDone, setIsDone] = useState(false);
  const [isShield, setIsShield] = useState(false);
  const [isSwap, setIsSwap] = useState(false);
  const [isSend, setIsSend] = useState(false);
  const [isDark, setIsDark] = useState(true);

  const riveInputs = { isDone, isShield, isSwap, isSend, isDark };
  const colors = isDark ? DARK_COLORS : LIGHT_COLORS;

  const toggles = [
    { label: 'isSend', value: isSend, toggle: () => setIsSend(p => !p) },
    { label: 'isShield', value: isShield, toggle: () => setIsShield(p => !p) },
    { label: 'isSwap', value: isSwap, toggle: () => setIsSwap(p => !p) },
    { label: 'Done', value: isDone, toggle: () => setIsDone(p => !p) },
  ];

  const anyOn = isDone || isShield || isSwap || isSend;

  return (
    <ThemeContext.Provider value={colors}>
      <div className="min-h-screen w-full flex items-center justify-center bg-[#D4D4D4] p-8 gap-8">
        <div className="relative">
          {/* Hint label */}
          <p
            style={{
              position: 'absolute',
              right: 'calc(100% + 12px)',
              top: '330px',
              fontFamily: 'system-ui, sans-serif',
              fontSize: '15px',
              fontWeight: 500,
              color: '#E85D5D',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            Press it
            <span style={{ fontSize: '18px' }}>→</span>
          </p>
          <div 
            className="relative overflow-hidden shadow-2xl"
            style={{ width: '393px', height: '852px' }}
          >
            <OnrampOfframp riveInputs={riveInputs} />
          </div>
        </div>

        {/* External Controls */}
        <div className="flex flex-col gap-2 items-start">
          <p style={{ fontFamily: 'system-ui', fontSize: '11px', fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
            State Machine Inputs
          </p>
          {toggles.map(({ label, value, toggle }) => (
            <button
              key={label}
              onClick={toggle}
              style={{
                ...TOGGLE_STYLE.base,
                ...(value ? TOGGLE_STYLE.on : TOGGLE_STYLE.off),
              }}
            >
              {label}: {value ? 'ON' : 'OFF'}
            </button>
          ))}
          {anyOn && (
            <button
              onClick={() => { setIsDone(false); setIsShield(false); setIsSwap(false); setIsSend(false); }}
              style={{
                padding: '8px 16px',
                backgroundColor: 'transparent',
                color: '#666',
                border: '1px solid #999',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 500,
                cursor: 'pointer',
                fontFamily: 'system-ui, sans-serif',
                marginTop: '4px',
              }}
            >
              Reset All
            </button>
          )}

          <div style={{ width: '100%', height: '1px', backgroundColor: '#ccc', margin: '12px 0' }} />

          <p style={{ fontFamily: 'system-ui', fontSize: '11px', fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
            Appearance
          </p>
          <button
            onClick={() => setIsDark(p => !p)}
            style={{
              ...TOGGLE_STYLE.base,
              backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5',
              color: isDark ? '#fff' : '#000',
              border: '1px solid',
              borderColor: isDark ? '#444' : '#ccc',
            }}
          >
            {isDark ? '● Dark' : '○ Light'}
          </button>
        </div>
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
