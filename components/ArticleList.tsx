import React from 'react';


type Article = { id: string; title: string; date: string; summary: string };


export default function ArticleList({ articles }: { articles: Article[] }) {
    return (
        <div>
            {articles.map(a => (
                <article key={a.id} style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                    <h3 style={{ margin: 0 }}>{a.title}</h3>
                    <div style={{ fontSize: 12, color: '#666' }}>{new Date(a.date).toLocaleDateString()}</div>
                    <p style={{ marginTop: 8 }}>{a.summary}</p>
                </article>
            ))}
        </div>
    );
}