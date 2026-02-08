import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const Hero = () => {
    const slides = [
        {
            id: 1,
            image: '/images/main/Banner_New_Collection.png',
            title: 'New Collection',
            subtitle: 'Our latest assortment gleams with an ethereal brilliance.',
            link: '/catalog',
            position: 'justify-start', // Align text to left
        },
        {
            id: 2,
            image: '/images/main/Banner_GoldChain.png',
            title: 'Gold Chains',
            subtitle: 'Everyday gold chains to accentuate your stunning neck!!',
            link: '/catalog',
            position: 'justify-start',
        },
        {
            id: 3,
            image: '/images/main/Banner_Customised_Jewellery.png',
            title: 'Customised Jewellery',
            subtitle: 'Your Vision, Our Craft: Exquisite Custom Jewellery Made Just for You.',
            link: '/contact',
            position: 'justify-start',
        },
    ];

    return (
        <section className="relative h-[600px] md:h-[800px] w-full overflow-hidden bg-dark-900">
            <Swiper
                modules={[Pagination, Autoplay, EffectFade]}
                effect={'fade'}
                speed={1000}
                pagination={{ clickable: true }}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                loop={true}
                className="h-full w-full"
            >
                {slides.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        <div className="relative w-full h-full">
                            {/* Background Image */}
                            <div
                                className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-ken-burns"
                                style={{ backgroundImage: `url(${slide.image})` }}
                            >
                                {/* Overlay for better text readability */}
                                <div className="absolute inset-0 bg-black/40 md:bg-black/30"></div>
                            </div>

                            {/* Content */}
                            <div className="absolute inset-0 flex items-center container mx-auto px-4 z-10">
                                <div className={`w-full md:w-2/3 lg:w-1/2 ${slide.position}`}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8, delay: 0.2 }}
                                        className="text-white"
                                    >
                                        <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-4 leading-tight">
                                            {slide.title}
                                        </h2>
                                        <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-lg font-light leading-relaxed">
                                            {slide.subtitle}
                                        </p>
                                        <Link
                                            to={slide.link}
                                            className="inline-block px-8 py-3 bg-gold-500 text-white font-medium uppercase tracking-wider hover:bg-gold-600 transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
                                        >
                                            View Collection
                                        </Link>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Custom Styles for Swiper Navigation */}
            <style jsx>{`

        .swiper-pagination-bullet {
          background: #fff;
          opacity: 0.5;
        }
        .swiper-pagination-bullet-active {
          background: #d4aa1e;
          opacity: 1;
        }
      `}</style>
        </section>
    );
};

export default Hero;
