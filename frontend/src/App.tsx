import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { WelcomeBanner } from './components/WelcomeBanner';
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
  }, []);

  const totalChunks = items.reduce((acc, i) => acc + (i.chunk_count || 0), 0);

  const handleIngestSuccess = () => {
    refreshItems();
    fetchHealth();
    showNotification('Item indexed successfully.');
  };

  const handleDeleteItem = async (id: string) => {
    const res = await deleteItem(id);
    if (res.success) {
      showNotification('Item removed.');
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
    <div className="flex h-screen bg-[#050507] text-[#f4f4f6] overflow-hidden font-sans">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-3.5 py-2 rounded-md shadow-lg border text-xs font-medium bg-[#11131a] border-[#222636] text-white">
          {notification.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400" />
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
        healthInfo={healthInfo}
      />

      {/* Main Content View */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
          {/* Welcome Banner */}
          <WelcomeBanner
            onAddNote={() => setIsNoteModalOpen(true)}
            onAddUrl={() => setIsUrlModalOpen(true)}
            itemCount={items.length}
            chunkCount={totalChunks}
          />

          {/* Ask AI Section */}
          <div className="rounded-lg border border-[#1e222f] bg-[#0c0e14] p-5 shadow-sm">
            <AskAISection
              onAsk={executeQuery}
              isQuerying={isQuerying}
              hasSavedItems={items.length > 0}
            />

            {queryError && (
              <div className="mt-3 p-3 rounded bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{queryError}</span>
              </div>
            )}
          </div>

          {/* RAG Answer Display */}
          {queryResult && (
            <AnswerDisplay
              result={queryResult}
              onClear={clearResult}
            />
          )}

          {/* Saved Content Section */}
          <div className="rounded-lg border border-[#1e222f] bg-[#0c0e14] p-5 shadow-sm">
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
