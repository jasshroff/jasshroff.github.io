import { useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import emailjs from '@emailjs/browser';

const Contact = () => {
    const form = useRef();
    const [status, setStatus] = useState(''); // 'SUCCESS' | 'FAILED' | ''
    const [errorMessage, setErrorMessage] = useState('');
    const [isSending, setIsSending] = useState(false);

    // Get product from URL if available
    const [searchParams] = useSearchParams();
    const product = searchParams.get('product');

    const sendEmail = (e) => {
        e.preventDefault();
        setIsSending(true);
        setStatus('');

        // Replace these with your actual EmailJS Service ID, Template ID, and Public Key
        // It's best practice to use environment variables for these values
        const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
        const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
        const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

        emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current, PUBLIC_KEY)
            .then((result) => {
                console.log(result.text);
                setStatus('SUCCESS');
                setIsSending(false);
                form.current.reset();
            }, (error) => {
                console.log(error.text);
                setStatus('FAILED');
                setErrorMessage(error.text || 'Unknown error occurred');
                setIsSending(false);
            });
    };

    return (
        <div className="animate-fade-in bg-white">
            <Helmet>
                <title>Contact & Orders - Shree Gopaldas Vallabhdas Jewellers</title>
                <meta name="description" content="Place your orders or contact us for custom jewelry designs. Visit our showroom in Burhanpur." />
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
                                    <p className="text-sm mt-1 text-gray-500">Note: Please verify your internet connection and that all fields are filled correctly.</p>
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

            {/* Map (Placeholder) */}
            <section className="h-96 w-full bg-gray-200">
                <iframe
                    src="https://maps.google.com/maps?q=Shree%20Gopaldas%20Vallabhdas%20Jewellers%2C%20Burhanpur&t=&z=15&ie=UTF8&iwloc=&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    title="SGV Jewellers Location"
                ></iframe>
            </section>
        </div>
    );
};

export default Contact;
