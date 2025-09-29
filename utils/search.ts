export function matchesFullText(texts: string[], query: string) {
    if (!query) return true;
    const q = query.toLocaleLowerCase();
    // split into tokens by whitespace, remove empty
    const tokens = q.split(/\s+/).filter(Boolean);
    if (tokens.length === 0) return true;


    // For each token, require at least one of the texts contains it
    return tokens.every(token => texts.some(t => t.toLocaleLowerCase().includes(token)));
}