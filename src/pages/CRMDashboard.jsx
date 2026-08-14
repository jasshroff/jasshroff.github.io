import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { blogCategories, blogPosts } from '../data/blogData';
import {
    AlertTriangle,
    Bell,
    Briefcase,
    Calendar,
    CheckCircle2,
    Clock3,
    Database,
    Edit3,
    ExternalLink,
    FileText,
    Filter,
    Gem,
    Inbox,
    LayoutDashboard,
    LogOut,
    MessageSquare,
    Newspaper,
    Plus,
    RefreshCw,
    Search,
    Send,
    ShieldCheck,
    TrendingUp,
    UploadCloud,
    Users,
} from 'lucide-react';

const demoRequests = [
    {
        id: 'req-001',
        customer: 'Anjali Desai',
        channel: 'Website Form',
        topic: 'Bridal consultation for antique set',
        priority: 'High',
        status: 'New',
        owner: 'Sales',
        date: '14 Aug',
    },
    {
        id: 'req-002',
        customer: 'Rajesh Kumar',
        channel: 'WhatsApp',
        topic: 'Rani Haar availability and estimated weight',
        priority: 'High',
        status: 'In Progress',
        owner: 'Catalog',
        date: '14 Aug',
    },
    {
        id: 'req-003',
        customer: 'Neeta Patil',
        channel: 'Showroom Call',
        topic: 'Gold chain exchange and buyback policy',
        priority: 'Medium',
        status: 'Waiting',
        owner: 'Accounts',
        date: '13 Aug',
    },
    {
        id: 'req-004',
        customer: 'Prameela Gawande',
        channel: 'Contact Page',
        topic: 'BIS/HUID verification help',
        priority: 'Low',
        status: 'Resolved',
        owner: 'Support',
        date: '12 Aug',
    },
];

const contentTasks = [
    { id: 'task-1', area: 'Homepage', task: 'Refresh best-seller cards for festive season', owner: 'Catalog', status: 'Ready' },
    { id: 'task-2', area: 'SEO', task: 'Add schema for new bridal consultation page', owner: 'Marketing', status: 'Review' },
    { id: 'task-3', area: 'Chatbot', task: 'Add verified answers for live rate handoff', owner: 'Support', status: 'Live' },
    { id: 'task-4', area: 'Gallery', task: 'Replace older necklace images with new shoot', owner: 'Creative', status: 'Draft' },
];

const campaignItems = [
    { id: 'cmp-1', name: 'Shravan bridal follow-up', audience: 'Warm bridal leads', progress: 72, status: 'Running' },
    { id: 'cmp-2', name: 'Gold investment guide readers', audience: 'Blog visitors', progress: 46, status: 'Draft' },
    { id: 'cmp-3', name: 'Catalog inquiry reminders', audience: 'Open product leads', progress: 88, status: 'Ready' },
];

const priorityClass = {
    High: 'bg-red-50 text-red-700 border-red-200',
    Medium: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    Low: 'bg-green-50 text-green-700 border-green-200',
};

const statusClass = {
    New: 'bg-blue-50 text-blue-700 border-blue-200',
    'In Progress': 'bg-gold-50 text-gold-700 border-gold-200',
    Waiting: 'bg-purple-50 text-purple-700 border-purple-200',
    Resolved: 'bg-green-50 text-green-700 border-green-200',
    Draft: 'bg-gray-50 text-gray-700 border-gray-200',
    Review: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    Ready: 'bg-blue-50 text-blue-700 border-blue-200',
    Live: 'bg-green-50 text-green-700 border-green-200',
    Running: 'bg-maroon-50 text-maroon-700 border-maroon-200',
};

const metricToneClass = {
    blue: 'bg-blue-50 text-blue-700',
    gold: 'bg-gold-50 text-gold-700',
    gray: 'bg-gray-50 text-gray-700',
    green: 'bg-green-50 text-green-700',
    purple: 'bg-purple-50 text-purple-700',
};

const requestStatuses = ['New', 'In Progress', 'Waiting', 'Resolved'];

function safeDateLabel(value) {
    if (!value) return 'N/A';
    if (value.toDate) return value.toDate().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    return value;
}

