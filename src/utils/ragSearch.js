import { blogPosts } from '../data/blogData';
import { businessProfile, chatbotKnowledgeBase } from '../data/chatbotKnowledge';

const STOP_WORDS = new Set([
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'can', 'could', 'do', 'does', 'for', 'from',
    'have', 'how', 'i', 'in', 'is', 'it', 'me', 'my', 'of', 'on', 'or', 'our', 'please', 'the',
    'to', 'us', 'we', 'what', 'when', 'where', 'which', 'who', 'with', 'you', 'your',
]);

const QUERY_EXPANSIONS = {
    address: ['location', 'showroom', 'directions', 'map', 'visit'],
    appointment: ['visit', 'consultation', 'bridal', 'showroom'],
    bill: ['invoice', 'pricing', 'weight', 'rate', 'making', 'gst'],
    bis: ['hallmark', 'huid', 'purity', 'certified', '916'],
    bridal: ['wedding', 'bride', 'rani', 'haar', 'maang', 'tikka'],
    buyback: ['buy', 'back', 'return', 'exchange', 'maintenance'],
    call: ['phone', 'contact', 'whatsapp'],
    catalog: ['collection', 'products', 'designs'],
    custom: ['customised', 'customized', 'design', 'personalised'],
    diamond: ['certified', 'gem', 'stones'],
    gold: ['22k', '916', 'hallmark', 'rate', 'purity'],
    job: ['career', 'hiring', 'apply', 'vacancy'],
    open: ['hours', 'timing', 'showroom'],
    pooja: ['puja', 'silver', 'mandir', 'diya', 'kalash', 'thali', 'coin', 'coins'],
    repair: ['maintenance', 'polish', 'cleaning', 'service'],
    silver: ['925', 'sterling', 'chandi', 'payal', 'bichhiya', 'kada', 'pooja', 'coin', 'tarnish', 'clean'],
    tarnish: ['black', 'clean', 'polish', 'silver', 'baking', 'soda'],
    whatsapp: ['contact', 'message', 'phone'],
};

