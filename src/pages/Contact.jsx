import { useRef, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Phone, Mail, MapPin, Clock, Send, MessageSquare } from 'lucide-react';
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
            .then(() => {
                setStatus('SUCCESS');
                setIsSending(false);
                form.current.reset();
            }, (error) => {
                setStatus('FAILED');
                setErrorMessage(error.text || 'Failed to send message.');
                setIsSending(false);
            });
    };

    const whatsappMessage = product
        ? `Hello SGV Jewellers, I would like to inquire about ${product}.`
        : `Hello SGV Jewellers, I would like to inquire about your jewellery collections.`;

    const whatsappUrl = `https://wa.me/919179559000?text=${encodeURIComponent(whatsappMessage)}`;

    return (
        <div className="animate-fade-in bg-white">
            <Helmet>
                <title>Visit Us | SGV Jewellers Showroom in Burhanpur | Contact</title>
                <meta name="description" content="Visit our premium jewellery showroom at Pandumal Chouraha, Burhanpur. Contact us for custom designs, certified gold rate inquiries, and wedding collections." />
                <meta name="keywords" content="Jewellery showroom Burhanpur, SGV Jewellers address, contact jewellers Burhanpur, custom jewelry Burhanpur, Pandumal Chouraha gold shop" />
            </Helmet>

            {/* Hero Header */}
            <div className="relative bg-maroon-950 text-white py-16 md:py-24 text-center">
                <div className="relative z-10 container mx-auto px-4">
                    <span className="text-gold-400 font-medium tracking-widest uppercase text-xs sm:text-sm block mb-2">Get in Touch</span>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold mb-4">Contact & Showroom Visit</h1>
                    <p className="text-gray-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
                        Ready to find your perfect piece? Reach out to us for inquiries, custom designs, or visit our Burhanpur showroom.
                    </p>
                </div>
            </div>

            {/* Quick Action Buttons (Mobile & Desktop) */}
            <section className="bg-gray-50 border-b border-gray-100 py-6">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                        <a
                            href="tel:+919179559000"
                            className="inline-flex items-center gap-2 bg-white border border-gray-200 text-maroon-950 px-5 py-2.5 text-xs sm:text-sm font-semibold uppercase tracking-wider shadow-sm hover:border-gold-500 hover:text-gold-600 transition-colors"
                        >
                            <Phone className="w-4 h-4 text-gold-500" />
                            Call +91 917-955-9000
                        </a>
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 text-xs sm:text-sm font-semibold uppercase tracking-wider shadow-sm hover:bg-green-700 transition-colors"
                        >
                            <MessageSquare className="w-4 h-4" />
                            WhatsApp Inquiry
                        </a>
                        <a
                            href="https://www.google.com/maps/place/Shree+Gopaldas+Vallabhdas+Jewellers+%7CBest+Jewellery+Shop+%7C+Gold+And+Silver+Jewellery+Shop+%7C+Jewellers+In+Burhanpur/@21.3063828,76.2314022,19.99z/data=!4m14!1m7!3m6!1s0x3bd8336530f39f59:0x89a0cd0e33fac384!2sShree+Gopaldas+Vallabhdas+Jewellers+%7CBest+Jewellery+Shop+%7C+Gold+And+Silver+Jewellery+Shop+%7C+Jewellers+In+Burhanpur!8m2!3d21.3064149!4d76.2313519!16s%2Fg%2F11vxh6ygqd!3m5!1s0x3bd8336530f39f59:0x89a0cd0e33fac384!8m2!3d21.3064149!4d76.2313519!16s%2Fg%2F11vxh6ygqd!5m1!1e1?entry=ttu&g_ep=EgoyMDI2MDgxMS4wIKXMDSoASAFQAw%3D%3D"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-white border border-gray-200 text-maroon-950 px-5 py-2.5 text-xs sm:text-sm font-semibold uppercase tracking-wider shadow-sm hover:border-gold-500 hover:text-gold-600 transition-colors"
                        >
                            <MapPin className="w-4 h-4 text-gold-500" />
                            Get Directions
                        </a>
                    </div>
                </div>
            </section>

            <section className="py-12 md:py-20 container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
                    {/* Contact Form */}
                    <div className="bg-white p-6 sm:p-8 rounded shadow-sm border border-gray-100">
                        <h2 className="text-2xl sm:text-3xl font-serif text-maroon-950 mb-6">
                            {product ? `Inquire about ${product}` : 'Send us a Message'}
                        </h2>
                        <form ref={form} onSubmit={sendEmail} className="space-y-4 sm:space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                                    <input type="text" name="user_name" className="w-full px-4 py-3 border border-gray-300 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-colors bg-gray-50 text-sm" placeholder="John Doe" required />
                                </div>
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Your Phone *</label>
                                    <input type="tel" name="user_phone" className="w-full px-4 py-3 border border-gray-300 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-colors bg-gray-50 text-sm" placeholder="+91 98765 43210" required />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Your Email *</label>
                                <input type="email" name="user_email" className="w-full px-4 py-3 border border-gray-300 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-colors bg-gray-50 text-sm" placeholder="john@example.com" required />
                            </div>
                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Message</label>
                                <textarea
                                    name="message"
                                    rows="4"
                                    className="w-full px-4 py-3 border border-gray-300 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-colors bg-gray-50 text-sm"
                                    placeholder="I am interested in custom bridal jewellery / gold rate inquiry..."
                                    defaultValue={product ? `I am interested in the ${product}. Please let me know the price, gold weight, and availability.` : ''}
                                ></textarea>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                <button type="submit" disabled={isSending} className="w-full sm:w-auto px-8 py-3 bg-gold-500 text-white font-medium uppercase tracking-wider hover:bg-gold-600 transition-all shadow-md flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm">
                                    {isSending ? 'Sending...' : 'Send Message'}
                                    <Send className="w-4 h-4 ml-2" />
                                </button>
                                <a
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white font-medium uppercase tracking-wider hover:bg-green-700 transition-all shadow-md flex items-center justify-center text-xs sm:text-sm"
                                >
                                    <MessageSquare className="w-4 h-4 mr-2" />
                                    Chat on WhatsApp
                                </a>
                            </div>
                            {status === 'SUCCESS' && <p className="text-green-600 font-medium text-sm">Message sent successfully! We will contact you soon.</p>}
                            {status === 'FAILED' && (
                                <div className="text-red-500 font-medium text-sm">
                                    <p>Failed to send message.</p>
                                    <p className="text-xs mt-1">Error: {errorMessage}</p>
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-6 sm:space-y-8">
                        <h2 className="text-2xl sm:text-3xl font-serif text-maroon-950 mb-6">Showroom Details</h2>

                        <div className="flex items-start space-x-4 sm:space-x-5 p-4 rounded bg-gray-50 border border-gray-100">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gold-100 text-gold-600 flex items-center justify-center rounded-full flex-shrink-0">
                                <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
                            </div>
                            <div>
                                <h4 className="text-base sm:text-lg font-bold text-maroon-950 mb-1">Our Showroom</h4>
                                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                                    17, Shreenath Sadan,<br />
                                    Pandumal Chouraha, Tilak Marg Road,<br />
                                    Burhanpur (M.P) - 450331
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4 sm:space-x-5 p-4 rounded bg-gray-50 border border-gray-100">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gold-100 text-gold-600 flex items-center justify-center rounded-full flex-shrink-0">
                                <Phone className="w-5 h-5 sm:w-6 sm:h-6" />
                            </div>
                            <div>
                                <h4 className="text-base sm:text-lg font-bold text-maroon-950 mb-1">Call Us Directly</h4>
                                <p className="text-gray-600 text-xs sm:text-sm">
                                    <a href="tel:+919179559000" className="hover:text-gold-600 transition-colors font-medium">+91 917-955-9000</a>
                                </p>
                                <p className="text-gray-400 text-xs mt-1">Available during showroom hours</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4 sm:space-x-5 p-4 rounded bg-gray-50 border border-gray-100">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gold-100 text-gold-600 flex items-center justify-center rounded-full flex-shrink-0">
                                <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
                            </div>
                            <div>
                                <h4 className="text-base sm:text-lg font-bold text-maroon-950 mb-1">Email Inquiries</h4>
                                <p className="text-gray-600 text-xs sm:text-sm break-all">
                                    <a href="mailto:sgvjewellers1938@gmail.com" className="hover:text-gold-600 transition-colors">sgvjewellers1938@gmail.com</a>
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4 sm:space-x-5 p-4 rounded bg-gray-50 border border-gray-100">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gold-100 text-gold-600 flex items-center justify-center rounded-full flex-shrink-0">
                                <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
                            </div>
                            <div>
                                <h4 className="text-base sm:text-lg font-bold text-maroon-950 mb-1">Showroom Timings</h4>
                                <p className="text-gray-600 text-xs sm:text-sm">
                                    Mon - Sun: 10:00 AM - 9:00 PM
                                </p>
                                <p className="text-gold-600 text-xs font-medium mt-1">Open all 7 days for bridal consultations</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stylized Solo Map */}
            <section className="h-[320px] sm:h-[400px] md:h-[500px] w-full bg-gray-100 border-t border-b border-gold-200 overflow-hidden">
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
