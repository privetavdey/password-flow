import React, { useEffect, useState } from 'react';
import { useRive, useStateMachineInput, Layout, Fit, Alignment } from '@rive-app/react-webgl2';

interface NavIconProps {
  src: string;
  isActive: boolean;
  onClick: () => void;
  className?: string;
}

const STATE_MACHINE_NAME = "Main";
const INPUT_NAME = "On";

export const NavIcon: React.FC<NavIconProps> = ({ src, isActive, onClick, className }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const { rive, RiveComponent } = useRive({
    src,
    stateMachines: STATE_MACHINE_NAME,
    autoplay: true,
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
  });

  const onInput = useStateMachineInput(rive, STATE_MACHINE_NAME, INPUT_NAME);

  useEffect(() => {
    if (onInput) {
      onInput.value = isActive;
      setIsInitialized(true);
    }
  }, [isActive, onInput]);

  return (
    <div 
      onClick={onClick} 
      className={className} 
      style={{ 
        cursor: 'pointer', 
        opacity: isInitialized ? 1 : 0 
      }}
    >
      <RiveComponent />
    </div>
  );
};
