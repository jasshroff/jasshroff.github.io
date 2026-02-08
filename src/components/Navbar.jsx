import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsOpen(false);
    }, [location]);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'About Us', path: '/about' },
        { name: 'Catalog', path: '/catalog' },
        { name: 'Contact Us', path: '/contact' },
    ];

    return (
        <>
            {/* Top Bar - Contact Info (Hidden on small screens) */}
            <div className="bg-dark-900 text-gold-200 py-2 px-4 hidden md:block text-sm border-b border-gold-900/20">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center space-x-6">
                        <a href="tel:+919179559000" className="flex items-center hover:text-white transition-colors">
                            <Phone className="w-4 h-4 mr-2" />
                            +91 917-955-9000
                        </a>
                        <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            Burhanpur, M.P.
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        {/* Social placeholders or other utility links could go here */}
                        <span className="font-serif italic">Est. 1938</span>
                    </div>
                </div>
            </div>

            {/* Main Navbar */}
            <nav
                className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg py-2' : 'bg-white py-4'
                    }`}
            >
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center">
                        {/* Logo */}
                        <Link to="/" className="flex items-center group">
                            <img
                                src="/images/main/sgv.png"
                                alt="Shree Gopaldas Vallabhdas Jewellers"
                                className={`transition-all duration-300 ${scrolled ? 'h-10' : 'h-14'}`}
                            />
                            <div className="ml-3 hidden lg:block">
                                <h1 className="text-lg lg:text-xl font-serif font-bold text-dark-900 tracking-wide group-hover:text-gold-600 transition-colors uppercase">
                                    Shree Gopaldas Vallabhdas Jewellers
                                </h1>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`relative font-medium text-sm uppercase tracking-wider transition-colors hover:text-gold-600 ${location.pathname === link.path ? 'text-gold-600' : 'text-dark-800'
                                        }`}
                                >
                                    {link.name}
                                    {location.pathname === link.path && (
                                        <motion.div
                                            layoutId="underline"
                                            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gold-500"
                                        />
                                    )}
                                </Link>
                            ))}
                            <Link
                                to="/catalog"
                                className="bg-gold-500 hover:bg-gold-600 text-white px-6 py-2 rounded-none font-medium text-sm transition-all transform hover:-translate-y-0.5 shadow-md hover:shadow-lg uppercase tracking-wider"
                            >
                                Shop Now
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden text-dark-800 hover:text-gold-600 focus:outline-none"
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div >

                {/* Mobile Menu Dropdown */}
                < AnimatePresence >
                    {isOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="md:hidden overflow-hidden bg-white border-t border-gray-100"
                        >
                            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        className={`block py-2 text-base font-medium border-b border-gray-100 ${location.pathname === link.path ? 'text-gold-600' : 'text-dark-800'
                                            }`}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                                <Link
                                    to="/catalog"
                                    className="block w-full text-center bg-gold-500 hover:bg-gold-600 text-white py-3 mt-4 font-medium uppercase tracking-wider"
                                >
                                    Shop Now
                                </Link>
                            </div>
                        </motion.div>
                    )
                    }
                </AnimatePresence >
            </nav >
        </>
    );
};

export default Navbar;
