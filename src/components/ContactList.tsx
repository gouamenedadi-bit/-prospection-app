import { SUPPORT_CONTACTS, whatsappLink } from "@/lib/contacts";

/** Les numéros du support, chacun avec un bouton Appeler et un bouton WhatsApp. */
export default function ContactList({ message }: { message?: string }) {
  return (
    <ul className="space-y-2">
      {SUPPORT_CONTACTS.map((c) => (
        <li key={c.tel} className="rounded-xl border border-line bg-white p-3">
          <span className="block font-mono text-[15px] font-semibold text-forest tabular-nums mb-2.5">{c.display}</span>
          <div className="grid grid-cols-2 gap-2">
          <a
            href={`tel:${c.tel}`}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-palm-light px-3 py-2 text-xs font-bold text-palm transition-colors hover:bg-palm hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            aria-label={`Appeler le ${c.display}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true"><path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1.9.4 1.8.7 2.7a2 2 0 01-.5 2.1L8 9.8a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.4c.9.3 1.8.6 2.7.7a2 2 0 011.7 2z" /></svg>
            Appeler
          </a>
          <a
            href={whatsappLink(c.whatsapp, message)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#E7F7EE] px-3 py-2 text-xs font-bold text-[#128C4B] transition-colors hover:bg-[#128C4B] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            aria-label={`Écrire sur WhatsApp au ${c.display}`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2zm0 18.2a8.2 8.2 0 01-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1112 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 01-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 00-.7.3 3 3 0 00-.9 2.2 5.2 5.2 0 001.1 2.8 11.9 11.9 0 004.6 4c1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3z" /></svg>
            WhatsApp
          </a>
          </div>
        </li>
      ))}
    </ul>
  );
}
