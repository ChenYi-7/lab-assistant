
import React, { useRef, useState } from 'react';
import { analyzeLabImage } from '../services/geminiService';

interface ImagePickerProps {
  label: string;
  value?: string;
  onChange: (base64: string) => void;
  type: 'foam' | 'coating' | 'lumps';
}

const ImagePicker: React.FC<ImagePickerProps> = ({ label, value, onChange, type }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        onChange(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const runAiAnalysis = async () => {
    if (!value) return;
    setAnalyzing(true);
    const feedback = await analyzeLabImage(value, type);
    setAiFeedback(feedback || "Analysis failed");
    setAnalyzing(false);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex flex-col gap-3">
        {value ? (
          <div className="relative group">
            <img 
              src={value} 
              alt="Preview" 
              className="w-full h-48 object-cover rounded-xl border border-gray-200 shadow-sm"
            />
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-white/90 p-2 rounded-full shadow hover:bg-white text-blue-600 transition-all"
              >
                <i className="fas fa-camera"></i>
              </button>
              <button
                type="button"
                onClick={() => onChange('')}
                className="bg-white/90 p-2 rounded-full shadow hover:bg-white text-red-600 transition-all"
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-32 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-all bg-white"
          >
            <i className="fas fa-plus-circle text-2xl mb-2"></i>
            <span className="text-xs">Add Photo</span>
          </button>
        )}

        {value && !aiFeedback && (
          <button
            type="button"
            onClick={runAiAnalysis}
            disabled={analyzing}
            className="text-xs bg-indigo-50 text-indigo-700 py-1.5 px-3 rounded-lg flex items-center justify-center gap-2 hover:bg-indigo-100 disabled:opacity-50"
          >
            {analyzing ? (
              <><i className="fas fa-spinner animate-spin"></i> Analyzing with AI...</>
            ) : (
              <><i className="fas fa-robot"></i> Suggest Data with Gemini AI</>
            )}
          </button>
        )}

        {aiFeedback && (
          <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-xs text-indigo-800 leading-relaxed italic">
            <div className="font-bold flex items-center gap-1 mb-1">
              <i className="fas fa-sparkles"></i> AI Analysis:
            </div>
            {aiFeedback}
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          capture="environment"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default ImagePicker;
