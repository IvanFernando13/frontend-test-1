"use client";
import { useEffect, useState } from "react";

export default function Banner() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div 
      className="relative w-full h-[400px] md:h-[500px] overflow-hidden bg-gray-900"
      style={{ clipPath: "polygon(0 0, 100% 0, 100% 80%, 0 100%)" }}
    >
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: "url('/banner-bg.jpg')",
          transform: `translateY(${offset * 0.5}px)`,
        }}
      />
      <div className="absolute inset-0 bg-black/40" />
      
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center pb-10">
        <h1 className="text-5xl font-bold mb-4">Ideas</h1>
        <p className="text-lg">Where all our great things begin</p>
      </div>
    </div>
  );
}