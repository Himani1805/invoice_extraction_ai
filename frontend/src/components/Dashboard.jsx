import React, { useEffect, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    LineChart, Line, CartesianGrid, AreaChart, Area
} from 'recharts';
import {
    TrendingUp, CreditCard, Landmark, Layers,
    AlertCircle, ArrowUpRight, Loader2, PieChart
} from 'lucide-react';
import api from '../lib/api';

// --- Sub-component: Stat Card ---
const StatCard = ({ title, value, subtext, icon: Icon, trend }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-indigo-50 rounded-lg">
                <Icon className="text-indigo-600" size={20} />
            </div>
            {trend && (
                <span className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                    {trend} <ArrowUpRight size={12} className="ml-1" />
                </span>
            )}
        </div>
        <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
            {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
        </div>
    </div>
);

// --- Main Dashboard Component ---
const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await api.get('/dashboard');
                setData(response.data);
            } catch (err) {
                setError("Failed to load analytics. Ensure the backend is running.");
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-96 space-y-4">
            <Loader2 className="animate-spin text-indigo-600" size={40} />
            <p className="text-slate-500 font-medium">Calculating financial insights...</p>
        </div>
    );

    if (error || !data || data.total_processed === 0) return (
        <div className="flex flex-col items-center justify-center h-96 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 p-12">
            <PieChart size={48} className="text-slate-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-800">No Analytics Data Yet</h3>
            <p className="text-slate-500 text-center max-w-sm mt-2">
                Upload your first few invoices to see spending trends, vendor breakdowns, and currency totals.
            </p>
        </div>
    );

    // Transform data for Recharts
    const vendorChartData = Object.entries(data.spend_by_vendor || {}).map(([name, total]) => ({ name, total }));
    const trendChartData = Object.entries(data.monthly_trends || {}).sort().map(([date, total]) => ({ date, total }));
    const currencyTotals = Object.entries(data.currency_totals || {});

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Top Row: Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Invoices"
                    value={data.total_processed}
                    icon={Layers} 
          subtext="Processed across all time"
        />
                {currencyTotals.map(([currency, amount]) => (
                    <StatCard
                        key={currency}
                        title={`Total Spend (${currency})`}
                        value={`${amount.toLocaleString()}`}
                        icon={Landmark}
            trend="+5.2%"
                />
        ))}
                <StatCard
                    title="Active Vendors"
                    value={vendorChartData.length}
                    icon={Users} 
          subtext="Unique billing entities"
        />
            </div>

            {/* Middle Row: Bento Grid Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Vendor Spend Bar Chart */}
                <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <CreditCard className="text-indigo-500" size={20} /> Spend by Vendor
                        </h3>
                        <p className="text-xs text-slate-400 font-medium">Top 5 Entities</p>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={vendorChartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="total" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={32} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Mini Breakdown Table */}
                <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl flex flex-col">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <TrendingUp className="text-indigo-400" size={20} /> Key Insights
                    </h3>
                    <div className="space-y-6 flex-1">
                        {vendorChartData.slice(0, 4).map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center border-b border-slate-800 pb-3">
                                <span className="text-sm text-slate-400 truncate max-w-[120px]">{item.name}</span>
                                <span className="text-sm font-bold">${item.total.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 pt-6 border-t border-slate-800">
                        <p className="text-xs text-slate-500">Predicted next month spend</p>
                        <p className="text-xl font-bold text-indigo-400">$14,200.00</p>
                    </div>
                </div>
            </div>

            {/* Bottom Row: Monthly Trends Area Chart */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-lg font-bold text-slate-900">Monthly Spending Trends</h3>
                    <div className="flex gap-2">
                        <span className="w-3 h-3 rounded-full bg-violet-500"></span>
                        <span className="text-xs text-slate-500 font-medium">Actual Spend</span>
                    </div>
                </div>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trendChartData}>
                            <defs>
                                <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                            <Area
                                type="monotone"
                                dataKey="total"
                                stroke="#8b5cf6"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorTrend)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;