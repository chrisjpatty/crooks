import React from "react";

const useScrollTop = () => {
  const [scrollTop, setScrollTop] = React.useState<number>(0);

  const handleScroll = React.useCallback(
    () => setScrollTop(window.scrollY),
    []
  );

  React.useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return scrollTop;
};

export default useScrollTop;
