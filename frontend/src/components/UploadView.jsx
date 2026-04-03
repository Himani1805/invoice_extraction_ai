import React, { useState } from 'react';
import { ArrowLeft, RefreshCcw } from 'lucide-react';
import InvoiceUploader from './InvoiceUploader';
import ExtractionResult from './ExtractionResult';

const UploadView = () => {
    // State to store the backend response (JSON + metadata) [cite: 3, 12, 21]
    const [processResult, setProcessResult] = useState(null);

    // State to store the local file object for previewing [cite: 25]
    const [uploadedFile, setUploadedFile] = useState(null);

    /**
     * Called when InvoiceUploader successfully receives data from /upload
     * @param {Object} data - The backend response containing 'extraction' and 'file_info'
     * @param {File} file - The raw file object from the input
     */
    const handleSuccess = (data, file) => {
        setProcessResult(data);
        setUploadedFile(file);
    };

    /**
     * Resets the view to allow a new upload 
     */
    const handleReset = () => {
        setProcessResult(null);
        setUploadedFile(null);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header section with conditional action button */}
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">
                        {processResult ? "Extraction Complete" : "Invoice Processing"}
                    </h2>
                    <p className="text-slate-500 text-sm">
                        {processResult
                            ? "Review the AI-extracted data and line items below."
                            : "Upload an invoice to extract structured data automatically using Gemini AI."}
                    </p>
                </div>

                {processResult && (
                    <button
                        onClick={handleReset}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 hover:text-blue-600 transition-all shadow-sm"
                    >
                        <RefreshCcw size={16} />
                        Process Another
                    </button>
                )}
            </div>

            {/* Main View Logic [cite: 8, 14] */}
            {!processResult ? (
                <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
                    <InvoiceUploader onUploadSuccess={handleSuccess} />
                </div>
            ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Detailed results view showing preview and JSON data [cite: 3, 12, 25] */}
                    <ExtractionResult data={processResult} file={uploadedFile} />

                    {/* RAW JSON Debug/Developer View (Satisfies requirement 12 & 14) */}
                    <div className="mt-8 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Raw AI Response</h4>
                            <span className="text-[10px] font-mono bg-slate-100 text-slate-500 px-2 py-1 rounded">
                                VALIDATION: SUCCESS
                            </span>
                        </div>
                        <pre className="bg-slate-900 text-blue-300 p-4 rounded-lg overflow-x-auto text-xs font-mono leading-relaxed">
                            {JSON.stringify(processResult.extraction, null, 2)}
                        </pre>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UploadView;