import { useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      // STEP 1: Remember the opener
      previousFocusRef.current = document.activeElement as HTMLElement;

      // STEP 2: Move focus into the modal
      dialogRef.current?.focus();

      // STEP 3: Escape key closes modal
      const handleGlobalKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      document.addEventListener("keydown", handleGlobalKeyDown);

      return () => {
        document.removeEventListener("keydown", handleGlobalKeyDown);
        // STEP 4: Restore focus
        previousFocusRef.current?.focus();
      };
    }
  }, [isOpen, onClose]);

  // STEP 5 & 6: Focus trap
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "Tab" || !dialogRef.current) return;

    const focusableElements = dialogRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    if (e.shiftKey) {
      // Shift+Tab on first → loop to last
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab on last → loop to first
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* STEP 7: Add ARIA attributes here */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        style={{ backgroundColor: "white", padding: "2rem", border: "1px solid black" }}
      >
        {/* STEP 8: Give heading an id */}
        <h2 id="modal-title">{title}</h2>

        <div>{children}</div>

        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
