import { useState, useEffect } from "react";
import { ScreenSizes } from "../const";

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= ScreenSizes.Tablet);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= ScreenSizes.Tablet);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return isMobile;
}

export const useIsMobileOnly = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= ScreenSizes.Mobile);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= ScreenSizes.Mobile);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return isMobile;
}
