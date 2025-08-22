import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const Hero3D = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial animation
      gsap.fromTo(
        titleRef.current,
        { 
          y: 100, 
          opacity: 0, 
          rotationX: 45,
          transformOrigin: "center bottom"
        },
        { 
          y: 0, 
          opacity: 1, 
          rotationX: 0, 
          duration: 1.5, 
          ease: "power3.out",
          delay: 0.5
        }
      );

      gsap.fromTo(
        subtitleRef.current,
        { 
          y: 50, 
          opacity: 0, 
          scale: 0.8
        },
        { 
          y: 0, 
          opacity: 1, 
          scale: 1, 
          duration: 1, 
          ease: "back.out(1.7)",
          delay: 1
        }
      );

      gsap.fromTo(
        buttonsRef.current,
        { 
          y: 30, 
          opacity: 0, 
          scale: 0.9
        },
        { 
          y: 0, 
          opacity: 1, 
          scale: 1, 
          duration: 0.8, 
          ease: "power2.out",
          delay: 1.5
        }
      );

      // Floating particles animation
      gsap.to(particlesRef.current, {
        y: -20,
        duration: 3,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1
      });

      // Scroll-triggered animations
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        onUpdate: (self) => {
          const progress = self.progress;
          if (titleRef.current) {
            titleRef.current.style.transform = `translateY(${progress * 50}px) rotateX(${progress * 15}deg)`;
          }
        }
      });

      // Hover animations for buttons
      const buttons = buttonsRef.current?.querySelectorAll('button');
      buttons?.forEach((button) => {
        button.addEventListener('mouseenter', () => {
          gsap.to(button, {
            scale: 1.1,
            rotationY: 15,
            duration: 0.3,
            ease: "power2.out"
          });
        });

        button.addEventListener('mouseleave', () => {
          gsap.to(button, {
            scale: 1,
            rotationY: 0,
            duration: 0.3,
            ease: "power2.out"
          });
        });
      });

    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={heroRef}
      className="relative py-24 bg-gradient-hero text-primary-foreground overflow-hidden perspective-1000 min-h-screen flex items-center"
    >
      {/* 3D Background Elements */}
      <div 
        ref={particlesRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.3) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(245, 158, 11, 0.2) 0%, transparent 50%)'
        }}
      />

      {/* Floating geometric shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 border-2 border-primary-foreground/20 rounded-full animate-spin-slow"></div>
        <div className="absolute top-40 right-32 w-24 h-24 border-2 border-secondary-foreground/20 transform rotate-45 animate-pulse"></div>
        <div className="absolute bottom-32 left-32 w-20 h-20 bg-accent/20 rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 right-20 w-16 h-16 border-2 border-primary-foreground/20 transform -rotate-12 animate-ping"></div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <h1 
          ref={titleRef}
          className="text-4xl md:text-7xl font-bold mb-6 leading-tight transform-gpu"
          style={{ transformStyle: 'preserve-3d' }}
        >
          Welcome to Mece<br />Consolidated Limited
        </h1>
        
        <p 
          ref={subtitleRef}
          className="text-xl md:text-2xl mb-4 opacity-90 transform-gpu"
        >
          Empowering Innovation, Talent, and Sustainable Growth
        </p>
        
        <div className="text-lg md:text-xl mb-8 space-y-2 transform-gpu">
          <p className="inline-block transform-gpu hover:scale-110 transition-transform duration-300">
            "Fueling Dreams. Shaping Realities."
          </p>
          <p className="inline-block transform-gpu hover:scale-110 transition-transform duration-300">
            "Your Vision, Our Platform."
          </p>
        </div>
        
        <div 
          ref={buttonsRef}
          className="flex flex-col sm:flex-row gap-4 justify-center transform-gpu"
        >
          <Button 
            size="lg" 
            variant="secondary" 
            asChild 
            className="transform-gpu hover:scale-110 hover:shadow-2xl transition-all duration-300"
          >
            <Link to="/participate">How Can We Help</Link>
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary transform-gpu hover:scale-110 hover:shadow-2xl transition-all duration-300" 
            asChild
          >
            <Link to="/about">About Us</Link>
          </Button>
        </div>
      </div>

      {/* 3D Depth overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 transform-gpu"></div>
    </section>
  );
};

export default Hero3D;
