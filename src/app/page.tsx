"use client";
import React, { useEffect, useState } from 'react';

export default function Presentation() {
  const [toastVisible, setToastVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('in'); });
    }, {threshold:0.15});
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleStoreToast = (e?: React.MouseEvent) => {
    if(e) e.preventDefault();
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2400);
  };

  return (
    <div className="presentation-page">
      <style dangerouslySetInnerHTML={{ __html: `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,560;0,9..144,650;0,9..144,780;1,9..144,560&family=Manrope:wght@400;500;600;700;800&display=swap');

:root{
  --forest:#173B2C;
  --forest-deep:#0F2A1F;
  --palm:#1F6E4A;
  --palm-light:#E7F2EB;
  --gold:#D98B2B;
  --gold-light:#FBEAD2;
  --clay:#B5552B;
  --cream:#F6F2E7;
  --cream-deep:#EFE8D6;
  --ink:#20231F;
  --ink-soft:#5B6358;
  --line:#E1DAC4;
  --white:#FFFFFF;
}
*{box-sizing:border-box;}
html{scroll-behavior:smooth;}
body{
  margin:0;
  font-family:'Manrope',sans-serif;
  background:var(--cream);
  color:var(--ink);
  -webkit-font-smoothing:antialiased;
  overflow-x:hidden;
}
.presentation-page{width:100%;}
.wrap{max-width:1160px;margin:0 auto;padding:0 32px;}
h1,h2,h3{font-family:'Fraunces',serif;font-weight:650;line-height:1.05;margin:0;letter-spacing:-0.01em;}
em{font-style:italic;color:var(--gold);}
a{color:inherit;}
.eyebrow{
  font-size:12.5px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;
  display:inline-flex;align-items:center;gap:8px;
}
.eyebrow::before{content:"";width:7px;height:7px;border-radius:50%;background:var(--gold);display:inline-block;}

.reveal{opacity:0;transform:translateY(24px);transition:opacity .7s cubic-bezier(.2,.7,.2,1), transform .7s cubic-bezier(.2,.7,.2,1);}
.reveal.in{opacity:1;transform:translateY(0);}
@media (prefers-reduced-motion: reduce){.reveal{opacity:1;transform:none;transition:none;}}

@keyframes marquee {
  0% { transform: translateX(100vw); }
  100% { transform: translateX(-100%); }
}

.mini-card, .testi-card, .step, .phone-card {
  transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.3s ease;
}
.mini-card:hover, .testi-card:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 32px 64px -24px rgba(23,59,44,0.4);
}
.step:hover {
  transform: scale(1.03);
  z-index: 10;
  border-radius: 14px;
}
.phone {
  transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.4s ease;
}
.phone:hover {
  transform: rotate(0deg) scale(1.08);
  box-shadow: 0 60px 100px -30px rgba(0,0,0,0.8), 0 0 0 2px rgba(217,139,43,0.3);
  z-index: 20;
}

.nav{
  position:sticky;top:0;z-index:50;background:rgba(246,242,231,0.88);backdrop-filter:blur(10px);
  border-bottom:1px solid var(--line);
}
.nav-inner{display:flex;align-items:center;justify-content:space-between;padding:16px 32px;max-width:1160px;margin:0 auto;}
.brand{display:flex;align-items:center;gap:10px;font-family:'Fraunces',serif;font-weight:700;font-size:19px;color:var(--forest);}
.brand-mark{
  width:34px;height:34px;border-radius:9px;background:var(--forest);display:flex;align-items:center;justify-content:center;flex-shrink:0;
}
.brand-mark svg{width:18px;height:18px;}
.nav-links{display:flex;gap:30px;font-size:14.5px;font-weight:600;color:var(--ink-soft);}
.nav-links a{text-decoration:none;transition:all .2s ease;display:inline-block;}
.nav-links a:hover{color:var(--palm);transform:translateY(-2px) scale(1.05);}
.nav-cta{
  background:var(--forest);color:#fff;border:none;padding:11px 20px;border-radius:30px;font-weight:700;font-size:13.5px;
  cursor:pointer;font-family:inherit;display:inline-block;transition:all .2s ease;
}
.nav-cta:hover{
  transform:translateY(-2px) scale(1.05);
  box-shadow:0 8px 16px rgba(23,59,44,0.25);
  background:var(--forest-deep);
}
.nav-burger{display:none;background:none;border:none;cursor:pointer;padding:6px;color:var(--forest);align-items:center;justify-content:center;}
.mobile-menu{
  position:absolute;top:100%;left:0;right:0;background:var(--cream);border-bottom:1px solid var(--line);
  box-shadow:0 16px 28px -16px rgba(23,59,44,0.25);display:flex;flex-direction:column;
  max-height:0;overflow:hidden;transition:max-height .3s ease;
}
.mobile-menu.open{max-height:420px;}
.mobile-menu a{
  padding:14px 24px;font-weight:700;font-size:15px;color:var(--ink);text-decoration:none;
  border-top:1px solid var(--line);
}
.mobile-menu a:first-child{border-top:none;}
@media (max-width:920px){
  .nav-links{display:none;}
  .nav-burger{display:inline-flex;}
}
@media (min-width:921px){.mobile-menu{display:none;}}

.hero{
  background:radial-gradient(circle at 18% -10%, #1F4F3A 0%, var(--forest) 45%, var(--forest-deep) 100%);
  color:#fff;position:relative;overflow:hidden;padding:0;
}
.hero-pattern{
  position:absolute;inset:0;opacity:.5;
  background-image:
    radial-gradient(circle at 92% 8%, rgba(217,139,43,0.16) 0%, transparent 38%),
    radial-gradient(circle at 6% 70%, rgba(255,255,255,0.06) 0%, transparent 45%);
  pointer-events:none;
}
.hero-inner{
  position:relative;display:grid;grid-template-columns:1.05fr 0.95fr;gap:40px;align-items:center;
  max-width:1160px;margin:0 auto;padding:64px 32px 0;
}
.hero-eyebrow{color:var(--gold-light);}
.hero-eyebrow::before{background:var(--gold);}
.hero h1{
  font-size:54px;color:#fff;margin:22px 0 22px;max-width:560px;
}
.hero p.lede{font-size:18px;line-height:1.55;color:#D8E6DC;max-width:480px;margin:0 0 32px;}
.hero-ctas{display:flex;gap:14px;flex-wrap:wrap;margin-bottom:38px;}
.btn{
  display:inline-flex;align-items:center;gap:9px;border-radius:30px;font-weight:700;font-size:14.5px;
  padding:15px 26px;cursor:pointer;border:none;font-family:inherit;transition:transform .15s, box-shadow .15s;
}
.btn:active{transform:scale(.97);}
.btn-gold{background:var(--gold);color:var(--forest-deep);box-shadow:0 10px 24px -8px rgba(217,139,43,0.55);}
.btn-gold:hover{box-shadow:0 14px 28px -8px rgba(217,139,43,0.7);}
.btn-ghost{background:rgba(255,255,255,0.08);color:#fff;border:1.5px solid rgba(255,255,255,0.28);}
.btn-ghost:hover{background:rgba(255,255,255,0.16);}

.hero-trust{display:flex;gap:28px;flex-wrap:wrap;padding-bottom:54px;border-top:1px solid rgba(255,255,255,0.14);padding-top:26px;}
.trust-stat b{font-family:'Fraunces',serif;font-size:23px;font-weight:650;display:block;color:#fff;}
.trust-stat span{font-size:12.5px;color:#AFC8B9;font-weight:600;}

.hero-visual{position:relative;display:flex;justify-content:center;padding-bottom:30px;}
.phone{
  width:280px;height:572px;background:var(--forest-deep);border-radius:38px;border:7px solid #0A1F16;
  box-shadow:0 50px 80px -30px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.05);
  transform:rotate(4deg);position:relative;overflow:hidden;
}
.phone-screen{position:absolute;inset:0;background:#EDEAE0;display:flex;flex-direction:column;}
.phone-status{height:24px;background:var(--forest-deep);flex-shrink:0;}
.phone-head{background:var(--forest-deep);color:#fff;padding:12px 16px 14px;flex-shrink:0;}
.phone-head .t1{font-size:13px;font-weight:800;}
.phone-head .t2{font-size:10px;color:#9FCBB0;font-weight:600;margin-top:1px;}
.phone-search{margin-top:10px;background:rgba(255,255,255,0.14);border-radius:8px;height:26px;display:flex;align-items:center;padding:0 9px;gap:6px;}
.phone-search span{width:11px;height:11px;border:1.4px solid #BFE0CC;border-radius:50%;display:inline-block;position:relative;}
.phone-search span::after{content:"";position:absolute;width:5px;height:1.4px;background:#BFE0CC;right:-4px;bottom:1px;transform:rotate(45deg);}
.phone-search i{width:70%;height:6px;background:rgba(255,255,255,0.22);border-radius:3px;}
.phone-map{flex:1;position:relative;background:#E3E7DD;overflow:hidden;}
.phone-map .road{position:absolute;background:#fff;}
.phone-map .road.h{left:0;width:100%;height:6px;}
.phone-map .road.v{top:0;height:100%;width:4px;}
.phone-map .water{position:absolute;background:#AFD6E8;border-radius:50%;}
.pin{position:absolute;width:22px;height:22px;transform:translate(-50%,-100%);opacity:0;animation:dropPin .55s cubic-bezier(.2,1.4,.4,1) forwards;}
.pin .h{width:22px;height:22px;border-radius:50% 50% 50% 0;background:#EA4335;transform:rotate(-45deg);border:1.5px solid rgba(255,255,255,0.85);box-shadow:0 3px 6px rgba(0,0,0,0.3);}
.you{position:absolute;width:13px;height:13px;border-radius:50%;background:#4285F4;border:2px solid #fff;transform:translate(-50%,-50%);box-shadow:0 0 0 5px rgba(66,133,244,0.25);}
.you::after{content:"";position:absolute;inset:-9px;border-radius:50%;border:2px solid rgba(66,133,244,0.5);animation:pulseRing 2.2s ease-out infinite;}
@keyframes pulseRing{0%{transform:scale(.5);opacity:.9;}100%{transform:scale(2.1);opacity:0;}}
@keyframes dropPin{0%{opacity:0;transform:translate(-50%,-180%) scale(.4);}70%{opacity:1;}100%{opacity:1;transform:translate(-50%,-100%) scale(1);}}
.phone-card{background:#fff;border-radius:14px 14px 0 0;padding:14px 16px 18px;box-shadow:0 -8px 18px rgba(0,0,0,0.06);flex-shrink:0;}
.phone-card .row1{display:flex;justify-content:space-between;align-items:flex-start;}
.phone-card h4{font-size:12.5px;font-weight:800;margin:0 0 3px;color:var(--forest);}
.phone-card .addr{font-size:10px;color:#8B8B82;font-weight:600;}
.phone-badge{font-size:9.5px;font-weight:800;color:var(--palm);background:var(--palm-light);padding:3px 8px;border-radius:20px;}
.phone-tags{display:flex;gap:6px;margin-top:9px;}
.phone-tags span{font-size:9px;font-weight:800;padding:4px 8px;border-radius:6px;}
.tag-p{background:var(--palm-light);color:var(--palm);}
.tag-s{background:#F2EFE6;color:#8B8B82;}

.float-card{
  position:absolute;background:#fff;border-radius:14px;padding:11px 14px;box-shadow:0 16px 32px -10px rgba(0,0,0,0.35);
  display:flex;align-items:center;gap:10px;font-weight:800;font-size:12px;color:var(--forest);
}
.float-card .ic{width:30px;height:30px;border-radius:8px;background:var(--gold-light);color:var(--clay);display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.float-card .ic svg{width:16px;height:16px;}
.fc1{top:64px;left:-26px;transform:rotate(-6deg);}
.fc2{bottom:96px;right:-30px;transform:rotate(5deg);}
.float-card small{display:block;font-size:9.5px;color:#9A9A8E;font-weight:700;margin-top:1px;}

section{padding:108px 0;}
.section-head{max-width:620px;margin-bottom:64px;}
.section-head h2{font-size:38px;color:var(--forest);margin-top:16px;}
.section-head p{font-size:16.5px;color:var(--ink-soft);margin-top:16px;line-height:1.6;}

.showcase{display:flex;flex-direction:column;gap:0;}
.feature-row{
  display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center;padding:56px 0;border-top:1px solid var(--line);
}
.feature-row.rev .f-text{order:2;}
.feature-row.rev .f-visual{order:1;}
.f-num{font-family:'Fraunces',serif;font-size:14px;font-weight:700;color:var(--gold);letter-spacing:.05em;}
.f-text h3{font-size:27px;color:var(--forest);margin-top:10px;max-width:380px;}
.f-text p{font-size:15.5px;color:var(--ink-soft);line-height:1.65;margin-top:14px;max-width:400px;}
.f-visual{display:flex;justify-content:center;}
.mini-card{background:#fff;border:1px solid var(--line);border-radius:20px;padding:22px;width:100%;max-width:380px;box-shadow:0 24px 50px -28px rgba(23,59,44,0.35);}

.mv-row{display:flex;gap:12px;align-items:center;background:var(--cream);border-radius:13px;padding:11px 13px;margin-bottom:10px;}
.mv-row:last-child{margin-bottom:0;}
.mv-thumb{width:38px;height:38px;border-radius:9px;background:var(--palm-light);display:flex;align-items:center;justify-content:center;flex-shrink:0;color:var(--palm);}
.mv-thumb svg{width:18px;height:18px;}
.mv-line1{font-size:12.5px;font-weight:800;color:var(--ink);}
.mv-line2{font-size:10.5px;color:#9A9A8E;font-weight:600;margin-top:1px;}
.mv-price{font-size:10px;font-weight:800;color:var(--palm);background:var(--palm-light);padding:3px 7px;border-radius:6px;margin-left:auto;flex-shrink:0;}

.mv-grade{text-align:center;padding:8px 4px;}
.mv-grade-badge{width:54px;height:54px;border-radius:50%;background:var(--gold);color:var(--forest-deep);display:flex;align-items:center;justify-content:center;margin:0 auto 10px;}
.mv-grade-badge svg{width:26px;height:26px;}
.mv-grade-name{font-family:'Fraunces',serif;font-weight:700;font-size:19px;color:var(--forest);}
.mv-grade-pv{font-size:11.5px;color:#9A9A8E;font-weight:700;margin-top:2px;}
.mv-track{height:7px;background:var(--cream);border-radius:5px;margin:14px 0 8px;overflow:hidden;}
.mv-track i{display:block;height:100%;width:38%;background:var(--gold);border-radius:5px;}
.mv-grade-next{font-size:10.5px;color:#9A9A8E;font-weight:700;}

.mv-pay{display:flex;gap:8px;margin-bottom:12px;}
.mv-pay span{flex:1;text-align:center;border:1.5px solid var(--line);border-radius:9px;padding:9px 4px;font-size:9.5px;font-weight:800;color:#8B8B82;}
.mv-pay span.sel{border-color:var(--palm);background:var(--palm-light);color:var(--palm);}
.mv-total{display:flex;justify-content:space-between;align-items:baseline;border-top:1px dashed var(--line);padding-top:12px;}
.mv-total span{font-size:11px;font-weight:700;color:#9A9A8E;text-transform:uppercase;letter-spacing:.04em;}
.mv-total b{font-family:'Fraunces',serif;font-size:21px;color:var(--forest);}

.how{background:var(--forest);color:#fff;}
.how .section-head h2{color:#fff;}
.how .section-head p{color:#B9CCBE;}
.how .eyebrow{color:var(--gold);}
.steps{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:rgba(255,255,255,0.12);border-radius:20px;overflow:hidden;}
.step{background:#1B4632;padding:34px 26px;position:relative;}
.step-num{font-family:'Fraunces',serif;font-size:38px;font-weight:650;color:var(--gold);opacity:.85;}
.step h4{font-size:16.5px;font-weight:800;margin:18px 0 8px;color:#fff;}
.step p{font-size:13.5px;color:#AFC8B9;line-height:1.55;margin:0;}
@media (max-width:900px){.steps{grid-template-columns:1fr 1fr;}}
@media (max-width:560px){.steps{grid-template-columns:1fr;}}

.testi-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;}
.testi-card{background:#fff;border:1px solid var(--line);border-radius:20px;padding:30px 26px;}
.testi-quote{font-family:'Fraunces',serif;font-size:17px;line-height:1.5;color:var(--forest);font-style:italic;}
.testi-who{display:flex;align-items:center;gap:11px;margin-top:20px;}
.testi-avatar{width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Fraunces',serif;font-weight:700;color:#fff;font-size:14px;flex-shrink:0;}
.testi-name{font-size:13.5px;font-weight:800;color:var(--ink);}
.testi-role{font-size:11.5px;color:#9A9A8E;font-weight:600;}
@media (max-width:880px){.testi-grid{grid-template-columns:1fr;}}

.cta-band{
  background:linear-gradient(135deg, var(--forest) 0%, #20543C 100%);
  border-radius:32px;padding:72px 56px;color:#fff;text-align:center;position:relative;overflow:hidden;
  max-width:1096px;margin:0 auto;
}
.cta-band::before{
  content:"";position:absolute;width:480px;height:480px;border-radius:50%;
  background:radial-gradient(circle, rgba(217,139,43,0.22), transparent 70%);
  top:-220px;right:-160px;
}
.cta-band h2{color:#fff;font-size:36px;max-width:560px;margin:18px auto 16px;}
.cta-band p{color:#CFE0D6;font-size:15.5px;max-width:440px;margin:0 auto 32px;}
.store-row{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;position:relative;z-index:1;}
.store-btn{
  display:flex;align-items:center;gap:10px;background:#0F2A1F;border:1px solid rgba(255,255,255,0.18);
  border-radius:13px;padding:11px 20px;cursor:pointer;color:#fff;font-family:inherit;
}
.store-btn svg{width:22px;height:22px;}
.store-btn .lines{text-align:left;}
.store-btn .l1{font-size:9.5px;color:#AFC8B9;}
.store-btn .l2{font-size:15px;font-weight:800;}

footer{padding:64px 0 36px;}
.foot-top{display:flex;justify-content:flex-start;align-items:flex-start;flex-wrap:wrap;gap:30px;padding-bottom:40px;border-bottom:1px solid var(--line);}
.foot-brand .brand{margin-bottom:10px;}
.foot-brand p{font-size:13.5px;color:#9A9A8E;max-width:280px;line-height:1.6;}
.foot-divider{width:1px;align-self:stretch;background:var(--line);flex-shrink:0;}
.foot-cols{display:flex;gap:56px;flex-wrap:wrap;margin-left:auto;}
.thin-sep{width:100%;height:1px;background:var(--line);}
@media (max-width:700px){.foot-divider{display:none;} .foot-cols{margin-left:0;}}
.foot-col h5{font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:var(--forest);margin-bottom:14px;}
.foot-col a{display:block;font-size:13.5px;color:#7C7C72;text-decoration:none;margin-bottom:10px;font-weight:600;}
.foot-col a:hover{color:var(--palm);}
.foot-bottom{display:flex;justify-content:space-between;padding-top:24px;font-size:12px;color:#9A9A8E;flex-wrap:wrap;gap:10px;}

@media (max-width:920px){
  .hero-inner{grid-template-columns:1fr;}
  .hero-visual{order:-1;margin-bottom:10px;}
  .hero h1{font-size:40px;}
  .feature-row{grid-template-columns:1fr;gap:32px;}
  .feature-row.rev .f-text{order:1;}
  .feature-row.rev .f-visual{order:2;}
  .section-head h2{font-size:30px;}
  .cta-band{margin:0 16px;padding:56px 28px;}
  .cta-band h2{font-size:28px;}
}
@media (max-width:600px){
  .wrap{padding:0 20px;}
  .hero-inner{padding:32px 20px 0;}
  .nav-inner{padding:14px 16px;}
  .brand{font-size: 16px;}
  .brand-mark{width: 28px; height: 28px;}
  .brand-mark svg{width: 14px; height: 14px;}
  .nav-cta{padding: 9px 14px; font-size: 12px;}
  .hero h1{font-size:32px; margin: 16px 0;}
  .hero p.lede{font-size: 15px;}
  .btn{padding: 12px 20px; font-size: 13.5px; width: 100%; justify-content: center;}
  .hero-trust{gap:14px; flex-direction: column;}
  .float-card{display:none;}
  .phone{width:220px;height:450px;}
  section{padding: 64px 0;}
  .section-head{margin-bottom: 40px;}
  .section-head h2{font-size:26px;}
  .section-head p{font-size: 15px;}
  .feature-row{padding: 32px 0; gap: 24px;}
  .f-text h3{font-size: 22px;}
  .f-text p{font-size: 14.5px;}
  .cta-band{margin:0; padding:40px 20px; border-radius: 20px;}
  .cta-band h2{font-size:24px;}
  .store-btn{width: 100%; justify-content: center;}
  footer{padding: 40px 0 24px;}
  .foot-cols{gap: 32px; flex-direction: column;}
}
` }} />
      
      
      <div style={{
        backgroundColor: 'var(--forest-deep)',
        color: 'var(--white)',
        padding: '8px 0',
        fontSize: '13.5px',
        fontWeight: '800',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        fontStyle: 'italic',
        borderBottom: '1px solid rgba(217,139,43,0.2)',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        width: '100%'
      }}>
        <div style={{
          display: 'inline-block',
          animation: 'marquee 30s linear infinite',
          paddingLeft: '100vw'
        }}>
          Better Life - Better Future
        </div>
      </div>
      <nav className="nav">
  <div className="nav-inner">
    <div className="brand">
      <span className="brand-mark"><svg viewBox="0 0 24 24" fill="none" stroke="#D98B2B" strokeWidth="2"><path d="M12 21s7-7.5 7-12a7 7 0 1 0-14 0c0 4.5 7 12 7 12z"/><circle cx="12" cy="9" r="2.4" fill="#D98B2B" stroke="none"/></svg></span>
      Prospections Longrich
    </div>
    <div className="nav-links">
      <a href="#fonctionnalites">Fonctionnalités</a>
      <a href="#comment">Comment ça marche</a>
      <a href="#avis">Avis</a>
      <a href="/abonnement">Abonnement</a>
      <a href="/login" style={{ color: 'var(--gold)' }}>Se connecter</a>
    </div>
    <button
      type="button"
      className="nav-burger"
      aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
      aria-expanded={mobileMenuOpen}
      onClick={() => setMobileMenuOpen(v => !v)}
    >
      {mobileMenuOpen ? (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
      ) : (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
      )}
    </button>
    <a href="/register" className="nav-cta text-center" style={{ textDecoration: 'none' }}>Inscription</a>
  </div>
  <div className={`mobile-menu${mobileMenuOpen ? ' open' : ''}`}>
    <a href="#fonctionnalites" onClick={() => setMobileMenuOpen(false)}>Fonctionnalités</a>
    <a href="#comment" onClick={() => setMobileMenuOpen(false)}>Comment ça marche</a>
    <a href="#avis" onClick={() => setMobileMenuOpen(false)}>Avis</a>
    <a href="/abonnement" onClick={() => setMobileMenuOpen(false)}>Abonnement</a>
    <a href="/login" style={{ color: 'var(--gold)' }} onClick={() => setMobileMenuOpen(false)}>Se connecter</a>
  </div>
</nav>

<header className="hero">
  <div className="hero-pattern"></div>
  <div className="hero-inner">
    <div>
      <span className="eyebrow hero-eyebrow">L'app des partenaires Longrich en Côte d'Ivoire</span>
      <h1>Votre bureau Longrich le plus proche, en un coup d'œil.</h1>
      <p className="lede">Localisez les prospections près de chez vous, comparez les vrais prix partenaires, et commandez vos produits bien-être préférés — où que vous soyez en Côte d'Ivoire.</p>
      <div className="hero-ctas">
        <a href="/register" className="btn btn-gold" style={{ textDecoration: 'none' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l9 5-9 5-9-5z"/><path d="M3 8v8l9 5 9-5V8" fill="none" stroke="currentColor" strokeWidth="2"/></svg>
          S'inscrire
        </a>
        <button className="btn btn-ghost" onClick={handleStoreToast}>Voir comment ça marche</button>
      </div>
      <div className="hero-trust">
        <div className="trust-stat"><b>58</b><span>Produits référencés</span></div>
        <div className="trust-stat"><b>4</b><span>Villes couvertes</span></div>
        <div className="trust-stat"><b>3</b><span>Opérateurs Mobile Money</span></div>
        <div className="trust-stat"><b>14</b><span>Grades de progression</span></div>
      </div>
    </div>

    <div className="hero-visual">
      <div className="float-card fc1">
        <span className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M5 13l4 4L19 7"/></svg></span>
        <div>Prospection vérifié<small>Cocody, Abidjan</small></div>
      </div>
      <div className="phone">
        <div className="phone-screen">
          <div className="phone-status"></div>
          <div className="phone-head">
            <div className="t1">Prospections Longrich</div>
            <div className="t2">Côte d'Ivoire</div>
            <div className="phone-search"><span></span><i></i></div>
          </div>
          <div className="phone-map" id="phoneMap">
            <div className="water" style={{"width":"90px","height":"90px","left":"-30px","top":"-20px"}}></div>
            <div className="road h" style={{"top":"36%"}}></div>
            <div className="road h" style={{"top":"66%","height":"3px"}}></div>
            <div className="road v" style={{"left":"25%"}}></div>
            <div className="road v" style={{"left":"68%"}}></div>
            <div className="you" style={{"left":"50%","top":"48%"}}></div>
            <div className="pin" style={{"left":"30%","top":"30%","animationDelay":".15s"}}><div className="h"></div></div>
            <div className="pin" style={{"left":"72%","top":"24%","animationDelay":".32s"}}><div className="h"></div></div>
            <div className="pin" style={{"left":"62%","top":"62%","animationDelay":".48s"}}><div className="h"></div></div>
          </div>
          <div className="phone-card">
            <div className="row1">
              <div><h4>Longrich Cocody Centre</h4><div className="addr">Angré 8e Tranche, Abidjan</div></div>
              <span className="phone-badge">1,2 km</span>
            </div>
            <div className="phone-tags"><span className="tag-p">13 produits</span><span className="tag-s">2 formations</span></div>
          </div>
        </div>
      </div>
      <div className="float-card fc2">
        <span className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="20" r="1.4" fill="currentColor" stroke="none"/><circle cx="18" cy="20" r="1.4" fill="currentColor" stroke="none"/><path d="M2.5 3h2.6l2.3 12.2a1.8 1.8 0 0 0 1.8 1.5h8.5a1.8 1.8 0 0 0 1.8-1.4L21.8 7H6.3"/></svg></span>
        <div>Paiement validé<small>Orange Money · 8 500 FCFA</small></div>
      </div>
    </div>
  </div>
</header>

<section id="fonctionnalites">
  <div className="wrap">
    <div className="section-head reveal">
      <span className="eyebrow" style={{"color":"var(--gold)"}}>Fonctionnalités</span>
      <h2>Tout ce qu'il faut pour vendre et acheter, au même endroit.</h2>
      <p>Conçue pour les partenaires et les prospections Longrich de Côte d'Ivoire, l'application réunit la localisation, le catalogue, les conseils bien-être et le paiement dans un seul parcours.</p>
    </div>

    <div className="showcase">
      <div className="feature-row reveal">
        <div className="f-text">
          <span className="f-num">01</span>
          <h3>Localisez le bureau le plus proche</h3>
          <p>Recherchez par ville, commune ou quartier et repérez en un instant les prospections Longrich autour de vous, avec leur distance et leurs produits disponibles.</p>
        </div>
        <div className="f-visual">
          <div className="mini-card">
            <div className="mv-row">
              <div className="mv-thumb"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s7-7.5 7-12a7 7 0 1 0-14 0c0 4.5 7 12 7 12z"/><circle cx="12" cy="9" r="2.4"/></svg></div>
              <div><div className="mv-line1">Longrich Cocody Centre</div><div className="mv-line2">Angré 8e Tranche — 1,2 km</div></div>
            </div>
            <div className="mv-row">
              <div className="mv-thumb"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s7-7.5 7-12a7 7 0 1 0-14 0c0 4.5 7 12 7 12z"/><circle cx="12" cy="9" r="2.4"/></svg></div>
              <div><div className="mv-line1">Longrich Yopougon Liberté</div><div className="mv-line2">Maroc — 4,8 km</div></div>
            </div>
            <div className="mv-row">
              <div className="mv-thumb"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s7-7.5 7-12a7 7 0 1 0-14 0c0 4.5 7 12 7 12z"/><circle cx="12" cy="9" r="2.4"/></svg></div>
              <div><div className="mv-line1">Longrich Bouaké Nimbo</div><div className="mv-line2">Air France — Bouaké</div></div>
            </div>
          </div>
        </div>
      </div>

      <div className="feature-row rev reveal">
        <div className="f-text">
          <span className="f-num">02</span>
          <h3>Les vrais prix, partenaire et non-partenaire</h3>
          <p>Chaque produit affiche son tarif partenaire et son tarif non-partenaire, mis à jour par le bureau lui-même — plus de surprise une fois sur place.</p>
        </div>
        <div className="f-visual">
          <div className="mini-card">
            <div className="mv-row">
              <div className="mv-thumb"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></svg></div>
              <div><div className="mv-line1">Cordyceps Militaris</div><div className="mv-line2">60 gélules</div></div>
              <span className="mv-price">75 000 FCFA</span>
            </div>
            <div className="mv-row">
              <div className="mv-thumb"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></svg></div>
              <div><div className="mv-line1">Le Calcium</div><div className="mv-line2">160 comprimés</div></div>
              <span className="mv-price">11 000 FCFA</span>
            </div>
            <div className="mv-row">
              <div className="mv-thumb"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></svg></div>
              <div><div className="mv-line1">Vitamine C</div><div className="mv-line2">60 comprimés</div></div>
              <span className="mv-price">10 500 FCFA</span>
            </div>
          </div>
        </div>
      </div>

      <div className="feature-row reveal">
        <div className="f-text">
          <span className="f-num">03</span>
          <h3>Des conseils bien-être, reliés aux produits</h3>
          <p>Recherchez une maladie courante, consultez ses causes et ses remèdes, et accédez directement aux produits Longrich recommandés, avec leur prix.</p>
        </div>
        <div className="f-visual">
          <div className="mini-card">
            <div className="mv-row" style={{"background":"#fff","border":"1px solid var(--line)"}}>
              <div style={{"flex":"1"}}>
                <div className="mv-line1" style={{"color":"var(--forest)","fontSize":"13.5px"}}>Douleurs articulaires</div>
                <div className="mv-line2" style={{"marginTop":"4px"}}>Effort physique, arthrose, inflammation.</div>
              </div>
            </div>
            <div className="mv-row">
              <div className="mv-thumb"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="4" width="16" height="13" rx="2"/><circle cx="8.5" cy="9.5" r="1.8"/><circle cx="13" cy="9.5" r="1.8"/><circle cx="17.5" cy="9.5" r="1.8"/></svg></div>
              <div><div className="mv-line1">Arthro SupReviver</div><div className="mv-line2">60 comprimés</div></div>
              <span className="mv-price">20 000 FCFA</span>
            </div>
          </div>
        </div>
      </div>

      <div className="feature-row rev reveal">
        <div className="f-text">
          <span className="f-num">04</span>
          <h3>Réglez en Mobile Money, en toute confiance</h3>
          <p>Orange Money, MTN Money ou Wave : choisissez votre opérateur et validez votre commande, avec un code secret partenaire pour les achats au tarif préférentiel.</p>
        </div>
        <div className="f-visual">
          <div className="mini-card">
            <div className="mv-pay"><span className="sel">Orange Money</span><span>MTN Money</span><span>Wave</span></div>
            <div className="mv-total"><span>Total à régler</span><b>23 000 FCFA</b></div>
          </div>
        </div>
      </div>

      <div className="feature-row reveal">
        <div className="f-text">
          <span className="f-num">05</span>
          <h3>Suivez votre progression de grade</h3>
          <p>De Pré-Diamant à Directeur 5 Étoiles, visualisez votre grade actuel, vos points de volume et les conditions pour atteindre le palier suivant.</p>
        </div>
        <div className="f-visual">
          <div className="mini-card">
            <div className="mv-grade">
              <div className="mv-grade-badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8.5" r="5.5"/><path d="M8.5 13L7 21l5-2.6L17 21l-1.5-8"/></svg></div>
              <div className="mv-grade-name">Pré-Diamant 1</div>
              <div className="mv-grade-pv">165 PV requis</div>
              <div className="mv-track"><i></i></div>
              <div className="mv-grade-next">90 PV / 240 PV pour Pré-Diamant 2</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section className="how" id="comment">
  <div className="wrap">
    <div className="section-head reveal">
      <span className="eyebrow">Comment ça marche</span>
      <h2>De la recherche au paiement, en quatre étapes.</h2>
      <p>Un parcours pensé pour les partenaires comme pour les prospections, du premier coup d'œil à la commande finalisée.</p>
    </div>
    <div className="steps reveal">
      <div className="step"><div className="step-num">01</div><h4>Repérez un bureau</h4><p>Ouvrez la carte et trouvez le prospection le plus proche, par ville, commune ou quartier.</p></div>
      <div className="step"><div className="step-num">02</div><h4>Comparez les produits</h4><p>Parcourez le catalogue complet et ses vrais prix, partenaire et non-partenaire.</p></div>
      <div className="step"><div className="step-num">03</div><h4>Commandez</h4><p>Ajoutez au panier et réglez par Orange Money, MTN Money ou Wave.</p></div>
      <div className="step"><div className="step-num">04</div><h4>Progressez</h4><p>Suivez votre grade et les conditions pour atteindre le palier suivant.</p></div>
    </div>
  </div>
</section>

<section id="avis">
  <div className="wrap">
    <div className="section-head reveal">
      <span className="eyebrow" style={{"color":"var(--gold)"}}>Ce qu'ils en disent</span>
      <h2>Pensée pour le terrain, par des gens du terrain.</h2>
    </div>
    <div className="testi-grid reveal">
      <div className="testi-card">
        <div className="testi-quote">« Depuis que j'utilise l'application, mes clients trouvent mon bureau en quelques secondes, même dans les quartiers qu'ils ne connaissent pas. »</div>
        <div className="testi-who">
          <div className="testi-avatar" style={{"background":"var(--palm)"}}>A</div>
          <div><div className="testi-name">Aya K.</div><div className="testi-role">Prospection à Cocody</div></div>
        </div>
      </div>
      <div className="testi-card">
        <div className="testi-quote">« Je vois enfin les vrais prix avant de me déplacer. Plus besoin d'appeler pour vérifier — ça change tout au quotidien. »</div>
        <div className="testi-who">
          <div className="testi-avatar" style={{"background":"var(--gold)","color":"var(--forest-deep)"}}>I</div>
          <div><div className="testi-name">Issa T.</div><div className="testi-role">Partenaire à Bouaké</div></div>
        </div>
      </div>
      <div className="testi-card">
        <div className="testi-quote">« La partie Soins & bien-être m'aide à mieux conseiller mes clients, et à leur proposer directement le bon produit. »</div>
        <div className="testi-who">
          <div className="testi-avatar" style={{"background":"var(--clay)"}}>F</div>
          <div><div className="testi-name">Fatou D.</div><div className="testi-role">Prospection à Yamoussoukro</div></div>
        </div>
      </div>
    </div>
  </div>
</section>

<div className="wrap"><div className="thin-sep"></div></div>

<section>
  <div className="cta-band reveal">
    <span className="eyebrow" style={{"color":"var(--gold)"}}>Rejoignez le réseau</span>
    <h2>Téléchargez l'application Prospections Longrich dès aujourd'hui.</h2>
    <p>Gratuite pour les partenaires et les prospections Longrich, disponible bientôt sur Android et iOS.</p>
    <div className="store-row">
      <button className="store-btn" onClick={handleStoreToast}>
        <svg viewBox="0 0 24 24" fill="#fff"><path d="M3 3l18 9-18 9z"/></svg>
        <span className="lines"><span className="l1">Bientôt disponible sur</span><span className="l2">Google Play</span></span>
      </button>
      <button className="store-btn" onClick={handleStoreToast}>
        <svg viewBox="0 0 24 24" fill="#fff"><path d="M16.7 1.5c.1 1.2-.3 2.4-1.1 3.3-.8.9-2 1.6-3.2 1.5-.1-1.2.4-2.4 1.1-3.2.8-.9 2.1-1.5 3.2-1.6zM20.9 17c-.5 1.1-.8 1.6-1.4 2.6-.9 1.4-2.2 3.1-3.8 3.1-1.4 0-1.8-.9-3.7-.9-1.9 0-2.4.9-3.7.9-1.6 0-2.8-1.6-3.7-3-2.5-3.8-2.8-9.3-.6-12.2.9-1.2 2.3-1.9 3.6-1.9 1.5 0 2.5.9 3.7.9 1.2 0 2-.9 3.7-.9 1.5 0 3 .8 3.9 2.1-3.4 1.9-2.9 6.5.5 8.3z"/></svg>
        <span className="lines"><span className="l1">Bientôt disponible sur</span><span className="l2">App Store</span></span>
      </button>
    </div>
  </div>
</section>

<footer>
  <div className="wrap">
    <div className="foot-top">
      <div className="foot-brand">
        <div className="brand"><span className="brand-mark"><svg viewBox="0 0 24 24" fill="none" stroke="#D98B2B" strokeWidth="2"><path d="M12 21s7-7.5 7-12a7 7 0 1 0-14 0c0 4.5 7 12 7 12z"/><circle cx="12" cy="9" r="2.4" fill="#D98B2B" stroke="none"/></svg></span>Prospections Longrich</div>
        <p>L'application des partenaires et prospections Longrich en Côte d'Ivoire — localisation, catalogue, bien-être et paiement, réunis.</p>
      </div>
      <div className="foot-divider"></div>
      <div className="foot-cols">
        <div className="foot-col">
          <h5>Application</h5>
          <a href="#fonctionnalites">Fonctionnalités</a>
          <a href="#comment">Comment ça marche</a>
          <a href="#avis">Avis</a>
        </div>
        <div className="foot-col">
          <h5>Partenaires</h5>
          <a href="#" onClick={handleStoreToast}>Devenir prospection</a>
          <a href="#" onClick={handleStoreToast}>Grades & progression</a>
          <a href="#" onClick={handleStoreToast}>Formations</a>
        </div>
        <div className="foot-col">
          <h5>Contact</h5>
          <a href="#" onClick={handleStoreToast}>Assistance partenaires</a>
          <a href="#" onClick={handleStoreToast}>Côte d'Ivoire</a>
        </div>
      </div>
    </div>
    <div className="foot-bottom">
      <span>© 2026 Prospections Longrich. Application non officielle à usage des partenaires.</span>
      <span>Maquette de présentation — non finale</span>
    </div>
  </div>
</footer>



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
