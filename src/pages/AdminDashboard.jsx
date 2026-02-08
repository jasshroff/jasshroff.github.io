import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { db } from '../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { Trash2, Upload, LogOut } from 'lucide-react';

const AdminDashboard = () => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Gold');
    const [type, setType] = useState('standard');
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const categories = ['Gold', 'Antique', 'Necklace', 'Rings', 'Bangles', 'Diamond', 'Silver'];
    const types = ['standard', 'large', 'wide', 'vertical'];

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "products"));
            const productsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProducts(productsData);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file || !title) return;

        setUploading(true);
        try {
            // Upload to ImgBB
            const formData = new FormData();
            formData.append('image', file);

            const imgbbKey = import.meta.env.VITE_IMGBB_API_KEY;
            if (!imgbbKey) {
                alert("Missing ImgBB API Key! Please check your .env file.");
                setUploading(false);
                return;
            }

            const response = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error?.message || 'ImgBB Upload Failed');
            }

            const downloadURL = data.data.url;

            await addDoc(collection(db, "products"), {
                title,
                category,
                type,
                image: downloadURL,
                createdAt: serverTimestamp(),
                createdBy: currentUser.email
            });

            setTitle('');
            setFile(null);
            // Reset file input manually if needed
            e.target.reset();

            alert('Product uploaded successfully!');
            fetchProducts();
        } catch (error) {
            console.error("Error uploading product:", error);
            alert(`Failed to upload: ${error.message}`);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteDoc(doc(db, "products", id));
                setProducts(products.filter(p => p.id !== id));
            } catch (error) {
                console.error("Error deleting product:", error);
                alert("Failed to delete product.");
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <Helmet>
                <title>Admin Dashboard - SGV Jewellers</title>
            </Helmet>
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-lg shadow-sm">
                    <h1 className="text-3xl font-serif font-bold text-dark-900">Admin Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-600 hidden sm:inline">{currentUser?.email}</span>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition border border-red-200"
                        >
                            <LogOut size={18} />
                            Logout
                        </button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Upload Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-lg shadow-sm sticky top-8">
                            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                <Upload size={20} className="text-gold-500" />
                                Upload New Product
                            </h2>
                            <form onSubmit={handleUpload} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Title</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none"
                                        required
                                        placeholder="e.g. Gold Necklace"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Display Size</label>
                                    <select
                                        value={type}
                                        onChange={(e) => setType(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none"
                                    >
                                        {types.map(t => (
                                            <option key={t} value={t}>{t} (Card Style)</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Image or Video</label>
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        accept="image/*,video/*"
                                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gold-50 file:text-gold-700 hover:file:bg-gold-100"
                                        required
                                    />
                                    <p className="text-xs text-gray-400 mt-1">Supports JPG, PNG, MP4</p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="w-full py-3 px-4 bg-gold-600 text-white rounded hover:bg-gold-700 transition disabled:opacity-50 font-medium shadow-md"
                                >
                                    {uploading ? 'Uploading to Catalog...' : 'Add to Catalog'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Product List */}
                    <div className="lg:col-span-2">
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h2 className="text-xl font-semibold mb-6">Current Inventory ({products.length})</h2>
                            {loading ? (
                                <p className="text-gray-500 text-center py-8">Loading products from database...</p>
                            ) : products.length === 0 ? (
                                <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                    <Upload className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                                    <p className="text-gray-500">No products uploaded yet.</p>
                                    <p className="text-sm text-gray-400">Use the form to add your first item.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {products.map(product => (
                                        <div key={product.id} className="border border-gray-100 rounded-lg p-3 flex gap-3 items-start hover:shadow-md transition">
                                            <div className="w-24 h-24 bg-gray-100 rounded overflow-hidden flex-shrink-0 relative">
                                                {product.image?.includes('.mp4') || product.image?.includes('.webm') ? (
                                                    <video src={product.image} className="w-full h-full object-cover" muted />
                                                ) : (
                                                    <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-gray-900 truncate">{product.title}</h3>
                                                <span className="inline-block px-2 py-0.5 bg-gold-50 text-gold-700 text-xs rounded-full mt-1">
                                                    {product.category}
                                                </span>
                                                <p className="text-xs text-gray-400 mt-2 capitalize">Style: {product.type}</p>
                                            </div>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="text-gray-400 hover:text-red-500 transition p-2 hover:bg-red-50 rounded-full"
                                                title="Delete Product"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
