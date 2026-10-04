import React, { useState, useCallback } from 'react';
import { StatefulButton } from './components/StatefulButton.tsx';
import './App.css';

type SimulationMode = 'random' | 'succeed' | 'fail';

interface LogEntry {
  id: string;
  time: string;
  message: string;
  type: 'info' | 'success' | 'error';
}

export const App: React.FC = () => {
  const [simulationMode, setSimulationMode] = useState<SimulationMode>('random');
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: 'init',
      time: new Date().toLocaleTimeString(),
      message: 'System ready. Click any button to test state transitions.',
      type: 'info',
    },
  ]);

  const addLog = useCallback((message: string, type: 'info' | 'success' | 'error') => {
    const newEntry: LogEntry = {
      id: `${Date.now()}-${Math.random()}`,
      time: new Date().toLocaleTimeString(),
      message,
      type,
    };
    setLogs((prev) => [newEntry, ...prev.slice(0, 24)]);
  }, []);

  // Fake async handler generating a 900–2200ms delay with configurable failure
  const createAsyncAction = useCallback(
    (actionName: string) => {
      return async (): Promise<void> => {
        const delay = Math.floor(Math.random() * (2200 - 900 + 1)) + 900;
        addLog(`Started "${actionName}" (estimated ~${delay}ms)...`, 'info');

        await new Promise((resolve) => setTimeout(resolve, delay));

        let shouldFail = false;
        if (simulationMode === 'fail') {
          shouldFail = true;
        } else if (simulationMode === 'random') {
          shouldFail = Math.random() < 0.2; // 20% failure rate
        }

        if (shouldFail) {
          addLog(`"${actionName}" failed after ${delay}ms!`, 'error');
          throw new Error(`${actionName} failed`);
        } else {
          addLog(`"${actionName}" succeeded after ${delay}ms!`, 'success');
        }
      };
    },
    [simulationMode, addLog]
  );

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="badge-tag">
          <span>🧠 FlyRank FE-AA1</span>
          <span>•</span>
          <span>Motion System</span>
        </div>
        <h1 className="app-title">Buttons with a Brain</h1>
        <p className="app-subtitle">
          A high-performance stateful button component with stacked face layers, opacity-only colour cross-fading, interruptible lifecycle, and zero-layout-shift motion.
        </p>
      </header>

      {/* Demo Controls */}
      <section className="card">
        <h2 className="card-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="4" y1="21" x2="4" y2="14" />
            <line x1="4" y1="10" x2="4" y2="3" />
            <line x1="12" y1="21" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12" y2="3" />
            <line x1="20" y1="21" x2="20" y2="16" />
            <line x1="20" y1="12" x2="20" y2="3" />
            <line x1="1" y1="14" x2="7" y2="14" />
            <line x1="9" y1="8" x2="15" y2="8" />
            <line x1="17" y1="16" x2="23" y2="16" />
          </svg>
          Simulation Controls
        </h2>

        <div className="controls-grid">
          <div className="control-group">
            <span className="control-label">Outcome Simulation</span>
            <div className="radio-group" role="radiogroup" aria-label="Outcome Simulation Mode">
              <label className={`radio-pill ${simulationMode === 'random' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="simulationMode"
                  value="random"
                  checked={simulationMode === 'random'}
                  onChange={() => setSimulationMode('random')}
                />
                Random (20% fail)
              </label>

              <label className={`radio-pill ${simulationMode === 'succeed' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="simulationMode"
                  value="succeed"
                  checked={simulationMode === 'succeed'}
                  onChange={() => setSimulationMode('succeed')}
                />
                Always succeed
              </label>

              <label className={`radio-pill ${simulationMode === 'fail' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="simulationMode"
                  value="fail"
                  checked={simulationMode === 'fail'}
                  onChange={() => setSimulationMode('fail')}
                />
                Always fail
              </label>
            </div>
          </div>

          <div className="control-group">
            <span className="control-label">Component State</span>
            <label className="checkbox-toggle">
              <input
                type="checkbox"
                checked={isDisabled}
                onChange={(e) => setIsDisabled(e.target.checked)}
              />
              <span>Disable all buttons (aria-disabled)</span>
            </label>
          </div>
        </div>
      </section>

      {/* Button Showcase */}
      <section className="card">
        <h2 className="card-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
          Component Showcase (Shared System)
        </h2>

        <div className="showcase-grid">
          {/* Button 1: Send Message */}
          <div className="showcase-item">
            <div className="showcase-item-header">
              <span className="showcase-item-title">Message Dispatch</span>
              <span className="showcase-item-desc">Interactive async dispatch</span>
            </div>
            <StatefulButton
              idleLabel="Send message"
              busyLabel="Sending..."
              doneLabel="Sent!"
              retryLabel="Retry"
              onAction={createAsyncAction('Send message')}
              disabled={isDisabled}
            />
          </div>

          {/* Button 2: Save */}
          <div className="showcase-item">
            <div className="showcase-item-header">
              <span className="showcase-item-title">Document Sync</span>
              <span className="showcase-item-desc">State persistence action</span>
            </div>
            <StatefulButton
              idleLabel="Save"
              busyLabel="Saving..."
              doneLabel="Saved!"
              retryLabel="Try saving again"
              onAction={createAsyncAction('Save')}
              disabled={isDisabled}
            />
          </div>

          {/* Button 3: Deploy */}
          <div className="showcase-item">
            <div className="showcase-item-header">
              <span className="showcase-item-title">Deployment Pipeline</span>
              <span className="showcase-item-desc">Production deployment trigger</span>
            </div>
            <StatefulButton
              idleLabel="Deploy"
              busyLabel="Deploying..."
              doneLabel="Deployed!"
              retryLabel="Redeploy"
              onAction={createAsyncAction('Deploy')}
              disabled={isDisabled}
            />
          </div>
        </div>
      </section>

      {/* Event Telemetry Log */}
      <section className="card">
        <h2 className="card-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="4 17 10 11 4 5" />
            <line x1="12" y1="19" x2="20" y2="19" />
          </svg>
          Event Activity & Timing Log
        </h2>
        <div className="log-box" role="log" aria-live="polite">
          {logs.map((log) => (
            <div key={log.id} className="log-entry">
              <span className="log-time">[{log.time}]</span>
              <span className={`log-msg-${log.type}`}>{log.message}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Motion Notes */}
      <section className="card">
        <h2 className="card-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          Motion Notes & Architecture
        </h2>

        <div className="motion-notes-grid">
          <div className="note-card">
            <div className="note-card-header">
              <span className="note-card-title">Hover & Press</span>
              <span className="token-tag">160ms / 90ms</span>
            </div>
            <p className="note-card-body">
              Hover uses a fast 160ms <code>cubic-bezier(.2,.8,.2,1)</code> curve for snappy tactile responsiveness. Press contracts in 90ms to give immediate tactile feedback without feeling sluggish.
            </p>
          </div>

          <div className="note-card">
            <div className="note-card-header">
              <span className="note-card-title">Label Swap & Colour</span>
              <span className="token-tag">280ms / 240ms</span>
            </div>
            <p className="note-card-body">
              Label transitions slide and cross-fade over 280ms with <code>cubic-bezier(.2,.8,.2,1)</code>. Colour cross-fades use stacked opacity layers over 240ms, avoiding expensive <code>background-color</code> repaints.
            </p>
          </div>

          <div className="note-card">
            <div className="note-card-header">
              <span className="note-card-title">Success Check Pop</span>
              <span className="token-tag">420ms overshoot</span>
            </div>
            <p className="note-card-body">
              The success checkmark springs in with an overshoot <code>cubic-bezier(.34,1.56,.64,1)</code> over 420ms, creating a celebratory affirmation before holding for 1800ms and smoothly returning to idle.
            </p>
          </div>

          <div className="note-card">
            <div className="note-card-header">
              <span className="note-card-title">Error Shake Animation</span>
              <span className="token-tag">360ms ease-out</span>
            </div>
            <p className="note-card-body">
              Error feedback executes a single horizontal shake via the Web Animations API (<code>element.animate</code>) over 360ms <code>ease-out</code>. The red colour and retry label persist until the next click.
            </p>
          </div>

          <div className="note-card">
            <div className="note-card-header">
              <span className="note-card-title">Accessibility & Reduced Motion</span>
              <span className="token-tag">120ms fade / pulse</span>
            </div>
            <p className="note-card-body">
              Under <code>prefers-reduced-motion: reduce</code>, transforms and shakes are disabled, fading transitions accelerate to 120ms, and the spinner switches to a gentle opacity pulse so feedback is never removed.
            </p>
          </div>

          <div className="note-card">
            <div className="note-card-header">
              <span className="note-card-title">Interruptible Lifecycle</span>
              <span className="token-tag">Zero Race Conditions</span>
            </div>
            <p className="note-card-body">
              Clicks during loading are ignored. Clicks during success or error cleanly cancel active timeouts and animations, immediately restarting the action without leftover state leaks.
            </p>
          </div>
        </div>

        <div className="deviation-callout">
          <strong>Deliberate Deviation Note:</strong> Button width is intentionally fixed to the longest label rather than animated during state transitions. Animating width triggers browser layout calculation (reflow), which causes performance drops and jarring layout shifts in surrounding UI elements. By keeping stacked faces in a single CSS grid area, the button statically adopts the maximum required width while animating only GPU-composited <code>transform</code> and <code>opacity</code>.
        </div>
      </section>

      {/* Footer */}
      <footer className="app-footer">
        FlyRank FE Assignment FE-AA1 • Portable Stateful Button Component
      </footer>
    </div>
  );
};

export default App;
