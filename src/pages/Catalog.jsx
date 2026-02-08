import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const Catalog = () => {
    const [filter, setFilter] = useState('All');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <div className="animate-fade-in bg-white min-h-screen">
            <Helmet>
                <title>Catalog - Shree Gopaldas Vallabhdas Jewellers</title>
                <meta name="description" content="Explore our exquisite collection of Gold, Antique, and Diamond jewelry." />
            </Helmet>

            {/* Hero Header */}
            <div className="relative bg-dark-900 text-white py-20 text-center">
                <div className="relative z-10 container mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Our Catalog</h1>
                    <p className="text-gray-300 max-w-2xl mx-auto">
                        Discover our extensive range of certified jewelry, crafted to perfection.
                    </p>
                </div>
            </div>

            {/* Filter Menu */}
            <section className="py-8 bg-gray-50 border-b border-gray-200 sticky top-0 md:top-[72px] z-30">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap justify-center gap-4">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${filter === cat
                                    ? 'bg-gold-500 text-white shadow-md'
                                    : 'bg-white text-gray-600 hover:text-gold-600 hover:bg-gold-50 border border-gray-200'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Product Grid */}
            <section className="py-16 container mx-auto px-4">
                <motion.div
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                    {filteredProducts.map((product) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            key={product.id}
                            className={`group bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 
                  ${product.type === 'large' ? 'col-span-1 sm:col-span-2 row-span-2' : ''}
                  ${product.type === 'wide' ? 'col-span-1 sm:col-span-2' : ''}
                  ${product.type === 'vertical' ? 'row-span-2' : ''}
               `}
                        >
                            <div className="relative w-full h-full min-h-[300px]">
                                <img
                                    src={product.image}
                                    alt={product.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                    <h3 className="text-white text-xl font-serif font-bold">{product.title}</h3>
                                    <p className="text-gold-300 text-sm uppercase tracking-wider mb-3">{product.category}</p>
                                    <button
                                        onClick={() => window.location.href = `/contact?product=${encodeURIComponent(product.title)}`}
                                        className="bg-white text-dark-900 px-4 py-2 text-sm font-medium w-fit hover:bg-gold-500 hover:text-white transition-colors"
                                    >
                                        Inquire Now
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </section>
        </div>
    );
};

export default Catalog;
