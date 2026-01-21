interface ModalBackdropProps {
  onClick: () => void;
  isExiting?: boolean;
}

export const ModalBackdrop = ({
  onClick,
  isExiting = false,
}: ModalBackdropProps): React.JSX.Element => (
  <div
    className={`fixed inset-0 bg-background/85 z-modal ${isExiting ? 'animate-backdrop-out' : 'animate-backdrop-in'}`}
    onClick={onClick}
  />
);
