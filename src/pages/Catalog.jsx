import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { OptimizedImage } from '../components/OptimizedImage';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

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

const Catalog = () => {
    const [filter, setFilter] = useState('All');
    const [products, setProducts] = useState(staticProducts);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "products"));
                const productsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                if (productsData.length > 0) {
                    setProducts(productsData);
                }
            } catch (error) {
                console.error("Error fetching products (using fallback):", error);
            }
        };

        fetchProducts();
    }, []);

    const filteredProducts = filter === 'All' ? products : products.filter(p => p.category === filter);

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4, ease: "easeOut" }
        },
        exit: {
            opacity: 0,
            scale: 0.95,
            transition: { duration: 0.2 }
        }
    };

    return (
        <div className="bg-white min-h-screen">
            <Helmet>
                <title>Jewellery Collections | Antique, Gold & Diamond Designs | SGV</title>
                <meta name="description" content="Explore our exquisite collection of BIS Hallmarked gold, diamond, and antique bridal jewelry in Burhanpur. From traditional Rani Haar to modern bangles and rings." />
                <meta name="keywords" content="Antique jewellery Burhanpur, gold bangle designs, traditional necklace collection, bridal jewellery Burhanpur, diamond rings Burhanpur, Rani Haar, Maang Tikka" />
                
                {/* Open Graph Tags */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://sgvjewellers.in/catalog" />
                <meta property="og:title" content="Jewellery Collections | Exclusive Designs | SGV" />
                <meta property="og:description" content="Certified gold, diamond, and antique jewelry collections in Burhanpur." />
                <meta property="og:image" content="https://sgvjewellers.in/images/main/catalog/310x585_1.png" />
            </Helmet>

            {/* Hero Header */}
            <div className="relative bg-maroon-950 text-white py-16 md:py-24 text-center overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 0.1, scale: 1 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0 bg-[url('/images/main/sgv_Collage.png')] bg-cover bg-center"
                />
                <div className="relative z-10 container mx-auto px-4">
                    <motion.span
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-gold-400 font-medium tracking-widest uppercase text-xs sm:text-sm block mb-2"
                    >
                        Handcrafted Brilliance
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-3xl sm:text-4xl md:text-6xl font-serif font-bold mb-4 md:mb-6 tracking-tight"
                    >
                        Our Collections
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="text-gray-300 max-w-2xl mx-auto text-sm sm:text-base md:text-lg leading-relaxed"
                    >
                        Discover our extensive range of 100% BIS Hallmarked certified jewelry, crafted to perfection and designed to be cherished for generations.
                    </motion.p>
                </div>
            </div>

            {/* Filter Menu — horizontally scrollable on mobile */}
            <section className="py-4 md:py-6 bg-white border-b border-gray-100 sticky top-0 md:top-[72px] z-30 shadow-sm">
                <div className="container mx-auto px-4">
                    <div className="flex gap-2 md:gap-3 overflow-x-auto scrollbar-hide justify-start md:justify-center pb-1">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`px-4 sm:px-6 py-2 rounded-none text-xs uppercase tracking-widest font-bold transition-all whitespace-nowrap flex-shrink-0 ${filter === cat
                                    ? 'bg-gold-500 text-white shadow-md'
                                    : 'bg-gray-50 text-gray-500 hover:text-gold-600 hover:bg-gold-50'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Product Grid */}
            <section className="py-12 md:py-20 container mx-auto px-4">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8"
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
                                className={`group relative bg-white overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 
                  ${product.type === 'large' ? 'col-span-1 sm:col-span-2 row-span-2' : ''}
                  ${product.type === 'wide' ? 'col-span-1 sm:col-span-2' : ''}
                  ${product.type === 'vertical' ? 'row-span-2' : ''}
                `}
                            >
                                <div className="relative aspect-[4/5] sm:aspect-auto sm:h-full w-full min-h-[280px] sm:min-h-[350px] overflow-hidden bg-gray-100">
                                    <OptimizedImage src={product.image} alt={product.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" loading="lazy" />
                                    
                                    {/* Desktop Hover Overlay */}
                                    <div className="hidden sm:flex absolute inset-0 bg-gradient-to-t from-maroon-950/90 via-maroon-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex-col justify-end p-6 md:p-8 translate-y-4 group-hover:translate-y-0">
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-gold-400 text-[10px] sm:text-xs uppercase tracking-[0.2em] font-bold mb-1">{product.category}</p>
                                                <h3 className="text-white text-xl sm:text-2xl font-serif font-medium">{product.title}</h3>
                                            </div>
                                            
                                            <div className="h-px w-12 bg-gold-500/50" />
                                            
                                            <button
                                                onClick={() => navigate(`/contact-us?product=${encodeURIComponent(product.title)}`)}
                                                className="group/btn relative inline-flex items-center gap-2 bg-transparent border border-gold-500/50 text-white px-5 py-2.5 text-xs uppercase tracking-widest font-bold hover:bg-gold-500 hover:border-gold-500 transition-all duration-300"
                                            >
                                                <span>Inquire Now</span>
                                                <ArrowRight className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Mobile Bottom Info Bar */}
                                    <div className="sm:hidden absolute bottom-0 inset-x-0 bg-gradient-to-t from-maroon-950/95 via-maroon-950/80 to-transparent p-4 flex items-end justify-between">
                                        <div>
                                            <p className="text-gold-400 text-[9px] uppercase tracking-widest font-bold">{product.category}</p>
                                            <h3 className="text-white text-base font-serif font-medium">{product.title}</h3>
                                        </div>
                                        <button
                                            onClick={() => navigate(`/contact-us?product=${encodeURIComponent(product.title)}`)}
                                            className="bg-gold-500 text-white px-3 py-1.5 text-[10px] uppercase tracking-wider font-bold shadow"
                                        >
                                            Inquire
                                        </button>
                                    </div>
                                    
                                    {/* Static Category Badge */}
                                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 text-[9px] sm:text-[10px] uppercase tracking-widest font-bold text-maroon-950 shadow-sm sm:transition-opacity sm:duration-300 sm:group-hover:opacity-0">
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
