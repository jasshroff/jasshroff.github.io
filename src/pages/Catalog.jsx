import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Catalog = () => {
    const [filter, setFilter] = useState('All');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const categories = ['All', 'Gold', 'Antique', 'Necklace', 'Rings', 'Bangles', 'Diamond', 'Silver'];

    // Static fallback data
    const staticProducts = [
        { id: 1, title: 'Maang Tikka', category: 'Gold', image: '/images/main/catalog/310x585_1.png', type: 'vertical' },
        { id: 2, title: 'Gold Set', category: 'Gold', image: '/images/main/catalog/631x587_1.png', type: 'large' },
        { id: 3, title: 'Necklace Detail', category: 'Necklace', image: '/images/main/catalog/311x289_1.png', type: 'standard' },
        { id: 4, title: 'Wedding Set', category: 'Gold', image: '/images/main/catalog/631x289_1.png', type: 'wide' },
        { id: 5, title: 'Bangle Set', category: 'Bangles', image: '/images/main/catalog/311x289_2.png', type: 'standard' },
        { id: 6, title: 'Ring Collection', category: 'Rings', image: '/images/main/catalog/311x289_3.png', type: 'standard' },
        { id: 7, title: 'Antique Pendant', category: 'Antique', image: '/images/main/catalog/311x289_4.png', type: 'standard' },
        { id: 8, title: 'Rani Haar', category: 'Gold', image: '/images/main/catalog/310x585_2.png', type: 'vertical' },
        { id: 9, title: 'Heavy Necklace', category: 'Necklace', image: '/images/main/catalog/631x587_2.png', type: 'large' },
    ];

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "products"));
                const productsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                // If no products in DB, fall back to initial static data or show empty
                // For now, let's mix them or just use DB
                // To keep the site looking good immediately, we will use static data if DB is empty
                if (productsData.length > 0) {
                    setProducts(productsData);
                } else {
                    setProducts(staticProducts);
                }
            } catch (error) {
                console.error("Error fetching products (using fallback):", error);
                setProducts(staticProducts);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const filteredProducts = filter === 'All' ? products : products.filter(p => p.category === filter);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" }
        },
        exit: {
            opacity: 0,
            scale: 0.9,
            transition: { duration: 0.2 }
        }
    };

    return (
        <div className="bg-white min-h-screen">
            <Helmet>
                <title>Catalog - Shree Gopaldas Vallabhdas Jewellers</title>
                <meta name="description" content="Explore our exquisite collection of Gold, Antique, and Diamond jewelry." />
                
                {/* Open Graph Tags */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://sgvjewellers.in/catalog" />
                <meta property="og:title" content="Our Catalog | Exclusive Jewellery | SGV" />
                <meta property="og:description" content="Certified gold, diamond, and antique jewelry collections." />
                <meta property="og:image" content="https://sgvjewellers.in/images/main/catalog/310x585_1.png" />
            </Helmet>

            {/* Hero Header */}
            <div className="relative bg-dark-900 text-white py-24 text-center overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 0.1, scale: 1 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0 bg-[url('/images/main/sgv_Collage.png')] bg-cover bg-center"
                />
                <div className="relative z-10 container mx-auto px-4">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-4xl md:text-6xl font-serif font-bold mb-6 tracking-tight"
                    >
                        Our Catalog
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="text-gray-300 max-w-2xl mx-auto text-lg leading-relaxed"
                    >
                        Discover our extensive range of certified jewelry, crafted to perfection and designed to be cherished for generations.
                    </motion.p>
                </div>
            </div>

            {/* Filter Menu */}
            <section className="py-8 bg-white border-b border-gray-100 sticky top-0 md:top-[72px] z-30 shadow-sm">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap justify-center gap-3">
                        {categories.map((cat) => (
                            <motion.button
                                key={cat}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setFilter(cat)}
                                className={`px-6 py-2.5 rounded-none text-xs uppercase tracking-widest font-bold transition-all ${filter === cat
                                    ? 'bg-gold-500 text-white shadow-lg'
                                    : 'bg-gray-50 text-gray-500 hover:text-gold-600 hover:bg-gold-50'
                                    }`}
                            >
                                {cat}
                            </motion.button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Product Grid */}
            <section className="py-20 container mx-auto px-4">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredProducts.map((product) => (
                            <motion.div
                                layout="position"
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                key={product.id}
                                whileHover={{ y: -10 }}
                                className={`group relative bg-white rounded-none overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 
                  ${product.type === 'large' ? 'col-span-1 sm:col-span-2 row-span-2' : ''}
                  ${product.type === 'wide' ? 'col-span-1 sm:col-span-2' : ''}
                  ${product.type === 'vertical' ? 'row-span-2' : ''}
                `}
                            >
                                <div className="relative aspect-[4/5] sm:aspect-auto sm:h-full w-full min-h-[350px] overflow-hidden bg-gray-100">
                                    <img
                                        src={product.image}
                                        alt={product.title}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />
                                    
                                    {/* Glassmorphism Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900/90 via-dark-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8 translate-y-4 group-hover:translate-y-0">
                                        <motion.div
                                            className="space-y-4"
                                        >
                                            <div>
                                                <p className="text-gold-400 text-xs uppercase tracking-[0.2em] font-bold mb-1">{product.category}</p>
                                                <h3 className="text-white text-2xl font-serif font-medium">{product.title}</h3>
                                            </div>
                                            
                                            <div className="h-px w-12 bg-gold-500/50" />
                                            
                                            <button
                                                onClick={() => navigate(`/contact?product=${encodeURIComponent(product.title)}`)}
                                                className="group/btn relative inline-flex items-center gap-2 bg-transparent border border-gold-500/50 text-white px-6 py-3 text-xs uppercase tracking-widest font-bold hover:bg-gold-500 hover:border-gold-500 transition-all duration-300"
                                            >
                                                <span>Inquire Now</span>
                                                <div className="w-0 group-hover/btn:w-4 transition-all duration-300 h-px bg-white" />
                                            </button>
                                        </motion.div>
                                    </div>
                                    
                                    {/* Static Category Badge */}
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 text-[10px] uppercase tracking-widest font-bold text-dark-900 shadow-sm transition-opacity duration-300 group-hover:opacity-0">
                                        {product.category}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </section>
        </div>
    );
};

export default Catalog;
