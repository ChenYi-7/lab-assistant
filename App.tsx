import React, { useState, useEffect } from 'react';
import { LabTestRecord, ViewState } from './types.ts';
import TestForm from './components/TestForm.tsx';
import DataList from './components/DataList.tsx';

const DB_KEY = 'lab_test_records_v3';

// 导出鲁棒的 ID 生成器，适配非 HTTPS 或旧版浏览器，防止组件崩溃
export const generateSafeId = () => {
  try {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
  } catch (e) {}
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('FORM');
  const [records, setRecords] = useState<LabTestRecord[]>([]);
  const [editingRecord, setEditingRecord] = useState<LabTestRecord | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(DB_KEY);
      if (saved) {
        setRecords(JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Storage access denied or failed", e);
    }
  }, []);

  const saveRecord = (record: LabTestRecord) => {
    try {
      if (!record.id) record.id = generateSafeId();
      
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
      // 已移除 window.scrollTo，防止页面自动定位到上方
    } catch (e) {
      alert("保存失败：存储空间可能已满。");
    }
  };

  const deleteRecords = (ids: string[]) => {
    if (window.confirm('确定要删除选中的记录吗？')) {
      const updated = records.filter(r => !ids.includes(r.id));
      setRecords(updated);
      localStorage.setItem(DB_KEY, JSON.stringify(updated));
    }
  };

  const startEdit = (record: LabTestRecord) => {
    setEditingRecord(record);
    setView('FORM');
    // 已移除 window.scrollTo，保持当前视觉焦点
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 px-4 py-4 sticky top-0 z-50 shadow-sm backdrop-blur-md bg-white/90">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg">
              <i className="fas fa-flask text-lg"></i>
            </div>
            <div>
              <h1 className="font-bold text-slate-800 text-sm leading-tight">实验室记录</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Mobile Sync</p>
            </div>
          </div>
          
          <nav className="flex bg-slate-100 rounded-2xl p-1">
            <button 
              onClick={() => { setEditingRecord(null); setView('FORM'); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${view === 'FORM' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
            >
              录入
            </button>
            <button 
              onClick={() => setView('LIST')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${view === 'LIST' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
            >
              历史
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full p-4 pb-24">
        {view === 'FORM' ? (
          <TestForm onSave={saveRecord} initialData={editingRecord || undefined} />
        ) : (
          <DataList records={records} onDelete={deleteRecords} onEdit={startEdit} />
        )}
      </main>

      {view === 'LIST' && (
        <button
          onClick={() => { setEditingRecord(null); setView('FORM'); }}
          className="fixed bottom-10 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center text-xl z-40 md:hidden active:scale-90"
        >
          <i className="fas fa-plus"></i>
        </button>
      )}
    </div>
  );
};

export default App;