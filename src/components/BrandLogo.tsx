import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  withBackground?: boolean;
}

/**
 * Fork Icon acting as the letter 'i' in "Kitchen"
 * Replicated with geometric precision from the user's uploaded official logo (IMG-20261018-WA0018.jpg).
 */
export const ForkIcon: React.FC<{ sizeClass?: string }> = ({ sizeClass = 'h-5 w-2.5' }) => (
  <svg
    viewBox="0 0 20 46"
    className={`${sizeClass} inline-block shrink-0`}
    style={{
      verticalAlign: '-0.1em',
      margin: '0 -0.5px',
    }}
    fill="currentColor"
    aria-hidden="true"
  >
    {/* 4 Tines */}
    <rect x="2" y="1" width="2.2" height="13" rx="0.9" />
    <rect x="6.6" y="1" width="2.2" height="13" rx="0.9" />
    <rect x="11.2" y="1" width="2.2" height="13" rx="0.9" />
    <rect x="15.8" y="1" width="2.2" height="13" rx="0.9" />
    {/* Fork base and stem handle */}
    <path
      d="M 1.5 12 C 1.5 20, 7.5 22.5, 8.8 23.5 L 8.8 44 C 8.8 45.5, 11.2 45.5, 11.2 44 L 11.2 23.5 C 12.5 22.5, 18.5 20, 18.5 12 Z"
    />
  </svg>
);

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  className = '',
  withBackground = true,
}) => {
  const config = {
    sm: {
      wrap: 'px-3 py-2 rounded-xl',
      theText: 'text-[9px] mb-0.5',
      kText: 'text-base font-extrabold',
      forkSize: 'h-4 w-2',
      tchenText: 'text-base font-extrabold',
      numText: 'text-base font-black',
      subText: 'text-[8px] tracking-[0.18em]',
      line: 'w-4 h-[1px]',
    },
    md: {
      wrap: 'px-4 py-2.5 rounded-2xl',
      theText: 'text-[11px] mb-0.5',
      kText: 'text-xl sm:text-2xl font-extrabold',
      forkSize: 'h-5 sm:h-6 w-2.5 sm:w-3',
      tchenText: 'text-xl sm:text-2xl font-extrabold',
      numText: 'text-xl sm:text-2xl font-black',
      subText: 'text-[9px] sm:text-[10px] tracking-[0.22em]',
      line: 'w-5 sm:w-8 h-[1px]',
    },
    lg: {
      wrap: 'px-6 py-4 rounded-3xl',
      theText: 'text-xs sm:text-sm mb-1',
      kText: 'text-2xl sm:text-3xl font-extrabold',
      forkSize: 'h-6 sm:h-7 w-3 sm:w-3.5',
      tchenText: 'text-2xl sm:text-3xl font-extrabold',
      numText: 'text-2xl sm:text-3xl font-black',
      subText: 'text-xs tracking-[0.25em]',
      line: 'w-8 sm:w-12 h-[1.5px]',
    },
    xl: {
      wrap: 'px-8 py-6 rounded-3xl',
      theText: 'text-sm sm:text-base mb-1',
      kText: 'text-3xl sm:text-4xl font-extrabold',
      forkSize: 'h-8 sm:h-9 w-4 sm:w-4.5',
      tchenText: 'text-3xl sm:text-4xl font-extrabold',
      numText: 'text-3xl sm:text-4xl font-black',
      subText: 'text-xs sm:text-sm tracking-[0.3em]',
      line: 'w-10 sm:w-16 h-[2px]',
    },
  }[size];

  return (
    <div
      className={`inline-flex flex-col items-center justify-center border border-stone-200/80 shadow-xs select-none ${
        withBackground ? 'bg-[#FAF6F0]' : 'bg-transparent'
      } ${config.wrap} ${className}`}
      style={{
        boxShadow: withBackground
          ? '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)'
          : 'none',
      }}
      aria-label="The Kitchen24 By FIT BISTRO"
    >
      {/* 1. "The" centered on top */}
      <span
        className={`font-sans font-medium text-[#1F1F1F] leading-none ${config.theText}`}
      >
        The
      </span>

      {/* 2. "Kitchen24" with fork replacing the 'i' */}
      <div className="flex items-center tracking-tight leading-none text-[#1F1F1F]">
        {/* K */}
        <span className={`font-sans ${config.kText}`}>K</span>

        {/* Fork as 'i' */}
        <ForkIcon sizeClass={config.forkSize} />

        {/* tchen */}
        <span className={`font-sans ${config.tchenText}`}>tchen</span>

        {/* 24 in bright orange (#E8531D) */}
        <span className={`text-[#E8531D] ml-0.5 ${config.numText}`}>
          24
        </span>
      </div>

      {/* 3. Subline: "By FIT BISTRO" with lines on either side */}
      <div className="flex items-center gap-1.5 sm:gap-2 mt-1 sm:mt-1.5 text-stone-600 w-full justify-center">
        <span className={`bg-stone-400 ${config.line}`} aria-hidden="true" />
        <span
          className={`font-semibold uppercase text-[#1F1F1F] ${config.subText} whitespace-nowrap`}
        >
          By FIT BISTRO
        </span>
        <span className={`bg-stone-400 ${config.line}`} aria-hidden="true" />
      </div>
    </div>
  );
};
