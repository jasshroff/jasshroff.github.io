import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Home } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 bg-gray-50">
            <Helmet>
                <title>Page Not Found - SGV Jewellers</title>
            </Helmet>

            <h1 className="text-9xl font-serif font-bold text-gold-200">404</h1>
            <h2 className="text-3xl md:text-4xl font-serif text-dark-900 mb-6 mt-[-2rem]">Page Not Found</h2>
            <p className="text-gray-600 mb-8 max-w-md">
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>

            <Link
                to="/"
                className="inline-flex items-center px-6 py-3 bg-gold-500 text-white font-medium uppercase tracking-wider hover:bg-gold-600 transition-all shadow-lg hover:shadow-xl rounded-sm"
            >
                <Home className="w-4 h-4 mr-2" />
                Back to Home
            </Link>
        </div>
    );
};

export default NotFound;
