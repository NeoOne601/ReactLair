import React from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from './context/ThemeContext';

// Import all the "Page" components
import GardenPage from './components/GardenPage/GardenPage';
import HousePage from './components/HousePage/HousePage';
import LegacyGaragePage from './components/LegacyGaragePage/LegacyGaragePage';

// Import shared UI components
import PageNavigator from './components/shared/PageNavigator';
import DiffDisplay from './components/DiffDisplay/DiffDisplay';
import LearningPanel from './components/LearningPanel/LearningPanel';
import ThemeToggleButton from './components/shared/ThemeToggleButton';

/**
 * The main App component.
 * This is the "house frame" that holds all pages.
 * It reads the `currentPage` from Redux to decide which page to show.
 */
function App() {
  const { isDarkMode } = useTheme();
  const currentPage = useSelector((state) => state.house.currentPage);

  // A simple function to render the active page component
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'GARDEN':
        return <GardenPage />;
      case 'HOUSE':
        return <HousePage />;
      case 'GARAGE':
        return <LegacyGaragePage />;
      default:
        return <GardenPage />;
    }
  };

  return (
    // This ensures the theme class is applied to the whole app
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen container mx-auto p-4 md:p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-400">
            React Learning Game
          </h1>
          <ThemeToggleButton />
        </header>

        {/* Main 3-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Left Column: Navigation & Learning */}
          <aside className="lg:col-span-1 flex flex-col gap-6">
            <PageNavigator />
            <LearningPanel />
          </aside>

          {/* Center Column: The Active Page */}
          <main className="lg:col-span-2">
            {renderCurrentPage()}
          </main>

          {/* Right Column: Diff and AI Helper */}
          <aside className="lg:col-span-1">
            <DiffDisplay />
          </aside>

        </div>
      </div>
    </div>
  );
}

export default App;
