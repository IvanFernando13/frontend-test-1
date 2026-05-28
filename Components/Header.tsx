"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Header() {
  const [isVisible, setIsVisible] = useState(true);
  const [isTop, setIsTop] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsTop(currentScrollY < 50);
      
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false); // Scroll down
      } else {
        setIsVisible(true);  // Scroll up
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      } ${isTop ? "bg-[#ff6600]" : "bg-[#ff6600]/90 backdrop-blur-sm"}`}
    >
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <div className="text-white font-bold text-2xl">Suitmedia</div>
        <nav className="hidden md:flex space-x-8 text-white text-sm">
          <Link href="#work" className="hover:border-b-2 border-white pb-1">Work</Link>
          <Link href="#about" className="hover:border-b-2 border-white pb-1">About</Link>
          <Link href="#services" className="hover:border-b-2 border-white pb-1">Services</Link>
          <Link href="#" className="border-b-2 border-white pb-1 font-semibold">Ideas</Link>
          <Link href="#careers" className="hover:border-b-2 border-white pb-1">Careers</Link>
          <Link href="#contact" className="hover:border-b-2 border-white pb-1">Contact</Link>
        </nav>
      </div>
    </header>
  );
}