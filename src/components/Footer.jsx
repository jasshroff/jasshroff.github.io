import { Link } from 'react-router-dom';
import { Facebook, Instagram, Phone, Mail, MapPin, Clock } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-dark-900 text-white pt-16 pb-8 border-t-4 border-gold-500">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Info */}
                    <div className="space-y-6">
                        <Link to="/" className="block">
                            <img src="/images/main/sgv.png" alt="Shree Gopaldas Vallabhdas Jewellers" className="h-16 brightness-100 opacity-100" />
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Crafting timeless elegance since 1938. Shree Gopaldas Vallabhdas Jewellers offers an exquisite collection of certified gold, diamond, and antique jewelry.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-dark-800 flex items-center justify-center hover:bg-gold-500 hover:text-white transition-all">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="https://www.instagram.com/shreegopaldasvallabhdas?igsh=MTRrcGhjazNibmp6dg==" className="w-10 h-10 rounded-full bg-dark-800 flex items-center justify-center hover:bg-gold-500 hover:text-white transition-all">
                                <Instagram className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-xl font-serif text-gold-400 mb-6">Quick Links</h3>
                        <ul className="space-y-3">
                            {['Home', 'About Us', 'Catalog', 'Contact Us'].map((item) => (
                                <li key={item}>
                                    <Link
                                        to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`}
                                        className="text-gray-400 hover:text-gold-400 transition-colors flex items-center"
                                    >
                                        <span className="w-1.5 h-1.5 bg-gold-500 rounded-full mr-2"></span>
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Collections */}
                    <div>
                        <h3 className="text-xl font-serif text-gold-400 mb-6">Our Collections</h3>
                        <ul className="space-y-3">
                            {['Necklace Sets', 'Earrings', 'Rings', 'Bangles', 'Gold Chains', 'Antique Jewellery'].map((item) => (
                                <li key={item}>
                                    <Link to="/catalog" className="text-gray-400 hover:text-gold-400 transition-colors">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-xl font-serif text-gold-400 mb-6">Contact Us</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start">
                                <MapPin className="w-5 h-5 text-gold-500 mr-3 mt-1 flex-shrink-0" />
                                <span className="text-gray-400 text-sm">
                                    17, Shreenath Sadan, Pandumal Chouraha, Tilak Marg Road, Burhanpur (M.P) - 450331
                                </span>
                            </li>
                            <li className="flex items-center">
                                <Phone className="w-5 h-5 text-gold-500 mr-3 flex-shrink-0" />
                                <a href="tel:+919179559000" className="text-gray-400 hover:text-white transition-colors">
                                    +91 917-955-9000
                                </a>
                            </li>
                            <li className="flex items-center">
                                <Mail className="w-5 h-5 text-gold-500 mr-3 flex-shrink-0" />
                                <a href="mailto:sgvjewellers1938@gmail.com" className="text-gray-400 hover:text-white transition-colors">
                                    sgvjewellers1938@gmail.com
                                </a>
                            </li>
                            <li className="flex items-center">
                                <Clock className="w-5 h-5 text-gold-500 mr-3 flex-shrink-0" />
                                <span className="text-gray-400 text-sm">
                                    Mon - Sun: 10:00 AM - 9:00 PM
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Footer */}
                <div className="border-t border-gray-100 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <p>&copy; {currentYear} Shree Gopaldas Vallabhdas Jewellers. All Rights Reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-gold-600 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-gold-600 transition-colors">Terms of Service</a>
                        <a href="/login" className="hover:text-gold-600 transition-colors">Staff Login</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
