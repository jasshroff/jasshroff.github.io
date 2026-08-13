import { Link } from 'react-router-dom';
import { Facebook, Instagram, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { OptimizedImage } from './OptimizedImage';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const quickLinks = [
        { name: 'Home', path: '/' },
        { name: 'About Us', path: '/about-us' },
        { name: 'Catalog', path: '/catalog' },
        { name: 'Blog', path: '/blog' },
        { name: 'Careers', path: '/careers' },
        { name: 'Contact Us', path: '/contact-us' },
    ];

    return (
        <footer className="bg-maroon-950 text-white pt-12 md:pt-16 pb-8 border-t-4 border-gold-500">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12">
                    {/* Brand Info */}
                    <div className="space-y-4 sm:space-y-6">
                        <Link to="/" className="block">
                            <OptimizedImage src="/images/main/sgv.png" alt="Shree Gopaldas Vallabhdas Jewellers" className="h-20 sm:h-28 w-auto object-contain brightness-100 opacity-100 transform hover:scale-105 transition-transform" loading="lazy" />
                        </Link>
                        <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                            Welcome to Shree Gopaldas Vallabhdas Jewellers, where legacy meets luxury. With a rich heritage dating back to 1938, we craft exceptional 100% BIS Hallmarked gold, diamond, and antique jewellery in Burhanpur.
                        </p>
                        <div className="flex space-x-3">
                            <a href="https://www.facebook.com/shreegopaldasvallabhdas" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-9 h-9 rounded-full bg-maroon-900 flex items-center justify-center text-gold-400 hover:bg-gold-500 hover:text-white transition-all">
                                <Facebook className="w-4 h-4" />
                            </a>
                            <a href="https://www.instagram.com/shreegopaldasvallabhdas?igsh=MTRrcGhjazNibmp6dg==" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-9 h-9 rounded-full bg-maroon-900 flex items-center justify-center text-gold-400 hover:bg-gold-500 hover:text-white transition-all">
                                <Instagram className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg md:text-xl font-serif text-gold-400 mb-4 sm:mb-6">Quick Links</h3>
                        <ul className="space-y-2.5 sm:space-y-3">
                            {quickLinks.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        to={item.path}
                                        className="text-gray-400 hover:text-gold-400 transition-colors flex items-center text-sm"
                                    >
                                        <span className="w-1.5 h-1.5 bg-gold-500 rounded-full mr-2"></span>
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Collections */}
                    <div>
                        <h3 className="text-lg md:text-xl font-serif text-gold-400 mb-4 sm:mb-6">Our Collections</h3>
                        <ul className="space-y-2.5 sm:space-y-3">
                            {['Necklace Sets', 'Earrings', 'Rings', 'Bangles', 'Gold Chains', 'Antique Jewellery'].map((item) => (
                                <li key={item}>
                                    <Link to="/catalog" className="text-gray-400 hover:text-gold-400 transition-colors text-sm flex items-center">
                                        <span className="w-1.5 h-1.5 bg-gold-500/40 rounded-full mr-2"></span>
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg md:text-xl font-serif text-gold-400 mb-4 sm:mb-6">Contact Us</h3>
                        <ul className="space-y-3 sm:space-y-4 text-sm">
                            <li className="flex items-start">
                                <MapPin className="w-4 h-4 text-gold-500 mr-3 mt-1 flex-shrink-0" />
                                <span className="text-gray-400 text-xs sm:text-sm">
                                    17, Shreenath Sadan, Pandumal Chouraha, Tilak Marg Road, Burhanpur (M.P) - 450331
                                </span>
                            </li>
                            <li className="flex items-center">
                                <Phone className="w-4 h-4 text-gold-500 mr-3 flex-shrink-0" />
                                <a href="tel:+919179559000" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">
                                    +91 917-955-9000
                                </a>
                            </li>
                            <li className="flex items-center">
                                <Mail className="w-4 h-4 text-gold-500 mr-3 flex-shrink-0" />
                                <a href="mailto:sgvjewellers1938@gmail.com" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm break-all">
                                    sgvjewellers1938@gmail.com
                                </a>
                            </li>
                            <li className="flex items-center">
                                <Clock className="w-4 h-4 text-gold-500 mr-3 flex-shrink-0" />
                                <span className="text-gray-400 text-xs sm:text-sm">
                                    Mon - Sun: 10:00 AM - 9:00 PM
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Footer */}
                <div className="border-t border-maroon-900/80 mt-8 md:mt-12 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 gap-4">
                    <p>&copy; {currentYear} Shree Gopaldas Vallabhdas Jewellers. All Rights Reserved.</p>
                    <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                        <Link to="/about-us" className="hover:text-gold-400 transition-colors">About Legacy</Link>
                        <Link to="/blog" className="hover:text-gold-400 transition-colors">Jewellery Guide</Link>
                        <Link to="/login" className="hover:text-gold-400 transition-colors">Staff Login</Link>
                        <Link to="/admin/hr" className="hover:text-gold-400 transition-colors">HR Portal</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
