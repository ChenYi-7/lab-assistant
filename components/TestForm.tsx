
import React, { useState, useEffect } from 'react';
import { LabTestRecord, TrialData } from '../types';
import ImagePicker from './ImagePicker';

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

  // Populate form if initialData is provided (Edit Mode)
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
      alert("Please enter sample name");
      return;
    }
    
    const record: LabTestRecord = {
      id: initialData ? initialData.id : crypto.randomUUID(),
      testDate,
      sampleName,
      temperature,
      trial1,
      trial2,
      createdAt: initialData ? initialData.createdAt : Date.now()
    };
    
    onSave(record);
    // Reset defaults after save
    setSampleName('');
    setTemperature('');
    setTrial1(emptyTrial());
    setTrial2(emptyTrial());
  };

  const TrialSection = ({ 
    num, 
    data, 
    setData 
  }: { 
    num: number, 
    data: TrialData, 
    setData: React.Dispatch<React.SetStateAction<TrialData>> 
  }) => (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
        <span className="bg-indigo-100 text-indigo-700 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold">
          {num}
        </span>
        <h3 className="font-bold text-slate-800 uppercase tracking-wider text-sm">Trial {num} Data</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Foam Score</label>
          <input 
            type="number" 
            value={data.foamScore} 
            onChange={e => setData({...data, foamScore: Number(e.target.value)})}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="0-10"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Foam (ml)</label>
          <input 
            type="number" 
            value={data.foamMl} 
            onChange={e => setData({...data, foamMl: Number(e.target.value)})}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Volume"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ImagePicker 
          label="Foam Image" 
          value={data.foamPic} 
          type="foam"
          onChange={val => setData({...data, foamPic: val})} 
        />
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Coating Status</label>
            <input 
              type="text" 
              value={data.coating} 
              onChange={e => setData({...data, coating: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="0/1/2"
            />
          </div>
          <ImagePicker 
            label="Coating Image" 
            value={data.coatingPic} 
            type="coating"
            onChange={val => setData({...data, coatingPic: val})} 
          />
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Floating Lumps</label>
            <input 
              type="text" 
              value={data.floatingLumps} 
              onChange={e => setData({...data, floatingLumps: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="0/1/2"
            />
          </div>
          <ImagePicker 
            label="Lumps Image" 
            value={data.floatingLumpsPic} 
            type="lumps"
            onChange={val => setData({...data, floatingLumpsPic: val})} 
          />
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Lumping</label>
            <input 
              type="text" 
              value={data.lumping} 
              onChange={e => setData({...data, lumping: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="0/1/2"
            />
          </div>
          <ImagePicker 
            label="Lumping Image" 
            value={data.lumpingPic} 
            type="lumps"
            onChange={val => setData({...data, lumpingPic: val})} 
          />
        </div>
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          <i className={`fas ${initialData ? 'fa-edit' : 'fa-info-circle'} text-indigo-500`}></i> 
          {initialData ? 'Edit Test Record' : 'General Information'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Test Date</label>
            <input 
              type="date" 
              value={testDate} 
              onChange={e => setTestDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Sample Name</label>
            <input 
              type="text" 
              value={sampleName} 
              onChange={e => setSampleName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
              placeholder="Batch-2024-X"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Temp (°C)</label>
            <input 
              type="text" 
              value={temperature} 
              onChange={e => setTemperature(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
              placeholder="25°C"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrialSection num={1} data={trial1} setData={setTrial1} />
        <TrialSection num={2} data={trial2} setData={setTrial2} />
      </div>

      <div className="flex gap-4 sticky bottom-6 z-40 bg-white/80 backdrop-blur px-2 py-3 rounded-2xl border border-slate-200 shadow-lg">
        <button 
          type="submit"
          className="flex-1 bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
        >
          <i className="fas fa-save"></i>
          {initialData ? 'UPDATE RECORD' : 'SAVE RECORD'}
        </button>
        <button 
          type="button"
          onClick={() => {
            if(confirm("Discard all changes?")) {
              setSampleName('');
              setTemperature('');
              setTrial1(emptyTrial());
              setTrial2(emptyTrial());
            }
          }}
          className="px-6 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all"
        >
          RESET
        </button>
      </div>
    </form>
  );
};

export default TestForm;
