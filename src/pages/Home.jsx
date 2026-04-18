import Hero from '../components/Hero';
import { CollectionGrid, BestSellers, QualityCTA, Testimonials, Features } from '../components/HomeSections';
import { Helmet } from 'react-helmet-async';

const Home = () => {
    return (
        <>
            <Helmet>
                <title>Shree Gopaldas Vallabhdas Jewellers - Top Jewellery Store in Burhanpur</title>
                <meta name="description" content="Shree Gopaldas Vallabhdas Jewellers - Exquisite gold, diamond, and antique jewellery in Burhanpur. Certified quality and lifetime maintenance." />
                
                {/* Open Graph Tags */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://sgvjewellers.in/" />
                <meta property="og:title" content="Shree Gopaldas Vallabhdas Jewellers | Burhanpur" />
                <meta property="og:description" content="Est. 1938. Premium certified gold and diamond jewellery in Burhanpur." />
                <meta property="og:image" content="https://sgvjewellers.in/images/main/sgv_Collage.png" />

                {/* Twitter Tags */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Shree Gopaldas Vallabhdas Jewellers" />
                <meta name="twitter:description" content="Premium certified gold and diamond jewellery in Burhanpur." />
                <meta name="twitter:image" content="https://sgvjewellers.in/images/main/sgv_Collage.png" />
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
