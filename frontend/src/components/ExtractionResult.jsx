import React from 'react';
import { ExternalLink, DollarSign, Building, Calendar, Hash } from 'lucide-react';

const ExtractionResult = ({ data, file }) => {
    const { extraction, file_info } = data;
    const previewUrl = URL.createObjectURL(file); // Preview local file 
    const [hoveredField, setHoveredField] = React.useState(null);

    const renderBoundingBox = (fieldName) => {
        if (!extraction?.bounding_boxes || !extraction.bounding_boxes[fieldName]) return null;
        // Only show if we're hovering over this specific field
        if (hoveredField !== fieldName) return null;

        const box = extraction.bounding_boxes[fieldName];
        if (!Array.isArray(box) || box.length !== 4) return null;
        
        // Gemini bounding boxes: [ymin, xmin, ymax, xmax] mapped to 0-1000
        const [ymin, xmin, ymax, xmax] = box;
        const top = (ymin / 1000) * 100;
        const left = (xmin / 1000) * 100;
        const height = ((ymax - ymin) / 1000) * 100;
        const width = ((xmax - xmin) / 1000) * 100;

        return (
            <div 
                className="absolute border-2 border-yellow-400 bg-yellow-400/20 shadow-lg z-10 transition-all duration-300 pointer-events-none"
                style={{ top: `${top}%`, left: `${left}%`, width: `${width}%`, height: `${height}%` }}
            />
        );
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12 animate-in slide-in-from-bottom-8 duration-500">
            {/* Document Preview */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm h-[600px]">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                        Invoice Preview
                    </h3>
                    <a href={file_info.file_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-xs flex items-center gap-1">
                        View Original <ExternalLink size={12} />
                    </a>
                </div>
                <div className="h-full bg-slate-200 flex items-center justify-center p-4">
                    <div className="relative inline-block h-full w-full flex items-center justify-center">
                        {file.type === "application/pdf" ? (
                            <embed src={previewUrl} className="w-full h-full rounded shadow-lg" type="application/pdf" />
                        ) : (
                            <div className="relative">
                                <img src={previewUrl} alt="Invoice" className="max-w-full max-h-full object-contain rounded shadow-lg" />
                                {renderBoundingBox('vendor_name')}
                                {renderBoundingBox('total_amount')}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Structured Data View */}
            <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-bold mb-6 text-slate-800 border-b pb-4">Extracted Details</h3>

                    <div className="grid grid-cols-2 gap-6">
                        <div 
                            className={`space-y-1 p-2 rounded transition-colors ${hoveredField === 'vendor_name' ? 'bg-yellow-50' : 'hover:bg-slate-50'}`}
                            onMouseEnter={() => setHoveredField('vendor_name')}
                            onMouseLeave={() => setHoveredField(null)}
                        >
                            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Vendor</p>
                            <p className="font-semibold text-slate-700 flex items-center gap-2">
                                <Building size={16} className="text-blue-500" /> {extraction?.vendor_name || 'N/A'}
                            </p>
                            {extraction?.bounding_boxes?.vendor_name && <span className="text-[10px] text-yellow-600 font-mono">📍 Located on image</span>}
                        </div>
                        <div className="space-y-1 p-2">
                            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Invoice #</p>
                            <p className="font-semibold text-slate-700 flex items-center gap-2">
                                <Hash size={16} className="text-blue-500" /> {extraction?.invoice_number || 'N/A'}
                            </p>
                        </div>
                        <div className="space-y-1 p-2">
                            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Date</p>
                            <p className="font-semibold text-slate-700 flex items-center gap-2">
                                <Calendar size={16} className="text-blue-500" /> {extraction?.date || 'N/A'}
                            </p>
                        </div>
                        <div 
                            className={`space-y-1 p-2 rounded transition-colors ${hoveredField === 'total_amount' ? 'bg-yellow-50' : 'hover:bg-slate-50'}`}
                            onMouseEnter={() => setHoveredField('total_amount')}
                            onMouseLeave={() => setHoveredField(null)}
                        >
                            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Total Amount</p>
                            <p className="text-xl font-bold text-blue-600 flex items-center gap-1">
                                <DollarSign size={20} /> {extraction?.total_amount?.toLocaleString()} <span className="text-xs text-slate-400">{extraction?.currency}</span>
                            </p>
                            {extraction?.bounding_boxes?.total_amount && <span className="text-[10px] text-yellow-600 font-mono">📍 Located on image</span>}
                        </div>
                    </div>
                </div>

                {/* Line Items Table */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 text-slate-400 text-xs uppercase font-bold">
                            <tr>
                                <th className="px-6 py-4">Description</th>
                                <th className="px-6 py-4">Qty</th>
                                <th className="px-6 py-4 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {extraction?.line_items?.map((item, idx) => (
                                <tr key={idx} className="hover:bg-slate-50 transition-colors text-slate-600">
                                    <td className="px-6 py-4 font-medium">{item.description}</td>
                                    <td className="px-6 py-4">{item.quantity}</td>
                                    <td className="px-6 py-4 text-right font-semibold">${item.total?.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ExtractionResult;