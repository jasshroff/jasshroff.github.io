import Hero from '../components/Hero';
import { CollectionGrid, BestSellers, QualityCTA, Testimonials, Features } from '../components/HomeSections';
import { Helmet } from 'react-helmet-async';

const Home = () => {
    return (
        <>
            <Helmet>
                <title>Shree Gopaldas Vallabhdas Jewellers - Top Jewellery Store in Burhanpur</title>
                <meta name="description" content="Shree Gopaldas Vallabhdas Jewellers - Exquisite gold, diamond, and antique jewellery in Burhanpur. Certified quality and lifetime maintenance." />
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
