import React, { useEffect, useRef, useState } from 'react';

const asset = (path) => `${import.meta.env.BASE_URL}${path}`;

export default function HeroVideo() {
  const video = useRef(null);
  const [enabled, setEnabled] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setEnabled(!preference.matches && !navigator.connection?.saveData);
    update();
    preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const element = video.current;
    if (!element) return;
    let visible = false;
    const update = () => {
      if (visible && !document.hidden) element.play().catch(() => {});
      else element.pause();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    observer.observe(element);
    document.addEventListener('visibilitychange', update);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', update);
      element.pause();
    };
  }, [enabled, failed]);

  return <>
    <img src={asset('images/hero-volvo.jpg')} alt="Volvo з напівпричепом на приморській трасі" fetchPriority="high" width="1920" height="1080"/>
    {enabled && !failed && <video ref={video} className="hero-video" muted loop playsInline preload="metadata"
      poster={asset('images/hero-volvo.jpg')} aria-hidden="true" onError={() => setFailed(true)}>
      <source src={asset('video/hero-volvo.mp4')} type="video/mp4" onError={() => setFailed(true)}/>
    </video>}
  </>;
}
