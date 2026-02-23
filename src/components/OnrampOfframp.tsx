import React, { useState } from 'react';
import { BORDER_RADIUS, SPACING } from '../constants/styles';
import { useThemeColors } from '../constants/ThemeContext';
import { NavIcon } from './NavIcon';
import { SendModal } from './SendModal';
import homeIcon from '../home_icon.riv';
import historyIcon from '../history_icon.riv';
import settingsIcon from '../settings_icon.riv';

import imgImage from '../assets/profile-image.png';
import imgImage324 from '../assets/pondo-logo.png';
import imgImage325 from '../assets/vusdc-logo.png';
import imgFrame626685 from '../assets/qr-code-icon.svg';
import imgFrame2147225731 from '../assets/scan-icon.svg';
import img from '../assets/arrow-down.svg';
import imgClock from '../assets/send-icon.svg';
import imgClock1 from '../assets/receive-icon.svg';
import imgClock2 from '../assets/shield-icon.svg';
import imgFrame2147225787 from '../assets/swap-icon.svg';
import imgFrame626766 from '../assets/records-icon.svg';
import imgSecondaryIconLight1 from '../assets/aleo-logo.svg';
import imgCap from '../assets/battery-cap.svg';
import imgWifi from '../assets/wifi-icon.svg';
import imgCellularConnection from '../assets/cellular-icon.svg';

interface RiveInputs {
  isDone: boolean;
  isShield: boolean;
  isSwap: boolean;
  isSend: boolean;
  isDark: boolean;
}

interface OnrampOfframpProps {
  riveInputs: RiveInputs;
}

export default function OnrampOfframp({ riveInputs }: OnrampOfframpProps) {
  const C = useThemeColors();
  const [activeTab, setActiveTab] = useState(0);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);

  return (
    <div 
      className="content-stretch flex gap-[8px] items-start justify-center overflow-clip relative size-full"
      style={{ 
        backgroundColor: C.BACKGROUND,
        paddingTop: '70px',
        paddingLeft: SPACING.xs,
        paddingRight: SPACING.xs,
        borderRadius: BORDER_RADIUS.sm 
      }}
      data-name="Onramp/offramp" 
      data-node-id="5567:32490"
    >
      <div 
        className="content-stretch flex flex-col items-center relative shrink-0 w-[385px]"
        style={{ gap: SPACING.lg }}
        data-node-id="5567:32648"
      >
        <div 
          className="content-stretch flex flex-col items-center relative shrink-0 w-full"
          style={{ gap: SPACING.sm }}
          data-node-id="5567:32647"
        >
          <div className="content-stretch flex items-center justify-between relative shrink-0 w-[353px]" data-node-id="5567:32642">
            <div 
              className="border-[0.5px] border-solid relative shrink-0 size-[28px]"
              style={{ borderColor: C.BORDER, borderRadius: BORDER_RADIUS.full }}
              data-name="image" 
              data-node-id="5567:32544"
            >
              <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[999px]">
                <img alt="" className="absolute max-w-none object-cover rounded-[999px] size-full" src={imgImage} />
                <div className="absolute inset-0 rounded-[999px]" style={{ backgroundImage: "linear-gradient(225deg, rgb(0, 212, 255) 0%, rgb(9, 9, 121) 100%)" }} />
              </div>
            </div>
            <div 
              className="content-stretch flex items-center relative shrink-0" 
              style={{ gap: SPACING.xs }}
              data-node-id="5567:32644"
            >
              <div 
                className="content-stretch flex items-center justify-center relative shrink-0 size-[32px]"
                style={{ backgroundColor: C.BG_SUBTLE, padding: SPACING.sm, borderRadius: BORDER_RADIUS.md }}
                data-name="Frame" 
                data-node-id="5567:32548"
              >
                <div className="relative shrink-0 size-[20px]" data-node-id="5567:32549">
                  <img alt="" className="block max-w-none size-full" src={imgFrame626685} />
                </div>
              </div>
              <div 
                className="content-stretch flex items-center justify-center relative shrink-0 size-[32px]"
                style={{ backgroundColor: C.BG_SUBTLE, padding: SPACING.sm, borderRadius: BORDER_RADIUS.md }}
                data-name="Frame" 
                data-node-id="5567:32545"
              >
                <div className="relative shrink-0 size-[20px]" data-node-id="5567:32546">
                  <img alt="" className="block max-w-none size-full" src={imgFrame2147225731} />
                </div>
              </div>
            </div>
          </div>
          <div 
            className="bg-gradient-to-b content-stretch flex flex-col h-[168px] items-start justify-end relative shrink-0 w-full"
            style={{ 
              backgroundImage: `linear-gradient(to bottom, ${C.BG_SUBTLE_TRANSPARENT}, ${C.BG_SUBTLE})`,
              paddingLeft: SPACING.md,
              paddingRight: SPACING.md,
              paddingBottom: '19px',
              borderRadius: BORDER_RADIUS.md
            }}
            data-node-id="5567:32639"
          >
            <div 
              className="content-stretch flex flex-col items-start relative shrink-0 w-[238px]"
              style={{ gap: SPACING.sm }}
              data-node-id="5567:32638"
            >
              <p 
                className="font-innovator leading-[1.35] not-italic relative shrink-0 text-[15px] w-full"
                style={{ color: C.TEXT_PRIMARY, opacity: 0.48, fontWeight: 600 }}
                data-node-id="5567:32553"
              >
                Balance
              </p>
              <div 
                className="content-stretch flex items-center relative shrink-0 w-full"
                style={{ gap: '12px' }}
                data-node-id="5567:32554"
              >
                <p 
                  className="font-innovator leading-[0] not-italic relative shrink-0 text-[0px] text-[40px] tracking-[-0.8px]"
                  style={{ color: C.TEXT_PRIMARY, fontWeight: 500 }}
                  data-node-id="5567:32555"
                >
                  <span className="leading-none">$17,</span>
                  <span className="leading-none">657</span>
                  <span className="leading-none" style={{ color: C.TEXT_TERTIARY }}>.89</span>
                </p>
                <div className="flex items-center justify-center relative shrink-0">
                  <div className="flex-none scale-y-[-100%]">
                    <div 
                      className="content-stretch flex items-center justify-center relative size-[24px]"
                      style={{ backgroundColor: C.BG_SUBTLE, padding: SPACING.sm, borderRadius: BORDER_RADIUS.md }}
                      data-name="Frame" 
                      data-node-id="5567:32556"
                    >
                      <div className="flex items-center justify-center relative shrink-0">
                        <div className="flex-none rotate-[180deg]">
                          <div className="opacity-48 overflow-clip relative size-[20px]" data-name="arrow-down" data-node-id="5567:32557">
                            <div className="absolute h-[7px] left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] w-[11px]" data-name="Vector" data-node-id="I5567:32557;3706:25714">
                              <div className="absolute inset-0" style={{ "--fill-0": C.TEXT_PRIMARY } as React.CSSProperties}>
                                <img alt="" className="block max-w-none size-full" src={img} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="content-stretch flex gap-[27px] items-center relative shrink-0" data-node-id="5567:32569">
          {[
            { img: imgClock, label: 'Send', onClick: () => setIsSendModalOpen(true) },
            { img: imgClock1, label: 'Receive' },
            { img: imgClock2, label: 'Shield' },
            { img: imgFrame2147225787, label: 'Swap' },
            { img: imgFrame626766, label: 'Records' },
          ].map((item, index) => (
            <div 
              key={index} 
              className="content-stretch flex flex-col gap-[12px] items-center relative shrink-0" 
              style={{ 
                width: index === 1 || index === 4 ? '51px' : index === 2 ? '43px' : '40px',
                cursor: item.onClick ? 'pointer' : 'default',
              }}
              onClick={item.onClick}
            >
              <div 
                className="content-stretch flex items-center justify-center relative shrink-0 size-[48px]"
                style={{ backgroundColor: C.BG_SUBTLE, padding: SPACING.sm, borderRadius: BORDER_RADIUS.sm }}
              >
                <div className="relative shrink-0 size-[24px]">
                  <img alt="" className="block max-w-none size-full" src={item.img} />
                </div>
              </div>
              <p 
                className="font-diatype leading-none min-w-full not-italic relative shrink-0 text-[11px] text-center tracking-[0.66px] uppercase w-[min-content]"
                style={{ color: C.TEXT_PRIMARY, fontWeight: 700 }}
              >
                {item.label}
              </p>
            </div>
          ))}
        </div>
        <div 
          className="bg-gradient-to-b content-stretch flex flex-col h-[455px] items-start relative shrink-0 w-full"
          style={{ 
            backgroundImage: `linear-gradient(to bottom, ${C.BG_SUBTLE}, ${C.BG_SUBTLE_TRANSPARENT})`,
            paddingLeft: SPACING.md,
            paddingRight: SPACING.md,
            paddingTop: '20px',
            borderRadius: BORDER_RADIUS.md
          }}
          data-node-id="5567:32641"
        >
          <div className="content-stretch flex flex-col gap-[48px] items-center relative shrink-0 w-[353px]" data-node-id="5567:32493">
            <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-name="Frame" data-node-id="5567:32494">
              {/* List Items */}
              <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full">
                <div className="content-stretch flex items-center relative shrink-0">
                  <div 
                    className="border border-solid relative shrink-0 size-[40px]"
                    style={{ backgroundColor: C.BACKGROUND, borderColor: C.BORDER, borderRadius: BORDER_RADIUS.full }}
                  >
                    <div className="absolute h-[32.008px] left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] w-[32px]">
                      <img alt="" className="block max-w-none size-full" src={imgSecondaryIconLight1} />
                    </div>
                  </div>
                </div>
                <div className="content-stretch flex flex-[1_0_0] items-center justify-between min-h-px min-w-px relative">
                  <div className="content-stretch flex flex-col font-innovator items-start justify-center not-italic relative shrink-0 uppercase">
                    <p className="leading-[1.35] relative shrink-0 text-[15px] tracking-[0.15px]" style={{ color: C.TEXT_PRIMARY, fontWeight: 600 }}>aleo</p>
                    <p className="leading-[1.4] relative shrink-0 text-[13px] tracking-[0.13px]" style={{ color: C.TEXT_SECONDARY }}>125,077 aleo</p>
                  </div>
                  <div className="content-stretch flex flex-col items-end justify-center relative shrink-0">
                    <p className="font-innovator leading-[1.35] not-italic relative shrink-0 text-[15px] text-right tracking-[0.15px] uppercase" style={{ color: C.TEXT_PRIMARY, fontWeight: 600 }}>$15,009</p>
                  </div>
                </div>
              </div>

              <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full">
                <div className="content-stretch flex items-center relative shrink-0">
                   <div 
                    className="border border-solid relative shrink-0 size-[40px]"
                    style={{ backgroundColor: C.BACKGROUND, borderColor: C.BORDER, borderRadius: BORDER_RADIUS.full }}
                  >
                    <div className="absolute left-0 rounded-[40px] size-[38px] top-0">
                      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[40px] size-full" src={imgImage324} />
                    </div>
                  </div>
                </div>
                <div className="content-stretch flex flex-[1_0_0] items-center justify-between min-h-px min-w-px relative">
                  <div className="content-stretch flex flex-col font-innovator items-start justify-center not-italic relative shrink-0">
                    <p className="leading-[1.35] relative shrink-0 text-[15px]" style={{ color: C.TEXT_PRIMARY, fontWeight: 600 }}>Pondo</p>
                    <p className="leading-[1.4] relative shrink-0 text-[13px] tracking-[0.13px] uppercase" style={{ color: C.TEXT_SECONDARY }}>3,171,936 pndo</p>
                  </div>
                  <div className="content-stretch flex flex-col items-end justify-center relative shrink-0">
                    <p className="font-innovator leading-[1.35] not-italic relative shrink-0 text-[15px] text-right tracking-[0.15px] uppercase" style={{ color: C.TEXT_PRIMARY, fontWeight: 600 }}>$2,648</p>
                  </div>
                </div>
              </div>

              <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full">
                <div className="content-stretch flex items-center relative shrink-0">
                   <div 
                    className="border border-solid relative shrink-0 size-[40px]"
                    style={{ backgroundColor: C.BACKGROUND, borderColor: C.BORDER, borderRadius: BORDER_RADIUS.full }}
                  >
                    <div className="absolute left-0 rounded-[40px] size-[38px] top-0">
                      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[40px] size-full" src={imgImage325} />
                    </div>
                  </div>
                </div>
                <div className="content-stretch flex flex-[1_0_0] items-center justify-between min-h-px min-w-px relative">
                  <div className="content-stretch flex flex-col font-innovator items-start justify-center not-italic relative shrink-0">
                    <p className="leading-[1.35] relative shrink-0 text-[15px]" style={{ color: C.TEXT_PRIMARY, fontWeight: 600 }}>vUSDC</p>
                    <p className="leading-[1.4] relative shrink-0 text-[13px] tracking-[0.13px] uppercase" style={{ color: C.TEXT_SECONDARY }}>0 VUSDC</p>
                  </div>
                  <div className="content-stretch flex flex-col items-end justify-center relative shrink-0">
                    <p className="font-innovator leading-[1.35] not-italic relative shrink-0 text-[15px] text-right tracking-[0.15px] uppercase" style={{ color: C.TEXT_PRIMARY, fontWeight: 600 }}>$0.00</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="content-stretch flex flex-col gap-[15px] items-center opacity-50 relative shrink-0 w-[154px]">
              <p className="font-innovator leading-none min-w-full not-italic relative shrink-0 text-[15px] w-[min-content]" style={{ color: C.TEXT_PRIMARY, fontWeight: 500 }}>
                Don't see your token?
              </p>
              <div 
                className="backdrop-blur-[24px] border border-solid content-stretch flex h-[40px] items-center relative shrink-0"
                style={{ backgroundColor: C.BG_SUBTLE, borderColor: C.BORDER_SUBTLE, paddingLeft: SPACING.md, paddingRight: SPACING.md, paddingBottom: SPACING.sm, paddingTop: SPACING.sm, borderRadius: BORDER_RADIUS.full }}
              >
                <p className="font-innovator leading-none not-italic relative shrink-0 text-[15px]" style={{ color: C.TEXT_QUINARY, fontWeight: 600 }}>
                  Manage tokens
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Home Indicator */}
      <div className="absolute bottom-0 h-[34px] left-1/2 translate-x-[-50%] w-[393px]">
        <div className="absolute bottom-[8px] flex h-[5px] items-center justify-center left-1/2 translate-x-[-50%] w-[139px]">
          <div className="flex-none rotate-[180deg] scale-y-[-100%]">
            <div className="h-[5px] rounded-[100px] w-[139px]" style={{ backgroundColor: C.TEXT_PRIMARY }} />
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="absolute h-[54px] left-1/2 top-0 translate-x-[-50%] w-[393px]">
        <div className="absolute h-[54px] left-0 right-[64.25%] top-1/2 translate-y-[-50%]">
          <p className="absolute font-sf inset-[33.96%_36.71%_25.3%_36.96%] leading-[22px] text-[17px] text-center" style={{ color: C.TEXT_PRIMARY, fontWeight: 600 }}>
            1:43
          </p>
        </div>
        <div className="absolute h-[54px] left-[64.25%] right-0 top-1/2 translate-y-[-50%]">
           <div className="absolute bottom-[33.33%] contents left-[calc(50%+32.41px)] top-[42.59%] translate-x-[-50%]">
            <div className="absolute border border-solid bottom-[33.33%] left-[calc(50%+31.25px)] opacity-35 rounded-[4.3px] top-[42.59%] translate-x-[-50%] w-[25px]" style={{ borderColor: C.TEXT_PRIMARY }} />
            <div className="absolute bottom-[41.01%] left-[calc(50%+45.41px)] top-[51.45%] translate-x-[-50%] w-[1.328px]">
              <img alt="" className="block max-w-none size-full" src={imgCap} />
            </div>
            <div className="absolute bottom-[37.04%] left-[calc(50%+31.25px)] rounded-[2.5px] top-[46.3%] translate-x-[-50%] w-[21px]" style={{ backgroundColor: C.TEXT_PRIMARY }} />
          </div>
          <div className="absolute bottom-[33.4%] left-[calc(50%+3.02px)] top-[43.77%] translate-x-[-50%] w-[17.142px]">
            <img alt="" className="block max-w-none size-full" src={imgWifi} />
          </div>
          <div className="absolute bottom-[33.77%] left-[calc(50%-22.65px)] top-[43.58%] translate-x-[-50%] w-[19.2px]">
            <img alt="" className="block max-w-none size-full" src={imgCellularConnection} />
          </div>
        </div>
      </div>

      {/* Bottom Nav */}
      <div 
        className="absolute backdrop-blur-[12px] border border-solid bottom-[42px] content-stretch flex flex-col h-[64px] items-center justify-center left-[calc(50%+0.5px)] translate-x-[-50%] w-[232px]"
        style={{ backgroundColor: C.NAV_BG, borderColor: C.BORDER_SUBTLE, padding: SPACING.sm, borderRadius: BORDER_RADIUS.lg }}
      >
        <div className="content-stretch flex h-[40px] items-center relative shrink-0 w-full">
          <div className="content-stretch flex flex-[1_0_0] flex-col h-full items-center justify-center min-h-px min-w-px overflow-clip p-[8px] relative rounded-[16px]">
            <div className="relative shrink-0 size-[24px]">
              <NavIcon 
                src={homeIcon} 
                isActive={activeTab === 0} 
                onClick={() => setActiveTab(0)}
                className="block max-w-none size-full" 
              />
            </div>
          </div>
          <div className="content-stretch flex flex-[1_0_0] flex-col h-full items-center justify-center min-h-px min-w-px overflow-clip p-[8px] relative rounded-[16px]">
            <div className="relative shrink-0 size-[24px]">
              <NavIcon 
                src={historyIcon} 
                isActive={activeTab === 1} 
                onClick={() => setActiveTab(1)}
                className="block max-w-none size-full" 
              />
            </div>
          </div>
          <div className="content-stretch flex flex-[1_0_0] flex-col h-full items-center justify-center min-h-px min-w-px overflow-clip p-[8px] relative rounded-[16px]">
            <div className="relative shrink-0 size-[24px]">
              <NavIcon 
                src={settingsIcon} 
                isActive={activeTab === 2} 
                onClick={() => setActiveTab(2)}
                className="block max-w-none size-full" 
              />
            </div>
          </div>
        </div>
        <div className="absolute inset-0 pointer-events-none rounded-[inherit]" style={{ boxShadow: `inset 0px 0px 20px 0px ${C.INNER_GLOW}` }} />
      </div>

      <SendModal isOpen={isSendModalOpen} onClose={() => setIsSendModalOpen(false)} riveInputs={riveInputs} />
    </div>
  );
}
