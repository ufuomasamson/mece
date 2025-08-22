import Layout from "@/components/Layout";
// import Background3DScene from "@/components/3d/Background3DScene"; // Removed 3D
// import Hero3D from "@/components/3d/Hero3D"; // Temporarily disabled
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ContactForm from "@/components/ContactForm";
import CompetitionGrid from "@/components/CompetitionGrid";
import { Link } from "react-router-dom";
import {
  Users,
  Target,
  Award,
  Handshake,
  MapPin,
  Phone,
  Mail
} from "lucide-react";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useContent } from "@/contexts/ContentContext";

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const Index = () => {
  const { content } = useContent();
  const servicesRef = useRef<HTMLDivElement>(null);
  const missionRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const competitionRef = useRef<HTMLDivElement>(null);


  // Services data from content context
  const services = content.services.items;

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero section animation
      if (heroRef.current) {
        gsap.fromTo(
          heroRef.current.querySelectorAll('h1, p, .flex'),
          {
            y: 50,
            opacity: 0,
            scale: 0.9
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1.2,
            ease: "power3.out",
            stagger: 0.2
          }
        );
      }

      // Competition grid animation
      if (competitionRef.current) {
        gsap.fromTo(
          competitionRef.current.querySelectorAll('.competition-card'),
          {
            y: 100,
            opacity: 0,
            rotationY: 45,
            transformOrigin: "center center"
          },
          {
            y: 0,
            opacity: 1,
            rotationY: 0,
            duration: 1,
            ease: "power3.out",
            stagger: 0.1,
            scrollTrigger: {
              trigger: competitionRef.current,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }

      // Services section animation
      if (servicesRef.current) {
        gsap.fromTo(
          servicesRef.current.querySelectorAll('.service-card'),
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
            duration: 1,
            ease: "power3.out",
            stagger: 0.1,
            scrollTrigger: {
              trigger: servicesRef.current,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }

      // Mission section animation
      if (missionRef.current) {
        gsap.fromTo(
          missionRef.current,
          {
            scale: 0.9,
            opacity: 0
          },
          {
            scale: 1,
            opacity: 1,
            duration: 1.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: missionRef.current,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }

      // Contact section animation
      if (contactRef.current) {
        gsap.fromTo(
          contactRef.current,
          {
            y: 50,
            opacity: 0
          },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: contactRef.current,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }

      // Floating animation for various elements
      gsap.to(".floating-element", {
        y: -20,
        duration: 2,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1
      });

      // Parallax effect for background elements
      gsap.to(".parallax-bg", {
        y: (i, target) => -target.offsetHeight * 0.5,
        ease: "none",
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom bottom",
          scrub: true
        }
      });

    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* <Background3DScene /> */}

      <Layout>
        {/* 3D Hero Section - Temporarily disabled */}
        {/* <Hero3D /> */}

        {/* Simple Hero Section for testing */}
        <section ref={heroRef} className="py-24 bg-gradient-hero text-primary-foreground relative overflow-hidden perspective-1000 min-h-screen flex items-center">

          {/* Hero Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src={content.hero.backgroundImage}
              alt="Hero Background"
              className="w-full h-full object-cover"
            />
            {/* Dark overlay to ensure text readability */}
            <div className="absolute inset-0 bg-black/40"></div>
          </div>

          {/* Floating background elements */}
          <div className="absolute inset-0 overflow-hidden z-10">
            <div className="floating-element absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl"></div>
            <div className="floating-element absolute top-40 right-20 w-16 h-16 bg-secondary/20 rounded-full blur-xl" style={{ animationDelay: '0.5s' }}></div>
            <div className="floating-element absolute bottom-20 left-1/4 w-24 h-24 bg-accent/20 rounded-full blur-xl" style={{ animationDelay: '1s' }}></div>
            <div className="floating-element absolute bottom-40 right-1/3 w-12 h-12 bg-primary/30 rounded-full blur-xl" style={{ animationDelay: '1.5s' }}></div>
          </div>

          <div className="container mx-auto px-4 text-center relative z-20">
            <h1 className="text-4xl md:text-7xl font-bold mb-6 leading-tight transform-gpu hover:scale-105 transition-transform duration-500">
              {content.hero.title}
            </h1>
            <p className="text-xl md:text-2xl mb-4 opacity-90 transform-gpu hover:scale-105 transition-transform duration-500">
              {content.hero.subtitle}
            </p>
            <div className="text-lg md:text-xl mb-8 space-y-2 transform-gpu hover:scale-105 transition-transform duration-500">
              <p>"{content.hero.tagline1}"</p>
              <p>"{content.hero.tagline2}"</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild className="transform-gpu hover:scale-110 hover:shadow-2xl transition-all duration-300">
                <Link to="/participate">How Can We Help</Link>
              </Button>
              <Button size="lg" className="bg-primary/20 hover:bg-primary/30 text-primary-foreground border-2 border-primary-foreground transform-gpu hover:scale-110 hover:shadow-2xl transition-all duration-300" asChild>
                <Link to="/about">About Us</Link>
              </Button>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent transform-gpu animate-pulse z-10"></div>
        </section>

        {/* Our Mission Section */}
        <section ref={missionRef} className="py-16 bg-background perspective-1000 particles-bg">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-5xl font-bold mb-8 bg-gradient-hero bg-clip-text text-transparent transform-gpu hover:scale-105 transition-transform duration-500 gradient-text">
                {content.mission.title}
              </h2>
              <Card className="shadow-elegant transform-gpu hover:scale-105 hover:shadow-glow transition-all duration-500 card-hover-3d">
                <CardContent className="p-8 md:p-12">
                  <p className="text-lg md:text-xl leading-relaxed">
                    {content.mission.description}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Competition Grid */}
        <div ref={competitionRef}>
          <CompetitionGrid />
        </div>

        {/* Services Section */}
        <section ref={servicesRef} className="py-16 bg-muted/30 perspective-1000 particles-bg">
          <div className="container mx-auto px-4">

            
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent transform-gpu hover:scale-105 transition-transform duration-500 gradient-text">
                {content.services.title}
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto transform-gpu hover:scale-105 transition-transform duration-500">
                {content.services.description}
              </p>
            </div>


            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {services.map((service, index) => (
                <Card
                  key={index}
                  className={`service-card shadow-elegant hover:shadow-glow transition-all duration-500 transform-gpu hover:scale-105 hover:-rotate-1 group perspective-1000 card-hover-3d stagger-${index + 1}`}
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: 'rotateY(0deg) rotateX(0deg)',
                  }}
                  onMouseMove={(e) => {
                    const card = e.currentTarget;
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    const rotateX = (y - centerY) / 15;
                    const rotateY = (centerX - x) / 15;

                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
                  }}
                >
                  <CardContent className="p-6 transform-gpu group-hover:scale-105 transition-transform duration-300">
                    <h3 className="text-lg font-semibold mb-4 text-primary transform-gpu group-hover:scale-105 transition-transform duration-300 text-glow-primary">
                      {service.title}
                    </h3>
                    <ul className="space-y-2 text-sm">
                      {service.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start space-x-2 transform-gpu group-hover:scale-105 transition-transform duration-300">
                          <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2 flex-shrink-0 transform-gpu group-hover:scale-150 transition-transform duration-300"></div>
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="shadow-elegant transform-gpu hover:scale-105 hover:shadow-glow transition-all duration-500">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4 text-primary transform-gpu hover:scale-105 transition-transform duration-300">
                  Ready to Transform Your Future?
                </h3>
                <p className="text-muted-foreground mb-6 transform-gpu hover:scale-105 transition-transform duration-300">
                  Join our community of innovators and talents. Explore our services and competitions.
                </p>
                <Button size="lg" variant="secondary" asChild className="transform-gpu hover:scale-110 hover:shadow-2xl transition-all duration-300">
                  <Link to="/participate">Get Started Today</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Contact Section */}
        <section ref={contactRef} className="py-16 perspective-1000 particles-bg">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent transform-gpu hover:scale-105 transition-transform duration-500 gradient-text">
                Contact Us
              </h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              <ContactForm />

              <Card className="shadow-elegant transform-gpu hover:scale-105 hover:shadow-glow transition-all duration-500 card-hover-3d">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6 transform-gpu hover:scale-105 transition-transform duration-300">Get In Touch</h3>

                  <div className="space-y-6">
                    <div className="flex items-start space-x-4 transform-gpu hover:scale-105 transition-transform duration-300 hover-lift">
                      <div className="bg-primary p-2 rounded-lg transform-gpu hover:rotate-12 transition-transform duration-300">
                        <Phone className="text-primary-foreground" size={20} />
                      </div>
                      <div>
                        <p className="font-semibold">Phone</p>
                        <p className="text-muted-foreground">{content.footer.contact?.phone || "+234 8032160583"}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4 transform-gpu hover:scale-105 transition-transform duration-300 hover-lift">
                      <div className="bg-secondary p-2 rounded-lg transform-gpu hover:rotate-12 transition-transform duration-300">
                        <Mail className="text-secondary-foreground" size={20} />
                      </div>
                      <div>
                        <p className="font-semibold">Email</p>
                        <p className="text-muted-foreground">{content.footer.contact?.email || "contact@mece.org.ng"}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4 transform-gpu hover:scale-105 transition-transform duration-300 hover-lift">
                      <div className="bg-accent p-2 rounded-lg transform-gpu hover:rotate-12 transition-transform duration-300">
                        <MapPin className="text-accent-foreground" size={20} />
                      </div>
                      <div>
                        <p className="font-semibold">Address</p>
                        <p className="text-muted-foreground">
                          {content.footer.contact?.address || "NO. 35, AJOSE ADEOGUN STREET, UTAKO, ABUJA, FCT, NIGERIA"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 p-4 bg-muted rounded-lg transform-gpu hover:scale-105 transition-transform duration-300 hover-lift">
                    <p className="text-sm text-center text-muted-foreground">
                      <strong>MECE CONSOLIDATED LTD</strong><br />
                      Your trusted partner in talent empowerment and innovation
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Index;