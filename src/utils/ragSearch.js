import { blogPosts } from '../data/blogData';
import { businessProfile, chatbotKnowledgeBase } from '../data/chatbotKnowledge';

const STOP_WORDS = new Set([
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'can', 'could', 'do', 'does', 'for', 'from',
    'have', 'how', 'i', 'in', 'is', 'it', 'me', 'my', 'of', 'on', 'or', 'our', 'please', 'the',
    'to', 'us', 'we', 'what', 'when', 'where', 'which', 'who', 'with', 'you', 'your',
    'aur', 'bataiye', 'batao', 'hai', 'hain', 'ji', 'ka', 'kaha', 'kaise', 'karu', 'ke', 'ki',
    'kya', 'me', 'mein', 'mujhe', 'se',
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
    daam: ['price', 'pricing', 'rate', 'cost'],
    diamond: ['certified', 'gem', 'stones'],
    bhav: ['price', 'pricing', 'rate', 'cost'],
    gold: ['22k', '916', 'hallmark', 'rate', 'purity'],
    job: ['career', 'hiring', 'apply', 'vacancy'],
    kidhar: ['address', 'location', 'showroom', 'directions'],
    open: ['hours', 'timing', 'showroom'],
    price: ['pricing', 'cost', 'rate', 'weight', 'making', 'charges', 'gst'],
    repair: ['maintenance', 'polish', 'cleaning', 'service'],
    silver: ['925', 'sterling', 'chandi', 'payal', 'kada', 'pooja', 'coin', 'clean'],
    kitna: ['price', 'pricing', 'rate', 'cost'],
    whatsapp: ['contact', 'message', 'phone'],
};

const ALLOWED_SCOPE_TERMS = new Set([
    '916', 'about', 'address', 'antique', 'apply', 'appointment', 'bangle', 'bangles', 'bhav',
    'bis', 'bridal', 'bride', 'burhanpur', 'buyback', 'career', 'care', 'catalog', 'certificate',
    'certified', 'chain', 'chandi', 'clean', 'collection', 'collections', 'contact', 'custom',
    'customised', 'customized', 'daam', 'diamond', 'directions', 'earring', 'earrings', 'email',
    'exchange', 'gold', 'hallmark', 'hallmarked', 'haar', 'hours', 'huid', 'investment',
    'jeweller', 'jewellers', 'jewellery', 'jewelry', 'job', 'kitna', 'location', 'maintenance',
    'making', 'necklace', 'open', 'pendant', 'phone', 'polish', 'price', 'pricing', 'purity',
    'rate', 'repair', 'return', 'rings', 'sgv', 'shop', 'showroom', 'silver', 'stock', 'store',
    'timing', 'visit', 'wedding', 'whatsapp',
]);

const LIVE_QUERY_PATTERN =
    /((today|current|live|latest|aaj|abhi).*(rate|price|gold|silver|stock|available|availability|making|charges|discount|offer|scheme|bhav|daam))|((rate|price|stock|available|availability|making|charges|discount|offer|scheme|bhav|daam).*(today|current|live|latest|aaj|abhi))|\b(in stock|available|availability|ready|booking|order status|delivery status|same day|discount|offer|scheme)\b/;

const MIN_GENERAL_SCORE = 4;

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
    if (LIVE_QUERY_PATTERN.test(text)) return 'live';
    if (/(phone|call|whatsapp|email|contact|number|address|location|direction|map|where|showroom)/.test(text)) return 'contact';
    if (/(open|timing|time|hour|today|sunday|monday|visit)/.test(text)) return 'hours';
    if (/(price|rate|cost|gold rate|making|charge|gst|weight|gram|today)/.test(text)) return 'pricing';
    if (/(bis|hallmark|huid|purity|916|22k|certificate|certified)/.test(text)) return 'quality';
    if (/(bridal|wedding|bride|custom|customised|customized|design|consultation)/.test(text)) return 'bridal';
    if (/(return|exchange|buyback|buy back|maintenance|repair|polish|clean)/.test(text)) return 'policy';
    if (/(catalog|collection|product|ring|bangle|necklace|earring|pendant|chain|silver|diamond|antique|gold)/.test(text)) return 'collections';
    if (/(career|job|hiring|apply|vacancy|work)/.test(text)) return 'careers';
    if (/(about|history|legacy|trust|established|owner|founder|family|shroff)/.test(text)) return 'about';

    return 'general';
};