const stripMarkdown = (text = '') =>
    text
        .replace(/```[\s\S]*?```/g, ' ')
        .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
        .replace(/\[[^\]]*\]\([^)]*\)/g, ' ')
        .replace(/[#>*_`|~:-]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

const normalize = (text = '') =>
    text
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, ' ')
        .trim();

const tokenize = (text = '') =>
    normalize(text)
        .split(/\s+/)
        .filter((token) => token.length > 1 && !STOP_WORDS.has(token));

const expandTokens = (tokens) => {
    const expanded = new Set(tokens);

    tokens.forEach((token) => {
        QUERY_EXPANSIONS[token]?.forEach((term) => expanded.add(term));
    });

    return [...expanded];
};

const splitIntoSentences = (text = '') =>
    stripMarkdown(text)
        .split(/(?<=[.!?])\s+/)
        .map((sentence) => sentence.trim())
        .filter(Boolean);

const blogDocuments = blogPosts.flatMap((post) => {
    const sections = post.content
        .split(/\n(?=##\s)/)
        .map((section) => stripMarkdown(section))
        .filter((section) => section.length > 80);

    return [
        {
            id: `blog-${post.slug}-summary`,
            title: post.title,
            route: `/blog/${post.slug}`,
            keywords: [post.category, ...post.tags],
            content: `${post.excerpt} ${post.metaDescription}`,
        },
        ...sections.map((section, index) => ({
            id: `blog-${post.slug}-${index}`,
            title: post.title,
            route: `/blog/${post.slug}`,
            keywords: [post.category, ...post.tags],
            content: section,
        })),
    ];
});

const allDocuments = [...chatbotKnowledgeBase, ...blogDocuments].map((doc) => {
    const searchableText = `${doc.title} ${(doc.keywords || []).join(' ')} ${doc.content}`;
    const tokens = tokenize(searchableText);
    const frequencies = tokens.reduce((acc, token) => {
        acc[token] = (acc[token] || 0) + 1;
        return acc;
    }, {});

    return {
        ...doc,
        tokens,
        frequencies,
        tokenSet: new Set(tokens),
    };
});

const getIntent = (message = '') => {
    const text = normalize(message);

    if (/^(hi|hello|hey|namaste|namaskar)\b/.test(text)) return 'greeting';
    if (/(phone|call|whatsapp|email|contact|number|address|location|direction|map|where|showroom)/.test(text)) return 'contact';
    if (/(open|timing|time|hour|today|sunday|monday|visit)/.test(text)) return 'hours';
    if (/(price|rate|cost|gold rate|making|charge|gst|weight|gram|today)/.test(text)) return 'pricing';
    if (/(bis|hallmark|huid|purity|916|22k|certificate|certified)/.test(text)) return 'quality';
    if (/(bridal|wedding|bride|custom|customised|customized|design|consultation)/.test(text)) return 'bridal';
    if (/(return|exchange|buyback|buy back|maintenance|repair|polish|clean)/.test(text)) return 'policy';
    if (/(catalog|collection|product|ring|bangle|necklace|earring|pendant|chain|silver|diamond|antique|gold)/.test(text)) return 'collections';
    if (/(career|job|hiring|apply|vacancy|work)/.test(text)) return 'careers';

    return 'general';
};

const INTENT_SOURCE_IDS = {
    contact: ['showroom-contact', 'business-overview'],
    hours: ['showroom-contact'],
    pricing: ['pricing-gold-rate', 'blog-complete-guide-22k-gold-jewellery-summary'],
    quality: ['quality-certification', 'blog-understanding-bis-hallmarking-summary'],
    bridal: ['bridal-custom-jewellery', 'blog-how-to-choose-perfect-bridal-jewellery-summary'],
    policy: ['policies-after-sales', 'gold-care'],
    collections: ['collections-overview'],
    careers: ['careers'],
};

const scoreDocument = (doc, queryTokens, rawQuery) => {
    const titleTokens = new Set(tokenize(doc.title));
    const keywordTokens = new Set(tokenize((doc.keywords || []).join(' ')));
    const raw = normalize(rawQuery);

    return queryTokens.reduce((score, token) => {
        if (!doc.tokenSet.has(token)) return score;

        let boost = 1 + Math.log1p(doc.frequencies[token] || 0);
        if (titleTokens.has(token)) boost += 2.8;
        if (keywordTokens.has(token)) boost += 2;
        if (raw.includes(token)) boost += 0.5;

        return score + boost;
    }, 0);
};

export const retrieveRelevantDocs = (message, limit = 4) => {
    const queryTokens = expandTokens(tokenize(message));

    if (queryTokens.length === 0) {
        return chatbotKnowledgeBase.slice(0, 3).map((doc) => ({ ...doc, score: 1 }));
    }

    const matches = allDocuments
        .map((doc) => ({ ...doc, score: scoreDocument(doc, queryTokens, message) }))
        .filter((doc) => doc.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

    if (matches.length > 0) return matches;

    return chatbotKnowledgeBase
        .filter((doc) => ['business-overview', 'showroom-contact', 'collections-overview'].includes(doc.id))
        .map((doc) => ({ ...doc, score: 1 }));
};

const getRelevantSentences = (docs, message, maxSentences = 4) => {
    const queryTokens = expandTokens(tokenize(message));

    return docs
        .flatMap((doc) =>
            splitIntoSentences(doc.content).map((sentence) => {
                const sentenceTokens = tokenize(sentence);
                const overlap = sentenceTokens.filter((token) => queryTokens.includes(token)).length;
                return {
                    sentence,
                    score: overlap + Math.min(doc.score || 0, 6) / 6,
                };
            })
        )
        .sort((a, b) => b.score - a.score)
        .slice(0, maxSentences)
        .map((item) => item.sentence);
};

const makeWhatsAppLink = (message) =>
    `${businessProfile.whatsappHref}?text=${encodeURIComponent(message)}`;

const uniqueSources = (docs, limit = 3) => {
    const seen = new Set();

    return docs.filter((doc) => {
        const key = `${doc.route}-${doc.title}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    }).slice(0, limit);
};

const sourcesForMessage = (message, docs, limit = 3) => {
    const preferredIds = INTENT_SOURCE_IDS[getIntent(message)] || [];
    const preferredDocs = preferredIds
        .map((id) => allDocuments.find((doc) => doc.id === id))
        .filter(Boolean);

    if (preferredDocs.length > 0) {
        return uniqueSources(preferredDocs, limit);
    }

    return uniqueSources([...preferredDocs, ...docs], limit);
};

const getDeterministicAnswer = (message, docs) => {
    const intent = getIntent(message);
    const sentences = getRelevantSentences(docs, message, 4);

    switch (intent) {
        case 'greeting':
            return `Namaste! I am the ${businessProfile.shortName} assistant. I can help with collections, bridal jewellery, BIS/HUID hallmarking, showroom visits, pricing basics, maintenance, buyback, and contact details.`;

        case 'contact':
            return `You can reach ${businessProfile.shortName} here:\n\n- Call/WhatsApp: ${businessProfile.phone}\n- Email: ${businessProfile.email}\n- Showroom: ${businessProfile.address}\n- Timings: ${businessProfile.hours}`;

        case 'hours':
            return `${businessProfile.shortName} showroom timings are ${businessProfile.hours}. For bridal consultations or product availability, it is best to call or WhatsApp ${businessProfile.phone} before visiting.`;

        case 'pricing':
            return `Gold rates and product prices change with the live gold rate, weight, making charges, design complexity, and GST. A common jewellery pricing formula is: gold weight in grams x current gold rate per gram + making charges + GST.\n\nFor today's exact rate, weight, and availability, please call or WhatsApp ${businessProfile.phone}.`;

        case 'quality':
            return `${businessProfile.shortName} focuses on certified jewellery: 100% BIS Hallmarked gold with HUID verification, transparent purity details, and certified diamonds. HUID is a unique 6-character code that helps verify and trace hallmarked gold jewellery.`;

        case 'bridal':
            return `Yes. ${businessProfile.shortName} helps with bridal jewellery, wedding sets, personalised consultations, and custom jewellery. Popular bridal pieces include Rani Haar, necklaces, earrings, Maang Tikka, bangles, rings, and antique-finish sets. Custom work can take around 15-30 days depending on the design, so starting early is recommended.`;

        case 'policy':
            return `${businessProfile.shortName} highlights easy returns, lifetime maintenance, lifetime buyback, transparent pricing, and after-sales care. Since returns, exchange, maintenance, polishing, repair, and buyback can depend on the exact piece, purity, bill, and condition, please confirm details directly with the showroom.`;

        case 'collections':
            return `${businessProfile.shortName} offers gold, diamond, antique, and silver jewellery. Website collections include earrings, necklaces, rings, bangles, pendants, men chains, Maang Tikka, Gold Set, Wedding Set, Rani Haar, Antique Pendant, and Heavy Necklace designs. You can browse the catalog or ask the showroom about exact availability.`;

        case 'careers':
            return `For jobs or applications, please visit the Careers page and apply online. The team can also guide you at ${businessProfile.phone} if you need help with an application.`;

        default:
            if (sentences.length === 0) {
                return `I can help with ${businessProfile.shortName} collections, BIS/HUID hallmarking, gold pricing basics, bridal consultations, custom jewellery, showroom visits, maintenance, and buyback. For anything very specific, WhatsApp ${businessProfile.phone} and the team can confirm it.`;
            }

            return `Here is what I found from ${businessProfile.shortName}'s website:\n\n${sentences.map((sentence) => `- ${sentence}`).join('\n')}\n\nFor exact pricing, current stock, or a personalised recommendation, please call or WhatsApp ${businessProfile.phone}.`;
    }
};

export const buildRagPayload = (message, history = [], docs = []) => ({
    message,
    history: history.slice(-8).map(({ role, content }) => ({ role, content })),
    business: {
        name: businessProfile.name,
        phone: businessProfile.phone,
        email: businessProfile.email,
        address: businessProfile.address,
        hours: businessProfile.hours,
    },
    context: docs.map(({ id, title, route, content }) => ({
        id,
        title,
        route,
        content,
    })),
    instructions:
        'Answer as SGV Jewellers customer support. Use only the provided context. If live rates, stock, availability, or policy exceptions are requested, ask the visitor to call or WhatsApp the showroom. Keep answers concise and helpful.',
});

export const getChatbotResponse = async (message, history = []) => {
    const docs = retrieveRelevantDocs(message, 5);
    const apiUrl = import.meta.env.VITE_CHATBOT_API_URL?.trim();

    if (apiUrl) {
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(buildRagPayload(message, history, docs)),
            });

            if (!response.ok) throw new Error(`Chatbot API responded with ${response.status}`);

            const payload = await response.json();
            const answer = payload.answer || payload.message || payload.response;

            if (answer) {
                return {
                    answer,
                    sources: sourcesForMessage(message, docs),
                    usedApi: true,
                    whatsappHref: makeWhatsAppLink(`Hello SGV Jewellers, I need help with: ${message}`),
                };
            }
        } catch (error) {
            console.error('Chatbot API failed; using local RAG fallback:', error);
        }
    }

    return {
        answer: getDeterministicAnswer(message, docs),
        sources: sourcesForMessage(message, docs),
        usedApi: false,
        whatsappHref: makeWhatsAppLink(`Hello SGV Jewellers, I need help with: ${message}`),
    };
};
