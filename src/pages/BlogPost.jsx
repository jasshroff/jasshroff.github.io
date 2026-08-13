import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowLeft, ArrowRight, Tag, ChevronRight, Share2, Facebook, Twitter } from 'lucide-react';
import { getBlogBySlug, getRelatedPosts } from '../data/blogData';

const BlogPost = () => {
    const { slug } = useParams();
    const post = getBlogBySlug(slug);
    const relatedPosts = post ? getRelatedPosts(slug, 3) : [];

    if (!post) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 bg-gray-50">
                <Helmet>
                    <title>Article Not Found — SGV Jewellers Blog</title>
                </Helmet>
                <h1 className="text-6xl font-serif font-bold text-gold-200 mb-4">404</h1>
                <h2 className="text-2xl font-serif text-maroon-950 mb-4">Article Not Found</h2>
                <p className="text-gray-500 mb-8">The article you're looking for doesn't exist or has been moved.</p>
                <Link
                    to="/blog"
                    className="inline-flex items-center px-6 py-3 bg-gold-500 text-white font-medium uppercase tracking-wider hover:bg-gold-600 transition-all shadow-lg"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Blog
                </Link>
            </div>
        );
    }

    // Parse content into rendered HTML-like sections
    const renderContent = (content) => {
        const lines = content.trim().split('\n');
        const elements = [];
        let currentList = [];
        let listType = null;
        let inTable = false;
        let tableRows = [];
        let tableHeaders = [];

        const flushList = () => {
            if (currentList.length > 0) {
                if (listType === 'ul') {
                    elements.push(
                        <ul key={`list-${elements.length}`} className="list-disc pl-6 mb-5 space-y-2">
                            {currentList.map((item, i) => (
                                <li key={i} className="text-base md:text-lg text-gray-700">{renderInlineMarkdown(item)}</li>
                            ))}
                        </ul>
                    );
                } else {
                    elements.push(
                        <ol key={`list-${elements.length}`} className="list-decimal pl-6 mb-5 space-y-2">
                            {currentList.map((item, i) => (
                                <li key={i} className="text-base md:text-lg text-gray-700">{renderInlineMarkdown(item)}</li>
                            ))}
                        </ol>
                    );
                }
                currentList = [];
                listType = null;
            }
        };

        const flushTable = () => {
            if (tableRows.length > 0) {
                elements.push(
                    <div key={`table-${elements.length}`} className="overflow-x-auto mb-6 -mx-4 px-4 md:mx-0 md:px-0">
                        <table className="w-full text-sm md:text-base border-collapse min-w-[400px]">
                            <thead>
                                <tr className="bg-maroon-950 text-white">
                                    {tableHeaders.map((h, i) => (
                                        <th key={i} className="px-3 md:px-4 py-3 text-left font-serif font-bold text-xs md:text-sm uppercase tracking-wider">{h.trim()}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {tableRows.map((row, i) => (
                                    <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                        {row.map((cell, j) => (
                                            <td key={j} className="px-3 md:px-4 py-3 text-gray-700 border-b border-gray-100">{renderInlineMarkdown(cell.trim())}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
                tableRows = [];
                tableHeaders = [];
                inTable = false;
            }
        };

        const renderInlineMarkdown = (text) => {
            // Bold
            const parts = text.split(/(\*\*[^*]+\*\*)/g);
            return parts.map((part, i) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={i} className="font-bold text-maroon-950">{part.slice(2, -2)}</strong>;
                }
                // Handle ❌ and other emoji
                return <span key={i}>{part}</span>;
            });
        };

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // Empty line
            if (line.trim() === '') {
                flushList();
                if (inTable) flushTable();
                continue;
            }

            // Heading 2
            if (line.startsWith('## ')) {
                flushList();
                if (inTable) flushTable();
                const id = line.slice(3).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                elements.push(
                    <h2 key={`h2-${elements.length}`} id={id} className="text-2xl md:text-3xl font-serif font-bold text-maroon-950 mt-10 mb-4">
                        {line.slice(3)}
                    </h2>
                );
                continue;
            }

            // Heading 3
            if (line.startsWith('### ')) {
                flushList();
                if (inTable) flushTable();
                elements.push(
                    <h3 key={`h3-${elements.length}`} className="text-xl md:text-2xl font-serif font-semibold text-maroon-900 mt-8 mb-3">
                        {line.slice(4)}
                    </h3>
                );
                continue;
            }

            // Blockquote
            if (line.startsWith('> ')) {
                flushList();
                if (inTable) flushTable();
                elements.push(
                    <blockquote key={`bq-${elements.length}`} className="border-l-4 border-gold-500 pl-5 md:pl-6 py-3 my-6 bg-gold-50/50 italic text-gray-600 text-base md:text-lg rounded-r">
                        {renderInlineMarkdown(line.slice(2))}
                    </blockquote>
                );
                continue;
            }

            // Table detection
            if (line.includes('|') && line.trim().startsWith('|')) {
                const cells = line.split('|').filter(c => c.trim() !== '');
                if (!inTable) {
                    flushList();
                    inTable = true;
                    tableHeaders = cells;
                } else if (cells.every(c => /^[\s-:]+$/.test(c))) {
                    // separator row, skip
                    continue;
                } else {
                    tableRows.push(cells);
                }
                continue;
            } else if (inTable) {
                flushTable();
            }

            // Unordered list
            if (line.match(/^- /)) {
                if (listType === 'ol') flushList();
                listType = 'ul';
                currentList.push(line.slice(2));
                continue;
            }

            // Ordered list
            if (line.match(/^\d+\. /)) {
                if (listType === 'ul') flushList();
                listType = 'ol';
                currentList.push(line.replace(/^\d+\.\s/, ''));
                continue;
            }

            // Regular paragraph
            flushList();
            if (inTable) flushTable();
            elements.push(
                <p key={`p-${elements.length}`} className="mb-5 text-base md:text-lg leading-relaxed text-gray-700">
                    {renderInlineMarkdown(line)}
                </p>
            );
        }

        flushList();
        if (inTable) flushTable();

        return elements;
    };

    // Extract headings for table of contents
    const headings = post.content
        .split('\n')
        .filter(line => line.startsWith('## '))
        .map(line => ({
            text: line.slice(3),
            id: line.slice(3).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        }));

    const shareUrl = `https://sgvjewellers.in/blog/${post.slug}`;

    return (
        <div className="bg-white min-h-screen">
            <Helmet>
                <title>{post.metaTitle}</title>
                <meta name="description" content={post.metaDescription} />
                <meta name="keywords" content={post.tags.join(', ')} />
                <meta property="og:type" content="article" />
                <meta property="og:url" content={shareUrl} />
                <meta property="og:title" content={post.metaTitle} />
                <meta property="og:description" content={post.metaDescription} />
                <meta property="og:image" content={`https://sgvjewellers.in${post.image}`} />
                <meta property="article:published_time" content={post.date} />
                <meta property="article:author" content={post.author} />
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Article",
                        "headline": post.title,
                        "description": post.metaDescription,
                        "image": `https://sgvjewellers.in${post.image}`,
                        "author": {
                            "@type": "Organization",
                            "name": post.author,
                            "url": "https://sgvjewellers.in"
                        },
                        "publisher": {
                            "@type": "Organization",
                            "name": "SGV Jewellers",
                            "logo": {
                                "@type": "ImageObject",
                                "url": "https://sgvjewellers.in/images/main/sgv.png"
                            }
                        },
                        "datePublished": post.date,
                        "dateModified": post.date,
                        "mainEntityOfPage": {
                            "@type": "WebPage",
                            "@id": shareUrl
                        }
                    })}
                </script>
            </Helmet>

            {/* Hero */}
            <div className="relative bg-maroon-950 text-white overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-20"
                    style={{ backgroundImage: `url(${post.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-maroon-950 via-maroon-950/80 to-maroon-950/60" />

                <div className="relative z-10 container mx-auto px-4 py-16 md:py-24">
                    {/* Breadcrumb */}
                    <motion.nav
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center gap-2 text-sm text-gray-400 mb-6 md:mb-8"
                    >
                        <Link to="/" className="hover:text-white transition-colors">Home</Link>
                        <ChevronRight className="w-3 h-3" />
                        <Link to="/blog" className="hover:text-white transition-colors">Blog</Link>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-gold-400 truncate max-w-[200px] md:max-w-none">{post.title}</span>
                    </motion.nav>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="max-w-3xl"
                    >
                        <span className="inline-block bg-gold-500 text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest mb-4">
                            {post.category}
                        </span>
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold mb-5 leading-tight">
                            {post.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-gray-300">
                            <span className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gold-400" />
                                {new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </span>
                            <span className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-gold-400" />
                                {post.readTime}
                            </span>
                            <span className="text-gold-400 font-medium">
                                By {post.author}
                            </span>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-10 md:py-16">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    {/* Main Content */}
                    <motion.article
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex-1 max-w-none lg:max-w-3xl"
                    >
                        <div className="blog-prose">
                            {renderContent(post.content)}
                        </div>

                        {/* Tags */}
                        <div className="mt-10 pt-8 border-t border-gray-200">
                            <div className="flex flex-wrap gap-2">
                                <Tag className="w-4 h-4 text-gray-400 mt-1" />
                                {post.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1.5 hover:bg-gold-50 hover:text-gold-700 transition-colors cursor-default"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Share */}
                        <div className="mt-6 flex items-center gap-4">
                            <span className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                <Share2 className="w-4 h-4" />
                                Share:
                            </span>
                            <a
                                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-blue-600 hover:text-white transition-all"
                                aria-label="Share on Facebook"
                            >
                                <Facebook className="w-4 h-4" />
                            </a>
                            <a
                                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-sky-500 hover:text-white transition-all"
                                aria-label="Share on Twitter"
                            >
                                <Twitter className="w-4 h-4" />
                            </a>
                            <a
                                href={`https://wa.me/?text=${encodeURIComponent(post.title + ' — ' + shareUrl)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-green-500 hover:text-white transition-all"
                                aria-label="Share on WhatsApp"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                            </a>
                        </div>
                    </motion.article>

                    {/* Sidebar — Table of Contents (desktop) */}
                    <aside className="hidden lg:block w-72 flex-shrink-0">
                        <div className="sticky top-28">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-maroon-950 mb-4">In This Article</h3>
                            <nav className="space-y-1">
                                {headings.map((heading) => (
                                    <a
                                        key={heading.id}
                                        href={`#${heading.id}`}
                                        className="block text-sm text-gray-500 hover:text-gold-600 hover:pl-2 transition-all py-1.5 border-l-2 border-transparent hover:border-gold-500 pl-3"
                                    >
                                        {heading.text}
                                    </a>
                                ))}
                            </nav>

                            {/* CTA */}
                            <div className="mt-10 p-5 bg-maroon-950 text-white">
                                <h4 className="font-serif font-bold mb-2">Need Expert Advice?</h4>
                                <p className="text-gray-400 text-xs mb-4">Visit our showroom or call us for personalised guidance.</p>
                                <Link
                                    to="/contact-us"
                                    className="block text-center bg-gold-500 text-white text-xs font-bold uppercase tracking-widest px-4 py-2.5 hover:bg-gold-600 transition-colors"
                                >
                                    Contact Us
                                </Link>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            {/* Mobile TOC (collapsible) */}
            <div className="lg:hidden container mx-auto px-4 -mt-4 mb-8">
                <details className="bg-gray-50 border border-gray-200 p-4">
                    <summary className="text-sm font-bold uppercase tracking-widest text-maroon-950 cursor-pointer">
                        Table of Contents
                    </summary>
                    <nav className="mt-3 space-y-1">
                        {headings.map((heading) => (
                            <a
                                key={heading.id}
                                href={`#${heading.id}`}
                                className="block text-sm text-gray-500 hover:text-gold-600 py-1.5 pl-3 border-l-2 border-transparent hover:border-gold-500"
                            >
                                {heading.text}
                            </a>
                        ))}
                    </nav>
                </details>
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
                <section className="py-12 md:py-16 bg-gray-50 border-t border-gray-100">
                    <div className="container mx-auto px-4">
                        <h2 className="text-2xl md:text-3xl font-serif font-bold text-maroon-950 text-center mb-10">
                            Related Articles
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                            {relatedPosts.map((relPost) => (
                                <Link
                                    key={relPost.id}
                                    to={`/blog/${relPost.slug}`}
                                    className="blog-card bg-white"
                                >
                                    <div className="aspect-[16/10] overflow-hidden bg-gray-100">
                                        <img
                                            src={relPost.image}
                                            alt={relPost.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="p-5">
                                        <span className="text-gold-600 text-[10px] font-bold uppercase tracking-widest">{relPost.category}</span>
                                        <h3 className="text-lg font-serif font-bold text-maroon-950 mt-1 mb-2 line-clamp-2 group-hover:text-gold-600 transition-colors">
                                            {relPost.title}
                                        </h3>
                                        <span className="text-xs text-gray-400 flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> {relPost.readTime}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Back to Blog */}
            <div className="py-8 md:py-10 text-center border-t border-gray-100">
                <Link
                    to="/blog"
                    className="inline-flex items-center gap-2 text-gold-600 hover:text-gold-700 font-medium text-sm uppercase tracking-wider"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to All Articles
                </Link>
            </div>
        </div>
    );
};

export default BlogPost;
