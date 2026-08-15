import { motion } from 'framer-motion';
import { OptimizedImage } from '../components/OptimizedImage';
import { Helmet } from 'react-helmet-async';
import { Award, ShieldCheck, HeartHandshake, Sparkles } from 'lucide-react';

const About = () => {
    const team = [
        { name: 'Shree Gopaldas Vallabhdas Shroff', role: 'Founder', image: '/images/team-1-270x236.jpg', desc: 'The visionary founder who established the hallmark of purity in 1938.' },
        { name: 'Shree Damodardas Gopaldas Shroff', role: 'Proprietor', image: '/public/images/team-2-270x236.jpg', desc: 'Pioneered the retail expansion and earned Burhanpur\'s trust over 5 decades.' },
        { name: 'Rakesh Damodardas Shroff', role: 'Gold Department', image: '/images/team-3-270x236.jpg', desc: 'Expert in 22K hallmarked gold curation and traditional craftsmanship.' },
        { name: 'Hitesh Damodardas Shroff', role: 'Silver Department', image: '/images/team-4-270x236.png', desc: 'Specialist in 925 sterling silver and contemporary bridal ornaments.' },
    ];

    const stats = [
        { value: '1938', label: 'Year Established' },
        { value: '85+', label: 'Years of Trust' },
        { value: '100%', label: 'BIS Hallmarked' },
        { value: '50k+', label: 'Happy Families' },
    ];

    return (
        <div className="animate-fade-in bg-white">
            <Helmet>
                <title>Our Heritage - 85+ Years of Trust | SGV Jewellers Burhanpur</title>
                <meta name="description" content="Established in 1938, Shree Gopaldas Vallabhdas Jewellers is Burhanpur's first and most trusted jewellery legacy. Learn about our journey of quality, craftsmanship, and the trust of generations." />
                <meta name="keywords" content="Legacy jewellers Burhanpur, heritage jewellery store, shroff family burhanpur, oldest jewellery shop burhanpur, trusted goldsmith burhanpur" />
            </Helmet>

            {/* Hero Header */}
            <div className="relative bg-maroon-950 text-white py-20 md:py-28 text-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/optimized/craftsmanship-desktop.jpg')] bg-cover bg-center opacity-30"></div>
                <div className="relative z-10 container mx-auto px-4">
                    <motion.span
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-gold-400 font-medium tracking-widest uppercase text-xs md:text-sm block mb-3"
                    >
                        Established 1938
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold mb-4"
                    >
                        Our Heritage & Story
                    </motion.h1>
                    <div className="w-24 h-1 bg-gold-500 mx-auto"></div>
                </div>
            </div>

            {/* Stats Bar */}
            <section className="bg-maroon-900 text-white py-8 border-b border-gold-900/30">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="p-2"
                            >
                                <div className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-gold-400 mb-1">{stat.value}</div>
                                <div className="text-xs sm:text-sm text-gray-300 uppercase tracking-wider">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Legacy Section */}
            <section className="py-12 md:py-20 container mx-auto px-4">
                <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="w-full md:w-1/2"
                    >
                        <OptimizedImage src="/images/about-1-835x418.jpg" alt="Legacy of Shree Gopaldas Vallabhdas Jewellers Burhanpur" className="rounded-lg shadow-xl w-full object-cover aspect-[16/10]" loading="lazy" />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="w-full md:w-1/2"
                    >
                        <span className="text-gold-600 font-medium tracking-widest uppercase text-xs sm:text-sm">Since 1938</span>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-maroon-950 mt-2 mb-4 md:mb-6">A Legacy of Trust and Excellence</h2>
                        <div className="prose text-gray-600 leading-relaxed space-y-4 text-sm sm:text-base">
                            <p>
                                Shree Gopaldas Vallabhdas Jewellers was founded in 1938 by the visionary Gopaldas Ji Shroff.
                                Initially focusing on trading raw gold and silver, we ventured into retail in 1985, offering the finest quality jewellery.
                            </p>
                            <p>
                                We take pride in being Burhanpur's first jewellery showroom. Our journey has been built on a foundation of trust, quality, and
                                uncompromising standards, as evidenced by our 100% BIS Certified Hallmarked products with HUID verification.
                            </p>
                            <p>
                                Today, under the guidance of Shri Damodardas Ji and his sons Rakesh and Hitesh Shroff, we continue to uphold
                                the values and traditions that have defined us for generations.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Values Cards */}
            <section className="py-12 md:py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-10 md:mb-16">
                        <span className="text-gold-600 font-medium tracking-widest uppercase text-xs sm:text-sm">Our Pillars</span>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-maroon-950 mt-1">Our Vision & Values</h2>
                        <div className="w-20 h-1 bg-gold-500 mx-auto mt-3"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="bg-white p-6 sm:p-8 shadow-md hover:shadow-xl border-t-4 border-gold-500 hover:-translate-y-1 transition-all"
                        >
                            <div className="w-12 h-12 bg-gold-100 rounded-full flex items-center justify-center text-gold-600 mb-4">
                                <Award className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg sm:text-xl font-serif font-bold mb-3 text-maroon-950">Uncompromising Quality</h3>
                            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                                Every piece meets our rigorous standards of excellence. 100% BIS Hallmarked with full transparency on gold weight, purity, and making charges.
                            </p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            viewport={{ once: true }}
                            className="bg-white p-6 sm:p-8 shadow-md hover:shadow-xl border-t-4 border-gold-500 hover:-translate-y-1 transition-all"
                        >
                            <div className="w-12 h-12 bg-gold-100 rounded-full flex items-center justify-center text-gold-600 mb-4">
                                <HeartHandshake className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg sm:text-xl font-serif font-bold mb-3 text-maroon-950">Customer Trust</h3>
                            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                                Building and maintaining trust is at the heart of our business. We offer transparent pricing, lifetime buyback, and dedicated after-sales care.
                            </p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="bg-white p-6 sm:p-8 shadow-md hover:shadow-xl border-t-4 border-gold-500 hover:-translate-y-1 transition-all"
                        >
                            <div className="w-12 h-12 bg-gold-100 rounded-full flex items-center justify-center text-gold-600 mb-4">
                                <Sparkles className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg sm:text-xl font-serif font-bold mb-3 text-maroon-950">Craftsmanship</h3>
                            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                                The legacy of SGV is defined by the artistry of our craftsmen. Each piece tells a story of heritage, detail, and perfection.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-12 md:py-20 container mx-auto px-4">
                <div className="text-center mb-10 md:mb-16">
                    <span className="text-gold-600 font-medium tracking-widest uppercase text-xs sm:text-sm">Leadership</span>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-maroon-950 mt-1">The Family Behind 85+ Years of Trust</h2>
                    <div className="w-24 h-1 bg-gold-500 mx-auto mt-4"></div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                    {team.map((member, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            className="group text-center bg-white p-3 sm:p-4 rounded shadow-sm hover:shadow-md transition-all"
                        >
                            <div className="mb-3 sm:mb-4 overflow-hidden rounded shadow-md aspect-[270/236] bg-gray-100 relative">
                                <OptimizedImage src={member.image} alt={`${member.name} - ${member.role} at SGV Jewellers Burhanpur`} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                            </div>
                            <h3 className="text-sm sm:text-base md:text-lg font-serif font-bold text-maroon-950 line-clamp-2">{member.name}</h3>
                            <p className="text-gold-600 text-xs sm:text-sm uppercase tracking-wider font-medium mt-1">{member.role}</p>
                            <p className="text-gray-500 text-xs mt-2 hidden sm:block line-clamp-2">{member.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default About;
