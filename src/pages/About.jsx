import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

const About = () => {
    const team = [
        { name: 'Shree Gopaldas Vallabhdas Shroff', role: 'Founder', image: '/images/team-1-270x236.jpg' },
        { name: 'Shree Damodardas Gopaldas Shroff', role: 'Proprietor', image: '/images/team-2-270x236.jpg' },
        { name: 'Rakesh Damodardas Shroff', role: 'Gold Department', image: '/images/team-3-270x236.jpg' },
        { name: 'Hitesh Damodardas Shroff', role: 'Silver Department', image: '/images/team-4-270x236.png' },
    ];

    return (
        <div className="animate-fade-in bg-white">
            <Helmet>
                <title>About Us - Shree Gopaldas Vallabhdas Jewellers</title>
                <meta name="description" content="Learn about our 85+ years of legacy, trust, and excellence in jewelry making." />
            </Helmet>

            {/* Hero Header */}
            <div className="relative bg-dark-900 text-white py-24 text-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/main/craftmanship.jpeg')] bg-cover bg-center opacity-30"></div>
                <div className="relative z-10 container mx-auto px-4">
                    <h1 className="text-5xl font-serif font-bold mb-4">About Us</h1>
                    <div className="w-24 h-1 bg-gold-500 mx-auto"></div>
                </div>
            </div>

            {/* Legacy Section */}
            <section className="py-20 container mx-auto px-4">
                <div className="flex flex-col md:flex-row gap-12 items-center">
                    <div className="md:w-1/2">
                        <img src="/images/about-1-835x418.jpg" alt="Our Legacy" className="rounded-lg shadow-xl w-full" />
                    </div>
                    <div className="md:w-1/2">
                        <span className="text-gold-600 font-medium tracking-widest uppercase text-sm">Since 1938</span>
                        <h2 className="text-3xl font-serif text-dark-900 mt-2 mb-6">A Legacy of Trust and Excellence</h2>
                        <div className="prose text-gray-600 leading-relaxed text-justify space-y-4">
                            <p>
                                Shree Gopaldas Vallabhdas Jewellers was founded in 1938 by the visionary Gopaldas Ji Shroff.
                                Initially focusing on trading raw gold and silver, we ventured into retail in 1985, offering the finest quality jewellery.
                            </p>
                            <p>
                                We take pride in being Burhanpur's first jewellery showroom. Our journey has been built on a foundation of trust, quality, and
                                uncompromising standards, as evidenced by our BIS Certified Hallmarked products.
                            </p>
                            <p>
                                Today, under the guidance of Shri Damodardas Ji and his sons Rakesh and Hitesh Shroff, we continue to uphold
                                the values and traditions that have defined us for generations.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values/Goals Tabs (Simplified as Cards) */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-serif text-dark-900">Our Vision & Values</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 shadow-lg border-t-4 border-gold-500 hover:-translate-y-2 transition-transform">
                            <h3 className="text-xl font-serif font-bold mb-4 text-dark-900">Uncompromising Quality</h3>
                            <p className="text-gray-600">
                                We are dedicated to providing only the highest quality jewellery. Every piece meets our rigorous standards of excellence.
                            </p>
                        </div>
                        <div className="bg-white p-8 shadow-lg border-t-4 border-gold-500 hover:-translate-y-2 transition-transform">
                            <h3 className="text-xl font-serif font-bold mb-4 text-dark-900">Customer Trust</h3>
                            <p className="text-gray-600">
                                Building and maintaining trust is at the heart of our business. We strive to exceed expectations and ensure complete satisfaction.
                            </p>
                        </div>
                        <div className="bg-white p-8 shadow-lg border-t-4 border-gold-500 hover:-translate-y-2 transition-transform">
                            <h3 className="text-xl font-serif font-bold mb-4 text-dark-900">Innovation & Tradition</h3>
                            <p className="text-gray-600">
                                With over 85 years of heritage, we honor our traditions while embracing innovation to create unique, timeless pieces.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-20 container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-serif text-dark-900">Meet Our Team</h2>
                    <div className="w-24 h-1 bg-gold-500 mx-auto mt-4"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {team.map((member, idx) => (
                        <div key={idx} className="group text-center">
                            <div className="mb-4 overflow-hidden rounded-lg shadow-md aspect-[270/236]">
                                <img src={member.image} alt={member.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            <h4 className="text-lg font-serif font-bold text-dark-900">{member.name}</h4>
                            <p className="text-gold-600 text-sm uppercase tracking-wider">{member.role}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default About;
