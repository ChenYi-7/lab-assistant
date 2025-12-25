
import React, { useState, useEffect } from 'react';
import { LabTestRecord, ViewState } from './types.ts';
import TestForm from './components/TestForm.tsx';
import DataList from './components/DataList.tsx';

const DB_KEY = 'lab_test_records_v2'; // 版本更新以防结构冲突

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteRecords = (ids: string[]) => {
    if (window.confirm('确定要删除选中的记录吗？此操作无法撤销。')) {
      const updated = records.filter(r => !ids.includes(r.id));
      setRecords(updated);
      localStorage.setItem(DB_KEY, JSON.stringify(updated));
    }
  };

  const startEdit = (record: LabTestRecord) => {
    setEditingRecord(record);
    setView('FORM');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewTest = () => {
    setEditingRecord(null);
    setView('FORM');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 px-4 py-4 sticky top-0 z-50 shadow-sm backdrop-blur-md bg-white/90">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-100">
              <i className="fas fa-microscope text-lg"></i>
            </div>
            <div>
              <h1 className="font-black text-slate-800 text-lg tracking-tight">LabTracker</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Pro Data Manager</p>
            </div>
          </div>
          
          <nav className="flex bg-slate-100 rounded-2xl p-1">
            <button 
              onClick={handleNewTest}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${view === 'FORM' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
            >
              <i className="fas fa-plus"></i>
              <span>录入</span>
            </button>
            <button 
              onClick={() => setView('LIST')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${view === 'LIST' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
            >
              <i className="fas fa-folder"></i>
              <span>数据库</span>
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-6 pb-24">
        {view === 'FORM' ? (
          <TestForm onSave={saveRecord} initialData={editingRecord || undefined} />
        ) : (
          <DataList records={records} onDelete={deleteRecords} onEdit={startEdit} />
        )}
      </main>

      {/* 底部浮动按钮仅在列表页且非编辑状态时显示 */}
      {view === 'LIST' && (
        <button
          onClick={handleNewTest}
          className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center text-xl hover:bg-indigo-700 active:scale-90 z-40 md:hidden sticky-bottom-safe"
        >
          <i className="fas fa-plus"></i>
        </button>
      )}
    </div>
  );
};

export default App;
