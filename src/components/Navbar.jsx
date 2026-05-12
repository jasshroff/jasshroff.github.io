import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, MapPin, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const location = useLocation();
    const { currentUser, logout } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close menus on route change
    useEffect(() => {
        setIsOpen(false);
        setProfileOpen(false);
    }, [location]);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'About Us', path: '/about-us' },
        { name: 'Catalog', path: '/catalog' },
        { name: 'Careers', path: '/careers' },
        { name: 'Contact Us', path: '/contact-us' },
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
                                className={`transition-all duration-300 object-contain ${scrolled ? 'h-16 scale-110' : 'h-28 scale-110'}`}
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

                            {/* User Profile Dropdown */}
                            {currentUser && (
                                <div className="relative">
                                    <button
                                        onClick={() => setProfileOpen(!profileOpen)}
                                        className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gold-50 text-dark-800 hover:text-gold-600 transition-colors focus:outline-none border border-gray-200"
                                    >
                                        {currentUser.photoURL ? (
                                            <img src={currentUser.photoURL} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
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
                                {currentUser && (
                                    <div className="pt-4 mt-2 border-t border-gray-100 flex flex-col space-y-2">
                                        <div className="px-2 mb-2">
                                            <p className="text-sm font-medium text-gray-900">{currentUser.displayName || 'User'}</p>
                                            <p className="text-xs text-gray-500">{currentUser.email}</p>
                                        </div>
                                        <Link
                                            to="/profile"
                                            className="flex items-center py-2 px-2 text-base font-medium text-dark-800 hover:text-gold-600 transition-colors"
                                        >
                                            <LayoutDashboard className="w-5 h-5 mr-3 text-gold-500" />
                                            My Profile & Apps
                                        </Link>
                                        <button
                                            onClick={logout}
                                            className="flex items-center py-2 px-2 text-base font-medium text-red-600 hover:text-red-700 transition-colors text-left"
                                        >
                                            <LogOut className="w-5 h-5 mr-3" />
                                            Sign Out
                                        </button>
                                    </div>
                                )}
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
