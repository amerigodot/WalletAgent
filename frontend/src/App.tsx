import { Dashboard } from './components/Dashboard';
import { ActionPanel } from './components/ActionPanel';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Agentic Wallet
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Control Plane for Autonomous Agents
          </p>
        </header>

        <main className="space-y-6">
          <Dashboard />
          <ActionPanel />
        </main>

        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>Powered by Agent Wallet Protocol</p>
        </footer>
      </div>
    </div>
  );
}

export default App;