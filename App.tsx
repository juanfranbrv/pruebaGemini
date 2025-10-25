
import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { ImageSlider } from './components/ImageSlider';
import { Spinner } from './components/Spinner';
import { generateBaldImage } from './services/geminiService';
import type { ImageState } from './types';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<ImageState | null>(null);
  const [generatedImage, setGeneratedImage] = useState<ImageState | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      const original: ImageState = {
          base64: base64String,
          mimeType: file.type,
      };
      setOriginalImage(original);

      try {
        const generatedBase64 = await generateBaldImage(original.base64, original.mimeType);
        setGeneratedImage({ base64: `data:${original.mimeType};base64,${generatedBase64}`, mimeType: original.mimeType});
      } catch (e) {
        console.error(e);
        setError('No se pudo generar la imagen. Por favor, inténtalo de nuevo con una imagen diferente.');
      } finally {
        setIsLoading(false);
      }
    };
    reader.onerror = () => {
        setError('Error al leer el archivo de imagen.');
        setIsLoading(false);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleReset = () => {
    setOriginalImage(null);
    setGeneratedImage(null);
    setIsLoading(false);
    setError(null);
  };

  const handleDownload = () => {
    if (!generatedImage) return;

    const link = document.createElement('a');
    link.href = generatedImage.base64;
    
    const extension = generatedImage.mimeType.split('/')[1] || 'png';
    link.download = `calvificado.${extension}`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center">
          <Spinner />
          <p className="text-xl text-gray-300 mt-4 animate-pulse">Aplicando calvicie... Un momento.</p>
          {originalImage && (
            <div className="mt-8">
              <img src={originalImage.base64} alt="Processing" className="rounded-lg max-w-xs mx-auto shadow-lg opacity-50" />
            </div>
          )}
        </div>
      );
    }

    if (error) {
        return (
            <div className="text-center bg-red-900/50 border border-red-700 p-6 rounded-lg">
                <p className="text-red-300 text-lg mb-4">{error}</p>
                <button
                    onClick={handleReset}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                    Intentar de Nuevo
                </button>
            </div>
        );
    }

    if (originalImage && generatedImage) {
      return (
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
          <ImageSlider 
            beforeImage={originalImage.base64} 
            afterImage={generatedImage.base64} 
          />
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleReset}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-transform duration-200 ease-in-out transform hover:scale-105"
            >
              Probar con otra imagen
            </button>
            <button
                onClick={handleDownload}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-transform duration-200 ease-in-out transform hover:scale-105 flex items-center justify-center gap-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Descargar Resultado
            </button>
          </div>
        </div>
      );
    }

    return <ImageUploader onImageUpload={handleImageUpload} />;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
          Calvificador IA
        </h1>
        <p className="text-lg text-gray-400 mt-2 max-w-2xl mx-auto">
          Sube una foto de una persona y nuestra IA le quitará el pelo. ¡Compara el antes y el después!
        </p>
      </div>
      <div className="w-full max-w-3xl bg-gray-800/50 border border-gray-700 rounded-xl shadow-2xl p-6 sm:p-10 backdrop-blur-sm">
        {renderContent()}
      </div>
       <footer className="text-center text-gray-500 mt-8 text-sm">
        Creado con React, Tailwind CSS, y la API de Gemini.
      </footer>
    </div>
  );
};

export default App;
