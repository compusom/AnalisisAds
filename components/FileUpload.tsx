import React, { useState, useRef } from 'react';

interface FileUploadProps {
    onFileUpload: (files: { square?: File; vertical?: File }) => void;
}

const UploadBox: React.FC<{
    title: string;
    description: string;
    onFileSelect: (file: File) => void;
}> = ({ title, description, onFileSelect }) => {
    const [fileName, setFileName] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        setFileName(file.name);
        onFileSelect(file);
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            setFileName(file.name);
            onFileSelect(file);
        }
    };

    return (
        <div
            className="border-2 border-dashed border-brand-border rounded-lg p-6 text-center cursor-pointer hover:border-brand-primary transition-colors bg-brand-bg"
            onClick={handleClick}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
        >
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*,video/*"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-10 w-10 text-brand-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
             <p className="mt-2 text-sm font-semibold text-brand-text">{title}</p>
            <p className="mt-1 text-xs text-brand-text-secondary">
                {fileName ? (
                    <span className="text-brand-primary font-medium break-all">{fileName}</span>
                ) : (
                    description
                )}
            </p>
        </div>
    );
};

export const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
    const [files, setFiles] = useState<{ square?: File; vertical?: File }>({});

    const handleFileSelect = (file: File, format: 'square' | 'vertical') => {
        const newFiles = { ...files, [format]: file };
        setFiles(newFiles);
        onFileUpload(newFiles);
    };

    return (
        <div className="bg-brand-surface rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-brand-text mb-4">Sube tus creativos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <UploadBox
                    title="Creativo Cuadrado (1:1)"
                    description="Ideal para Feeds"
                    onFileSelect={(file) => handleFileSelect(file, 'square')}
                />
                <UploadBox
                    title="Creativo Vertical (9:16)"
                    description="Ideal para Stories y Reels"
                    onFileSelect={(file) => handleFileSelect(file, 'vertical')}
                />
            </div>
             <p className="text-xs text-brand-text-secondary mt-4 text-center">Puedes subir uno o ambos. La herramienta usará el más adecuado para cada ubicación.</p>
        </div>
    );
};