function downloadCSV(rows, filename) {
    if (!rows.length) return;

    const headers = Object.keys(rows[0]);
    const csv = [
        headers.join(','),
        ...rows.map((row) => headers.map((key) => `"${String(row[key] || '').replace(/"/g, '""')}"`).join(',')),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
}

const MetricTile = ({ icon, label, value, note, tone = 'gray' }) => {
    const IconComponent = icon;

    return (
        <div className="border border-gray-200 bg-white p-4">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
                    <p className="mt-2 text-2xl font-bold text-maroon-950">{value}</p>
                    <p className="mt-1 text-xs text-gray-500">{note}</p>
                </div>
                <div className={`flex h-10 w-10 items-center justify-center rounded ${metricToneClass[tone] || metricToneClass.gray}`}>
                    <IconComponent className="h-5 w-5" />
                </div>
            </div>
        </div>
    );
};

const SectionHeader = ({ icon, title, action }) => {
    const IconComponent = icon;

    return (
        <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-gold-50 text-gold-700">
                    <IconComponent className="h-4 w-4" />
                </div>
                <h2 className="font-serif text-xl font-bold text-maroon-950">{title}</h2>
            </div>
            {action}
        </div>
    );
};

const CRMDashboard = ({ demoMode = false }) => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const draftIdRef = useRef(0);
    const [loading, setLoading] = useState(true);
    const [dataError, setDataError] = useState('');
    const [products, setProducts] = useState([]);
    const [applications, setApplications] = useState([]);
    const [requests, setRequests] = useState(demoRequests);
    const [requestFilter, setRequestFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [draftTitle, setDraftTitle] = useState('');
    const [draftCategory, setDraftCategory] = useState(blogCategories[1] || 'Gold Guide');
    const [blogDrafts, setBlogDrafts] = useState(() => [
        ...blogPosts.slice(0, 4).map((post, index) => ({
            id: `blog-${post.id}`,
            title: post.title,
            category: post.category,
            status: index === 0 ? 'Live' : index === 1 ? 'Ready' : 'Review',
            owner: post.author,
            date: safeDateLabel(post.date),
        })),
        {
            id: 'draft-bridal-2026',
            title: 'Festive bridal necklace checklist',
            category: 'Wedding',
            status: 'Draft',
            owner: 'Marketing',
            date: 'Draft',
        },
    ]);

    const fetchDashboardData = useCallback(async () => {
        if (demoMode) {
            setProducts([]);
            setApplications([]);
            setRequests(demoRequests);
            setDataError('');
            setLoading(false);
            return;
        }

        setLoading(true);
        setDataError('');

        try {
            const [productSnap, applicationSnap, requestSnap] = await Promise.all([
                getDocs(collection(db, 'products')),
                getDocs(collection(db, 'jobApplications')),
                getDocs(collection(db, 'websiteRequests')).catch(() => null),
            ]);

            setProducts(productSnap.docs.map((item) => ({ id: item.id, ...item.data() })));
            setApplications(applicationSnap.docs.map((item) => ({ id: item.id, ...item.data() })));

            if (requestSnap?.docs?.length) {
                setRequests(requestSnap.docs.map((item) => ({ id: item.id, ...item.data() })));
            }
        } catch (error) {
            console.error('CRM dashboard data failed:', error);
            setDataError('Live database data could not be loaded. Showing demo CRM queues.');
        } finally {
            setLoading(false);
        }
    }, [demoMode]);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    const handleLogout = async () => {
        if (demoMode) {
            navigate('/');
            return;
        }

        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Failed to log out', error);
        }
    };

    const metrics = useMemo(() => {
        const unresolvedRequests = requests.filter((request) => request.status !== 'Resolved').length;
        const pendingApplications = applications.filter((application) => (application.status || 'Pending') === 'Pending').length;
        const liveBlogs = blogDrafts.filter((draft) => draft.status === 'Live').length;

        return {
            unresolvedRequests,
            pendingApplications,
            productCount: products.length || 9,
            liveBlogs,
        };
    }, [applications, blogDrafts, products, requests]);

    const filteredRequests = useMemo(() => {
        return requests.filter((request) => {
            const statusMatch = requestFilter === 'All' || request.status === requestFilter;
            const query = searchQuery.toLowerCase();
            const searchMatch =
                !query ||
                [request.customer, request.channel, request.topic, request.owner]
                    .some((value) => String(value || '').toLowerCase().includes(query));

            return statusMatch && searchMatch;
        });
    }, [requestFilter, requests, searchQuery]);

    const recentApplications = useMemo(() => {
        const source = applications.length > 0
            ? applications
            : [
                { id: 'app-demo-1', fullName: 'Demo Applicant', appliedRole: 'Sales Executive', status: 'Pending', createdAt: 'Today' },
                { id: 'app-demo-2', fullName: 'Demo Candidate', appliedRole: 'Catalog Assistant', status: 'Shortlisted', createdAt: '13 Aug' },
            ];

        return source.slice(0, 4);
    }, [applications]);

    const updateRequestStatus = (id, status) => {
        setRequests((current) => current.map((request) => (
            request.id === id ? { ...request, status } : request
        )));
    };

    const addBlogDraft = (event) => {
        event.preventDefault();
        const title = draftTitle.trim();
        if (!title) return;

        draftIdRef.current += 1;
        setBlogDrafts((current) => [
            {
                id: `draft-${draftIdRef.current}`,
                title,
                category: draftCategory,
                status: 'Draft',
                owner: currentUser?.email || 'Admin',
                date: 'Draft',
            },
            ...current,
        ]);
        setDraftTitle('');
    };

    const exportRequests = () => {
        downloadCSV(filteredRequests.map((request) => ({
            customer: request.customer,
            channel: request.channel,
            topic: request.topic,
            priority: request.priority,
            status: request.status,
            owner: request.owner,
            date: request.date,
        })), 'sgv-crm-requests.csv');
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <Helmet>
                <title>CRM Portal - SGV Jewellers</title>
            </Helmet>

            <header className="border-b border-gray-200 bg-white">
                <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gold-700">
                            <LayoutDashboard className="h-4 w-4" />
                            {demoMode ? 'CRM Portal Demo' : 'CRM Portal'}
                        </div>
                        <h1 className="mt-2 font-serif text-3xl font-bold text-maroon-950">Website Control Center</h1>
                        <p className="mt-1 text-sm text-gray-500">Manage requests, content, catalog updates, campaigns, and website tasks.</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Link to="/admin" className="inline-flex items-center gap-2 rounded border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-gold-300 hover:text-gold-700">
                            <Gem className="h-4 w-4" />
                            Inventory
                        </Link>
                        <Link to="/admin/hr" className="inline-flex items-center gap-2 rounded border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-gold-300 hover:text-gold-700">
                            <Briefcase className="h-4 w-4" />
                            HR
                        </Link>
                        <button onClick={fetchDashboardData} className="inline-flex items-center gap-2 rounded border border-gold-200 bg-gold-50 px-3 py-2 text-sm font-medium text-gold-700 transition hover:bg-gold-100">
                            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                            Sync
                        </button>
                        <button onClick={handleLogout} className="inline-flex items-center gap-2 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100">
                            <LogOut className="h-4 w-4" />
                            {demoMode ? 'Exit Demo' : 'Logout'}
                        </button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 py-6">
                {demoMode && (
                    <div className="mb-5 flex items-start gap-3 border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
                        <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0" />
                        <p>This is a CRM demo preview using sample data. The protected live portal is available at /admin/crm after staff login.</p>
                    </div>
                )}

                {dataError && (
                    <div className="mb-5 flex items-start gap-3 border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
                        <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                        <p>{dataError}</p>
                    </div>
                )}

                <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <MetricTile icon={Inbox} label="Open Requests" value={metrics.unresolvedRequests} note="Customer requests needing action" tone="blue" />
                    <MetricTile icon={Gem} label="Catalog Items" value={metrics.productCount} note="Live products or demo inventory" tone="gold" />
                    <MetricTile icon={Newspaper} label="Content Live" value={metrics.liveBlogs} note="Published blog/content pieces" tone="green" />
                    <MetricTile icon={Users} label="Pending Careers" value={metrics.pendingApplications} note="Applications awaiting review" tone="purple" />
                </section>

                <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.45fr_0.9fr]">
                    <div className="border border-gray-200 bg-white p-5">
                        <SectionHeader
                            icon={Inbox}
                            title="Customer Request Inbox"
                            action={(
                                <button onClick={exportRequests} className="inline-flex items-center gap-2 rounded border border-gray-200 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-600 transition hover:border-gold-300 hover:text-gold-700">
                                    <UploadCloud className="h-4 w-4" />
                                    Export
                                </button>
                            )}
                        />

                        <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-[1fr_180px]">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(event) => setSearchQuery(event.target.value)}
                                    placeholder="Search customer, channel, topic..."
                                    className="w-full rounded border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-gold-500 focus:bg-white"
                                />
                            </div>
                            <div className="relative">
                                <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <select
                                    value={requestFilter}
                                    onChange={(event) => setRequestFilter(event.target.value)}
                                    className="w-full appearance-none rounded border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-gold-500 focus:bg-white"
                                >
                                    <option value="All">All Status</option>
                                    {requestStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[760px] text-left text-sm">
                                <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                                    <tr>
                                        <th className="px-3 py-3 font-semibold">Customer</th>
                                        <th className="px-3 py-3 font-semibold">Request</th>
                                        <th className="px-3 py-3 font-semibold">Priority</th>
                                        <th className="px-3 py-3 font-semibold">Owner</th>
                                        <th className="px-3 py-3 font-semibold">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredRequests.map((request) => (
                                        <tr key={request.id} className="hover:bg-gray-50">
                                            <td className="px-3 py-4 align-top">
                                                <p className="font-semibold text-maroon-950">{request.customer}</p>
                                                <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                                                    <MessageSquare className="h-3.5 w-3.5" />
                                                    {request.channel} - {request.date}
                                                </p>
                                            </td>
                                            <td className="px-3 py-4 align-top text-gray-700">{request.topic}</td>
                                            <td className="px-3 py-4 align-top">
                                                <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${priorityClass[request.priority] || priorityClass.Low}`}>
                                                    {request.priority}
                                                </span>
                                            </td>
                                            <td className="px-3 py-4 align-top text-gray-600">{request.owner}</td>
                                            <td className="px-3 py-4 align-top">
                                                <select
                                                    value={request.status}
                                                    onChange={(event) => updateRequestStatus(request.id, event.target.value)}
                                                    className={`rounded border px-2.5 py-1 text-xs font-medium outline-none ${statusClass[request.status] || statusClass.Draft}`}
                                                >
                                                    {requestStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <aside className="space-y-6">
                        <div className="border border-gray-200 bg-white p-5">
                            <SectionHeader icon={Bell} title="Action Queue" />
                            <div className="space-y-3">
                                {contentTasks.map((item) => (
                                    <div key={item.id} className="flex items-start gap-3 border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                                        <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded bg-gray-50 text-gray-600">
                                            <FileText className="h-4 w-4" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-start justify-between gap-2">
                                                <p className="font-medium text-gray-900">{item.task}</p>
                                                <span className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${statusClass[item.status] || statusClass.Draft}`}>{item.status}</span>
                                            </div>
                                            <p className="mt-1 text-xs text-gray-500">{item.area} - {item.owner}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="border border-gray-200 bg-white p-5">
                            <SectionHeader icon={Briefcase} title="Recent Applications" />
                            <div className="space-y-3">
                                {recentApplications.map((application) => (
                                    <div key={application.id} className="flex items-center justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="truncate font-medium text-maroon-950">{application.fullName || application.email || 'Applicant'}</p>
                                            <p className="truncate text-xs text-gray-500">{application.appliedRole || 'General'} - {safeDateLabel(application.createdAt)}</p>
                                        </div>
                                        <span className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${statusClass[application.status] || statusClass.Waiting}`}>
                                            {application.status || 'Pending'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <Link to="/admin/hr" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-gold-700 hover:text-gold-800">
                                Open HR dashboard
                                <ExternalLink className="h-3.5 w-3.5" />
                            </Link>
                        </div>
                    </aside>
                </section>

                <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
                    <div className="border border-gray-200 bg-white p-5">
                        <SectionHeader icon={Newspaper} title="Blog and Content Pipeline" />
                        <form onSubmit={addBlogDraft} className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-[1fr_180px_44px]">
                            <input
                                type="text"
                                value={draftTitle}
                                onChange={(event) => setDraftTitle(event.target.value)}
                                placeholder="Add demo blog draft title"
                                className="rounded border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none transition focus:border-gold-500 focus:bg-white"
                            />
                            <select
                                value={draftCategory}
                                onChange={(event) => setDraftCategory(event.target.value)}
                                className="rounded border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none transition focus:border-gold-500 focus:bg-white"
                            >
                                {blogCategories.filter((item) => item !== 'All').map((category) => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                            <button type="submit" aria-label="Add blog draft" className="inline-flex h-11 items-center justify-center rounded bg-gold-500 text-white transition hover:bg-gold-600">
                                <Plus className="h-4 w-4" />
                            </button>
                        </form>
                        <div className="space-y-3">
                            {blogDrafts.slice(0, 6).map((draft) => (
                                <div key={draft.id} className="flex items-start justify-between gap-3 border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                                    <div>
                                        <p className="font-medium text-maroon-950">{draft.title}</p>
                                        <p className="mt-1 text-xs text-gray-500">{draft.category} - {draft.owner} - {draft.date}</p>
                                    </div>
                                    <select
                                        value={draft.status}
                                        onChange={(event) => {
                                            const nextStatus = event.target.value;
                                            setBlogDrafts((current) => current.map((item) => (
                                                item.id === draft.id ? { ...item, status: nextStatus } : item
                                            )));
                                        }}
                                        className={`rounded border px-2.5 py-1 text-xs font-medium outline-none ${statusClass[draft.status] || statusClass.Draft}`}
                                    >
                                        {['Draft', 'Review', 'Ready', 'Live'].map((status) => <option key={status} value={status}>{status}</option>)}
                                    </select>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="border border-gray-200 bg-white p-5">
                        <SectionHeader icon={TrendingUp} title="Campaign and Lead Follow-up" />
                        <div className="space-y-4">
                            {campaignItems.map((campaign) => (
                                <div key={campaign.id}>
                                    <div className="mb-2 flex items-center justify-between gap-3">
                                        <div>
                                            <p className="font-medium text-maroon-950">{campaign.name}</p>
                                            <p className="text-xs text-gray-500">{campaign.audience}</p>
                                        </div>
                                        <span className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${statusClass[campaign.status] || statusClass.Draft}`}>{campaign.status}</span>
                                    </div>
                                    <div className="h-2 overflow-hidden rounded bg-gray-100">
                                        <div className="h-full bg-gold-500" style={{ width: `${campaign.progress}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-5 grid grid-cols-2 gap-3">
                            <button className="inline-flex items-center justify-center gap-2 rounded border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-gold-300 hover:text-gold-700">
                                <Send className="h-4 w-4" />
                                Send Follow-up
                            </button>
                            <button className="inline-flex items-center justify-center gap-2 rounded border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-gold-300 hover:text-gold-700">
                                <Edit3 className="h-4 w-4" />
                                Create Campaign
                            </button>
                        </div>
                    </div>
                </section>

                <section className="mt-6 border border-gray-200 bg-white p-5">
                    <SectionHeader icon={ShieldCheck} title="Website Control Map" />
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                        {[
                            { icon: Gem, title: 'Catalog', text: 'Products, categories, hero product cards', link: '/admin' },
                            { icon: Newspaper, title: 'Blog CMS', text: 'Draft, review, publish-ready editorial queue', link: '/blog' },
                            { icon: Inbox, title: 'Requests', text: 'Contact, WhatsApp, appointment and inquiry queue', link: '/contact-us' },
                            { icon: Database, title: 'Backend', text: 'Firestore collections and future live data feeds', link: '/admin/crm' },
                        ].map((item) => (
                            <Link key={item.title} to={item.link} className="group border border-gray-200 p-4 transition hover:border-gold-300 hover:bg-gold-50/40">
                                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded bg-maroon-50 text-maroon-800 group-hover:bg-gold-100 group-hover:text-gold-800">
                                    <item.icon className="h-5 w-5" />
                                </div>
                                <h3 className="font-serif text-lg font-bold text-maroon-950">{item.title}</h3>
                                <p className="mt-1 text-sm text-gray-500">{item.text}</p>
                            </Link>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default CRMDashboard;
