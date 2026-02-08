import React from 'react';
import { GeneratedAsset } from '../types';

interface ResultDisplayProps {
  asset: GeneratedAsset | null;
  loading: boolean;
  loadingMessage?: string;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ asset, loading, loadingMessage }) => {
  if (loading) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-xl flex flex-col items-center justify-center animate-pulse border border-gray-200">
        <div className="w-12 h-12 border-4 border-sola-brick border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium">{loadingMessage || "Génération en cours..."}</p>
        <p className="text-xs text-gray-400 mt-2">Cela peut prendre quelques instants</p>
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="w-full h-96 bg-sola-beige rounded-xl flex flex-col items-center justify-center border border-gray-200 text-gray-400">
        <svg className="w-12 h-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
        <p>Le résultat apparaîtra ici</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <h3 className="font-medium text-gray-700">Résultat Généré</h3>
        <a 
          href={asset.url} 
          download={`sola-didact-asset-${Date.now()}`}
          className="text-sola-brick hover:text-red-700 text-sm font-medium flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
          Télécharger
        </a>
      </div>
      <div className="p-2 flex items-center justify-center bg-sola-beige min-h-[300px]">
        {asset.type === 'video' ? (
          <video src={asset.url} controls className="max-w-full max-h-[500px] rounded-lg shadow-sm" autoPlay loop />
        ) : (
          <img src={asset.url} alt="Result" className="max-w-full max-h-[500px] object-contain rounded-lg shadow-sm" />
        )}
      </div>
    </div>
  );
};