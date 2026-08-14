import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { OptimizedImage } from '../components/OptimizedImage';
import { Menu, X, Phone, MapPin, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const location = useLocation();
    const { currentUser, logout } = useAuth();

    // Hysteresis scroll listener with requestAnimationFrame to eliminate all layout jitter
    useEffect(() => {
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrollY = window.scrollY;
                    if (scrollY > 50) {
                        setScrolled(true);
                    } else if (scrollY < 15) {
                        setScrolled(false);
                    }
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Close menus on route change
    const [prevPath, setPrevPath] = useState(location.pathname);
    if (prevPath !== location.pathname) {
        setPrevPath(location.pathname);
        setIsOpen(false);
        setProfileOpen(false);
    }

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'About Us', path: '/about-us' },
        { name: 'Catalog', path: '/catalog' },
        { name: 'Blog', path: '/blog' },
        { name: 'Careers', path: '/careers' },
        { name: 'Contact Us', path: '/contact-us' },
    ];

    return (
        <header className="w-full">
            {/* Top Bar - Contact Info */}
            <div className="bg-maroon-950 text-gold-200 py-2 px-4 hidden md:block text-sm border-b border-gold-900/20">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center space-x-6">
                        <a href="tel:+919179559000" className="flex items-center hover:text-white transition-colors">
                            <Phone className="w-4 h-4 mr-2 text-gold-400" />
                            +91 917-955-9000
                        </a>
                        <div className="flex items-center text-gray-300">
                            <MapPin className="w-4 h-4 mr-2 text-gold-400" />
                            Burhanpur, M.P.
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-xs bg-gold-500/20 text-gold-300 border border-gold-500/30 px-2.5 py-0.5 rounded-full font-serif">BIS 100% Hallmarked</span>
                        <span className="font-serif italic text-gold-300">Est. 1938</span>
                    </div>
                </div>
            </div>

            {/* Main Navbar - Fixed height to guarantee zero layout shift / shaking */}
            <nav
                className={`sticky top-0 z-50 w-full transition-all duration-300 ${
                    scrolled 
                        ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-gray-100' 
                        : 'bg-white border-b border-gray-50'
                }`}
            >
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center h-20 md:h-24">
                        {/* Logo */}
                        <Link to="/" className="flex items-center group py-1">
                            <OptimizedImage
                                src="/images/main/sgv.png"
                                alt="Shree Gopaldas Vallabhdas Jewellers"
                                className="h-14 md:h-20 w-auto object-contain transition-transform group-hover:scale-105"
                            />
                            <div className="ml-2 md:ml-3">
                                <h1 className="text-sm sm:text-base lg:text-xl font-serif font-bold text-maroon-950 tracking-wide group-hover:text-gold-600 transition-colors uppercase leading-tight">
                                    SGV Jewellers
                                </h1>
                                <p className="text-[10px] sm:text-xs text-gold-600 tracking-widest uppercase hidden sm:block">Shree Gopaldas Vallabhdas</p>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center space-x-7 xl:space-x-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`relative font-medium text-xs xl:text-sm uppercase tracking-wider transition-colors hover:text-gold-600 py-1 ${
                                        location.pathname === link.path || (link.path === '/blog' && location.pathname.startsWith('/blog')) 
                                            ? 'text-gold-600 font-bold' 
                                            : 'text-maroon-900'
                                    }`}
                                >
                                    {link.name}
                                    {(location.pathname === link.path || (link.path === '/blog' && location.pathname.startsWith('/blog'))) && (
                                        <motion.div
                                            layoutId="underline"
                                            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gold-500"
                                        />
                                    )}
                                </Link>
                            ))}
                            <Link
                                to="/catalog"
                                className="bg-gold-500 hover:bg-gold-600 text-white px-5 xl:px-6 py-2.5 rounded-none font-medium text-xs xl:text-sm transition-all transform hover:-translate-y-0.5 shadow-md hover:shadow-lg uppercase tracking-wider whitespace-nowrap"
                            >
                                Shop Now
                            </Link>

                            {/* User Profile Dropdown */}
                            {currentUser && (
                                <div className="relative">
                                    <button
                                        onClick={() => setProfileOpen(!profileOpen)}
                                        aria-label="User menu"
                                        className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gold-50 text-maroon-900 hover:text-gold-600 transition-colors focus:outline-none border border-gray-200"
                                    >
                                        {currentUser.photoURL ? (
                                            <OptimizedImage src={currentUser.photoURL} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
                                        ) : (
                                            <User className="w-5 h-5" />
                                        )}
                                    </button>
                                    
                                    <AnimatePresence>
                                        {profileOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 shadow-xl rounded-lg overflow-hidden py-2"
                                            >
                                                <div className="px-4 py-3 border-b border-gray-50 mb-2">
                                                    <p className="text-sm font-medium text-gray-900 truncate">{currentUser.displayName || 'User'}</p>
                                                    <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                                                </div>
                                                <Link 
                                                    to="/profile" 
                                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gold-50 hover:text-gold-700 transition-colors"
                                                >
                                                    <LayoutDashboard className="w-4 h-4 mr-2" />
                                                    My Profile & Apps
                                                </Link>
                                                <button 
                                                    onClick={logout}
                                                    className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                                >
                                                    <LogOut className="w-4 h-4 mr-2" />
                                                    Sign Out
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            aria-label={isOpen ? "Close menu" : "Open menu"}
                            aria-expanded={isOpen}
                            className="lg:hidden text-maroon-900 hover:text-gold-600 focus:outline-none p-2"
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="lg:hidden overflow-hidden bg-white border-t border-gray-100 shadow-xl max-h-[calc(100vh-80px)] overflow-y-auto"
                        >
                            <div className="container mx-auto px-4 py-6 flex flex-col space-y-3">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        className={`block py-2.5 px-3 rounded text-base font-medium transition-colors ${
                                            location.pathname === link.path || (link.path === '/blog' && location.pathname.startsWith('/blog')) 
                                                ? 'text-gold-600 bg-gold-50 font-bold' 
                                                : 'text-maroon-950 hover:bg-gray-50'
                                        }`}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                                <Link
                                    to="/catalog"
                                    className="block w-full text-center bg-gold-500 hover:bg-gold-600 text-white py-3 mt-2 font-medium uppercase tracking-wider shadow-md"
                                >
                                    Shop Now
                                </Link>
                                {currentUser && (
                                    <div className="pt-4 mt-2 border-t border-gray-100 flex flex-col space-y-2">
                                        <div className="px-3 mb-2">
                                            <p className="text-sm font-medium text-gray-900">{currentUser.displayName || 'User'}</p>
                                            <p className="text-xs text-gray-500">{currentUser.email}</p>
                                        </div>
                                        <Link
                                            to="/profile"
                                            className="flex items-center py-2 px-3 text-base font-medium text-maroon-900 hover:text-gold-600 transition-colors"
                                        >
                                            <LayoutDashboard className="w-5 h-5 mr-3 text-gold-500" />
                                            My Profile & Apps
                                        </Link>
                                        <button
                                            onClick={logout}
                                            className="flex items-center py-2 px-3 text-base font-medium text-red-600 hover:text-red-700 transition-colors text-left"
                                        >
                                            <LogOut className="w-5 h-5 mr-3" />
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </header>
    );
};

export default Navbar;
