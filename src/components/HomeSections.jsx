import { OptimizedImage } from '../components/OptimizedImage';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, ShieldCheck, RefreshCw, Award, Gem, ArrowRight, Calendar, Clock } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { getFeaturedPosts } from '../data/blogData';
import 'swiper/css';
import 'swiper/css/pagination';

// Collection Grid implementation
export const CollectionGrid = () => {
    const collections = [
        { id: 1, title: 'Earrings', image: '/images/main/display_earing.png', link: '/catalog' },
        { id: 2, title: 'Necklaces', image: '/images/main/display_necklace.png', link: '/catalog' },
        { id: 3, title: 'Rings', image: '/images/main/display_ring.png', link: '/catalog' },
        { id: 4, title: 'Bangles', image: '/images/main/display_bangle.png', link: '/catalog' },
        { id: 5, title: 'Pendants', image: '/images/main/display_pendent.png', link: '/catalog' },
        { id: 6, title: 'Men', image: '/images/main/display_men_chain.png', link: '/catalog' },
    ];

    return (
        <section className="py-12 md:py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-10 md:mb-16">
                    <span className="text-gold-600 font-medium tracking-widest uppercase text-sm">Discover</span>
                    <h2 className="text-3xl md:text-4xl font-serif text-maroon-950 mt-2">Our Collections</h2>
                    <div className="w-24 h-1 bg-gold-500 mx-auto mt-4"></div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-8">
                    {collections.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="group cursor-pointer"
                        >
                            <Link to={item.link} className="block overflow-hidden relative shadow-lg">
                                <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                        <OptimizedImage src={item.image} alt={`SGV Jewellers ${item.title} Collection Burhanpur`} className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                                </div>
                                {/* Mobile: always show title; Desktop: hover reveal */}
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300 flex items-end sm:items-center justify-center p-2 sm:p-0">
                                    <div className="bg-white/90 px-4 sm:px-8 py-2 sm:py-3 sm:transform sm:translate-y-4 sm:group-hover:translate-y-0 sm:transition-transform sm:duration-300 sm:opacity-0 sm:group-hover:opacity-100">
                                        <h3 className="text-maroon-950 font-serif font-bold text-sm sm:text-xl uppercase tracking-wide text-center">{item.title}</h3>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// Best Sellers component
export const BestSellers = () => {
    const products = [
        { id: 1, title: 'Antique Set', image: '/images/main/best-seller-antique-set.png', rating: 4, isNew: false, price: 'Rs. 1,200', colors: ['gold', 'silver'] },
        { id: 2, title: 'Necklace Set', image: '/images/main/best-seller-necklace.png', rating: 5, isNew: true, price: 'Rs. 1,500', colors: ['gold'] },
        { id: 3, title: 'Men Chain', image: '/images/main/best-seller-chain.png', rating: 4, isNew: false, price: 'Rs. 800', colors: ['gold'] },
        { id: 4, title: 'Vertical Mala', image: '/images/main/best-seller-vertical-mala.png', rating: 5, isNew: false, price: 'Rs. 2,000', colors: ['gold', 'red'] },
    ];

    return (
        <section className="py-12 md:py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-10 md:mb-16">
                    <span className="text-gold-600 font-medium tracking-widest uppercase text-sm">Shop</span>
                    <h2 className="text-3xl md:text-4xl font-serif text-maroon-950 mt-2">Best Sellers</h2>
                    <div className="w-24 h-1 bg-gold-500 mx-auto mt-4"></div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-8">
                    {products.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-white p-2 sm:p-4 shadow-md hover:shadow-xl transition-shadow group relative"
                        >
                            {product.isNew && (
                                <span className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-gold-500 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 uppercase z-10">
                                    New
                                </span>
                            )}
                            <div className="relative overflow-hidden mb-2 sm:mb-4 bg-gray-100 aspect-square flex items-center justify-center">
                                <OptimizedImage src={product.image} alt={`Best Seller ${product.title} - SGV Jewellers Burhanpur`} className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                                    <Link to="/catalog" className="bg-white text-maroon-950 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium hover:bg-gold-500 hover:text-white transition-colors shadow-lg uppercase tracking-wider">
                                        View
                                    </Link>
                                </div>
                            </div>

                            <div className="text-center">
                                <div className="flex justify-center mb-1 sm:mb-2 space-x-0.5 sm:space-x-1 text-gold-400 text-sm">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-3 h-3 sm:w-4 sm:h-4 ${i < product.rating ? 'fill-current text-gold-500' : 'text-gray-300'}`} />
                                    ))}
                                </div>
                                <h3 className="text-sm sm:text-lg font-serif font-semibold text-maroon-950 mb-1 sm:mb-2">{product.title}</h3>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// Quality CTA
export const QualityCTA = () => {
    return (
        <section className="relative py-20 md:py-32 bg-fixed bg-center bg-cover" style={{ backgroundImage: "url('/images/main/craftmanship.jpeg')" }}>
            <div className="absolute inset-0 bg-black/60"></div>
            <div className="container mx-auto px-4 relative z-10 text-center md:text-right">
                <div className="md:w-1/2 ml-auto">
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="bg-black/40 backdrop-blur-sm p-6 sm:p-10 border border-white/10"
                    >
                        <span className="text-gold-400 font-serif italic text-lg md:text-xl mb-4 block">Best-in-class craftsmanship</span>
                        <h2 className="text-2xl sm:text-3xl md:text-5xl font-serif text-white mb-4 md:mb-6 leading-tight">
                            Beauty and elegance <br /><span className="text-gold-500">beyond measure</span>
                        </h2>
                        <p className="text-gray-300 mb-6 md:mb-8 text-base md:text-lg font-light">
                            Gold is the most ductile and malleable of all metals, and its craftsmanship brings beauty and elegance beyond measure.
                        </p>
                        <div className="text-gold-300 font-serif italic mb-6 md:mb-8">- Pliny the Elder</div>
                        <Link to="/about-us" className="inline-block border-2 border-white text-white px-6 sm:px-8 py-3 hover:bg-gold-500 hover:border-gold-500 transition-all uppercase tracking-widest text-xs sm:text-sm font-medium">
                            View Our Services
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

// Testimonials
export const Testimonials = () => {
    const testimonials = [
        { id: 1, name: 'Neeta Patil', role: 'Client', image: '/images/user-6-115x115.jpg', quote: 'I bought a beautiful gold necklace from Burhanpur Gold Jewellers. The craftsmanship is exquisite, and the staff was very helpful. Highly recommended!' },
        { id: 2, name: 'Siddhart Gupta', role: 'Client', image: '/images/user-8-115x115.jpg', quote: 'Burhanpur Gold Jewellers is my go-to for gold purchases. Great designs, transparent pricing, and a lifetime buyback policy. Excellent service and quality!' },
        { id: 3, name: 'Prameela Gawande', role: 'Client', image: '/images/user-7-115x115.jpg', quote: 'Amazing shopping experience! Beautiful collection and knowledgeable staff. Their 100% HUID compliance and PSI certification ensure purity.' },
        { id: 4, name: 'Rajesh Kumar', role: 'Client', image: '', quote: "The antique collection is simply stunning. I found exactly what I was looking for my daughter's wedding." },
        { id: 5, name: 'Anjali Desai', role: 'Client', image: '', quote: 'Trustworthy and reliable. I have been buying from them for years and have never been disappointed.' },
    ];

    return (
        <section className="py-16 md:py-24 bg-white relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-gold-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 translate-x-1/2 translate-y-1/2"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-10 md:mb-16">
                    <span className="text-gold-600 font-medium tracking-widest uppercase text-sm">Testimonials</span>
                    <h2 className="text-3xl md:text-4xl font-serif text-maroon-950 mt-2">What People Say</h2>
                    <div className="w-24 h-1 bg-gold-500 mx-auto mt-4"></div>
                </div>

                <Swiper
                    modules={[Autoplay, Pagination]}
                    spaceBetween={16}
                    slidesPerView={1}
                    loop={true}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                    }}
                    pagination={{ clickable: true }}
                    breakpoints={{
                        480: {
                            spaceBetween: 20,
                        },
                        640: {
                            slidesPerView: 1,
                            spaceBetween: 24,
                        },
                        768: {
                            slidesPerView: 2,
                            spaceBetween: 24,
                        },
                        1024: {
                            slidesPerView: 3,
                            spaceBetween: 30,
                        },
                    }}
                    className="pb-12"
                >
                    {testimonials.map((item) => (
                        <SwiperSlide key={item.id} className="h-full">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="bg-white p-6 sm:p-8 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-gray-100 text-center relative hover:-translate-y-2 transition-transform duration-300 h-full flex flex-col justify-between"
                            >

                                <div className="text-gold-500 mb-4 sm:mb-6 flex justify-center">
                                    <span className="text-3xl sm:text-4xl font-serif leading-none">"</span>
                                </div>
                                <p className="text-gray-600 italic mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                                    {item.quote}
                                </p>
                                <div>
                                    <h4 className="font-serif font-bold text-maroon-950 text-base sm:text-lg">{item.name}</h4>
                                    <span className="text-gold-600 text-xs sm:text-sm uppercase tracking-wider">{item.role}</span>
                                </div>
                            </motion.div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

// Features
export const Features = () => {
    const features = [
        { icon: <Gem className="w-6 h-6 sm:w-8 sm:h-8" />, title: "Certified Diamonds", desc: "Quality and authenticity certified by leading institutes." },
        { icon: <RefreshCw className="w-6 h-6 sm:w-8 sm:h-8" />, title: "Easy Return", desc: "Hassle-free returns with our convenient policy." },
        { icon: <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8" />, title: "Complete Transparency", desc: "We maintain complete transparency in pricing." },
        { icon: <Award className="w-6 h-6 sm:w-8 sm:h-8" />, title: "Lifetime Maintenance", desc: "Assured lifetime maintenance for all jewelry." },
        { icon: <RefreshCw className="w-6 h-6 sm:w-8 sm:h-8" />, title: "Lifetime Buy Back", desc: "Benefit from our lifetime buy-back policy." },
        { icon: <Award className="w-6 h-6 sm:w-8 sm:h-8" />, title: "100% HUID Compliant", desc: "Ensuring purity and traceability of gold." },
    ];

    return (
        <section className="py-12 md:py-20 bg-maroon-950 text-white border-t border-gold-900/30 overflow-hidden">
            <div className="w-full relative group">
                {/* Fade gradient edges for smooth transition */}
                <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-maroon-950 to-transparent z-10 pointer-events-none"></div>
                <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-maroon-950 to-transparent z-10 pointer-events-none"></div>

                {/* Animated Marquee Track — pauses on hover for accessibility */}
                <div className="flex w-[200%] animate-marquee group-hover:[animation-play-state:paused]">
                    {/* Double the array for seamless infinite scrolling */}
                    {[...features, ...features].map((feature, index) => (
                        <div
                            key={index}
                            className="flex-shrink-0 w-52 sm:w-64 md:w-80 px-4 sm:px-6 text-center"
                        >
                            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 bg-maroon-900 rounded-full flex items-center justify-center text-gold-500 hover:bg-gold-500 hover:text-white transition-all duration-300 shadow-lg px-2">
                                {feature.icon}
                            </div>
                            <h4 className="font-serif font-bold text-sm sm:text-lg mb-2 sm:mb-3 hover:text-gold-400 transition-colors">{feature.title}</h4>
                            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// Latest from Blog — new section for homepage
export const BlogPreview = () => {
    const featuredPosts = getFeaturedPosts(3);

    return (
        <section className="py-12 md:py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-10 md:mb-16">
                    <span className="text-gold-600 font-medium tracking-widest uppercase text-sm">Knowledge</span>
                    <h2 className="text-3xl md:text-4xl font-serif text-maroon-950 mt-2">Latest from Our Blog</h2>
                    <div className="w-24 h-1 bg-gold-500 mx-auto mt-4"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8">
                    {featuredPosts.map((post, index) => (
                        <motion.article
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="blog-card bg-white"
                        >
                            <Link to={`/blog/${post.slug}`} className="block">
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
                                <div className="p-4 sm:p-5">
                                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {post.readTime}
                                        </span>
                                    </div>
                                    <h3 className="text-base sm:text-lg font-serif font-bold text-maroon-950 mb-2 group-hover:text-gold-600 transition-colors line-clamp-2">
                                        {post.title}
                                    </h3>
                                    <p className="text-gray-500 text-xs sm:text-sm leading-relaxed line-clamp-2">
                                        {post.excerpt}
                                    </p>
                                </div>
                            </Link>
                        </motion.article>
                    ))}
                </div>

                <div className="text-center mt-8 md:mt-12">
                    <Link
                        to="/blog"
                        className="inline-flex items-center gap-2 text-gold-600 hover:text-gold-700 font-medium text-sm uppercase tracking-widest hover:gap-3 transition-all"
                    >
                        View All Articles
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
};
