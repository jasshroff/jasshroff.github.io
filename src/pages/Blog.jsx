import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Calendar, Clock, ArrowRight, Tag } from 'lucide-react';
import { blogPosts, blogCategories } from '../data/blogData';

const Blog = () => {
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredPosts = useMemo(() => {
        let posts = blogPosts;

        if (activeCategory !== 'All') {
            posts = posts.filter(post => post.category === activeCategory);
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            posts = posts.filter(post =>
                post.title.toLowerCase().includes(query) ||
                post.excerpt.toLowerCase().includes(query) ||
                post.tags.some(tag => tag.toLowerCase().includes(query))
            );
        }

        return posts;
    }, [activeCategory, searchQuery]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.1 }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
        exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
    };

    return (
        <div className="bg-white min-h-screen">
            <Helmet>
                <title>Jewellery Blog — Gold Guides, Wedding Tips & Expert Advice | SGV Jewellers</title>
                <meta name="description" content="Expert articles on gold jewellery, bridal tips, BIS hallmarking, investment guides, and care tips from SGV Jewellers — Burhanpur's most trusted jewellers since 1938." />
                <meta name="keywords" content="gold jewellery blog, bridal jewellery tips, gold investment India, jewellery care guide, BIS hallmark guide, wedding jewellery trends" />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://sgvjewellers.in/blog" />
                <meta property="og:title" content="Jewellery Blog — Expert Advice from SGV Jewellers" />
                <meta property="og:description" content="Gold guides, wedding tips, investment advice, and care tips from Burhanpur's most trusted jewellers." />
            </Helmet>

            {/* Hero Header */}
            <div className="relative bg-maroon-950 text-white py-20 md:py-28 text-center overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 0.08, scale: 1 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0 bg-[url('/images/main/craftmanship.jpeg')] bg-cover bg-center"
                />
                <div className="relative z-10 container mx-auto px-4">
                    <motion.span
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-gold-400 font-medium tracking-widest uppercase text-sm block mb-3"
                    >
                        Knowledge & Insights
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-4xl md:text-6xl font-serif font-bold mb-6 tracking-tight"
                    >
                        Our Blog
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="text-gray-300 max-w-2xl mx-auto text-base md:text-lg leading-relaxed"
                    >
                        Expert guides on gold jewellery, bridal collections, investment wisdom, and care tips — drawn from our 85+ years of craftsmanship.
                    </motion.p>
                </div>
            </div>

            {/* Search & Filter Bar */}
            <section className="py-6 md:py-8 bg-white border-b border-gray-100 sticky top-0 md:top-[72px] z-30 shadow-sm">
                <div className="container mx-auto px-4">
                    {/* Search */}
                    <div className="max-w-md mx-auto mb-5">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search articles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 border border-gray-200 bg-gray-50 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-colors text-sm"
                            />
                        </div>
                    </div>

                    {/* Category Filter */}
                    <div className="flex gap-2 md:gap-3 overflow-x-auto scrollbar-hide pb-1 justify-start md:justify-center">
                        {blogCategories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 md:px-6 py-2 text-xs uppercase tracking-widest font-bold transition-all whitespace-nowrap flex-shrink-0 ${activeCategory === cat
                                    ? 'bg-gold-500 text-white shadow-lg'
                                    : 'bg-gray-50 text-gray-500 hover:text-gold-600 hover:bg-gold-50'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Blog Grid */}
            <section className="py-12 md:py-20 container mx-auto px-4">
                {filteredPosts.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <p className="text-gray-400 text-lg font-serif">No articles found.</p>
                        <button
                            onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
                            className="mt-4 text-gold-600 hover:text-gold-700 font-medium text-sm uppercase tracking-wider"
                        >
                            Clear filters
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredPosts.map((post) => (
                                <motion.article
                                    key={post.id}
                                    variants={cardVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    layout="position"
                                    className="blog-card"
                                >
                                    <Link to={`/blog/${post.slug}`} className="block">
                                        {/* Image */}
                                        <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                                            <img
                                                src={post.image}
                                                alt={post.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                loading="lazy"
                                            />
                                            <div className="absolute top-3 left-3">
                                                <span className="bg-gold-500 text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest">
                                                    {post.category}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-5 md:p-6">
                                            {/* Meta */}
                                            <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {post.readTime}
                                                </span>
                                            </div>

                                            {/* Title */}
                                            <h2 className="text-lg md:text-xl font-serif font-bold text-maroon-950 mb-2 group-hover:text-gold-600 transition-colors line-clamp-2">
                                                {post.title}
                                            </h2>

                                            {/* Excerpt */}
                                            <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">
                                                {post.excerpt}
                                            </p>

                                            {/* Read More */}
                                            <span className="inline-flex items-center gap-2 text-gold-600 text-xs font-bold uppercase tracking-widest group-hover:gap-3 transition-all">
                                                Read Article
                                                <ArrowRight className="w-3.5 h-3.5" />
                                            </span>
                                        </div>
                                    </Link>
                                </motion.article>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </section>

            {/* CTA Section */}
            <section className="py-16 md:py-20 bg-maroon-950 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Have Questions About Gold?</h2>
                    <p className="text-gray-400 max-w-xl mx-auto mb-8 text-base md:text-lg">
                        Visit our showroom or reach out to our experts. With 85+ years of experience, we're here to guide you.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/contact-us"
                            className="inline-block px-8 py-3 bg-gold-500 text-white font-medium uppercase tracking-wider hover:bg-gold-600 transition-all shadow-lg"
                        >
                            Contact Us
                        </Link>
                        <Link
                            to="/catalog"
                            className="inline-block px-8 py-3 border-2 border-white text-white font-medium uppercase tracking-wider hover:bg-white hover:text-maroon-950 transition-all"
                        >
                            View Catalog
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Blog;
