import { useState, useEffect } from 'react';

export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLandscape: boolean;
  isPortrait: boolean;
  screenWidth: number;
  screenHeight: number;
  orientation: 'landscape' | 'portrait';
  deviceType: 'mobile' | 'tablet' | 'desktop';
  touchCapable: boolean;
}

export interface BreakpointInfo {
  isXs: boolean;    // < 640px
  isSm: boolean;    // >= 640px
  isMd: boolean;    // >= 768px
  isLg: boolean;    // >= 1024px
  isXl: boolean;    // >= 1280px
  is2xl: boolean;   // >= 1536px
}

const getDeviceInfo = (): DeviceInfo => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const isLandscape = width > height;
  const isPortrait = height > width;
  const touchCapable = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  let deviceType: 'mobile' | 'tablet' | 'desktop';
  if (width < 768) {
    deviceType = 'mobile';
  } else if (width < 1024) {
    deviceType = 'tablet';
  } else {
    deviceType = 'desktop';
  }

  return {
    isMobile: width < 768,
    isTablet: width >= 768 && width < 1024,
    isDesktop: width >= 1024,
    isLandscape,
    isPortrait,
    screenWidth: width,
    screenHeight: height,
    orientation: isLandscape ? 'landscape' : 'portrait',
    deviceType,
    touchCapable,
  };
};

const getBreakpointInfo = (): BreakpointInfo => {
  const width = window.innerWidth;
  
  return {
    isXs: width < 640,
    isSm: width >= 640,
    isMd: width >= 768,
    isLg: width >= 1024,
    isXl: width >= 1280,
    is2xl: width >= 1536,
  };
};

export const useMobile = () => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(getDeviceInfo());
  const [breakpointInfo, setBreakpointInfo] = useState<BreakpointInfo>(getBreakpointInfo());

  useEffect(() => {
    const handleResize = () => {
      setDeviceInfo(getDeviceInfo());
      setBreakpointInfo(getBreakpointInfo());
    };

    const handleOrientationChange = () => {
      // Add a small delay to ensure orientation change is complete
      setTimeout(() => {
        setDeviceInfo(getDeviceInfo());
        setBreakpointInfo(getBreakpointInfo());
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  return {
    ...deviceInfo,
    ...breakpointInfo,
    // Convenience methods
    isSmallScreen: deviceInfo.isMobile || deviceInfo.isTablet,
    isLargeScreen: deviceInfo.isDesktop,
    isTouchDevice: deviceInfo.touchCapable,
    // Responsive helpers
    shouldShowSidebar: deviceInfo.isDesktop || (deviceInfo.isTablet && deviceInfo.isLandscape),
    shouldShowMobileMenu: deviceInfo.isMobile || (deviceInfo.isTablet && deviceInfo.isPortrait),
    // Breakpoint helpers
    isAtLeastMd: breakpointInfo.isMd,
    isAtLeastLg: breakpointInfo.isLg,
    isAtLeastXl: breakpointInfo.isXl,
  };
};
