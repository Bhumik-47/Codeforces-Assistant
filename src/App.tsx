import { useEffect, useState } from 'react';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import { useCodeforcesData } from './hooks/useCodeforcesData';

const STORAGE_KEY = 'cf_tracker_handle';

function App() {
  const [handle, setHandle] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEY);
  });

  const { problems, topics, stats, loading, error, fetchData } = useCodeforcesData();

  useEffect(() => {
    if (handle && problems.length === 0 && !loading) {
      fetchData(handle);
    }
  }, [handle]);

  const handleLogin = async (h: string) => {
    const success = await fetchData(h);
    if (success) {
      localStorage.setItem(STORAGE_KEY, h);
      setHandle(h);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setHandle(null);
  };

  const handleRefresh = () => {
    if (handle) fetchData(handle);
  };

  if (handle && stats) {
    return (
      <Dashboard
        problems={problems}
        topics={topics}
        stats={stats}
        onLogout={handleLogout}
        onRefresh={handleRefresh}
        loading={loading}
      />
    );
  }

  return (
    <LoginPage
      onLogin={handleLogin}
      loading={loading}
      error={error}
    />
  );
}

export default App;
