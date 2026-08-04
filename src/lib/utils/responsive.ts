export const breakpoints = {
  mobile: 390,
  tablet: 768,
  laptop: 1024,
  desktop: 1280,
  wide: 1440,
} as const;

export type Breakpoint = keyof typeof breakpoints;

export function isMobileWidth(width: number): boolean {
  return width < breakpoints.tablet;
}

export function isTabletWidth(width: number): boolean {
  return width >= breakpoints.tablet && width < breakpoints.laptop;
}

export function isDesktopWidth(width: number): boolean {
  return width >= breakpoints.laptop;
}
