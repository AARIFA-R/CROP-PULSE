import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FolderPlus, 
  Trash2, 
  FileCheck, 
  AlertTriangle, 
  ArrowRight, 
  Image as ImageIcon, 
  Sparkles,
  Tractor,
  Layers
} from 'lucide-react';

interface SelectedBatchItem {
  id: string;
  file: File;
  previewUrl: string;
  isValid: boolean;
  error?: string;
}

interface BulkUploadProps {
  onStartBatch: (items: SelectedBatchItem[], batchName: string) => void;
  onCancel?: () => void;
}

export const BulkUpload: React.FC<BulkUploadProps> = ({
  onStartBatch,
  onCancel
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const [batchName, setBatchName] = useState<string>(`Plot_Survey_${new Date().toLocaleDateString().replace(/\//g, '-')}`);
  const [selectedItems, setSelectedItems] = useState<SelectedBatchItem[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxFileSizeBytes = 25 * 1024 * 1024;

  const processFiles = (files: FileList | File[]) => {
    const newItems: SelectedBatchItem[] = [];

    Array.from(files).forEach((file, index) => {
      const isValidType = supportedTypes.includes(file.type.toLowerCase()) || file.name.match(/\.(jpe?g|png|webp)$/i);
      const isSizeOk = file.size <= maxFileSizeBytes;
      const isValid = Boolean(isValidType && isSizeOk);

      let errorMsg: string | undefined;
      if (!isValidType) errorMsg = 'Unsupported image format';
      else if (!isSizeOk) errorMsg = 'Exceeds 25MB';

      const previewUrl = URL.createObjectURL(file);

      newItems.push({
        id: `file_${Date.now()}_${index}_${Math.random().toString(36).substr(2, 5)}`,
        file,
        previewUrl,
        isValid,
        error: errorMsg
      });
    });

    setSelectedItems(prev => [...prev, ...newItems]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleRemoveItem = (id: string) => {
    setSelectedItems(prev => {
      const filtered = prev.filter(item => item.id !== id);
      const toRemove = prev.find(item => item.id === id);
      if (toRemove?.previewUrl) {
        URL.revokeObjectURL(toRemove.previewUrl);
      }
      return filtered;
    });
  };

  const handleClearAll = () => {
    selectedItems.forEach(item => URL.revokeObjectURL(item.previewUrl));
    setSelectedItems([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (folderInputRef.current) folderInputRef.current.value = '';
  };

  const validItems = selectedItems.filter(item => item.isValid);
  const invalidItems = selectedItems.filter(item => !item.isValid);
  const totalSizeBytes = selectedItems.reduce((acc, curr) => acc + curr.file.size, 0);
  const totalSizeMB = (totalSizeBytes / (1024 * 1024)).toFixed(2);

  const handleStartAnalysis = () => {
    if (validItems.length === 0) return;
    onStartBatch(validItems, batchName.trim() || 'Commercial Crop Survey');
  };

  return (
    <div id="farmer-bulk-upload-view" className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 animate-fade-in">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
              Enterprise Agro Intelligence
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2.5">
            <Tractor className="w-7 h-7 text-amber-600" />
            Farmer Bulk Leaf Ingestion
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Analyze hundreds of field samples simultaneously. Independent image pipeline with live progress telemetry.
          </p>
        </div>
      </div>

      {/* Batch Metadata & Config */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 max-w-md">
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
            Batch Identification Label
          </label>
          <input
            type="text"
            value={batchName}
            onChange={(e) => setBatchName(e.target.value)}
            placeholder="e.g. North Orchard Row 14"
            className="w-full px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Stats Pills */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200">
            <span className="text-slate-500">Selected: </span>
            <span className="font-bold text-slate-900">{selectedItems.length} images</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200">
            <span className="text-emerald-700">Valid: </span>
            <span className="font-bold text-emerald-900">{validItems.length}</span>
          </div>
          {invalidItems.length > 0 && (
            <div className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200">
              <span className="text-rose-700">Invalid: </span>
              <span className="font-bold text-rose-900">{invalidItems.length}</span>
            </div>
          )}
          <div className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200">
            <span className="text-slate-500">Payload: </span>
            <span className="font-bold text-slate-900">{totalSizeMB} MB</span>
          </div>
        </div>
      </div>

      {/* Drag & Drop Bulk Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition flex flex-col items-center justify-center ${
          isDragging
            ? 'border-amber-500 bg-amber-50/60 scale-[1.01]'
            : 'border-slate-300 hover:border-amber-500 bg-slate-50/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.webp"
          onChange={(e) => e.target.files && processFiles(e.target.files)}
          className="hidden"
        />
        {/* Folder picker input */}
        <input
          ref={folderInputRef}
          type="file"
          // @ts-ignore
          webkitdirectory=""
          directory=""
          multiple
          onChange={(e) => e.target.files && processFiles(e.target.files)}
          className="hidden"
        />

        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4 shadow-sm">
          <UploadCloud className="w-8 h-8" />
        </div>

        <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1">
          Drag & Drop Multi-Image Leaves Here
        </h3>
        <p className="text-xs text-slate-500 max-w-md mb-6">
          Upload whole directories or multi-select leaf files from field surveys. Supports high-throughput concurrent processing.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            id="browse-files-btn"
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition"
          >
            <ImageIcon className="w-4 h-4" />
            Select Multiple Photos
          </button>

          <button
            id="browse-folder-btn"
            type="button"
            onClick={() => folderInputRef.current?.click()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-sm transition"
          >
            <FolderPlus className="w-4 h-4 text-amber-600" />
            Upload Entire Folder
          </button>
        </div>
      </div>

      {/* Selected Items Grid */}
      {selectedItems.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-600" />
              Uploaded Batch Previews ({selectedItems.length})
            </h3>

            <button
              onClick={handleClearAll}
              className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-[380px] overflow-y-auto p-1">
            {selectedItems.map((item) => (
              <div
                key={item.id}
                className={`relative rounded-xl overflow-hidden border group bg-slate-900 ${
                  item.isValid ? 'border-slate-200' : 'border-rose-400 bg-rose-950'
                }`}
              >
                <img
                  src={item.previewUrl}
                  alt={item.file.name}
                  className="w-full h-24 object-cover"
                />

                {/* Remove button */}
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  title="Remove Image"
                  className="absolute top-1 right-1 p-1 rounded-md bg-slate-950/80 text-white hover:bg-rose-600 transition"
                >
                  <Trash2 className="w-3 h-3" />
                </button>

                <div className="p-1.5 bg-white text-slate-900 text-[10px]">
                  <p className="font-semibold truncate">{item.file.name}</p>
                  <p className="text-slate-400">{(item.file.size / 1024).toFixed(0)} KB</p>
                  {!item.isValid && (
                    <p className="text-rose-600 font-bold truncate">{item.error}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              Ready to process <span className="font-bold text-slate-900">{validItems.length}</span> images through the Crop Pulse inference pipeline.
            </div>

            <div className="flex items-center gap-3">
              {onCancel && (
                <button
                  onClick={onCancel}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
              )}

              <button
                id="start-batch-analysis-btn"
                onClick={handleStartAnalysis}
                disabled={validItems.length === 0}
                className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-black text-sm shadow-lg shadow-amber-900/20 transition"
              >
                <span>Start Batch Analysis ({validItems.length})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
