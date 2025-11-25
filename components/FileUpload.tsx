import React, { useCallback, useState } from 'react';
import { Upload, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { parseExcelFile } from '../utils/excelParser';
import { Participant } from '../types';

interface FileUploadProps {
  onDataLoaded: (data: Participant[]) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onDataLoaded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const processFile = async (file: File) => {
    setError(null);
    setIsLoading(true);

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      setError('Por favor, envie um arquivo Excel (.xlsx ou .xls)');
      setIsLoading(false);
      return;
    }

    try {
      const data = await parseExcelFile(file);
      onDataLoaded(data);
    } catch (err) {
      console.error(err);
      setError('Erro ao processar o arquivo. Verifique o formato (Col A: Código, B: Nome, C: Peso).');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto mt-10">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative group cursor-pointer
          border-2 border-dashed rounded-2xl p-10
          transition-all duration-300 ease-in-out
          flex flex-col items-center justify-center text-center
          ${isDragging 
            ? 'border-brand-orange bg-brand-orange/10 scale-[1.02]' 
            : 'border-brand-gray bg-brand-dark hover:border-brand-orange/50 hover:bg-brand-gray/50'}
        `}
      >
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileInput}
          accept=".xlsx, .xls"
          disabled={isLoading}
        />

        <div className={`p-4 rounded-full mb-4 transition-colors ${isDragging ? 'bg-brand-orange/20' : 'bg-brand-gray'}`}>
          {isLoading ? (
             <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-orange"></div>
          ) : (
             <Upload className={`w-10 h-10 ${isDragging ? 'text-brand-orange' : 'text-gray-400'}`} />
          )}
        </div>

        <h3 className="text-xl font-bold text-white mb-2">
          {isLoading ? 'Processando...' : 'Carregar Cupons'}
        </h3>
        
        <p className="text-gray-400 text-sm mb-6 max-w-xs">
          Arraste e solte seu arquivo .xlsx aqui ou clique para selecionar.
        </p>

        <div className="flex items-start text-xs text-gray-500 bg-black/30 p-3 rounded-lg text-left w-full">
          <FileSpreadsheet className="w-4 h-4 mr-2 flex-shrink-0 text-brand-orange" />
          <div>
            <p className="font-semibold text-gray-300 mb-1">Aguardando compras</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-900/20 border border-red-500/50 rounded-lg flex items-center text-red-400 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};