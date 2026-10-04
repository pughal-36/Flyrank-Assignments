import React, { useState, useRef, useEffect, useCallback } from 'react';
import './StatefulButton.css';

export type ButtonState = 'idle' | 'loading' | 'success' | 'error';

export interface StatefulButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  idleLabel: string;
  busyLabel: string;
  doneLabel: string;
  retryLabel: string;
  onAction: () => Promise<void>;
  disabled?: boolean;
  className?: string;
}

const SUCCESS_HOLD_DURATION_MS = 1800;

export const StatefulButton: React.FC<StatefulButtonProps> = ({
  idleLabel,
  busyLabel,
  doneLabel,
  retryLabel,
  onAction,
  disabled = false,
  className = '',
  onClick,
  ...restProps
}) => {
  const [state, setState] = useState<ButtonState>('idle');
  const [announcement, setAnnouncement] = useState<string>('');

  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const successTimerRef = useRef<number | null>(null);
  const shakeAnimationRef = useRef<Animation | null>(null);

  // Clear timers and animations safely
  const clearTimersAndAnimations = useCallback(() => {
    if (successTimerRef.current !== null) {
      window.clearTimeout(successTimerRef.current);
      successTimerRef.current = null;
    }
    if (shakeAnimationRef.current) {
      shakeAnimationRef.current.cancel();
      shakeAnimationRef.current = null;
    }
  }, []);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      clearTimersAndAnimations();
    };
  }, [clearTimersAndAnimations]);

  // Shake animation trigger on error using Web Animations API (element.animate)
  const triggerShake = useCallback(() => {
    if (!buttonRef.current) return;

    // Check for prefers-reduced-motion
    if (typeof window !== 'undefined' && window.matchMedia) {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;
    }

    // Cancel any running shake animation before starting a new one
    if (shakeAnimationRef.current) {
      shakeAnimationRef.current.cancel();
      shakeAnimationRef.current = null;
    }

    const keyframes: Keyframe[] = [
      { transform: 'translateX(0)' },
      { transform: 'translateX(-7px)' },
      { transform: 'translateX(7px)' },
      { transform: 'translateX(-5px)' },
      { transform: 'translateX(5px)' },
      { transform: 'translateX(-2px)' },
      { transform: 'translateX(2px)' },
      { transform: 'translateX(0)' }
    ];

    try {
      shakeAnimationRef.current = buttonRef.current.animate(keyframes, {
        duration: 360,
        easing: 'ease-out',
        fill: 'none'
      });

      shakeAnimationRef.current.onfinish = () => {
        shakeAnimationRef.current = null;
      };
    } catch {
      // Fallback for environments lacking element.animate support
      shakeAnimationRef.current = null;
    }
  }, []);

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(event);
    }

    // Requirement 3: Ignore clicks while loading or when disabled
    if (state === 'loading' || disabled) {
      return;
    }

    // Requirement 3: Clicking during success/error clears timers and restarts cleanly
    clearTimersAndAnimations();

    setState('loading');
    setAnnouncement(busyLabel);

    try {
      await onAction();
      
      setState('success');
      setAnnouncement(doneLabel);

      // Requirement 3: Success holds 1800ms then returns to idle
      successTimerRef.current = window.setTimeout(() => {
        setState('idle');
        setAnnouncement('');
        successTimerRef.current = null;
      }, SUCCESS_HOLD_DURATION_MS);

    } catch {
      setState('error');
      setAnnouncement(`${retryLabel}. Action failed.`);
      triggerShake();
    }
  };

  const isAriaDisabled = disabled || state === 'loading';

  return (
    <button
      ref={buttonRef}
      type="button"
      className={`stateful-btn ${className}`.trim()}
      data-state={state}
      aria-disabled={isAriaDisabled}
      aria-busy={state === 'loading'}
      onClick={handleClick}
      {...restProps}
    >
      {/* Stacked Colour Layers (Cross-faded with Opacity ONLY) */}
      <span className="stateful-btn__bg-layer stateful-btn__bg-layer--idle" aria-hidden="true" />
      <span className="stateful-btn__bg-layer stateful-btn__bg-layer--success" aria-hidden="true" />
      <span className="stateful-btn__bg-layer stateful-btn__bg-layer--error" aria-hidden="true" />
      <span className="stateful-btn__highlight" aria-hidden="true" />

      {/* Stacked Face Layers (Fixed width sized for the longest label) */}
      <span className="stateful-btn__content">
        {/* Idle Face */}
        <span className="stateful-btn__face stateful-btn__face--idle">
          <span>{idleLabel}</span>
        </span>

        {/* Loading Face */}
        <span className="stateful-btn__face stateful-btn__face--loading">
          <span className="stateful-btn__icon stateful-btn__spinner" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="12" cy="12" r="9" opacity="0.25" stroke="currentColor" />
              <path d="M12 3a9 9 0 0 1 9 9" opacity="1" stroke="currentColor" />
            </svg>
          </span>
          <span>{busyLabel}</span>
        </span>

        {/* Success Face */}
        <span className="stateful-btn__face stateful-btn__face--success">
          <span className="stateful-btn__icon stateful-btn__icon--check" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </span>
          <span>{doneLabel}</span>
        </span>

        {/* Error Face */}
        <span className="stateful-btn__face stateful-btn__face--error">
          <span className="stateful-btn__icon stateful-btn__icon--retry" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          </span>
          <span>{retryLabel}</span>
        </span>
      </span>

      {/* Visually hidden aria-live polite region for screen readers */}
      <span className="stateful-btn__sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </span>
    </button>
  );
};
