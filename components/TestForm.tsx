import React, { useState, useEffect } from 'react';
import { LabTestRecord, TrialData } from '../types.ts';
import ImagePicker from './ImagePicker.tsx';
import { generateSafeId } from '../App.tsx';

interface TestFormProps {
  onSave: (record: LabTestRecord) => void;
  initialData?: LabTestRecord;
}

const emptyTrial = (): TrialData => ({
  foamScore: 0,
  foamMl: 0,
  coating: '',
  floatingLumps: '',
  lumping: ''
});

const TestForm: React.FC<TestFormProps> = ({ onSave, initialData }) => {
  const [testDate, setTestDate] = useState(new Date().toISOString().split('T')[0]);
  const [sampleName, setSampleName] = useState('');
  const [temperature, setTemperature] = useState('');
  
  const [trial1, setTrial1] = useState<TrialData>(emptyTrial());
  const [trial2, setTrial2] = useState<TrialData>(emptyTrial());

  useEffect(() => {
    if (initialData) {
      setTestDate(initialData.testDate);
      setSampleName(initialData.sampleName);
      setTemperature(initialData.temperature);
      setTrial1(initialData.trial1);
      setTrial2(initialData.trial2);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sampleName) {
      alert("请输入样品名称");
      return;
    }
    
    const record: LabTestRecord = {
      // 关键修复：使用安全的 ID 生成器，不要在非 HTTPS 下直接用 crypto.randomUUID
      id: initialData ? initialData.id : generateSafeId(),
      testDate,
      sampleName,
      temperature,
      trial1,
      trial2,
      createdAt: initialData ? initialData.createdAt : Date.now()
    };
    
    onSave(record);
  };

  const TrialSection = ({ num, data, setData }: { num: number, data: TrialData, setData: React.Dispatch<React.SetStateAction<TrialData>> }) => (
    <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
        <span className="bg-indigo-600 text-white w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold">{num}</span>
        <h3 className="font-bold text-slate-800 text-sm tracking-wide">测试试验 {num} (Trial {num})</h3>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-indigo-600 mb-1">
          <i className="fas fa-soap text-xs"></i>
          <span className="text-[11px] font-bold uppercase tracking-wider">泡沫测试 (Foam)</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase ml-1">Score (0-10)</label>
            <input 
              type="number" 
              inputMode="decimal"
              value={data.foamScore || ''} 
              onChange={e => setData({...data, foamScore: Number(e.target.value)})} 
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
              placeholder="分数"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase ml-1">Volume (ml)</label>
            <input 
              type="number" 
              inputMode="numeric"
              value={data.foamMl || ''} 
              onChange={e => setData({...data, foamMl: Number(e.target.value)})} 
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
              placeholder="ml"
            />
          </div>
        </div>
        <ImagePicker value={data.foamPic} type="foam" label="泡沫照片 (Foam Pic)" onChange={val => setData({...data, foamPic: val})} />
      </div>

      <div className="space-y-3 pt-2 border-t border-slate-50">
        <div className="flex items-center gap-2 text-indigo-600 mb-1">
          <i className="fas fa-layer-group text-xs"></i>
          <span className="text-[11px] font-bold uppercase tracking-wider">挂壁情况 (Coating)</span>
        </div>
        <textarea 
          value={data.coating} 
          onChange={e => setData({...data, coating: e.target.value})} 
          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none min-h-[60px]" 
          placeholder="输入挂壁描述..."
        />
        <ImagePicker value={data.coatingPic} type="coating" label="挂壁照片 (Coating Pic)" onChange={val => setData({...data, coatingPic: val})} />
      </div>

      <div className="space-y-3 pt-2 border-t border-slate-50">
        <div className="flex items-center gap-2 text-indigo-600 mb-1">
          <i className="fas fa-water text-xs"></i>
          <span className="text-[11px] font-bold uppercase tracking-wider">浮渣情况 (Floating Lumps)</span>
        </div>
        <input 
          type="text" 
          value={data.floatingLumps} 
          onChange={e => setData({...data, floatingLumps: e.target.value})} 
          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
          placeholder="描述浮渣..."
        />
        <ImagePicker value={data.floatingLumpsPic} type="lumps" label="浮渣照片 (Floating Lumps Pic)" onChange={val => setData({...data, floatingLumpsPic: val})} />
      </div>

      <div className="space-y-3 pt-2 border-t border-slate-50">
        <div className="flex items-center gap-2 text-indigo-600 mb-1">
          <i className="fas fa-cubes text-xs"></i>
          <span className="text-[11px] font-bold uppercase tracking-wider">结块情况 (Lumping)</span>
        </div>
        <input 
          type="text" 
          value={data.lumping} 
          onChange={e => setData({...data, lumping: e.target.value})} 
          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
          placeholder="描述结块..."
        />
        <ImagePicker value={data.lumpingPic} type="lumps" label="结块照片 (Lumping Pic)" onChange={val => setData({...data, lumpingPic: val})} />
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-28">
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <h2 className="text-base font-bold text-slate-800 mb-5 flex items-center gap-2">
          <i className="fas fa-clipboard-check text-indigo-500"></i> 测试基础信息
        </h2>
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase ml-1">测试日期 (Date)</label>
            <input type="date" value={testDate} onChange={e => setTestDate(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-medium" />
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase ml-1">样品名称 (Sample Name)</label>
            <input type="text" value={sampleName} onChange={e => setSampleName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-medium" placeholder="输入样品名称或批次号" />
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase ml-1">环境温度 (Temp)</label>
            <input type="text" value={temperature} onChange={e => setTemperature(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-medium" placeholder="如: 25°C" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrialSection num={1} data={trial1} setData={setTrial1} />
        <TrialSection num={2} data={trial2} setData={setTrial2} />
      </div>

      {/* 优化：使用 sticky 替代 fixed 以防软键盘弹出时布局跳动 */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-xl border-t border-slate-200 z-50 safe-area-bottom">
        <div className="max-w-4xl mx-auto">
          <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-100 active:scale-[0.97] transition-all flex items-center justify-center gap-3">
            <i className="fas fa-save"></i> {initialData ? '更新实验记录' : '保存实验数据'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default TestForm;