'use client';

import React from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: React.ReactNode;
  container?: Element | DocumentFragment | null;
  disabled?: boolean;
}

/**
 * Lightweight portal that defaults to `document.body` and no-ops on the server.
 * Keeps modal/dropdown layers out of transformed ancestors (e.g. virtualized lists).
 */
export function Portal({ children, container, disabled = false }: PortalProps): React.ReactPortal | null {
  const [mountNode, setMountNode] = React.useState<Element | DocumentFragment | null>(null);

  React.useEffect(() => {
    if (disabled) return;
    if (container) {
      setMountNode(container);
      return;
    }
    if (typeof document !== 'undefined') {
      setMountNode(document.body);
    }
  }, [container, disabled]);

  if (disabled || !mountNode) {
    return null;
  }

  return createPortal(children, mountNode);
}
