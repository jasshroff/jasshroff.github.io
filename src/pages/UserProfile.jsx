import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { Helmet } from 'react-helmet-async';
import { User, Briefcase, FileText, Loader2, MessageSquare, Clock, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const UserProfile = () => {
    const { currentUser, logout } = useAuth();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplications = async () => {
            if (!currentUser?.email) return;
            
            try {
                // Fetch applications matching the logged-in user's email
                const q = query(
                    collection(db, 'jobApplications'),
                    where('email', '==', currentUser.email),
                    // We don't orderBy here because it requires a composite index that the user might not have set up.
                    // We'll sort them in memory instead.
                );
                
                const querySnapshot = await getDocs(q);
                const apps = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                
                // Sort by createdAt descending
                apps.sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis());
                
                setApplications(apps);
            } catch (error) {
                console.error("Error fetching applications:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, [currentUser]);

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'reviewed': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'hired': return 'bg-green-100 text-green-800 border-green-200';
            case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending': return <Clock className="w-4 h-4 mr-1.5" />;
            case 'reviewed': return <FileText className="w-4 h-4 mr-1.5" />;
            case 'hired': return <CheckCircle className="w-4 h-4 mr-1.5" />;
            case 'rejected': return <XCircle className="w-4 h-4 mr-1.5" />;
            default: return null;
        }
    };

    if (!currentUser) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-gray-500">Please sign in to view your profile.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <Helmet>
                <title>My Profile | SGV Jewellers</title>
            </Helmet>

            <div className="container mx-auto px-4 max-w-5xl">
                {/* Profile Header */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8 flex flex-col md:flex-row items-center gap-6">
                    <div className="w-24 h-24 bg-gold-50 rounded-full flex items-center justify-center flex-shrink-0">
                        {currentUser.photoURL ? (
                            <img src={currentUser.photoURL} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
                        ) : (
                            <User className="w-10 h-10 text-gold-600" />
                        )}
                    </div>
                    <div className="flex-grow text-center md:text-left">
                        <h1 className="text-3xl font-serif font-bold text-dark-900 mb-2">
                            {currentUser.displayName || 'My Profile'}
                        </h1>
                        <p className="text-gray-500">{currentUser.email}</p>
                    </div>
                    <button
                        onClick={logout}
                        className="px-6 py-2.5 border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-dark-900 transition-colors rounded-lg font-medium"
                    >
                        Sign Out
                    </button>
                </div>

                {/* Applications Section */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-serif font-bold text-dark-900 flex items-center gap-3">
                        <Briefcase className="w-6 h-6 text-gold-500" />
                        My Job Applications
                    </h2>

                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-gold-500" />
                        </div>
                    ) : applications.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FileText className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Found</h3>
                            <p className="text-gray-500 mb-6">You haven't submitted any job applications yet.</p>
                            <a href="/careers" className="inline-block bg-gold-500 hover:bg-gold-600 text-white px-8 py-3 font-medium transition-colors">
                                Browse Careers
                            </a>
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {applications.map((app, index) => (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    key={app.id} 
                                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                                >
                                    <div className="p-6 md:p-8">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                            <div>
                                                <h3 className="text-xl font-bold text-dark-900 mb-1">
                                                    {app.appliedRole || 'General Application'}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    Applied on {app.createdAt ? new Date(app.createdAt.toMillis()).toLocaleDateString('en-US', {
                                                        year: 'numeric', month: 'long', day: 'numeric'
                                                    }) : 'Recently'}
                                                </p>
                                            </div>
                                            <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(app.status)}`}>
                                                {getStatusIcon(app.status)}
                                                {app.status || 'Pending'}
                                            </span>
                                        </div>

                                        {/* Admin Notes Section */}
                                        {app.adminNotes ? (
                                            <div className="mt-6 bg-gold-50/50 border border-gold-100 rounded-lg p-5">
                                                <h4 className="flex items-center gap-2 text-sm font-bold text-gold-800 mb-2">
                                                    <MessageSquare className="w-4 h-4" />
                                                    Message from HR Admin
                                                </h4>
                                                <p className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">
                                                    {app.adminNotes}
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="mt-6 border-t border-gray-100 pt-5">
                                                <p className="text-sm text-gray-400 italic">
                                                    Your application is currently being processed. Any updates or messages from the HR team will appear here.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
