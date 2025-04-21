interface Window {
  bootstrap: {
    Toast: {
      new(element: Element, options?: {
        animation?: boolean;
        autohide?: boolean;
        delay?: number;
      }): {
        show(): void;
        hide(): void;
        dispose(): void;
      };
    };
  };
}