import { useState } from 'react';
import OnrampOfframp from './components/OnrampOfframp';
import { SetupPasswordFlow } from './components/SetupPasswordFlow';
import { EnterPasswordFlow } from './components/EnterPasswordFlow';
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
};

function App() {
  const [isDark, setIsDark] = useState(true);
  const [flowMode, setFlowMode] = useState<'setup' | 'enter'>('setup');
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [flowKey, setFlowKey] = useState(0);

  const riveInputs = { isDone: false, isShield: false, isSwap: false, isSend: false, isDark };
  const colors = isDark ? DARK_COLORS : LIGHT_COLORS;

  return (
    <ThemeContext.Provider value={colors}>
      <div className="min-h-screen w-full flex items-center justify-center bg-[#D4D4D4] p-8 gap-8">
        <div
          className="relative overflow-hidden shadow-2xl"
          style={{ width: '393px', height: 'calc(100vh - 64px)', maxHeight: '852px', borderRadius: '16px' }}
        >
          {onboardingComplete ? (
            <OnrampOfframp riveInputs={riveInputs} />
          ) : flowMode === 'setup' ? (
            <SetupPasswordFlow key={flowKey} onComplete={() => setOnboardingComplete(true)} />
          ) : (
            <EnterPasswordFlow key={flowKey} onComplete={() => setOnboardingComplete(true)} />
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-2 items-start">
          <p style={{ fontFamily: 'system-ui', fontSize: '11px', fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
            Flow
          </p>
          <button
            onClick={() => {
              const next = flowMode === 'setup' ? 'enter' : 'setup';
              setFlowMode(next as 'setup' | 'enter');
              setOnboardingComplete(false);
              setFlowKey(k => k + 1);
            }}
            style={{
              ...TOGGLE_STYLE.base,
              backgroundColor: flowMode === 'setup' ? '#1a6b4a' : '#4a1a6b',
              color: '#fff',
              border: '1px solid',
              borderColor: flowMode === 'setup' ? '#2a8b5a' : '#6a2a8b',
            }}
          >
            {flowMode === 'setup' ? 'Setup Password' : 'Enter Password'}
          </button>

          <div style={{ width: '100%', height: '1px', backgroundColor: '#ccc', margin: '8px 0' }} />

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
