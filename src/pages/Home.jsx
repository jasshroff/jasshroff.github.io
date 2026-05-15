import Hero from '../components/Hero';
import { CollectionGrid, BestSellers, QualityCTA, Testimonials, Features } from '../components/HomeSections';
import { Helmet } from 'react-helmet-async';

const Home = () => {
    return (
        <>
            <Helmet>
                <title>SGV Jewellers | Best Jewellery Store in Burhanpur | Gold & Diamonds</title>
                <meta name="description" content="Discover Shree Gopaldas Vallabhdas Jewellers, the most trusted name in Burhanpur since 1938. Explore our legacy of BIS Hallmarked gold, diamond, and antique bridal collections. Visit us today for certified quality and timeless designs." />
                
                {/* Search Keywords */}
                <meta name="keywords" content="Best jewellers in Burhanpur, gold jewellery shop Burhanpur, antique jewellery Burhanpur, diamond jewellery Burhanpur, Shree Gopaldas Vallabhdas Jewellers, trusted jewellers in Burhanpur, gold shop Pandumal Chouraha" />

                {/* Structured Data (Schema.org) for Google Ranking */}
                <script type="application/ld+json">
                {`
                {
                  "@context": "https://schema.org",
                  "@type": "JewelryStore",
                  "name": "Shree Gopaldas Vallabhdas Jewellers",
                  "alternateName": "SGV Jewellers",
                  "url": "https://sgvjewellers.in/",
                  "logo": "https://sgvjewellers.in/images/main/sgv.png",
                  "image": "https://sgvjewellers.in/images/main/sgv_Collage.png",
                  "description": "Premium certified gold, diamond, and antique jewellery showroom in Burhanpur. Established in 1938.",
                  "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "17, Shreenath Sadan, Pandumal Chouraha, Tilak Marg Road",
                    "addressLocality": "Burhanpur",
                    "addressRegion": "MP",
                    "postalCode": "450331",
                    "addressCountry": "IN"
                  },
                  "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": 21.3121,
                    "longitude": 76.2233
                  },
                  "telephone": "+91-9179559000",
                  "openingHoursSpecification": [
                    {
                      "@type": "OpeningHoursSpecification",
                      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                      "opens": "10:00",
                      "closes": "21:00"
                    }
                  ],
                  "sameAs": [
                    "https://www.instagram.com/shreegopaldasvallabhdas",
                    "https://www.facebook.com/shreegopaldasvallabhdas"
                  ]
                }
                `}
                </script>

                {/* Open Graph Tags */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://sgvjewellers.in/" />
                <meta property="og:title" content="SGV Jewellers | Best Jewellery Store in Burhanpur" />
                <meta property="og:description" content="Most trusted jewellers in Burhanpur since 1938. Certified BIS Hallmarked gold, diamonds, and antique jewellery." />
                <meta property="og:image" content="https://sgvjewellers.in/images/main/sgv_Collage.png" />

                {/* Local SEO Tags */}
                <meta name="geo.region" content="IN-MP" />
                <meta name="geo.placename" content="Burhanpur" />
                <meta name="geo.position" content="21.3121;76.2233" />
            </Helmet>

            <div className="animate-fade-in">
                <Hero />
                <Features />
                <CollectionGrid />
                <QualityCTA />
                <BestSellers />
                <Testimonials />
            </div>
        </>
    );
};

export default Home;
