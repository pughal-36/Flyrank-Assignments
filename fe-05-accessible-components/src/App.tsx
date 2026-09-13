import { Disclosure } from './components/Disclosure';

function App() {
  return (
    <div>
      <h1>Accessible Components</h1>
      <Disclosure title="Click to show details">
        <p>Here is the hidden content!</p>
      </Disclosure>
    </div>
  );
}

export default App;