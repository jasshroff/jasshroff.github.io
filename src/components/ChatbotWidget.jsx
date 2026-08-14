import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Bot,
    ExternalLink,
    Loader2,
    MessageCircle,
    Minimize2,
    Phone,
    Send,
    Sparkles,
    User,
    X,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
    businessProfile,
    chatbotQuickPrompts,
} from '../data/chatbotKnowledge';
import { getChatbotResponse } from '../utils/ragSearch';

const INITIAL_MESSAGE = {
    id: 'welcome',
    role: 'assistant',
    content:
        'Namaste! I am the SGV Jewellers assistant. Ask me about collections, bridal jewellery, BIS/HUID hallmarking, showroom timings, gold pricing basics, maintenance, or buyback.',
    sources: [],
};

const MessageBubble = ({ message }) => {
    const isUser = message.role === 'user';

    return (
        <div className={`flex gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
            {!isUser && (
                <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gold-100 text-gold-700">
                    <Bot className="h-4 w-4" />
                </div>
            )}

            <div className={`max-w-[82%] ${isUser ? 'order-first' : ''}`}>
                <div
                    className={`whitespace-pre-line rounded-lg px-4 py-3 text-sm leading-relaxed shadow-sm ${
                        isUser
                            ? 'bg-maroon-950 text-white'
                            : 'border border-gray-100 bg-white text-gray-700'
                    }`}
                >
                    {message.content}
                </div>

                {!isUser && message.sources?.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                        {message.sources.map((source) => (
                            <Link
                                key={source.id}
                                to={source.route}
                                className="inline-flex max-w-full items-center gap-1 rounded-full border border-gold-200 bg-gold-50 px-2.5 py-1 text-[11px] font-medium text-maroon-900 transition-colors hover:border-gold-400 hover:text-gold-700"
                            >
                                <span className="truncate">{source.title}</span>
                                <ExternalLink className="h-3 w-3 flex-shrink-0" />
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {isUser && (
                <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-maroon-950 text-white">
                    <User className="h-4 w-4" />
                </div>
            )}
        </div>
    );
};

const ChatbotWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([INITIAL_MESSAGE]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const scrollRef = useRef(null);
    const inputRef = useRef(null);
    const messageIdRef = useRef(0);

    const getMessageId = (prefix) => {
        messageIdRef.current += 1;
        return `${prefix}-${messageIdRef.current}`;
    };

    useEffect(() => {
        if (!scrollRef.current) return;
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages, isThinking, isOpen]);

    useEffect(() => {
        if (!isOpen) return;
        const timer = window.setTimeout(() => inputRef.current?.focus(), 180);
        return () => window.clearTimeout(timer);
    }, [isOpen]);

    const sendMessage = async (rawMessage) => {
        const content = rawMessage.trim();
        if (!content || isThinking) return;

        const userMessage = {
            id: getMessageId('user'),
            role: 'user',
            content,
        };

        const nextMessages = [...messages, userMessage];
        setMessages(nextMessages);
        setInput('');
        setIsThinking(true);

        try {
            const response = await getChatbotResponse(content, nextMessages);
            setMessages((currentMessages) => [
                ...currentMessages,
                {
                    id: getMessageId('assistant'),
                    role: 'assistant',
                    content: response.answer,
                    sources: response.sources,
                    whatsappHref: response.whatsappHref,
                    usedApi: response.usedApi,
                },
            ]);
        } catch (error) {
            console.error('Chatbot response failed:', error);
            setMessages((currentMessages) => [
                ...currentMessages,
                {
                    id: getMessageId('assistant-error'),
                    role: 'assistant',
                    content:
                        'I could not answer that right now. Please call or WhatsApp +91 917-955-9000 and the SGV team will help you directly.',
                    sources: [],
                },
            ]);
        } finally {
            setIsThinking(false);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        sendMessage(input);
    };

    return (
        <div className="fixed bottom-4 right-4 z-[80] sm:bottom-6 sm:right-6">
            <AnimatePresence>
                {isOpen && (
                    <motion.section
                        initial={{ opacity: 0, y: 24, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.98 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        aria-label="SGV AI assistant chat"
                        className="mb-3 flex h-[min(680px,calc(100vh-104px))] w-[calc(100vw-32px)] flex-col overflow-hidden rounded-lg border border-gold-200 bg-gray-50 shadow-2xl sm:w-[420px]"
                    >
                        <div className="bg-maroon-950 px-4 py-4 text-white">
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gold-500 text-white">
                                        <Sparkles className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h2 className="font-serif text-lg font-bold leading-tight">
                                            SGV AI Assistant
                                        </h2>
                                        <p className="text-xs text-gold-100">
                                            24/7 guidance for visitors
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    aria-label="Minimize assistant"
                                    className="rounded-full p-2 text-gold-100 transition-colors hover:bg-white/10 hover:text-white"
                                >
                                    <Minimize2 className="h-4 w-4" />
                                </button>
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-2">
                                <a
                                    href={businessProfile.phoneHref}
                                    className="inline-flex items-center justify-center gap-2 rounded bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-white/20"
                                >
                                    <Phone className="h-3.5 w-3.5" />
                                    Call
                                </a>
                                <a
                                    href={`${businessProfile.whatsappHref}?text=${encodeURIComponent('Hello SGV Jewellers, I need assistance.')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2 rounded bg-green-600 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-green-700"
                                >
                                    <MessageCircle className="h-3.5 w-3.5" />
                                    WhatsApp
                                </a>
                            </div>
                        </div>

                        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
                            {messages.map((message) => (
                                <MessageBubble key={message.id} message={message} />
                            ))}

                            {isThinking && (
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-100 text-gold-700">
                                        <Bot className="h-4 w-4" />
                                    </div>
                                    <div className="inline-flex items-center gap-2 rounded-lg border border-gray-100 bg-white px-4 py-3 shadow-sm">
                                        <Loader2 className="h-4 w-4 animate-spin text-gold-600" />
                                        Checking SGV knowledge...
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="border-t border-gray-200 bg-white p-3">
                            <div className="mb-3 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                                {chatbotQuickPrompts.map((prompt) => (
                                    <button
                                        key={prompt}
                                        type="button"
                                        onClick={() => sendMessage(prompt)}
                                        disabled={isThinking}
                                        className="flex-shrink-0 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:border-gold-400 hover:text-maroon-950 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {prompt}
                                    </button>
                                ))}
                            </div>

                            <form onSubmit={handleSubmit} className="flex items-end gap-2">
                                <label className="sr-only" htmlFor="sgv-chatbot-message">
                                    Ask SGV AI Assistant
                                </label>
                                <textarea
                                    ref={inputRef}
                                    id="sgv-chatbot-message"
                                    value={input}
                                    onChange={(event) => setInput(event.target.value)}
                                    onKeyDown={(event) => {
                                        if (event.key === 'Enter' && !event.shiftKey) {
                                            event.preventDefault();
                                            handleSubmit(event);
                                        }
                                    }}
                                    rows={1}
                                    placeholder="Ask about collections, gold rates, BIS, bridal..."
                                    className="max-h-24 min-h-[44px] flex-1 resize-none rounded border border-gray-200 bg-gray-50 px-3 py-3 text-sm text-gray-800 outline-none transition-colors placeholder:text-gray-400 focus:border-gold-500 focus:bg-white focus:ring-1 focus:ring-gold-500"
                                />
                                <button
                                    type="submit"
                                    disabled={isThinking || input.trim().length === 0}
                                    aria-label="Send message"
                                    className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded bg-gold-500 text-white shadow-sm transition-colors hover:bg-gold-600 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {isThinking ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Send className="h-4 w-4" />
                                    )}
                                </button>
                            </form>

                            <p className="mt-2 text-[11px] leading-relaxed text-gray-400">
                                AI answers use SGV website knowledge. Confirm live rates, stock, and billing with the showroom.
                            </p>
                        </div>
                    </motion.section>
                )}
            </AnimatePresence>

            <button
                type="button"
                onClick={() => setIsOpen((current) => !current)}
                aria-label={isOpen ? 'Close SGV AI Assistant' : 'Open SGV AI Assistant'}
                aria-expanded={isOpen}
                className="group ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold-500 text-white shadow-xl ring-4 ring-white transition-all hover:bg-gold-600 hover:shadow-2xl focus:outline-none focus:ring-gold-200 sm:h-16 sm:w-16"
            >
                <AnimatePresence mode="wait" initial={false}>
                    {isOpen ? (
                        <motion.span
                            key="close"
                            initial={{ opacity: 0, rotate: -45 }}
                            animate={{ opacity: 1, rotate: 0 }}
                            exit={{ opacity: 0, rotate: 45 }}
                            transition={{ duration: 0.15 }}
                        >
                            <X className="h-6 w-6" />
                        </motion.span>
                    ) : (
                        <motion.span
                            key="open"
                            initial={{ opacity: 0, rotate: 45 }}
                            animate={{ opacity: 1, rotate: 0 }}
                            exit={{ opacity: 0, rotate: -45 }}
                            transition={{ duration: 0.15 }}
                            className="relative"
                        >
                            <MessageCircle className="h-7 w-7" />
                            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-white" />
                        </motion.span>
                    )}
                </AnimatePresence>
            </button>
        </div>
    );
};

export default ChatbotWidget;
