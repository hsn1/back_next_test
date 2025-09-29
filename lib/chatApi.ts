
export async function fetchChatAnswer(message: string) {
    const CHAT_API = process.env.NEXT_PUBLIC_CHAT_API;
    try {
        const res = await fetch(CHAT_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message }),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || "Chat API error");
        }
        return await res.json();
    } catch (err: any) {
        throw new Error(err.message || "Unknown error");
    }
}
