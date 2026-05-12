import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
    Briefcase, MapPin, Clock, Users, Star, ChevronRight,
    Award, Heart, TrendingUp, Calendar, Gem, ArrowRight
} from 'lucide-react';

const jobOpenings = [
    {
        id: 'sales-marketing',
        title: 'Sales + Marketing Executive',
        type: 'Full-Time',
        experience: '0-3 Years',
        level: 'Fresher / Experienced',
        location: 'Burhanpur, M.P.',
        description: 'Drive sales growth and manage marketing campaigns for our premium jewellery collections. Engage with customers and build lasting relationships.',
        responsibilities: [
            'Handle walk-in customers and provide personalized jewellery consultation',
            'Manage digital marketing campaigns across social media platforms',
            'Organize and participate in jewellery exhibitions and events',
            'Maintain customer relationships and follow up on leads'
        ]
    },
    {
        id: 'marketing-accounting',
        title: 'Marketing + Accounting Executive',
        type: 'Full-Time',
        experience: '1-4 Years',
        level: 'Fresher / Experienced',
        location: 'Burhanpur, M.P.',
        description: 'Combine marketing expertise with accounting skills to manage brand promotions and financial records for our jewellery business.',
        responsibilities: [
            'Plan and execute marketing strategies for brand visibility',
            'Maintain accurate financial records and accounting documentation',
            'Coordinate with vendors and suppliers for marketing materials',
            'Generate monthly sales and marketing performance reports'
        ]
    },
    {
        id: 'sales-accounting',
        title: 'Sales + Accounting Executive',
        type: 'Full-Time',
        experience: '1-5 Years',
        level: 'Experienced',
        location: 'Burhanpur, M.P.',
        description: 'Manage retail sales operations along with accurate billing, invoicing, and financial record-keeping in our premium showroom.',
        responsibilities: [
            'Handle premium jewellery sales and customer billing',
            'Manage daily cash flow and accounting entries',
            'Coordinate inventory tracking with the management team',
            'Ensure compliance with GST and taxation requirements'
        ]
    }
];

