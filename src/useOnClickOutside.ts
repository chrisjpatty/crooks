import React from "react";

export default <T extends HTMLElement>(
  onClickOutside: () => void,
  disabled?: boolean
) => {
  const ref = React.useRef<T>(null);

  React.useEffect(() => {
    if (!disabled) {
      window.addEventListener("click", checkForClickOutside);
      return () => {
        window.removeEventListener("click", checkForClickOutside);
      };
    } else {
      window.removeEventListener("click", checkForClickOutside);
    }
  }, [disabled]);

  const checkForClickOutside = (e: MouseEvent) => {
    if (ref.current && e.target instanceof Element) {
      if (!ref.current.contains(e.target)) {
        onClickOutside();
      }
    }
  };
  return ref;
};
