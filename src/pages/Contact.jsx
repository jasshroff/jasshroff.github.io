import { useRef, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import emailjs from '@emailjs/browser';

const Contact = () => {
    const form = useRef();
    const mapRef = useRef(null);
    const [status, setStatus] = useState(''); // 'SUCCESS' | 'FAILED' | ''
    const [errorMessage, setErrorMessage] = useState('');
    const [isSending, setIsSending] = useState(false);

    // Get product from URL if available
    const [searchParams] = useSearchParams();
    const product = searchParams.get('product');

    useEffect(() => {
        if (!mapRef.current || !window.google) return;

        const position = { lat: 21.3121, lng: 76.2233 };
        
        const map = new window.google.maps.Map(mapRef.current, {
            center: position,
            zoom: 17,
            disableDefaultUI: false,
            styles: [
                {
                    featureType: "poi",
                    elementType: "labels",
                    stylers: [{ visibility: "off" }]
                },
                {
                    featureType: "transit",
                    elementType: "labels",
                    stylers: [{ visibility: "off" }]
                },
                {
                    featureType: "poi.business",
                    stylers: [{ visibility: "off" }]
                }
            ]
        });

        new window.google.maps.Marker({
            position: position,
            map: map,
            title: 'Shree Gopaldas Vallabhdas Jewellers',
            animation: window.google.maps.Animation.DROP
        });
    }, []);

    const sendEmail = (e) => {
        e.preventDefault();
        setIsSending(true);
        setStatus('');

        const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
        const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
        const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

        if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
            console.error('EmailJS credentials missing');
            setStatus('FAILED');
            setErrorMessage('Email configuration is missing. Please add your EmailJS keys to GitHub Secrets.');
            setIsSending(false);
            return;
        }

        emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current, PUBLIC_KEY)
            .then((result) => {
                setStatus('SUCCESS');
                setIsSending(false);
                form.current.reset();
            }, (error) => {
                setStatus('FAILED');
                setErrorMessage(error.text || 'Failed to send email.');
                setIsSending(false);
            });
    };

    return (
        <div className="animate-fade-in bg-white">
            <Helmet>
                <title>Visit Us | SGV Jewellers Showroom in Burhanpur | Contact</title>
                <meta name="description" content="Visit our premium jewellery showroom at Pandumal Chouraha, Burhanpur. Contact us for custom designs, certified gold rate inquiries, and wedding collections." />
                <meta name="keywords" content="Jewellery showroom Burhanpur, SGV Jewellers address, contact jewellers Burhanpur, custom jewelry Burhanpur, Pandumal Chouraha gold shop" />
            </Helmet>

            {/* Hero Header */}
            <div className="relative bg-dark-900 text-white py-20 text-center">
                <div className="relative z-10 container mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Contact & Orders</h1>
                    <p className="text-gray-300 max-w-2xl mx-auto">
                        Ready to order? Reach out to us for inquiries, custom designs, or visit our showroom.
                    </p>
                </div>
            </div>

            <section className="py-20 container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-16">
                    {/* Contact Form */}
                    <div>
                        <h2 className="text-3xl font-serif text-dark-900 mb-8">
                            {product ? `Inquire about ${product}` : 'Send us a Message'}
                        </h2>
                        <form ref={form} onSubmit={sendEmail} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                                    <input type="text" name="user_name" className="w-full px-4 py-3 border border-gray-300 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-colors bg-gray-50" placeholder="John Doe" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Phone *</label>
                                    <input type="tel" name="user_phone" className="w-full px-4 py-3 border border-gray-300 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-colors bg-gray-50" placeholder="+91" required />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Your Email *</label>
                                <input type="email" name="user_email" className="w-full px-4 py-3 border border-gray-300 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-colors bg-gray-50" placeholder="john@example.com" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                <textarea
                                    name="message"
                                    rows="5"
                                    className="w-full px-4 py-3 border border-gray-300 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-colors bg-gray-50"
                                    placeholder="I am interested in..."
                                    defaultValue={product ? `I am interested in the ${product}. Please let me know the price and availability.` : ''}
                                ></textarea>
                            </div>
                            <button type="submit" disabled={isSending} className="px-8 py-3 bg-gold-500 text-white font-medium uppercase tracking-wider hover:bg-gold-600 transition-all shadow-lg flex items-center disabled:opacity-50 disabled:cursor-not-allowed">
                                {isSending ? 'Sending...' : 'Send Message'}
                                <Send className="w-4 h-4 ml-2" />
                            </button>
                            {status === 'SUCCESS' && <p className="text-green-600 font-medium">Message sent successfully! We will contact you soon.</p>}
                            {status === 'FAILED' && (
                                <div className="text-red-500 font-medium">
                                    <p>Failed to send message.</p>
                                    <p className="text-sm mt-1">Error: {errorMessage}</p>
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-10">
                        <h2 className="text-3xl font-serif text-dark-900 mb-8">Contact Information</h2>

                        <div className="flex items-start space-x-6">
                            <div className="w-12 h-12 bg-gold-100 text-gold-600 flex items-center justify-center rounded-full flex-shrink-0">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-dark-900 mb-2">Our Location</h4>
                                <p className="text-gray-600 leading-relaxed">
                                    17, Shreenath Sadan,<br />
                                    Pandumal Chouraha, Tilak Marg Road,<br />
                                    Burhanpur (M.P) - 450331
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-6">
                            <div className="w-12 h-12 bg-gold-100 text-gold-600 flex items-center justify-center rounded-full flex-shrink-0">
                                <Phone className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-dark-900 mb-2">Phone Number</h4>
                                <p className="text-gray-600">
                                    <a href="tel:+919179559000" className="hover:text-gold-600 transition-colors">+91 917-955-9000</a>
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-6">
                            <div className="w-12 h-12 bg-gold-100 text-gold-600 flex items-center justify-center rounded-full flex-shrink-0">
                                <Mail className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-dark-900 mb-2">Email Address</h4>
                                <p className="text-gray-600">
                                    <a href="mailto:sgvjewellers1938@gmail.com" className="hover:text-gold-600 transition-colors">sgvjewellers1938@gmail.com</a>
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-6">
                            <div className="w-12 h-12 bg-gold-100 text-gold-600 flex items-center justify-center rounded-full flex-shrink-0">
                                <Clock className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-dark-900 mb-2">Opening Hours</h4>
                                <p className="text-gray-600">
                                    Mon - Sun: 10:00 AM - 9:00 PM
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stylized Solo Map */}
            <section className="h-[500px] w-full bg-gray-100 border-t border-b border-gold-200 overflow-hidden">
                <div 
                    ref={mapRef} 
                    className="w-full h-full grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
                    title="SGV Jewellers Location"
                ></div>
            </section>
        </div>
    );
};

export default Contact;
