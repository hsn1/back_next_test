import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ArticleList from '../../components/ArticleList';
import { fetchChatAnswer } from '../../lib/chatApi';

type Article = { id: string; title: string; date: string; summary: string };
type ChatResponse = { answer: string; sources: string[] };

export default function ArticlesPage() {
    const router = useRouter();
    const { query: routerQuery } = router;

    // cehck query url, do a regex for it
    const match = router.asPath.match(/query=([^&]+)/);
    const queryValue = match ? decodeURIComponent(match[1]) : null;

    const match2 = router.asPath.match(/sort=([^&]+)/);
    const sortValue = match2 ? match2[1] : null;

    const initialQuery = (queryValue as string) || '';
    const initialSort =
        (routerQuery.sort as 'asc' | 'desc') && ['asc', 'desc'].includes(sortValue as string)
            ? (routerQuery.sort as 'asc' | 'desc')
            : 'desc';

    const [query, setQuery] = useState(initialQuery);
    const [sort, setSort] = useState<'asc' | 'desc'>(initialSort);
    const [articles, setArticles] = useState<Article[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // --- Chatbot var ---
    const [chatInput, setChatInput] = useState('');
    const [chatResponse, setChatResponse] = useState<ChatResponse | null>(null);
    const [chatLoading, setChatLoading] = useState(false);

    useEffect(() => {
        let mounted = true;
        async function load() {
            setLoading(true);
            setError(null);
            try {
                const params = new URLSearchParams();
                if (query) params.set('query', query);
                params.set('sort', sort);
                const res = await fetch(`/api/articles?${params.toString()}`);
                if (!res.ok) throw new Error((await res.json()).error || 'Fetch error');
                const body = await res.json();
                if (mounted) setArticles(body.data);
            } catch (e: any) {
                if (mounted) setError(e.message || 'Unknown error');
            } finally {
                if (mounted) setLoading(false);
            }
        }
        load();
        return () => {
            mounted = false;
        };
    }, [query, sort]);

    async function handleChat() {
        if (!chatInput.trim()) return;
        setChatLoading(true);
        setChatResponse(null);
        try {
            const result = await fetchChatAnswer(chatInput);
            setChatResponse(result);
        } catch (err: any) {
            setChatResponse({ answer: `Error: ${err.message}`, sources: [] });
        } finally {
            setChatLoading(false);
        }
    }

    return (
        <main style={{ maxWidth: 800, margin: '24px auto', padding: 16 }}>
            <h1>Articles</h1>

            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <input
                    aria-label="search"
                    placeholder="Search titles and summaries..."
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    style={{ flex: 1, padding: 8 }}
                />
                <button onClick={() => setSort(s => (s === 'desc' ? 'asc' : 'desc'))}>
                    Sort: {sort === 'desc' ? 'Most recent' : 'Oldest first'}
                </button>
            </div>

            {loading && <div>Loading...</div>}
            {error && <div style={{ color: 'red' }}>Error: {error}</div>}
            {!loading && !error && articles?.length === 0 && <div>No results. Try a different search.</div>}
            {!loading && !error && articles && articles.length > 0 && <ArticleList articles={articles} />}

            {/* --- Chatbot section --- */}
            <hr style={{ margin: '24px 0' }} />
            <h2>Ask the Finance Chatbot</h2>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <input
                    aria-label="chat"
                    placeholder="Ask a finance question..."
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    style={{ flex: 1, padding: 8 }}
                />
                <button onClick={handleChat} disabled={chatLoading}>
                    {chatLoading ? 'Asking...' : 'Ask'}
                </button>
            </div>
            {chatResponse && (
                <div style={{ background: '#f5f5f5', padding: 12, borderRadius: 8 }}>
                    <strong>Answer:</strong> {chatResponse.answer}
                    {chatResponse.sources.length > 0 && (
                        <div style={{ fontSize: '0.9em', marginTop: 4 }}>
                            <strong>Sources:</strong> {chatResponse.sources.join(', ')}
                        </div>
                    )}
                </div>
            )}
        </main>
    );
}