const benefits = [
    { icon: TrendingUp, title: 'Growth Opportunities', desc: 'Clear career progression path in a growing organization' },
    { icon: Heart, title: 'Supportive Culture', desc: 'Work with a family-oriented team that values every member' },
    { icon: Award, title: 'Training & Development', desc: 'Learn the art of fine jewellery and retail excellence' },
    { icon: Star, title: 'Competitive Pay', desc: 'Industry-standard compensation with performance bonuses' },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const Careers = () => {
    const [expandedJob, setExpandedJob] = useState(null);

    return (
        <div className="bg-white">
            <Helmet>
                <title>Careers | Join SGV Jewellers Team | Jobs in Burhanpur</title>
                <meta name="description" content="Join Shree Gopaldas Vallabhdas Jewellers. Explore exciting career opportunities in sales, marketing, and accounting at Burhanpur's premium jewellery showroom." />
                <meta name="keywords" content="SGV Jewellers careers, jewellery jobs Burhanpur, sales executive jobs, marketing jobs Burhanpur, jewellery showroom jobs" />
                <link rel="canonical" href="https://sgvjewellers.in/careers" />
            </Helmet>

            {/* ═══════════════════ HERO BANNER ═══════════════════ */}
            <section className="relative bg-maroon-950 overflow-hidden">
                {/* Decorative gold pattern overlay */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-full h-full" style={{
                        backgroundImage: `radial-gradient(circle at 20% 50%, rgba(212,170,30,0.3) 0%, transparent 50%),
                                          radial-gradient(circle at 80% 50%, rgba(139,69,69,0.3) 0%, transparent 50%)`
                    }}></div>
                </div>

                {/* Floating gold particles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-gold-400 rounded-full"
                            style={{
                                left: `${15 + i * 15}%`,
                                top: `${20 + (i % 3) * 25}%`,
                            }}
                            animate={{
                                y: [-10, 10, -10],
                                opacity: [0.3, 0.8, 0.3],
                            }}
                            transition={{
                                duration: 3 + i * 0.5,
                                repeat: Infinity,
                                delay: i * 0.4,
                            }}
                        />
                    ))}
                </div>

                <div className="relative z-10 container mx-auto px-4 py-24 md:py-32 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="flex items-center justify-center gap-2 mb-6">
                            <div className="h-px w-12 bg-gold-500"></div>
                            <Gem className="w-5 h-5 text-gold-400" />
                            <span className="text-gold-400 uppercase tracking-[0.25em] text-sm font-medium">Career Opportunities</span>
                            <Gem className="w-5 h-5 text-gold-400" />
                            <div className="h-px w-12 bg-gold-500"></div>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight">
                            Join Our <span className="text-gold-400">Team</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-4 font-serif italic">
                            Build Your Career with Shree Gopaldas Vallabhdas Jewellers
                        </p>
                        <p className="text-gray-400 max-w-2xl mx-auto mb-10">
                            Since 1938, we have been crafting timeless elegance. Now, we invite passionate individuals to become part of our legacy.
                        </p>
                        <a
                            href="#openings"
                            className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-white px-8 py-4 font-medium uppercase tracking-wider transition-all transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                        >
                            View Open Positions
                            <ChevronRight className="w-5 h-5" />
                        </a>
                    </motion.div>
                </div>

                {/* Bottom gold border */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent"></div>
            </section>

            {/* ═══════════════════ APPLY THROUGH WEBSITE BANNER ═══════════════════ */}
            <section className="bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 border-b border-gold-200">
                <div className="container mx-auto px-4 py-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="flex flex-col md:flex-row items-center justify-between gap-4"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gold-500 rounded-full flex items-center justify-center animate-pulse">
                                <Briefcase className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="font-serif font-bold text-maroon-950 text-lg">Apply Through Our Website</p>
                                <p className="text-gray-600 text-sm">Submit your application online — fast, easy, and secure</p>
                            </div>
                        </div>
                        <a
                            href="#openings"
                            className="flex items-center gap-2 bg-maroon-950 text-gold-400 hover:bg-maroon-900 px-6 py-3 font-medium uppercase tracking-wider text-sm transition-all"
                        >
                            Apply Now <ArrowRight className="w-4 h-4" />
                        </a>
                    </motion.div>
                </div>
            </section>

            {/* ═══════════════════ WHY JOIN US ═══════════════════ */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <span className="text-gold-500 uppercase tracking-[0.2em] text-sm font-medium">Why Choose Us</span>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-maroon-950 mt-3 mb-4">
                            Why Work With SGV Jewellers?
                        </h2>
                        <div className="w-20 h-0.5 bg-gold-500 mx-auto mb-6"></div>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Be part of a heritage brand that values tradition, craftsmanship, and the growth of every team member.
                        </p>
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                    >
                        {benefits.map((benefit, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className="text-center p-8 border border-gray-100 hover:border-gold-300 transition-all duration-300 group hover:shadow-lg"
                            >
                                <div className="w-16 h-16 bg-gold-50 text-gold-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-gold-500 group-hover:text-white transition-all duration-300">
                                    <benefit.icon className="w-7 h-7" />
                                </div>
                                <h3 className="font-serif font-bold text-maroon-950 text-lg mb-3">{benefit.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{benefit.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ═══════════════════ WALK-IN INTERVIEW ANNOUNCEMENT ═══════════════════ */}
            <section className="py-16 bg-gradient-to-br from-maroon-950 via-maroon-900 to-maroon-950 relative overflow-hidden">
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(212,170,30,0.1) 35px, rgba(212,170,30,0.1) 70px)`
                    }}></div>
                </div>
                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-3xl mx-auto text-center"
                    >
                        <div className="inline-flex items-center gap-2 bg-gold-500/20 text-gold-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
                            <Calendar className="w-4 h-4" />
                            Walk-In Interview
                        </div>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
                            Walk-In Interviews <span className="text-gold-400">Welcome</span>
                        </h2>
                        <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                            We conduct regular walk-in interviews at our showroom. Bring your resume and meet our team in person.
                            Walk-ins are accepted <strong className="text-gold-400">Monday to Saturday, 11:00 AM – 5:00 PM</strong>.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-5 rounded-lg">
                                <MapPin className="w-6 h-6 text-gold-400 mx-auto mb-3" />
                                <p className="text-white font-medium text-sm">SGV Jewellers Showroom</p>
                                <p className="text-gray-400 text-xs mt-1">Pandumal Chouraha, Burhanpur</p>
                            </div>
                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-5 rounded-lg">
                                <Clock className="w-6 h-6 text-gold-400 mx-auto mb-3" />
                                <p className="text-white font-medium text-sm">Mon – Sat</p>
                                <p className="text-gray-400 text-xs mt-1">11:00 AM – 5:00 PM</p>
                            </div>
                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-5 rounded-lg">
                                <Users className="w-6 h-6 text-gold-400 mx-auto mb-3" />
                                <p className="text-white font-medium text-sm">Carry Your Resume</p>
                                <p className="text-gray-400 text-xs mt-1">Original documents required</p>
                            </div>
                        </div>
                        <p className="text-gray-500 text-sm">
                            Can't visit in person? <a href="#openings" className="text-gold-400 hover:text-gold-300 underline">Apply online</a> using our application form below.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ═══════════════════ CURRENT OPENINGS ═══════════════════ */}
            <section id="openings" className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <span className="text-gold-500 uppercase tracking-[0.2em] text-sm font-medium">Open Positions</span>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-maroon-950 mt-3 mb-4">
                            Current Openings
                        </h2>
                        <div className="w-20 h-0.5 bg-gold-500 mx-auto mb-6"></div>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Discover roles that match your talent and passion. We're looking for dedicated individuals to join our growing team.
                        </p>
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="max-w-4xl mx-auto space-y-6"
                    >
                        {jobOpenings.map((job) => (
                            <motion.div
                                key={job.id}
                                variants={itemVariants}
                                className="bg-white border border-gray-100 hover:border-gold-300 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
                            >
                                <div className="p-6 md:p-8">
                                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-xl md:text-2xl font-serif font-bold text-maroon-950 mb-3">
                                                {job.title}
                                            </h3>
                                            <div className="flex flex-wrap gap-3 mb-4">
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold-50 text-gold-700 text-xs font-medium rounded-full border border-gold-200">
                                                    <Briefcase className="w-3.5 h-3.5" />
                                                    {job.type}
                                                </span>
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-50 text-gray-700 text-xs font-medium rounded-full border border-gray-200">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {job.experience}
                                                </span>
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-50 text-gray-700 text-xs font-medium rounded-full border border-gray-200">
                                                    <Users className="w-3.5 h-3.5" />
                                                    {job.level}
                                                </span>
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-50 text-gray-700 text-xs font-medium rounded-full border border-gray-200">
                                                    <MapPin className="w-3.5 h-3.5" />
                                                    {job.location}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 text-sm leading-relaxed">{job.description}</p>
                                        </div>
                                        <Link
                                            to={`/careers/apply?role=${encodeURIComponent(job.title)}`}
                                            className="flex-shrink-0 inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-white px-6 py-3 font-medium uppercase tracking-wider text-sm transition-all transform hover:-translate-y-0.5 shadow-md hover:shadow-lg"
                                        >
                                            Apply Now
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>

                                    {/* Expandable responsibilities */}
                                    <button
                                        onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                                        className="text-gold-600 hover:text-gold-700 text-sm font-medium flex items-center gap-1 mt-2"
                                    >
                                        {expandedJob === job.id ? 'Hide' : 'View'} Responsibilities
                                        <ChevronRight className={`w-4 h-4 transition-transform ${expandedJob === job.id ? 'rotate-90' : ''}`} />
                                    </button>

                                    {expandedJob === job.id && (
                                        <motion.ul
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="mt-4 space-y-2 pl-4 border-l-2 border-gold-300"
                                        >
                                            {job.responsibilities.map((resp, idx) => (
                                                <li key={idx} className="text-gray-600 text-sm flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 bg-gold-500 rounded-full mt-2 flex-shrink-0"></span>
                                                    {resp}
                                                </li>
                                            ))}
                                        </motion.ul>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ═══════════════════ CTA SECTION ═══════════════════ */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-maroon-950 mb-4">
                            Don't See a Perfect Fit?
                        </h2>
                        <p className="text-gray-600 max-w-xl mx-auto mb-8">
                            We're always looking for talented individuals. Send us your application and we'll keep your resume on file for future openings.
                        </p>
                        <Link
                            to="/careers/apply"
                            className="inline-flex items-center gap-2 bg-maroon-950 hover:bg-maroon-900 text-gold-400 px-8 py-4 font-medium uppercase tracking-wider text-sm transition-all transform hover:-translate-y-0.5 shadow-lg"
                        >
                            Submit General Application
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Careers;
