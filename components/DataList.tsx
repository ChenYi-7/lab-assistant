import React, { useState } from 'react';
import { LabTestRecord } from '../types.ts';
import { exportToExcel } from '../utils/exportUtils.ts';

interface DataListProps {
  records: LabTestRecord[];
  onDelete: (ids: string[]) => void;
  onEdit: (record: LabTestRecord) => void;
}

const DataList: React.FC<DataListProps> = ({ records, onDelete, onEdit }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const calculateAvg = (v1: any, v2: any) => {
    const n1 = parseFloat(v1);
    const n2 = parseFloat(v2);
    if (!isNaN(n1) && !isNaN(n2)) return ((n1 + n2) / 2).toFixed(2);
    return '-';
  };

  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-white rounded-3xl border border-slate-200 border-dashed m-4">
        <i className="fas fa-database text-4xl mb-4 opacity-20"></i>
        <p className="font-medium">暂无实验记录</p>
      </div>
    );
  }

  const DetailRow = ({ label, value, pic }: { label: string, value: string | number, pic?: string }) => (
    <div className="space-y-2 py-2 border-b border-slate-100 last:border-0">
      <div className="flex justify-between items-start">
        <span className="text-[10px] font-bold text-slate-400 uppercase">{label}</span>
        <span className="text-xs font-medium text-slate-700">{value || '无描述'}</span>
      </div>
      {pic && (
        <div className="rounded-xl overflow-hidden border border-slate-200 aspect-video w-full bg-slate-100">
          <img src={pic} alt={label} className="w-full h-full object-cover" />
        </div>
      )}
    </div>
  );

  const TrialDetail = ({ title, data }: { title: string, data: any }) => (
    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
      <h5 className="text-[11px] text-indigo-600 font-bold uppercase tracking-wider border-b border-indigo-50 pb-2 mb-2">{title}</h5>
      <DetailRow label="Foam Score" value={data.foamScore} pic={data.foamPic} />
      <DetailRow label="Foam ML" value={data.foamMl} />
      <DetailRow label="Coating" value={data.coating} pic={data.coatingPic} />
      <DetailRow label="Floating Lumps" value={data.floatingLumps} pic={data.floatingLumpsPic} />
      <DetailRow label="Lumping" value={data.lumping} pic={data.lumpingPic} />
    </div>
  );

  return (
    <div className="space-y-4 px-2">
      <div className="flex justify-between items-center px-2 pt-2">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">历史实验库 ({records.length})</h3>
        <button 
          onClick={() => exportToExcel(records)}
          className="text-xs font-bold text-indigo-600 flex items-center gap-1.5 bg-indigo-50 px-4 py-2 rounded-full active:scale-95 transition-transform"
        >
          <i className="fas fa-file-export text-[10px]"></i> 导出表格
        </button>
      </div>
      
      {records.map(record => (
        <div key={record.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm transition-all">
          <div className="p-4 flex items-center gap-4 cursor-pointer" onClick={() => setExpandedId(expandedId === record.id ? null : record.id)}>
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-indigo-500 border border-slate-100">
              <i className="fas fa-flask text-lg"></i>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-slate-800 truncate">{record.sampleName}</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase">{record.testDate} · {record.temperature || 'N/A'}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={(e) => { e.stopPropagation(); onEdit(record); }} className="w-10 h-10 flex items-center justify-center text-indigo-600 bg-indigo-50 rounded-xl active:scale-90 transition-transform"><i className="fas fa-pen text-xs"></i></button>
              <div className={`w-8 h-8 flex items-center justify-center text-slate-300 transition-transform ${expandedId === record.id ? 'rotate-180' : ''}`}>
                <i className="fas fa-chevron-down text-xs"></i>
              </div>
            </div>
          </div>
          
          {expandedId === record.id && (
            <div className="p-4 bg-slate-50/50 border-t border-slate-100 space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TrialDetail title="测试试验 1 (Trial 1)" data={record.trial1} />
                  <TrialDetail title="测试试验 2 (Trial 2)" data={record.trial2} />
               </div>
               
               <div className="bg-indigo-600 p-5 rounded-2xl shadow-lg shadow-indigo-100 text-white">
                  <p className="text-[10px] opacity-70 font-bold uppercase mb-3">平均统计结果 (Averages)</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                      <p className="text-[10px] opacity-70 uppercase mb-1">Avg Foam Score</p>
                      <p className="text-xl font-black">{calculateAvg(record.trial1.foamScore, record.trial2.foamScore)}</p>
                    </div>
                    <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                      <p className="text-[10px] opacity-70 uppercase mb-1">Avg Foam ML</p>
                      <p className="text-xl font-black">{calculateAvg(record.trial1.foamMl, record.trial2.foamMl)} ml</p>
                    </div>
                  </div>
               </div>

               <div className="flex gap-3 pt-2">
                 <button onClick={() => onDelete([record.id])} className="flex-1 py-4 text-xs font-bold text-red-600 bg-red-50 rounded-2xl hover:bg-red-100 active:scale-95 transition-all"><i className="fas fa-trash-alt mr-2"></i>删除本条记录</button>
               </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DataList;