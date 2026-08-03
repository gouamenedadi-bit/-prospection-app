const fs = require('fs');

let html = fs.readFileSync('C:/Users/HP/Documents/PROSPECTION LONGRICH/presentation_prospection_longrich2026.html', 'utf8');

// Replace Stockiste -> Prospection
html = html.replace(/Stockistes/g, 'Prospections');
html = html.replace(/Stockiste/g, 'Prospection');
html = html.replace(/stockistes/g, 'prospections');
html = html.replace(/stockiste/g, 'prospection');

// Extract styles
const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
const styles = styleMatch ? styleMatch[1] : '';

// Extract body (excluding scripts and toast)
const bodyMatch = html.match(/<body>([\s\S]*?)<div id="toast"/);
let body = bodyMatch ? bodyMatch[1] : '';

// Replace class with className
body = body.replace(/class=/g, 'className=');

// Fix unclosed tags (img, input, hr, br)
body = body.replace(/<img(.*?[^\/])>/g, '<img$1 />');
body = body.replace(/<input(.*?[^\/])>/g, '<input$1 />');
body = body.replace(/<br(.*?[^\/])>/g, '<br$1 />');
body = body.replace(/<hr(.*?[^\/])>/g, '<hr$1 />');

// Handle style="..."
body = body.replace(/style="(.*?)"/g, (match, p1) => {
  const css = p1.split(';').filter(Boolean).reduce((acc, rule) => {
    const parts = rule.split(':');
    if(parts.length < 2) return acc;
    const key = parts[0].trim();
    const val = parts.slice(1).join(':').trim();
    if(!key || !val) return acc;
    const camelKey = key.replace(/-([a-z])/g, g => g[1].toUpperCase());
    acc[camelKey] = val;
    return acc;
  }, {});
  return 'style={' + JSON.stringify(css) + '}';
});

// Remove onclick strings and use onClick hook placeholder
body = body.replace(/onclick=".*?"/g, 'onClick={handleStoreToast}');

const pageContent = `"use client";
import React, { useEffect, useState } from 'react';

export default function Presentation() {
  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('in'); });
    }, {threshold:0.15});
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleStoreToast = (e) => {
    if(e) e.preventDefault();
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2400);
  };

  return (
    <div className="presentation-page">
      <style dangerouslySetInnerHTML={{ __html: \`${styles}\` }} />
      
      ${body}

      <div 
        id="toast" 
        style={{
          position: 'fixed', bottom: '28px', left: '50%', transform: toastVisible ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(20px)',
          background: '#173B2C', color: '#fff', padding: '14px 22px', borderRadius: '12px',
          fontFamily: '"Manrope", sans-serif', fontSize: '13.5px', fontWeight: 700,
          opacity: toastVisible ? 1 : 0, transition: 'opacity .25s, transform .25s',
          zIndex: 200, boxShadow: '0 14px 30px rgba(0,0,0,0.25)', pointerEvents: toastVisible ? 'auto' : 'none'
        }}
      >
        Bientôt disponible sur Android et iOS 🚀
      </div>
    </div>
  );
}
`;

fs.mkdirSync('src/app/presentation', { recursive: true });
fs.writeFileSync('src/app/presentation/page.tsx', pageContent);
console.log('Conversion successful!');
