import React, { useState } from 'react';
import { Upload, Loader2, FileCheck, XCircle } from 'lucide-react';
import api from '../lib/api';

const InvoiceUploader = ({ onUploadSuccess }) => {
    const [dragActive, setDragActive] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFile = async (file) => {
        // Return if no file selected (e.g. user canceled the file picker window)
        if (!file) return;

        // Basic validation [cite: 14, 76]
        if (file.size > 10 * 1024 * 1024) {
            setError("File is too large (Max 10MB)");
            return;
        }

        setLoading(true);
        setError(null);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.extraction_error) {
                setError(response.data.extraction_error);
            } else {
                // Pass the result and the local file for preview 
                onUploadSuccess(response.data, file);
            }
        } catch (err) {
            setError(err.response?.data?.detail || "Backend processing failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const onDrag = (e) => {
        e.preventDefault();
        setDragActive(e.type === "dragenter" || e.type === "dragover");
    };

    const onDrop = (e) => {
        e.preventDefault();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div
                onDragEnter={onDrag}
                onDragLeave={onDrag}
                onDragOver={onDrag}
                onDrop={onDrop}
                className={`relative border-2 border-dashed rounded-xl p-12 transition-all flex flex-col items-center justify-center bg-white ${dragActive ? "border-blue-500 bg-blue-50" : "border-slate-300 hover:border-slate-400"
                    }`}
            >
                <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(e) => handleFile(e.target.files[0])}
                />

                {loading ? (
                    <div className="flex flex-col items-center">
                        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                        <p className="text-slate-600 font-medium">AI is reading your invoice...</p>
                        <p className="text-xs text-slate-400 mt-2 italic">OCR + Gemini processing active</p>
                    </div>
                ) : (
                    <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                        <div className="p-4 bg-blue-50 rounded-full mb-4">
                            <Upload className="w-8 h-8 text-blue-600" />
                        </div>
                        <p className="text-slate-700 font-semibold text-lg">Click to upload or drag and drop</p>
                        <p className="text-slate-400 text-sm mt-1">Supports JPG, PNG, and PDF</p>
                    </label>
                )}
            </div>

            {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700 animate-in fade-in">
                    <XCircle size={20} />
                    <span className="text-sm font-medium">{error}</span>
                </div>
            )}
        </div>
    );
};

export default InvoiceUploader;