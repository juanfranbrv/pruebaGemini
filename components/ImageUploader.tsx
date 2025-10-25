
import React, { useState, useCallback, useRef } from 'react';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      if (files[0].type.startsWith('image/')) {
        onImageUpload(files[0]);
      } else {
        alert("Por favor, sube un archivo de imagen válido.");
      }
    }
  }, [onImageUpload]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      if (files[0].type.startsWith('image/')) {
        onImageUpload(files[0]);
      } else {
        alert("Por favor, sube un archivo de imagen válido.");
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const dropzoneClasses = `
    flex flex-col items-center justify-center w-full h-64
    border-2 border-dashed rounded-lg cursor-pointer
    transition-all duration-300 ease-in-out
    ${isDragging ? 'border-blue-400 bg-gray-700/50' : 'border-gray-600 bg-gray-800 hover:bg-gray-700/80'}
  `;

  return (
    <div
      className={dropzoneClasses}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <div className="flex flex-col items-center justify-center pt-5 pb-6">
        <svg className={`w-10 h-10 mb-3 ${isDragging ? 'text-blue-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
        <p className={`mb-2 text-sm ${isDragging ? 'text-blue-300' : 'text-gray-400'}`}>
          <span className="font-semibold">Haz clic para subir</span> o arrastra y suelta
        </p>
        <p className="text-xs text-gray-500">PNG, JPG, GIF (MAX. 800x400px)</p>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
    </div>
  );
};
