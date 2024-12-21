import { useState, useEffect } from "react";

export const useMediaQuery = (maxWidth: number) => {
  const [matches, setMatches] = useState(window.innerWidth <= maxWidth);

  useEffect(() => {
    const handleResize = () => {
      setMatches(window.innerWidth <= maxWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [maxWidth]);

  return matches;
};
