import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useContent } from "@/contexts/ContentContext";
import SocialMediaLinks from './SocialMediaLinks';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const { content } = useContent();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About Us" },
    { path: "/mission", label: "Mission/Vision" },
    { path: "/blog", label: "Blog" },
    { path: "/contact", label: "Contact" },
    { path: "/participate", label: "Registration" },
  ];

  return (
    <div className="min-h-screen bg-background perspective-1000">
      <header className={`bg-gradient-primary shadow-elegant relative z-50 transform-gpu sticky top-0 transition-all duration-500 backdrop-blur-sm ${
        isScrolled 
          ? 'bg-opacity-90 shadow-2xl py-2' 
          : 'bg-opacity-95 py-4'
      } hover:bg-opacity-100`}>
        <div className="container mx-auto px-8">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-primary-foreground transform-gpu hover:scale-110 hover:rotate-2 transition-all duration-300 ml-4">
              <img 
                src="/images/mece-logo.png" 
                alt="MECE Logo" 
                className={`w-auto transform-gpu hover:scale-110 hover:rotate-2 transition-all duration-300 ${
                  isScrolled ? 'h-12' : 'h-16'
                }`}
              />
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-primary-foreground hover:text-primary-glow transition-all duration-300 font-medium transform-gpu hover:scale-110 hover:-translate-y-1 relative group ${
                    location.pathname === link.path ? 'border-b-2 border-primary-foreground' : ''
                  }`}
                >
                  {link.label}
                  {/* Animated underline on hover */}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-glow transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
              
              {/* Authentication Buttons */}
              <div className="flex items-center space-x-4">
                {user ? (
                  <div className="flex items-center space-x-3">
                    <span className="text-primary-foreground text-sm font-medium">
                      Welcome, {user.name}
                    </span>
                    {user.role === 'admin' && (
                      <Link to="/admin">
                        <Button variant="outline" size="sm" className="text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent">
                          Admin
                        </Button>
                      </Link>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={logout}
                      className="text-primary-foreground hover:bg-primary-foreground/20 bg-transparent"
                    >
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Link to="/login">
                    <Button variant="outline" size="sm" className="text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent">
                      <User size={16} className="mr-2" />
                      Login
                    </Button>
                  </Link>
                )}
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-primary-foreground hover:bg-primary-foreground/20 transform-gpu hover:scale-110 hover:rotate-90 transition-all duration-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 transform-gpu animate-in slide-in-from-top-2 duration-300">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="block py-2 text-primary-foreground hover:text-primary-glow transition-all duration-300 font-medium transform-gpu hover:scale-105 hover:translate-x-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Mobile Authentication */}
              <div className="pt-4 border-t border-primary-foreground/20">
                {user ? (
                  <div className="space-y-3">
                    <div className="text-primary-foreground text-sm font-medium py-2">
                      Welcome, {user.name}
                    </div>
                    {user.role === 'admin' && (
                      <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="outline" size="sm" className="w-full text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent">
                          Admin Dashboard
                        </Button>
                      </Link>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                      className="w-full text-primary-foreground hover:bg-primary-foreground/20 bg-transparent"
                    >
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent">
                      <User size={16} className="mr-2" />
                      Login
                    </Button>
                  </Link>
                )}
              </div>
            </nav>
          )}
        </div>
      </header>

      <main className="transform-gpu">{children}</main>

      <footer className="bg-gradient-secondary text-primary-foreground perspective-1000">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="transform-gpu hover:scale-105 transition-transform duration-300">
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src="/images/mece-logo.png" 
                  alt="MECE Logo" 
                  className="h-12 w-auto transform-gpu hover:scale-110 transition-transform duration-300"
                />
                <h3 className="text-2xl font-bold transform-gpu hover:scale-110 transition-transform duration-300">MECE</h3>
              </div>
              <p className="text-primary-foreground/80 transform-gpu hover:scale-105 transition-transform duration-300">
                {content.footer.description}
              </p>
            </div>
            <div className="transform-gpu hover:scale-105 transition-transform duration-300">
              <h4 className="font-semibold mb-4 transform-gpu hover:scale-110 transition-transform duration-300">Quick Links</h4>
              <div className="space-y-2">
                {content.footer.quickLinks.map((link, index) => (
                  <Link
                    key={index}
                    to={link === "Home" ? "/" : link === "About Us" ? "/about" : link === "Mission/Vision" ? "/mission" : link === "Blog" ? "/blog" : link === "Contact" ? "/contact" : link === "Registration" ? "/participate" : "/"}
                    className="block text-primary-foreground/80 hover:text-primary-foreground transition-all duration-300 transform-gpu hover:scale-105 hover:translate-x-2"
                  >
                    {link}
                  </Link>
                ))}
              </div>
            </div>
            <div className="transform-gpu hover:scale-105 transition-transform duration-300">
              <h4 className="font-semibold mb-4 transform-gpu hover:scale-110 transition-transform duration-300">Services</h4>
              <div className="space-y-2 text-primary-foreground/80">
                {content.footer.services.map((service, index) => (
                  <p key={index} className="transform-gpu hover:scale-105 transition-transform duration-300">{service}</p>
                ))}
              </div>
            </div>
            <div className="transform-gpu hover:scale-105 transition-transform duration-300">
              <h4 className="font-semibold mb-4 transform-gpu hover:scale-110 transition-transform duration-300">Contact</h4>
              <div className="space-y-2 text-primary-foreground/80">
                <p className="transform-gpu hover:scale-105 transition-transform duration-300">{content.footer.contact?.phone || "+234 8032160583"}</p>
                <p className="transform-gpu hover:scale-105 transition-transform duration-300">{content.footer.contact?.email || "contact@mece.org.ng"}</p>
                <p className="transform-gpu hover:scale-105 transition-transform duration-300">{content.footer.contact?.address || "35, Ajose Adeogun Street, Utako, Abuja, FCT"}</p>
              </div>
            </div>
          </div>
          
          {/* Social Media Links */}
          <div className="border-t border-primary-foreground/20 mt-8 pt-8">
            <div className="flex flex-col items-center space-y-4">
              <h4 className="font-semibold text-center transform-gpu hover:scale-110 transition-transform duration-300">
                Follow Us
              </h4>
              <div className="flex items-center justify-center space-x-6">
                <SocialMediaLinks />
              </div>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-primary-foreground/80 transform-gpu hover:scale-105 transition-transform duration-300">
            <p>&copy; 2024 MECE Consolidated Limited. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;