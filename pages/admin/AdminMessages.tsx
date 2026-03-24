import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "@/lib/firebase";
import { Mail } from "lucide-react";

interface Message { id: string; name: string; email: string; phone: string; service: string; message: string; date: string; }

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const unsub = onValue(ref(db, "quoteRequests"), (snap) => {
      if (snap.exists()) {
        setMessages(
          Object.entries(snap.val())
            .map(([id, val]: any) => ({ id, ...val }))
            .filter((m: any) => m.message)
            .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
        );
      } else setMessages([]);
    });
    return () => unsub();
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-extrabold text-foreground">Contact Messages</h1>
        <p className="text-sm text-muted-foreground">Customer messages from quote requests.</p>
      </div>
      <div className="space-y-4">
        {messages.map((m) => (
          <div key={m.id} className="rounded-xl border bg-card p-5 card-shadow">
            <div className="mb-3 flex items-start justify-between">
              <div>
                <h3 className="font-bold text-foreground">{m.name}</h3>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{m.phone}</span>
                  {m.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {m.email}</span>}
                </div>
              </div>
              <span className="text-xs text-muted-foreground">{new Date(m.date).toLocaleDateString()}</span>
            </div>
            <p className="text-sm text-muted-foreground">{m.message}</p>
            <div className="mt-2 text-xs font-medium text-primary">{m.service}</div>
          </div>
        ))}
        {messages.length === 0 && <p className="text-center text-muted-foreground">No messages yet.</p>}
      </div>
    </div>
  );
}
