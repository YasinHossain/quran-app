interface ModalContentProps {
  title: string;
  description: string;
  children: React.ReactNode;
  isExiting?: boolean;
}

export const ModalContent = ({
  title,
  description,
  children,
  isExiting = false,
}: ModalContentProps): React.JSX.Element => (
  <div
    className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm z-modal transform-gpu ${isExiting ? 'animate-modal-out' : 'animate-modal-in'}`}
    style={{ willChange: 'transform, opacity' }}
  >
    <div
      role="dialog"
      aria-modal="true"
      className="bg-surface border border-border rounded-2xl shadow-modal p-6"
    >
      <h2 className="text-lg font-semibold text-foreground mb-4">{title}</h2>
      <p className="text-foreground mb-6">{description}</p>
      {children}
    </div>
  </div>
);
