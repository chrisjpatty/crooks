import React from "react";

type KeyboardShortcutProps = {
  /**
   * The key name to track. use keycode.info to get this name
   */
  key: String;
  onKeyPressed: (event: KeyboardEvent) => void;
  disabled?: boolean;
};

export default ({ key, onKeyPressed, disabled }: KeyboardShortcutProps) => {
  const handleAction = (e: KeyboardEvent) => {
    if (e.key === key) {
      e.preventDefault();
      onKeyPressed(e);
    }
  };

  const enable = React.useCallback(() => {
    document.addEventListener("keydown", handleAction);
  }, [handleAction]);

  const disable = React.useCallback(() => {
    document.removeEventListener("keydown", handleAction);
  }, [handleAction]);

  React.useEffect(() => {
    if (!disabled) {
      enable();
    }
    return () => {
      disable();
    };
  }, [disabled]);

  return { enable, disable };
};
