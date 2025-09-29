import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { articlesQuerySchema } from '../../lib/validate';


type Article = { id: string; title: string; date: string; summary: string };
const ARTICLE_PATH = process.env.ARTICLE_PATH;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const parsed = articlesQuerySchema.parse(req.query);



        const file = path.join(process.cwd(), 'data', ARTICLE_PATH);
        const raw = fs.readFileSync(file, 'utf-8');
        const all: Article[] = JSON.parse(raw);


        const q = parsed.query;

        const filtered = all.filter(a => {
            if (!q) return true;
            const hay = [a.title, a.summary];
            // smiple search(by tokens) maybe we can ameliorate it later
            const qLow = q.toLocaleLowerCase();
            const tokens = qLow.split(/\s+/).filter(Boolean);
            return tokens.every(tok => hay.some(h => h.toLocaleLowerCase().includes(tok)));
        });


        // sort by date 
        const sorted = filtered.sort((a, b) => {
            if (parsed.sort === 'asc') return a.date.localeCompare(b.date);
            return b.date.localeCompare(a.date);
        });


        res.status(200).json({ data: sorted });
    } catch (err: any) {
        if (err?.errors) {
            return res.status(400).json({ error: 'Invalid query', details: err.errors });
        }
        console.error(err);
        res.status(500).json({ error: 'Internal error' });
    }
}