import { useId, useState } from 'react';
import { Modal } from './components/Modal';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const disclosureId = useId();

  const tabs = [
    { id: 'overview', label: 'Overview', content: 'This is the overview panel.' },
    { id: 'features', label: 'Features', content: 'These components support keyboard navigation and screen readers.' },
    { id: 'about', label: 'About', content: 'This example demonstrates accessible React components.' },
  ];

  const activePanel = tabs.find((tab) => tab.id === activeTab);

  return (
    <main>
      <h1>Accessible Components</h1>

      <section aria-labelledby="modal-heading">
        <h2 id="modal-heading">Modal</h2>
        <button type="button" onClick={() => setIsModalOpen(true)}>
          Open Modal
        </button>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Example Modal"
        >
          <p>This is a focus-trapped accessible modal.</p>
          <button type="button" onClick={() => setIsModalOpen(false)}>
            Close modal
          </button>
        </Modal>
      </section>

      <section aria-labelledby="disclosure-heading">
        <h2 id="disclosure-heading">Disclosure</h2>

        <button
          type="button"
          aria-expanded={isDetailsOpen}
          aria-controls={disclosureId}
          onClick={() => setIsDetailsOpen((open) => !open)}
        >
          {isDetailsOpen ? 'Hide details' : 'Show details'}
        </button>

        {isDetailsOpen && (
          <div id={disclosureId}>
            <p>This content can be expanded and collapsed accessibly.</p>
          </div>
        )}
      </section>

      <section aria-labelledby="tabs-heading">
        <h2 id="tabs-heading">Tabs</h2>

        <div role="tablist" aria-label="Example tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`${tab.id}-panel`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div
          id={`${activeTab}-panel`}
          role="tabpanel"
          tabIndex={0}
          aria-labelledby={activeTab}
        >
          <p>{activePanel?.content}</p>
        </div>
      </section>
    </main>
  );
}

export default App;