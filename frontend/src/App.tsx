import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { WelcomeBanner } from './components/WelcomeBanner';
import { WelcomeIntro } from './components/WelcomeIntro';
import { AskAISection } from './components/AskAISection';
import { AnswerDisplay } from './components/AnswerDisplay';
import { SavedContentList } from './components/SavedContentList';
import { AddNoteModal } from './components/AddNoteModal';
import { AddUrlModal } from './components/AddUrlModal';
import { ItemDetailModal } from './components/ItemDetailModal';
import { SystemStatusModal } from './components/SystemStatusModal';
import { useItems } from './hooks/useItems';
import { useRAGQuery } from './hooks/useRAGQuery';
import { api } from './services/api';
import { Item, HealthInfo } from './types';
import { AlertCircle, CheckCircle } from 'lucide-react';

export function App() {
  const { items, isLoading: isItemsLoading, refreshItems, deleteItem } = useItems();
  const { result: queryResult, isQuerying, error: queryError, executeQuery, clearResult } = useRAGQuery();

  const [activeFilter, setActiveFilter] = useState<'all' | 'note' | 'url'>('all');
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);
  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);
  const [isWelcomeIntroOpen, setIsWelcomeIntroOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const [healthInfo, setHealthInfo] = useState<HealthInfo | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const fetchHealth = async () => {
    try {
      const data = await api.getHealth();
      setHealthInfo(data);
    } catch {
      // Offline fallback
    }
  };

  useEffect(() => {
    fetchHealth();
    // Launch welcoming intro on initial load if not yet viewed this session
    const hasSeenWelcome = sessionStorage.getItem('turium_welcome_intro_seen');
    if (!hasSeenWelcome) {
      setIsWelcomeIntroOpen(true);
      sessionStorage.setItem('turium_welcome_intro_seen', 'true');
    }
  }, []);

  const totalChunks = items.reduce((acc, i) => acc + (i.chunk_count || 0), 0);

  const handleIngestSuccess = () => {
    refreshItems();
    fetchHealth();
    showNotification('Item indexed successfully into vector store.');
  };

  const handleDeleteItem = async (id: string) => {
    const res = await deleteItem(id);
    if (res.success) {
      showNotification('Item and associated vector chunks removed.');
      fetchHealth();
      if (selectedItem?.id === id) {
        setSelectedItem(null);
      }
    } else {
      showNotification(res.error || 'Failed to delete item.', 'error');
    }
    return res;
  };

  return (
    <div className="flex h-screen bg-[#fcfbf9] text-[#111114] overflow-hidden font-sans">
      {/* Interactive Welcoming Intro Sequence */}
      <WelcomeIntro
        isOpen={isWelcomeIntroOpen}
        onComplete={() => setIsWelcomeIntroOpen(false)}
      />

      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-dropdown border text-xs font-semibold bg-white border-[#e8e4dd] text-[#111114] animate-modal-enter">
          {notification.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Sidebar */}
      <Sidebar
        items={items}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        onOpenAddNote={() => setIsNoteModalOpen(true)}
        onOpenAddUrl={() => setIsUrlModalOpen(true)}
        onSelectItem={(item) => setSelectedItem(item)}
        onOpenHealth={() => setIsHealthModalOpen(true)}
        onReplayWelcome={() => setIsWelcomeIntroOpen(true)}
        healthInfo={healthInfo}
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative">
        {/* Ambient Top Beacon Line */}
        <div className="sticky top-0 z-30 h-[2px] w-full bg-gradient-to-r from-transparent via-[#6100ff]/60 to-transparent animate-ambient-beacon pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
          {/* Welcome Banner */}
          <WelcomeBanner
            onAddNote={() => setIsNoteModalOpen(true)}
            onAddUrl={() => setIsUrlModalOpen(true)}
            onReplayWelcome={() => setIsWelcomeIntroOpen(true)}
            itemCount={items.length}
            chunkCount={totalChunks}
          />

          {/* Ask AI Section */}
          <div className="rounded-2xl border border-[#e8e4dd] bg-white p-6 shadow-card transition-all duration-300 hover:shadow-card-hover animate-welcome-2">
            <AskAISection
              onAsk={executeQuery}
              isQuerying={isQuerying}
              hasSavedItems={items.length > 0}
              items={items}
            />

            {queryError && (
              <div className="mt-3.5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{queryError}</span>
              </div>
            )}
          </div>

          {/* RAG Answer Display */}
          {queryResult && (
            <div className="animate-welcome-1">
              <AnswerDisplay
                result={queryResult}
                onClear={clearResult}
              />
            </div>
          )}

          {/* Saved Content Section */}
          <div className="rounded-2xl border border-[#e8e4dd] bg-white p-6 shadow-card transition-all duration-300 hover:shadow-card-hover animate-welcome-3">
            <SavedContentList
              items={items}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              onViewItem={(item) => setSelectedItem(item)}
              onDeleteItem={handleDeleteItem}
              isLoading={isItemsLoading}
            />
          </div>
        </div>
      </main>

      {/* Modals */}
      <AddNoteModal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        onSuccess={handleIngestSuccess}
      />

      <AddUrlModal
        isOpen={isUrlModalOpen}
        onClose={() => setIsUrlModalOpen(false)}
        onSuccess={handleIngestSuccess}
      />

      <ItemDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />

      <SystemStatusModal
        isOpen={isHealthModalOpen}
        onClose={() => setIsHealthModalOpen(false)}
        healthInfo={healthInfo}
      />
    </div>
  );
}

export default App;
