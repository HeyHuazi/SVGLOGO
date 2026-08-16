export const buttonStyles =
  'flex items-center space-x-2 relative h-10 rounded-full border border-neutral-200 dark:border-neutral-800 bg-transparent px-4 text-neutral-950 dark:text-white hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50 focus:outline-none focus:ring-1 focus:ring-neutral-300 dark:focus:ring-neutral-700 transition-colors duration-100 disabled:opacity-50 disabled:cursor-not-allowed';

export const inputStyles =
  'w-full border-b border-neutral-300 bg-white p-3 px-11 placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-300 dark:border-neutral-800 dark:bg-neutral-900 dark:focus:ring-neutral-700';

export const badgeStyles =
  'inline-flex items-center px-2.5 py-0.5 rounded-full font-medium bg-neutral-100 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 text-xs font-mono hover:underline hover:bg-neutral-200 dark:hover:bg-neutral-700/50 transition-colors duration-100';

export const sidebarItemStyles =
  'flex w-full items-center space-x-3 justify-between rounded-md p-2 transition-none duration-100 text-neutral-600 hover:text-dark dark:hover:text-white dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700/40 text-sm';

export const sidebarCategoryCountStyles =
  'px-2.5 py-0.5 rounded-full font-medium bg-neutral-100 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 text-xs font-mono';

// === New Homepage Styles ===

/** Navbar link styles - light weight, Inter font */
export const navLinkStyles =
  'inline-flex items-center h-[30px] px-3 rounded-lg text-[13px] font-medium text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-150';

/** Navbar action button - white background with subtle shadow */
export const navButtonStyles =
  'flex items-center justify-center w-8 h-8 rounded-[9.5px] relative transition-colors duration-150';

/** Green CTA button - "提交图标" style */
export const navCtaStyles =
  'flex items-center justify-center w-24 shrink-0 gap-1.5 h-8 px-3 rounded-[10px] bg-[#01B30B] dark:bg-[#01B30B] text-white text-xs font-medium relative shadow-[#FFFFFF40_0px_0.5px_0px_inset,#0A0A0B08_0px_-1px_0px_inset,#007D0559_0px_2px_5px_-2px,#0A0A0B12_0px_0.5px_0px,#0A0A0B03_0px_9px_5px_-2px,#0A0A0B05_0px_5px_4px_-1px,#0A0A0B0A_0px_2px_3px_-1px] [text-shadow:#0A0A0B26_0px_0.5px_0px] hover:bg-[#02A50C] dark:hover:bg-[#02A50C] transition-colors duration-150';

/** Green CTA button - size-agnostic, reuse in dialogs/CTAs */
export const ctaGreenStyles =
  'inline-flex items-center justify-center gap-1.5 rounded-[10px] bg-[#01B30B] dark:bg-[#01B30B] text-white font-medium relative shadow-[#FFFFFF40_0px_0.5px_0px_inset,#0A0A0B08_0px_-1px_0px_inset,#007D0559_0px_2px_5px_-2px,#0A0A0B12_0px_0.5px_0px,#0A0A0B03_0px_9px_5px_-2px,#0A0A0B05_0px_5px_4px_-1px,#0A0A0B0A_0px_2px_3px_-1px] [text-shadow:#0A0A0B26_0px_0.5px_0px] hover:bg-[#02A50C] dark:hover:bg-[#02A50C] transition-colors duration-150';

/** Home sidebar item - unselected state */
export const homeSidebarItemStyles =
  'flex w-full items-center justify-between h-8 px-2.5 rounded-[10px] text-xs font-medium transition-colors duration-150';

/** Home sidebar item - selected state */
export const homeSidebarItemSelectedStyles =
  'bg-[#1C1F21] dark:bg-neutral-700 text-white border border-[#1C1F21]/5 dark:border-neutral-600 shadow-sm';

/** Home search bar container */
export const homeSearchStyles =
  'flex items-center h-9 w-full bg-[#EFF0F0] dark:bg-neutral-800 border border-neutral-200/10 dark:border-neutral-700/50 rounded-[10px] pl-[30px] pr-16';

/** Card action button */
export const cardActionStyles =
  'flex items-center justify-center rounded-md p-2 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700/40 transition-colors duration-100';
