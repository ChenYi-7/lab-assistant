
import React, { useState } from 'react';
import { LabTestRecord } from '../types';
import { exportToExcel } from '../utils/exportUtils';

interface DataListProps {
  records: LabTestRecord[];
  onDelete: (ids: string[]) => void;
  onEdit: (record: LabTestRecord) => void;
}

const DataList: React.FC<DataListProps> = ({ records, onDelete, onEdit }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const calculateAvg = (v1: any, v2: any) => {
    const n1 = parseFloat(v1);
    const n2 = parseFloat(v2);
    if (!isNaN(n1) && !isNaN(n2)) {
      const avg = (n1 + n2) / 2;
      return Number.isInteger(avg) ? avg.toString() : avg.toFixed(2);
    }
    return '-';
  };

  const handleExport = async () => {
    const selectedRecords = records.filter(r => selectedIds.includes(r.id));
    if (selectedRecords.length === 0) {
      alert("请先选择至少一条记录。");
      return;
    }
    setIsExporting(true);
    try {
      await exportToExcel(selectedRecords);
    } catch (error) {
      console.error(error);
      alert("导出失败，请重试。");
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteBatch = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIds.length === 0) return;
    
    if (confirm(`确定要删除选中的 ${selectedIds.length} 条记录吗？`)) {
      onDelete(selectedIds);
      setSelectedIds([]); 
    }
  };

  const handleDeleteSingle = (id: string, name: string) => {
    if (confirm(`确定要删除记录 "${name}" 吗？`)) {
      onDelete([id]);
      if (selectedIds.includes(id)) {
        setSelectedIds(prev => prev.filter(i => i !== id));
      }
    }
  };

  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-white rounded-3xl border border-slate-200 border-dashed">
        <i className="fas fa-database text-4xl mb-4 opacity-20"></i>
        <p className="font-medium">暂无记录</p>
        <p className="text-xs mt-1">请点击“New Test”添加新记录。</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Selection Control Bar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm sticky top-[72px] z-30">
        <div className="flex items-center gap-3">
          <input 
            type="checkbox" 
            checked={selectedIds.length === records.length && records.length > 0}
            onChange={(e) => {
              e.stopPropagation();
              setSelectedIds(selectedIds.length === records.length ? [] : records.map(r => r.id));
            }}
            className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
          />
          <span className="text-sm font-bold text-slate-600">
            已选择 {selectedIds.length} 项
          </span>
        </div>
        <div className="flex gap-2">
          {selectedIds.length > 0 && (
            <>
              <button 
                onClick={handleExport}
                disabled={isExporting}
                className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-700 flex items-center gap-2 disabled:opacity-50 transition-all"
              >
                {isExporting ? (
                  <><i className="fas fa-spinner animate-spin"></i> 正在导出...</>
                ) : (
                  <><i className="fas fa-file-excel"></i> 导出 Excel</>
                )}
              </button>
              <button 
                onClick={handleDeleteBatch}
                className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-100 flex items-center gap-2 transition-all shadow-sm"
              >
                <i className="fas fa-trash"></i> 批量删除
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-4">
        {records.map(record => (
          <div 
            key={record.id} 
            className={`bg-white rounded-2xl border transition-all duration-200 ${expandedId === record.id ? 'border-indigo-400 ring-1 ring-indigo-400' : 'border-slate-200 hover:border-slate-300'}`}
          >
            <div className="p-4 flex items-center gap-4 cursor-pointer" onClick={() => setExpandedId(expandedId === record.id ? null : record.id)}>
              <input 
                type="checkbox" 
                checked={selectedIds.includes(record.id)}
                onClick={(e) => e.stopPropagation()} 
                onChange={(e) => {
                  e.stopPropagation();
                  toggleSelect(record.id);
                }}
                className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-slate-800">{record.sampleName}</h4>
                  <div className="flex gap-2">
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{record.testDate}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-slate-500">
                  <span>温度: <strong className="text-slate-700">{record.temperature}</strong></span>
                  <span>平均 Foam: <strong className="text-indigo-600">{calculateAvg(record.trial1.foamScore, record.trial2.foamScore)} 分</strong></span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                 <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(record);
                    }}
                    className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                    title="编辑"
                 >
                    <i className="fas fa-edit"></i>
                 </button>
                 <i className={`fas fa-chevron-${expandedId === record.id ? 'up' : 'down'} text-slate-300`}></i>
              </div>
            </div>

            {expandedId === record.id && (
              <div className="p-4 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl animate-in fade-in duration-300">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Trial 1 Summary */}
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                    <h5 className="font-bold text-xs text-indigo-600 uppercase mb-3 border-b pb-1">测试 1</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span>Foam:</span> <strong>{record.trial1.foamScore} 分 / {record.trial1.foamMl}ml</strong></div>
                      <div className="flex justify-between"><span>Coating:</span> <strong>{record.trial1.coating || '-'}</strong></div>
                      <div className="flex justify-between"><span>Lumps:</span> <strong>{record.trial1.floatingLumps || '-'}</strong></div>
                      <div className="flex justify-between"><span>Lumping:</span> <strong>{record.trial1.lumping || '-'}</strong></div>
                    </div>
                  </div>

                  {/* Trial 2 Summary */}
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                    <h5 className="font-bold text-xs text-indigo-600 uppercase mb-3 border-b pb-1">测试 2</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span>Foam:</span> <strong>{record.trial2.foamScore} 分 / {record.trial2.foamMl}ml</strong></div>
                      <div className="flex justify-between"><span>Coating:</span> <strong>{record.trial2.coating || '-'}</strong></div>
                      <div className="flex justify-between"><span>Lumps:</span> <strong>{record.trial2.floatingLumps || '-'}</strong></div>
                      <div className="flex justify-between"><span>Lumping:</span> <strong>{record.trial2.lumping || '-'}</strong></div>
                    </div>
                  </div>

                  {/* Averages Summary */}
                  <div className="bg-indigo-50/50 p-4 rounded-xl shadow-sm border border-indigo-100">
                    <h5 className="font-bold text-xs text-indigo-700 uppercase mb-3 border-b border-indigo-200 pb-1 flex items-center gap-2">
                      <i className="fas fa-calculator text-[10px]"></i> 综合平均值
                    </h5>
                    <div className="space-y-2 text-sm text-indigo-900">
                      <div className="flex justify-between"><span>Foam Score:</span> <strong>{calculateAvg(record.trial1.foamScore, record.trial2.foamScore)}</strong></div>
                      <div className="flex justify-between"><span>Foam (ml):</span> <strong>{calculateAvg(record.trial1.foamMl, record.trial2.foamMl)}</strong></div>
                      <div className="flex justify-between"><span>Coating:</span> <strong>{calculateAvg(record.trial1.coating, record.trial2.coating)}</strong></div>
                      <div className="flex justify-between"><span>Floating Lumps:</span> <strong>{calculateAvg(record.trial1.floatingLumps, record.trial2.floatingLumps)}</strong></div>
                      <div className="flex justify-between"><span>Lumping:</span> <strong>{calculateAvg(record.trial1.lumping, record.trial2.lumping)}</strong></div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                   <h6 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">试验照片回顾</h6>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-3 rounded-lg border border-slate-200 flex flex-wrap gap-2">
                         <span className="w-full text-[9px] text-slate-400 mb-1">测试 1 照片:</span>
                         {record.trial1.foamPic && <img src={record.trial1.foamPic} className="w-16 h-16 rounded object-cover border" alt="f1" />}
                         {record.trial1.coatingPic && <img src={record.trial1.coatingPic} className="w-16 h-16 rounded object-cover border" alt="c1" />}
                         {record.trial1.floatingLumpsPic && <img src={record.trial1.floatingLumpsPic} className="w-16 h-16 rounded object-cover border" alt="fl1" />}
                         {record.trial1.lumpingPic && <img src={record.trial1.lumpingPic} className="w-16 h-16 rounded object-cover border" alt="l1" />}
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-slate-200 flex flex-wrap gap-2">
                         <span className="w-full text-[9px] text-slate-400 mb-1">测试 2 照片:</span>
                         {record.trial2.foamPic && <img src={record.trial2.foamPic} className="w-16 h-16 rounded object-cover border" alt="f2" />}
                         {record.trial2.coatingPic && <img src={record.trial2.coatingPic} className="w-16 h-16 rounded object-cover border" alt="c2" />}
                         {record.trial2.floatingLumpsPic && <img src={record.trial2.floatingLumpsPic} className="w-16 h-16 rounded object-cover border" alt="fl2" />}
                         {record.trial2.lumpingPic && <img src={record.trial2.lumpingPic} className="w-16 h-16 rounded object-cover border" alt="l2" />}
                      </div>
                   </div>
                </div>

                {/* Individual Record Actions */}
                <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end gap-3">
                  <button 
                    onClick={() => onEdit(record)}
                    className="px-4 py-2 text-xs font-bold bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-2"
                  >
                    <i className="fas fa-edit"></i> 编辑记录
                  </button>
                  <button 
                    onClick={() => handleDeleteSingle(record.id, record.sampleName)}
                    className="px-4 py-2 text-xs font-bold bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2"
                  >
                    <i className="fas fa-trash"></i> 删除记录
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DataList;