const INTENT_SOURCE_IDS = {
    about: ['business-overview'],
    contact: ['showroom-contact', 'business-overview'],
    hours: ['showroom-contact'],
    live: ['pricing-gold-rate', 'showroom-contact'],
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
        return [];
    }

    const matches = allDocuments
        .map((doc) => ({ ...doc, score: scoreDocument(doc, queryTokens, message) }))
        .filter((doc) => doc.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

    if (matches.length > 0) return matches;

    return [];
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

const isOutOfScope = (message, docs) => {
    const intent = getIntent(message);
    if (intent !== 'general') return false;

    const queryTokens = tokenize(message);
    if (queryTokens.length === 0) return false;

    const hasScopeTerm = queryTokens.some((token) => ALLOWED_SCOPE_TERMS.has(token));
    const topScore = docs[0]?.score || 0;

    return !hasScopeTerm || docs.length === 0 || topScore < MIN_GENERAL_SCORE;
};

const getOutOfScopeAnswer = () =>
    `Namaste ji, is question par main verified SGV Jewellers context ke bahar answer nahi de sakta, taaki aapko galat information na mile.\n\nMain SGV collections, bridal/custom jewellery, BIS/HUID hallmarking, showroom timing, pricing process, jewellery care, maintenance, buyback aur careers ke baare me help kar sakta hoon. Urgent help ke liye please call/WhatsApp ${businessProfile.phone}.`;

const getDeterministicAnswer = (message, docs) => {
    const intent = getIntent(message);
    const sentences = getRelevantSentences(docs, message, 4);

    if (isOutOfScope(message, docs)) {
        return getOutOfScopeAnswer();
    }

    switch (intent) {
        case 'greeting':
            return `Namaste ji! Main ${businessProfile.shortName} ka AI assistant hoon. Aap collections, bridal/custom jewellery, BIS/HUID hallmarking, showroom visit, pricing process, maintenance, buyback ya contact details ke baare me pooch sakte hain.`;

        case 'about':
            return `Namaste ji, ${businessProfile.shortName} Burhanpur ka trusted jewellery showroom hai. Shree Gopaldas Vallabhdas Jewellers ki legacy 1938 se hai, aur store 100% BIS Hallmarked jewellery, transparent pricing, craftsmanship aur family-led service ke liye jaana jaata hai.`;

        case 'contact':
            return `Namaste ji, zaroor. ${businessProfile.shortName} ke details yeh hain:\n\n- Call/WhatsApp: ${businessProfile.phone}\n- Email: ${businessProfile.email}\n- Showroom: ${businessProfile.address}\n- Timings: ${businessProfile.hours}`;

        case 'hours':
            return `Namaste ji, ${businessProfile.shortName} showroom timings: ${businessProfile.hours}.\n\nBridal consultation ya product availability ke liye visit se pehle call/WhatsApp kar dena best rahega: ${businessProfile.phone}.`;

        case 'live':
            return `Namaste ji, live rate, current stock, availability, offers ya same-day delivery jaise details real-time change hote hain. Main guess karke answer nahi dunga.\n\nAccurate aur verified information ke liye please abhi call/WhatsApp karein: ${businessProfile.phone}. SGV team aapko latest rate, weight, availability aur billing details confirm kar degi.`;

        case 'pricing':
            return `Namaste ji, jewellery pricing usually is formula se hoti hai: gold weight in grams x current gold rate per gram + making charges + GST.\n\nGold/silver rates daily change hote hain, aur final price design, weight aur making charges par depend karta hai. Aaj ka exact rate, stock aur billing confirm karne ke liye please call/WhatsApp karein: ${businessProfile.phone}.`;

        case 'quality':
            return `Namaste ji, ${businessProfile.shortName} certified jewellery par focus karta hai: 100% BIS Hallmarked gold, HUID verification, transparent purity details aur certified diamonds. HUID ek unique 6-character code hota hai jisse hallmarked gold jewellery verify aur trace ki ja sakti hai.`;

        case 'bridal':
            return `Namaste ji, haan. ${businessProfile.shortName} bridal jewellery, wedding sets, personalised consultations aur custom jewellery me help karta hai. Popular bridal pieces me Rani Haar, necklaces, earrings, Maang Tikka, bangles, rings aur antique-finish sets aate hain.\n\nCustom work design complexity par depend karta hai; usually 15-30 days ka planning window rakhna better rahega.`;

        case 'policy':
            return `Namaste ji, ${businessProfile.shortName} easy returns, lifetime maintenance, lifetime buyback, transparent pricing aur after-sales care highlight karta hai.\n\nReturn, exchange, repair, polishing ya buyback exact piece, purity, bill aur condition par depend kar sakta hai, isliye final confirmation showroom se lena best rahega: ${businessProfile.phone}.`;

        case 'collections':
            return `Namaste ji, ${businessProfile.shortName} gold, diamond, antique aur silver jewellery offer karta hai. Website par earrings, necklaces, rings, bangles, pendants, men chains, Maang Tikka, Gold Set, Wedding Set, Rani Haar, Antique Pendant aur Heavy Necklace designs listed hain.\n\nExact stock aur latest designs ke liye showroom ko call/WhatsApp karna best rahega.`;

        case 'careers':
            return `Namaste ji, jobs ya applications ke liye Careers page par apply kar sakte hain. Agar application me help chahiye ho to SGV team ko call/WhatsApp kar sakte hain: ${businessProfile.phone}.`;

        default:
            if (sentences.length === 0) {
                return getOutOfScopeAnswer();
            }

            return `Namaste ji, ${businessProfile.shortName} ke verified website context se yeh information mili:\n\n${sentences.map((sentence) => `- ${sentence}`).join('\n')}\n\nExact live pricing, current stock ya personalised recommendation ke liye please call/WhatsApp karein: ${businessProfile.phone}.`;
    }
};

export const buildRagPayload = (message, history = [], docs = []) => ({
    message,
    detectedIntent: getIntent(message),
    requiresLiveVerification: getIntent(message) === 'live',
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
        'Answer as SGV Jewellers customer support in warm Indian Hinglish, starting politely when natural with Namaste ji. Use only the provided SGV context or verified live business data. Do not hallucinate, invent rates, invent stock, invent offers, or answer unrelated topics. If the user asks outside SGV jewellery/business scope, refuse politely and explain you can help only with SGV collections, BIS/HUID, showroom, pricing process, care, policies, bridal/custom jewellery, and careers. If live rates, current stock, availability, offers, delivery status, or policy exceptions are requested, answer only when verified live data is available and return verifiedLiveData: true; otherwise ask the visitor to call or WhatsApp the showroom. Keep answers concise and welcoming.',
});

export const getChatbotResponse = async (message, history = []) => {
    const docs = retrieveRelevantDocs(message, 5);
    const intent = getIntent(message);
    const apiUrl = import.meta.env.VITE_CHATBOT_API_URL?.trim();

    if (isOutOfScope(message, docs)) {
        return {
            answer: getOutOfScopeAnswer(),
            sources: [],
            usedApi: false,
            whatsappHref: makeWhatsAppLink(`Hello SGV Jewellers, I need help with: ${message}`),
        };
    }

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

            if (payload.outOfScope === true) {
                return {
                    answer: getOutOfScopeAnswer(),
                    sources: [],
                    usedApi: true,
                    whatsappHref: makeWhatsAppLink(`Hello SGV Jewellers, I need help with: ${message}`),
                };
            }

            if (answer) {
                if (intent === 'live' && payload.verifiedLiveData !== true) {
                    return {
                        answer: getDeterministicAnswer(message, docs),
                        sources: sourcesForMessage(message, docs),
                        usedApi: false,
                        whatsappHref: makeWhatsAppLink(`Hello SGV Jewellers, I need help with: ${message}`),
                    };
                }

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
