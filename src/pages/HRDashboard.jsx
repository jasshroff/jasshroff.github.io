import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Helmet } from 'react-helmet-async';
import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import {
  Search, Filter, Download, FileText, Eye, ChevronDown,
  Users, Clock, CheckCircle, XCircle, CalendarCheck, Star,
  Loader2, StickyNote, ExternalLink, Image
} from 'lucide-react';

const STATUS_OPTIONS = ['Pending', 'Shortlisted', 'Rejected', 'Interview Scheduled', 'Selected'];
const STATUS_COLORS = {
  Pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  Shortlisted: 'bg-blue-50 text-blue-700 border-blue-200',
  Rejected: 'bg-red-50 text-red-700 border-red-200',
  'Interview Scheduled': 'bg-purple-50 text-purple-700 border-purple-200',
  Selected: 'bg-green-50 text-green-700 border-green-200',
};
const STATUS_ICONS = {
  Pending: Clock, Shortlisted: Star, Rejected: XCircle,
  'Interview Scheduled': CalendarCheck, Selected: CheckCircle,
};

function exportToCSV(data, filename) {
  if (!data.length) return;
  const headers = ['Full Name','Email','Mobile','Applied Role','Experience','Qualification','Status','Applied Date'];
  const rows = data.map(a => [
    a.fullName, a.email, a.mobile, a.appliedRole, a.experience,
    a.qualification, a.status,
    a.createdAt?.toDate ? a.createdAt.toDate().toLocaleDateString() : 'N/A'
  ]);
  const csv = [headers, ...rows].map(r => r.map(c => `"${(c||'').replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function exportToExcel(data, filename) {
  // Simple HTML table → .xls export
  if (!data.length) return;
  let html = '<table><tr><th>Name</th><th>Email</th><th>Mobile</th><th>Role</th><th>Experience</th><th>Qualification</th><th>City</th><th>Status</th><th>Applied</th></tr>';
  data.forEach(a => {
    html += `<tr><td>${a.fullName}</td><td>${a.email}</td><td>${a.mobile}</td><td>${a.appliedRole}</td><td>${a.experience}</td><td>${a.qualification}</td><td>${a.city}</td><td>${a.status}</td><td>${a.createdAt?.toDate ? a.createdAt.toDate().toLocaleDateString() : 'N/A'}</td></tr>`;
  });
  html += '</table>';
  const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

const HRDashboard = () => {
  const { currentUser } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterExperience, setFilterExperience] = useState('All');
  const [selectedApp, setSelectedApp] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [editingNotes, setEditingNotes] = useState({});

  useEffect(() => { fetchApplications(); }, []);

  const fetchApplications = async () => {
    try {
      const snap = await getDocs(collection(db, 'jobApplications'));
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      data.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setApplications(data);
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      await updateDoc(doc(db, 'jobApplications', id), { status: newStatus, updatedAt: serverTimestamp() });
      setApplications(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
      if (selectedApp?.id === id) setSelectedApp(prev => ({ ...prev, status: newStatus }));
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const saveNotes = async (id) => {
    try {
      await updateDoc(doc(db, 'jobApplications', id), { adminNotes: editingNotes[id] || '', updatedAt: serverTimestamp() });
      setApplications(prev => prev.map(a => a.id === id ? { ...a, adminNotes: editingNotes[id] || '' } : a));
      alert('Notes saved!');
    } catch (err) {
      alert('Failed to save notes: ' + err.message);
    }
  };

  const filtered = useMemo(() => {
    return applications.filter(a => {
      const matchSearch = !searchQuery || [a.fullName, a.email, a.mobile, a.skills].some(f => (f || '').toLowerCase().includes(searchQuery.toLowerCase()));
      const matchRole = filterRole === 'All' || a.appliedRole === filterRole;
      const matchStatus = filterStatus === 'All' || a.status === filterStatus;
      const matchExp = filterExperience === 'All' ||
        (filterExperience === 'Fresher' && (a.experience || '').toLowerCase().includes('fresher')) ||
        (filterExperience === 'Experienced' && !(a.experience || '').toLowerCase().includes('fresher'));
      return matchSearch && matchRole && matchStatus && matchExp;
    });
  }, [applications, searchQuery, filterRole, filterStatus, filterExperience]);

  const stats = useMemo(() => ({
    total: applications.length,
    pending: applications.filter(a => a.status === 'Pending').length,
    shortlisted: applications.filter(a => a.status === 'Shortlisted').length,
    selected: applications.filter(a => a.status === 'Selected').length,
  }), [applications]);

  const roles = [...new Set(applications.map(a => a.appliedRole).filter(Boolean))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gold-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet><title>HR Dashboard - SGV Jewellers</title></Helmet>

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-serif font-bold text-maroon-950">HR Dashboard</h1>
            <p className="text-sm text-gray-500">Manage job applications • {currentUser?.email}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => exportToCSV(filtered, 'applications.csv')} className="flex items-center gap-1.5 px-3 py-2 text-sm bg-white border border-gray-300 hover:bg-gray-50 rounded transition">
              <Download className="w-4 h-4" /> CSV
            </button>
            <button onClick={() => exportToExcel(filtered, 'applications.xls')} className="flex items-center gap-1.5 px-3 py-2 text-sm bg-gold-500 text-white hover:bg-gold-600 rounded transition">
              <Download className="w-4 h-4" /> Excel
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total', value: stats.total, icon: Users, color: 'text-gray-700 bg-gray-50' },
            { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-yellow-700 bg-yellow-50' },
            { label: 'Shortlisted', value: stats.shortlisted, icon: Star, color: 'text-blue-700 bg-blue-50' },
            { label: 'Selected', value: stats.selected, icon: CheckCircle, color: 'text-green-700 bg-green-50' },
          ].map(s => (
            <div key={s.label} className={`p-4 rounded-lg border ${s.color}`}>
              <div className="flex items-center gap-2 mb-1"><s.icon className="w-4 h-4" /><span className="text-xs font-medium uppercase tracking-wider">{s.label}</span></div>
              <p className="text-2xl font-bold">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search name, email, skills..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded text-sm focus:border-gold-500 outline-none" />
            </div>
            <select value={filterRole} onChange={e => setFilterRole(e.target.value)} className="px-3 py-2 border border-gray-300 rounded text-sm focus:border-gold-500 outline-none">
              <option value="All">All Roles</option>
              {roles.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-2 border border-gray-300 rounded text-sm focus:border-gold-500 outline-none">
              <option value="All">All Statuses</option>
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={filterExperience} onChange={e => setFilterExperience(e.target.value)} className="px-3 py-2 border border-gray-300 rounded text-sm focus:border-gold-500 outline-none">
              <option value="All">All Experience</option>
              <option value="Fresher">Fresher</option>
              <option value="Experienced">Experienced</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-sm text-gray-500 mb-4">Showing {filtered.length} of {applications.length} applications</p>

        {/* Applications Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-700">Applicant</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-700 hidden md:table-cell">Role</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-700 hidden lg:table-cell">Experience</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-700">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-700 hidden lg:table-cell">Applied</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.length === 0 ? (
                  <tr><td colSpan="6" className="px-4 py-12 text-center text-gray-500">No applications found matching your criteria.</td></tr>
                ) : filtered.map(app => {
                  const StatusIcon = STATUS_ICONS[app.status] || Clock;
                  return (
                    <tr key={app.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3">
                        <p className="font-medium text-maroon-950">{app.fullName}</p>
                        <p className="text-xs text-gray-500">{app.email}</p>
                        <p className="text-xs text-gray-400 md:hidden">{app.appliedRole}</p>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-gray-700 text-xs">{app.appliedRole}</td>
                      <td className="px-4 py-3 hidden lg:table-cell text-gray-700 text-xs">{app.experience}</td>
                      <td className="px-4 py-3">
                        <select
                          value={app.status}
                          onChange={e => updateStatus(app.id, e.target.value)}
                          disabled={updatingId === app.id}
                          className={`px-2 py-1 text-xs font-medium rounded border ${STATUS_COLORS[app.status] || ''} cursor-pointer outline-none`}
                        >
                          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell text-xs text-gray-500">
                        {app.createdAt?.toDate ? app.createdAt.toDate().toLocaleDateString('en-IN') : 'N/A'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button onClick={() => { setSelectedApp(app); setEditingNotes(prev => ({ ...prev, [app.id]: app.adminNotes || '' })); }}
                            className="p-1.5 hover:bg-gold-50 rounded text-gold-600" title="View Details">
                            <Eye className="w-4 h-4" />
                          </button>
                          {app.resumeUrl && (
                            <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 hover:bg-blue-50 rounded text-blue-600" title="Download Resume">
                              <FileText className="w-4 h-4" />
                            </a>
                          )}
                          {app.aadharFrontUrl && (
                            <a href={app.aadharFrontUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 hover:bg-gray-100 rounded text-gray-600" title="View Aadhar">
                              <Image className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-10 px-4 overflow-y-auto" onClick={() => setSelectedApp(null)}>
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl mb-10" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-serif font-bold text-maroon-950">{selectedApp.fullName}</h2>
                <p className="text-sm text-gray-500">{selectedApp.appliedRole} • Applied {selectedApp.createdAt?.toDate ? selectedApp.createdAt.toDate().toLocaleDateString('en-IN') : 'N/A'}</p>
              </div>
              <button onClick={() => setSelectedApp(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Personal */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm uppercase tracking-wider">Personal</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-gray-500">Father's Name:</span> <span className="text-gray-900 ml-1">{selectedApp.fatherName}</span></div>
                  <div><span className="text-gray-500">DOB:</span> <span className="text-gray-900 ml-1">{selectedApp.dob}</span></div>
                  <div><span className="text-gray-500">Gender:</span> <span className="text-gray-900 ml-1">{selectedApp.gender}</span></div>
                  <div><span className="text-gray-500">Marital Status:</span> <span className="text-gray-900 ml-1">{selectedApp.maritalStatus}</span></div>
                </div>
              </div>
              {/* Contact */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm uppercase tracking-wider">Contact</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-gray-500">Mobile:</span> <span className="text-gray-900 ml-1">{selectedApp.mobile}</span></div>
                  <div><span className="text-gray-500">WhatsApp:</span> <span className="text-gray-900 ml-1">{selectedApp.whatsapp || 'Same'}</span></div>
                  <div className="col-span-2"><span className="text-gray-500">Email:</span> <span className="text-gray-900 ml-1">{selectedApp.email}</span></div>
                  <div className="col-span-2"><span className="text-gray-500">Address:</span> <span className="text-gray-900 ml-1">{selectedApp.address}, {selectedApp.city}, {selectedApp.state} - {selectedApp.pincode}</span></div>
                </div>
              </div>
              {/* Professional */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm uppercase tracking-wider">Professional</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-gray-500">Qualification:</span> <span className="text-gray-900 ml-1">{selectedApp.qualification}</span></div>
                  <div><span className="text-gray-500">Experience:</span> <span className="text-gray-900 ml-1">{selectedApp.experience}</span></div>
                  <div><span className="text-gray-500">Previous Company:</span> <span className="text-gray-900 ml-1">{selectedApp.previousCompany || 'N/A'}</span></div>
                  <div><span className="text-gray-500">Expected Salary:</span> <span className="text-gray-900 ml-1">{selectedApp.expectedSalary || 'N/A'}</span></div>
                  <div className="col-span-2"><span className="text-gray-500">Skills:</span> <span className="text-gray-900 ml-1">{selectedApp.skills}</span></div>
                </div>
              </div>
              {/* Motivation */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm uppercase tracking-wider">Motivation</h3>
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{selectedApp.motivation}</p>
                <p className="text-xs text-gray-500 mt-2">Joining Date: {selectedApp.joiningDate}</p>
              </div>
              {/* Documents */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm uppercase tracking-wider">Documents</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedApp.resumeUrl && <a href={selectedApp.resumeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded border border-blue-200 hover:bg-blue-100"><FileText className="w-3.5 h-3.5" /> Resume</a>}
                  {selectedApp.aadharFrontUrl && <a href={selectedApp.aadharFrontUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-50 text-gray-700 text-xs font-medium rounded border border-gray-200 hover:bg-gray-100"><Image className="w-3.5 h-3.5" /> Aadhar Front</a>}
                  {selectedApp.aadharBackUrl && <a href={selectedApp.aadharBackUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-50 text-gray-700 text-xs font-medium rounded border border-gray-200 hover:bg-gray-100"><Image className="w-3.5 h-3.5" /> Aadhar Back</a>}
                  {selectedApp.photoUrl && <a href={selectedApp.photoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-50 text-gray-700 text-xs font-medium rounded border border-gray-200 hover:bg-gray-100"><Image className="w-3.5 h-3.5" /> Photo</a>}
                </div>
              </div>
              {/* Status Change */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm uppercase tracking-wider">Update Status</h3>
                <div className="flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map(s => (
                    <button key={s} onClick={() => updateStatus(selectedApp.id, s)}
                      className={`px-3 py-1.5 text-xs font-medium rounded border transition ${selectedApp.status === s ? STATUS_COLORS[s] + ' ring-2 ring-offset-1 ring-current' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              {/* Admin Notes */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm uppercase tracking-wider flex items-center gap-1"><StickyNote className="w-4 h-4" /> HR Notes</h3>
                <textarea
                  value={editingNotes[selectedApp.id] ?? selectedApp.adminNotes ?? ''}
                  onChange={e => setEditingNotes(prev => ({ ...prev, [selectedApp.id]: e.target.value }))}
                  rows="3"
                  placeholder="Add notes about this candidate..."
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:border-gold-500 outline-none"
                />
                <button onClick={() => saveNotes(selectedApp.id)} className="mt-2 px-4 py-1.5 bg-gold-500 text-white text-xs rounded hover:bg-gold-600 transition">Save Notes</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HRDashboard;
