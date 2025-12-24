
import React, { useState, useEffect } from 'react';
import { LabTestRecord, ViewState, TrialData } from './types';
import TestForm from './components/TestForm';
import DataList from './components/DataList';

const DB_KEY = 'lab_test_records_v1';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('FORM');
  const [records, setRecords] = useState<LabTestRecord[]>([]);
  const [editingRecord, setEditingRecord] = useState<LabTestRecord | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(DB_KEY);
    if (saved) {
      try {
        setRecords(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load records", e);
      }
    }
  }, []);

  const saveRecord = (record: LabTestRecord) => {
    let updated;
    const existingIndex = records.findIndex(r => r.id === record.id);
    
    if (existingIndex > -1) {
      updated = [...records];
      updated[existingIndex] = record;
    } else {
      updated = [record, ...records];
    }
    
    setRecords(updated);
    localStorage.setItem(DB_KEY, JSON.stringify(updated));
    setEditingRecord(null);
    setView('LIST');
  };

  const deleteRecords = (ids: string[]) => {
    const updated = records.filter(r => !ids.includes(r.id));
    setRecords(updated);
    localStorage.setItem(DB_KEY, JSON.stringify(updated));
  };

  const startEdit = (record: LabTestRecord) => {
    setEditingRecord(record);
    setView('FORM');
  };

  const handleNewTest = () => {
    setEditingRecord(null);
    setView('FORM');
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header - 适配 iOS 安全区域 */}
      <header className="bg-indigo-600 text-white px-4 pb-4 pt-10 sticky top-0 z-50 shadow-md">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <i className="fas fa-flask text-xl"></i>
            </div>
            <div>
              <h1 className="font-bold text-lg leading-none">LabAssistant</h1>
              <p className="text-[10px] opacity-70 mt-1">TEST DATA TRACKER PRO</p>
            </div>
          </div>
          <div className="flex bg-white/10 rounded-full p-1">
            <button 
              onClick={handleNewTest}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${view === 'FORM' && !editingRecord ? 'bg-white text-indigo-600 shadow-sm' : 'text-white/80'}`}
            >
              录入
            </button>
            <button 
              onClick={() => setView('LIST')}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${view === 'LIST' ? 'bg-white text-indigo-600 shadow-sm' : 'text-white/80'}`}
            >
              库
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-4 md:p-6">
        {view === 'FORM' ? (
          <TestForm onSave={saveRecord} initialData={editingRecord || undefined} />
        ) : (
          <DataList records={records} onDelete={deleteRecords} onEdit={startEdit} />
        )}
      </main>

      {/* Mobile Floating Action Button */}
      {view === 'LIST' && (
        <button
          onClick={handleNewTest}
          className="fixed bottom-8 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center text-xl hover:bg-indigo-700 md:hidden transition-transform active:scale-90 z-40"
          style={{ bottom: 'calc(2rem + env(safe-area-inset-bottom))' }}
        >
          <i className="fas fa-plus"></i>
        </button>
      )}
    </div>
  );
};

export default App;
