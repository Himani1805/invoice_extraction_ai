import React, { useEffect, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    AreaChart, Area, CartesianGrid
} from 'recharts';
import {
    TrendingUp, CreditCard, Landmark, Layers,
    Loader2, PieChart, Users
} from 'lucide-react';
import api from '../lib/api';

// --- Sub-component: Professional Stat Card ---
const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-2 rounded-lg ${color} bg-opacity-10`}>
                <Icon className={color.replace('bg-', 'text-')} size={20} />
            </div>
        </div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
    </div>
);

const DashboardView = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/dashboard'); // Calls our Analytics API
                setStats(response.data);
            } catch (err) {
                console.error("Dashboard Load Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-64">
            <Loader2 className="animate-spin text-indigo-600 mb-2" />
            <p className="text-slate-500 text-sm">Aggregating financial data...</p>
        </div>
    );

    // Empty State: If no invoices have been processed yet 
    if (!stats || stats.total_processed === 0) return (
        <div className="text-center p-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <PieChart size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-800">No Data Available</h3>
            <p className="text-slate-500">Upload your first invoice to generate analytics.</p>
        </div>
    );

    // Data Formatting for Recharts [cite: 33, 34]
    const vendorData = Object.entries(stats.spend_by_vendor).map(([name, total]) => ({ name, total }));
    const trendData = Object.entries(stats.monthly_trends).sort().map(([date, total]) => ({ date, total }));

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* 1. Key Performance Indicators (KPIs) [cite: 35, 36] */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Invoices Processed" value={stats.total_processed} icon={Layers} color="bg-blue-600" />
                <StatCard title="Total Vendors" value={vendorData.length} icon={Users} color="bg-violet-600" />
                {Object.entries(stats.currency_totals).map(([curr, total]) => (
                    <StatCard key={curr} title={`Total Spend (${curr})`} value={total.toLocaleString()} icon={Landmark} color="bg-emerald-600" />
                ))}
            </div>

            {/* 2. Main Analytics Charts [cite: 33, 34] */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Vendor Spending Breakdown */}
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <CreditCard size={18} className="text-indigo-500" /> Spend by Vendor
                    </h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={vendorData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                <Bar dataKey="total" fill="#6366f1" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Monthly Spending Trends */}
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <TrendingUp size={18} className="text-emerald-500" /> Monthly Trends
                    </h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData}>
                                <defs>
                                    <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                <Area type="monotone" dataKey="total" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorTrend)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardView;