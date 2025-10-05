'use client';
import { IconSearch, IconX } from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useEffect, memo } from 'react';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
  setQuery: (value: string) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  children: React.ReactNode;
}

export const QuickSearchModal = memo(function QuickSearchModal({
  isOpen,
  onClose,
  query,
  setQuery,
  handleKeyDown,
  children,
}: QuickSearchModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <Backdrop onClick={onClose} />
          <ModalCard>
            <SearchHeader
              inputRef={inputRef}
              query={query}
              setQuery={setQuery}
              handleKeyDown={handleKeyDown}
              onClose={onClose}
            />
            <div className="max-h-96 overflow-y-auto">{children}</div>
          </ModalCard>
        </>
      )}
    </AnimatePresence>
  );
});

function Backdrop({ onClick }: { onClick: () => void }): React.JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClick}
      className="fixed inset-0 bg-surface-overlay/60 backdrop-blur-sm z-50"
    />
  );
}

function ModalCard({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      transition={{ duration: 0.2 }}
      className="fixed top-20 left-4 right-4 mx-auto max-w-2xl z-50"
    >
      <div className="bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden">
        {children}
      </div>
    </motion.div>
  );
}

function SearchHeader({
  inputRef,
  query,
  setQuery,
  handleKeyDown,
  onClose,
}: {
  inputRef: React.RefObject<HTMLInputElement | null>;
  query: string;
  setQuery: (value: string) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onClose: () => void;
}): React.JSX.Element {
  return (
    <div className="flex items-center p-4 border-b border-border/30">
      <IconSearch size={20} className="text-muted mr-3 flex-shrink-0" />
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search verses, surahs, topics..."
        className="flex-1 bg-surface/0 outline-none text-foreground placeholder:text-muted text-lg"
      />
      <button onClick={onClose} className="p-2 hover:bg-muted/50 rounded-lg transition-colors ml-2">
        <IconX size={20} className="text-muted" />
      </button>
    </div>
  );
}
