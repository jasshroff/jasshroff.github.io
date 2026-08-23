import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
    const { pathname, search } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);

        if (typeof window.gtag === 'function') {
            window.gtag('config', 'G-RVWB6TK477', {
                page_path: pathname + search,
            });
        }
    }, [pathname, search]);

    return null;
};

export default ScrollToTop;
