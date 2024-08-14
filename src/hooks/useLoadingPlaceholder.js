import { useState, useEffect } from "react";

/**
 * Custom hook to manage the loading state with a placeholder delay.
 *
 * @description This hook provides a boolean state `isLoaded` that indicates whether a loading process has completed. It initially starts as `false` and updates to `true` after a specified delay. This can be useful for displaying loading placeholders or spinners before content is fully loaded.
 *
 * @param {number} [delay=1000] - The delay in milliseconds before setting the loading state to `true`. Defaults to 1000ms.
 *
 * @returns {[boolean, React.Dispatch<React.SetStateAction<boolean>>]} An array where:
 *  - The first value is `isLoaded`, a boolean indicating if the loading process has completed.
 *  - The second value is `setIsLoaded`, a function to manually set the `isLoaded` state.
 */
export default function useLoadingPlaceholder(delay = 1000) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return [isLoaded, setIsLoaded];
}
