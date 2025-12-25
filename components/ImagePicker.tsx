
import React, { useRef } from 'react';

interface ImagePickerProps {
  label: string;
  value?: string;
  onChange: (base64: string) => void;
  type: 'foam' | 'coating' | 'lumps';
}

const ImagePicker: React.FC<ImagePickerProps> = ({ label, value, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const compressImage = (base64Str: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        // 使用 jpeg 格式并设置 0.7 的质量，能大幅减小体积
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        // 压缩后再保存
        const compressed = await compressImage(base64String);
        onChange(compressed);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full">
      {label && <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase ml-1">{label}</label>}
      <div className="relative">
        {value ? (
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 aspect-video bg-slate-100 shadow-inner">
            <img 
              src={value} 
              alt="Preview" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/10 flex items-end justify-end p-2 gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-10 h-10 bg-white/90 rounded-full shadow-lg flex items-center justify-center text-indigo-600 active:scale-90 transition-transform"
              >
                <i className="fas fa-redo text-sm"></i>
              </button>
              <button
                type="button"
                onClick={() => onChange('')}
                className="w-10 h-10 bg-white/90 rounded-full shadow-lg flex items-center justify-center text-red-500 active:scale-90 transition-transform"
              >
                <i className="fas fa-trash-alt text-sm"></i>
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-6 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all bg-slate-50/50 active:bg-slate-100"
          >
            <i className="fas fa-camera text-2xl mb-2 opacity-50"></i>
            <span className="text-[11px] font-bold tracking-wide uppercase">点击拍摄照片</span>
            <span className="text-[9px] opacity-60 mt-1">支持：Foam / Coating / Lumps</span>
          </button>
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
