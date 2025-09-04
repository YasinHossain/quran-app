import { useEffect, useRef } from 'react';

export const useScrollbarHiding = () => {
  const sidebarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (sidebarRef.current) {
      const sidebar = sidebarRef.current;

      // Hide scrollbar with inline styles
      const styleDecl = sidebar.style as CSSStyleDeclaration & {
        msOverflowStyle?: string;
        scrollbarWidth?: string;
      };
      styleDecl.msOverflowStyle = 'none';
      styleDecl.scrollbarWidth = 'none';

      // Add style tag for webkit scrollbar
      const style = document.createElement('style');
      style.textContent = `
        .settings-sidebar::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }
      `;
      document.head.appendChild(style);

      return () => {
        if (document.head.contains(style)) {
          document.head.removeChild(style);
        }
      };
    }
    return undefined;
  }, []);

  return { sidebarRef };
};
