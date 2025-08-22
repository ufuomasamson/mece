import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useContent } from "@/contexts/ContentContext";
import { toast } from "sonner";
import { Save, RefreshCw, Eye, Plus, Trash2, Edit } from "lucide-react";

const ContentManagement = () => {
  const { content, updateContent } = useContent();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("hero");

  // Sync form states with content context
  useEffect(() => {
    console.log('Content changed, syncing forms:', content);
    setHeroForm({
      title: content.hero.title,
      subtitle: content.hero.subtitle,
      tagline1: content.hero.tagline1,
      tagline2: content.hero.tagline2,
      backgroundImage: content.hero.backgroundImage
    });

    setMissionForm({
      title: content.mission.title,
      description: content.mission.description
    });

    setServicesForm({
      title: content.services.title,
      description: content.services.description,
      items: content.services.items
    });

    setAboutForm({
      title: content.about.title,
      description: content.about.description
    });

    setCompetitionsForm({
      title: content.competitions.title,
      description: content.competitions.description,
      items: content.competitions.items
    });

    setFooterForm({
      description: content.footer.description,
      quickLinks: content.footer.quickLinks,
      services: content.footer.services
    });

    setContactForm({
      phone: content.footer.contact?.phone || "+234 8032160583",
      email: content.footer.contact?.email || "contact@mece.org.ng",
      address: content.footer.contact?.address || "NO. 35, AJOSE ADEOGUN STREET, UTAKO, ABUJA, FCT, NIGERIA"
    });
  }, [content]);

  // Form states for each section
  const [heroForm, setHeroForm] = useState({
    title: "",
    subtitle: "",
    tagline1: "",
    tagline2: "",
    backgroundImage: ""
  });

  const [missionForm, setMissionForm] = useState({
    title: "",
    description: ""
  });

  const [servicesForm, setServicesForm] = useState({
    title: "",
    description: "",
    items: []
  });

  const [aboutForm, setAboutForm] = useState({
    title: "",
    description: ""
  });

  const [competitionsForm, setCompetitionsForm] = useState({
    title: "",
    description: "",
    items: []
  });

  const [footerForm, setFooterForm] = useState({
    description: "",
    quickLinks: [],
    services: []
  });

  const [contactForm, setContactForm] = useState({
    phone: "",
    email: "",
    address: ""
  });

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    console.log('Submitting hero form:', heroForm);
    updateContent('hero', heroForm);
    toast.success("Hero section updated successfully!");
    setIsLoading(false);
  };

  const handleMissionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    updateContent('mission', missionForm);
    toast.success("Mission section updated successfully!");
    setIsLoading(false);
  };

  const handleServicesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    updateContent('services', {
      title: servicesForm.title,
      description: servicesForm.description,
      items: servicesForm.items
    });
    toast.success("Services section updated successfully!");
    setIsLoading(false);
  };

  const handleAboutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    updateContent('about', aboutForm);
    toast.success("About section updated successfully!");
    setIsLoading(false);
  };

  const handleCompetitionsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    updateContent('competitions', {
      title: competitionsForm.title,
      description: competitionsForm.description,
      items: competitionsForm.items
    });
    toast.success("Competitions section updated successfully!");
    setIsLoading(false);
  };

  const handleFooterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    updateContent('footer', {
      description: footerForm.description,
      quickLinks: footerForm.quickLinks,
      services: footerForm.services,
      contact: content.footer.contact // Preserve existing contact info
    });
    toast.success("Footer section updated successfully!");
    setIsLoading(false);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Update contact info in footer section
    updateContent('footer', {
      ...content.footer,
      contact: {
        phone: contactForm.phone,
        email: contactForm.email,
        address: contactForm.address
      }
    });
    toast.success("Contact information updated successfully!");
    setIsLoading(false);
  };

  const resetForm = (section: string) => {
    switch (section) {
      case "hero":
        setHeroForm({
          title: content.hero.title,
          subtitle: content.hero.subtitle,
          tagline1: content.hero.tagline1,
          tagline2: content.hero.tagline2,
          backgroundImage: content.hero.backgroundImage
        });
        break;
      case "mission":
        setMissionForm({
          title: content.mission.title,
          description: content.mission.description
        });
        break;
      case "services":
        setServicesForm({
          title: content.services.title,
          description: content.services.description,
          items: content.services.items
        });
        break;
      case "about":
        setAboutForm({
          title: content.about.title,
          description: content.about.description
        });
        break;
      case "competitions":
        setCompetitionsForm({
          title: content.competitions.title,
          description: content.competitions.description,
          items: content.competitions.items
        });
        break;
      case "footer":
        setFooterForm({
          description: content.footer.description,
          quickLinks: content.footer.quickLinks,
          services: content.footer.services
        });
        break;
      case "contact":
        setContactForm({
          phone: "+234 8032160583",
          email: "contact@mece.org.ng",
          address: "NO. 35, AJOSE ADEOGUN STREET, UTAKO, ABUJA, FCT, NIGERIA"
        });
        break;
    }
    toast.info("Form reset to current values");
  };

  // Helper functions for competitions
  const addCompetition = () => {
    const newCompetition = {
      title: "NEW COMPETITION",
      shortDescription: "Enter short description",
      fullContent: "Enter full content",
      image: "/images/default-competition.jpg",
      gradient: "bg-gradient-primary"
    };
    setCompetitionsForm(prev => ({
      ...prev,
      items: [...prev.items, newCompetition]
    }));
  };

  const updateCompetition = (index: number, field: string, value: string) => {
    setCompetitionsForm(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const deleteCompetition = (index: number) => {
    if (confirm("Are you sure you want to delete this competition?")) {
      setCompetitionsForm(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    }
  };

  // Helper functions for services
  const addService = () => {
    const newService = {
      title: "NEW SERVICE",
      items: ["Enter service item"]
    };
    setServicesForm(prev => ({
      ...prev,
      items: [...prev.items, newService]
    }));
  };

  const updateService = (index: number, field: string, value: any) => {
    setServicesForm(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const updateServiceItem = (serviceIndex: number, itemIndex: number, value: string) => {
    setServicesForm(prev => ({
      ...prev,
      items: prev.items.map((service, i) => 
        i === serviceIndex ? {
          ...service,
          items: service.items.map((item, j) => 
            j === itemIndex ? value : item
          )
        } : service
      )
    }));
  };

  const addServiceItem = (serviceIndex: number) => {
    setServicesForm(prev => ({
      ...prev,
      items: prev.items.map((service, i) => 
        i === serviceIndex ? {
          ...service,
          items: [...service.items, "New service item"]
        } : service
      )
    }));
  };

  const deleteServiceItem = (serviceIndex: number, itemIndex: number) => {
    setServicesForm(prev => ({
      ...prev,
      items: prev.items.map((service, i) => 
        i === serviceIndex ? {
          ...service,
          items: service.items.filter((_, j) => j !== itemIndex)
        } : service
      )
    }));
  };

  const deleteService = (index: number) => {
    if (confirm("Are you sure you want to delete this service?")) {
      setServicesForm(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
          <p className="text-gray-600 mt-2">Edit and manage your website content</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => window.open("/", "_blank")}
          className="flex items-center space-x-2"
        >
          <Eye size={20} />
          <span>Preview Site</span>
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="mission">Mission</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="competitions">Competitions</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="footer">Footer</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>

        {/* Hero Section */}
        <TabsContent value="hero" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section Content</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleHeroSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hero-title">Main Title</Label>
                    <Input
                      id="hero-title"
                      value={heroForm.title}
                      onChange={(e) => setHeroForm({...heroForm, title: e.target.value})}
                      placeholder="Enter main title"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hero-subtitle">Subtitle</Label>
                    <Input
                      id="hero-subtitle"
                      value={heroForm.subtitle}
                      onChange={(e) => setHeroForm({...heroForm, subtitle: e.target.value})}
                      placeholder="Enter subtitle"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hero-tagline1">Tagline 1</Label>
                    <Input
                      id="hero-tagline1"
                      value={heroForm.tagline1}
                      onChange={(e) => setHeroForm({...heroForm, tagline1: e.target.value})}
                      placeholder="Enter first tagline"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hero-tagline2">Tagline 2</Label>
                    <Input
                      id="hero-tagline2"
                      value={heroForm.tagline2}
                      onChange={(e) => setHeroForm({...heroForm, tagline2: e.target.value})}
                      placeholder="Enter second tagline"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hero-bg">Background Image URL</Label>
                  <Input
                    id="hero-bg"
                    value={heroForm.backgroundImage}
                    onChange={(e) => setHeroForm({...heroForm, backgroundImage: e.target.value})}
                    placeholder="Enter background image URL"
                    required
                  />
                </div>

                <div className="flex space-x-3">
                  <Button type="submit" disabled={isLoading} className="flex items-center space-x-2">
                    <Save size={20} />
                    <span>{isLoading ? "Saving..." : "Save Changes"}</span>
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => resetForm("hero")}
                    className="flex items-center space-x-2"
                  >
                    <RefreshCw size={20} />
                    <span>Reset</span>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Mission Section */}
        <TabsContent value="mission" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mission Section Content</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleMissionSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mission-title">Mission Title</Label>
                  <Input
                    id="mission-title"
                    value={missionForm.title}
                    onChange={(e) => setMissionForm({...missionForm, title: e.target.value})}
                    placeholder="Enter mission title"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="mission-description">Mission Description</Label>
                  <Textarea
                    id="mission-description"
                    value={missionForm.description}
                    onChange={(e) => setMissionForm({...missionForm, description: e.target.value})}
                    placeholder="Enter mission description"
                    rows={6}
                    required
                  />
                </div>

                <div className="flex space-x-3">
                  <Button type="submit" disabled={isLoading} className="flex items-center space-x-2">
                    <Save size={20} />
                    <span>{isLoading ? "Saving..." : "Save Changes"}</span>
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => resetForm("mission")}
                    className="flex items-center space-x-2"
                  >
                    <RefreshCw size={20} />
                    <span>Reset</span>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Services Section */}
        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Services Section Content</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleServicesSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="services-title">Services Title</Label>
                  <Input
                    id="services-title"
                    value={servicesForm.title}
                    onChange={(e) => setServicesForm({...servicesForm, title: e.target.value})}
                    placeholder="Enter services title"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="services-description">Services Description</Label>
                  <Textarea
                    id="services-description"
                    value={servicesForm.description}
                    onChange={(e) => setServicesForm({...servicesForm, description: e.target.value})}
                    placeholder="Enter services description"
                    rows={4}
                    required
                  />
                </div>

                <div className="flex space-x-3">
                  <Button type="submit" disabled={isLoading} className="flex items-center space-x-2">
                    <Save size={20} />
                    <span>{isLoading ? "Saving..." : "Save Changes"}</span>
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => resetForm("services")}
                    className="flex items-center space-x-2"
                  >
                    <RefreshCw size={20} />
                    <span>Reset</span>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Services Items Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Services Items</CardTitle>
                <Button onClick={addService} variant="outline" size="sm">
                  <Plus size={16} className="mr-2" />
                  Add Service
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {servicesForm.items.map((service, serviceIndex) => (
                  <div key={serviceIndex} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">Service {serviceIndex + 1}</h4>
                      <Button 
                        onClick={() => deleteService(serviceIndex)} 
                        variant="destructive" 
                        size="sm"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Service Title</Label>
                      <Input
                        value={service.title}
                        onChange={(e) => updateService(serviceIndex, 'title', e.target.value)}
                        placeholder="Enter service title"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Service Items</Label>
                        <Button 
                          onClick={() => addServiceItem(serviceIndex)} 
                          variant="outline" 
                          size="sm"
                        >
                          <Plus size={16} className="mr-2" />
                          Add Item
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {service.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-center space-x-2">
                            <Input
                              value={item}
                              onChange={(e) => updateServiceItem(serviceIndex, itemIndex, e.target.value)}
                              placeholder="Enter service item"
                            />
                            <Button 
                              onClick={() => deleteServiceItem(serviceIndex, itemIndex)} 
                              variant="destructive" 
                              size="sm"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Competitions Section */}
        <TabsContent value="competitions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Competitions Section Content</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCompetitionsSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="competitions-title">Competitions Title</Label>
                  <Input
                    id="competitions-title"
                    value={competitionsForm.title}
                    onChange={(e) => setCompetitionsForm({...competitionsForm, title: e.target.value})}
                    placeholder="Enter competitions title"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="competitions-description">Competitions Description</Label>
                  <Textarea
                    id="competitions-description"
                    value={competitionsForm.description}
                    onChange={(e) => setCompetitionsForm({...competitionsForm, description: e.target.value})}
                    placeholder="Enter competitions description"
                    rows={4}
                    required
                  />
                </div>

                <div className="flex space-x-3">
                  <Button type="submit" disabled={isLoading} className="flex items-center space-x-2">
                    <Save size={20} />
                    <span>{isLoading ? "Saving..." : "Save Changes"}</span>
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => resetForm("competitions")}
                    className="flex items-center space-x-2"
                  >
                    <RefreshCw size={20} />
                    <span>Reset</span>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Competitions Items Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Competition Items</CardTitle>
                <Button onClick={addCompetition} variant="outline" size="sm">
                  <Plus size={16} className="mr-2" />
                  Add Competition
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {competitionsForm.items.map((competition, competitionIndex) => (
                  <div key={competitionIndex} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">Competition {competitionIndex + 1}</h4>
                      <Button 
                        onClick={() => deleteCompetition(competitionIndex)} 
                        variant="destructive" 
                        size="sm"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                          value={competition.title}
                          onChange={(e) => updateCompetition(competitionIndex, 'title', e.target.value)}
                          placeholder="Enter competition title"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Image URL</Label>
                        <Input
                          value={competition.image}
                          onChange={(e) => updateCompetition(competitionIndex, 'image', e.target.value)}
                          placeholder="Enter image URL"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Short Description</Label>
                      <Textarea
                        value={competition.shortDescription}
                        onChange={(e) => updateCompetition(competitionIndex, 'shortDescription', e.target.value)}
                        placeholder="Enter short description"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Full Content</Label>
                      <Textarea
                        value={competition.fullContent}
                        onChange={(e) => updateCompetition(competitionIndex, 'fullContent', e.target.value)}
                        placeholder="Enter full content"
                        rows={6}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Gradient Class</Label>
                      <Input
                        value={competition.gradient}
                        onChange={(e) => updateCompetition(competitionIndex, 'gradient', e.target.value)}
                        placeholder="e.g., bg-gradient-primary"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* About Section */}
        <TabsContent value="about" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>About Section Content</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAboutSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="about-title">About Title</Label>
                  <Input
                    id="about-title"
                    value={aboutForm.title}
                    onChange={(e) => setAboutForm({...aboutForm, title: e.target.value})}
                    placeholder="Enter about title"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="about-description">About Description</Label>
                  <Textarea
                    id="about-description"
                    value={aboutForm.description}
                    onChange={(e) => setAboutForm({...aboutForm, description: e.target.value})}
                    placeholder="Enter about description"
                    rows={6}
                    required
                  />
                </div>

                <div className="flex space-x-3">
                  <Button type="submit" disabled={isLoading} className="flex items-center space-x-2">
                    <Save size={20} />
                    <span>{isLoading ? "Saving..." : "Save Changes"}</span>
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => resetForm("about")}
                    className="flex items-center space-x-2"
                  >
                    <RefreshCw size={20} />
                    <span>Reset</span>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Footer Section */}
        <TabsContent value="footer" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Footer Section Content</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFooterSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="footer-description">Footer Description</Label>
                  <Textarea
                    id="footer-description"
                    value={footerForm.description}
                    onChange={(e) => setFooterForm({...footerForm, description: e.target.value})}
                    placeholder="Enter footer description"
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Quick Links</Label>
                    <div className="space-y-2">
                      {footerForm.quickLinks.map((link, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Input
                            value={link}
                            onChange={(e) => {
                              const newLinks = [...footerForm.quickLinks];
                              newLinks[index] = e.target.value;
                              setFooterForm({...footerForm, quickLinks: newLinks});
                            }}
                            placeholder="Enter quick link"
                          />
                          <Button 
                            onClick={() => {
                              const newLinks = footerForm.quickLinks.filter((_, i) => i !== index);
                              setFooterForm({...footerForm, quickLinks: newLinks});
                            }} 
                            variant="destructive" 
                            size="sm"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      ))}
                      <Button 
                        onClick={() => setFooterForm({
                          ...footerForm, 
                          quickLinks: [...footerForm.quickLinks, "New Link"]
                        })} 
                        variant="outline" 
                        size="sm"
                      >
                        <Plus size={16} className="mr-2" />
                        Add Quick Link
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Services</Label>
                    <div className="space-y-2">
                      {footerForm.services.map((service, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Input
                            value={service}
                            onChange={(e) => {
                              const newServices = [...footerForm.services];
                              newServices[index] = e.target.value;
                              setFooterForm({...footerForm, services: newServices});
                            }}
                            placeholder="Enter service"
                          />
                          <Button 
                            onClick={() => {
                              const newServices = footerForm.services.filter((_, i) => i !== index);
                              setFooterForm({...footerForm, services: newServices});
                            }} 
                            variant="destructive" 
                            size="sm"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      ))}
                      <Button 
                        onClick={() => setFooterForm({
                          ...footerForm, 
                          services: [...footerForm.services, "New Service"]
                        })} 
                        variant="outline" 
                        size="sm"
                      >
                        <Plus size={16} className="mr-2" />
                        Add Service
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button type="submit" disabled={isLoading} className="flex items-center space-x-2">
                    <Save size={20} />
                    <span>{isLoading ? "Saving..." : "Save Changes"}</span>
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => resetForm("footer")}
                    className="flex items-center space-x-2"
                  >
                    <RefreshCw size={20} />
                    <span>Reset</span>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Section */}
        <TabsContent value="contact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contact-phone">Phone Number</Label>
                  <Input
                    id="contact-phone"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                    placeholder="Enter phone number"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-email">Email Address</Label>
                  <Input
                    id="contact-email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                    placeholder="Enter email address"
                    type="email"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-address">Address</Label>
                  <Textarea
                    id="contact-address"
                    value={contactForm.address}
                    onChange={(e) => setContactForm({...contactForm, address: e.target.value})}
                    placeholder="Enter address"
                    rows={3}
                    required
                  />
                </div>

                <div className="flex space-x-3">
                  <Button type="submit" disabled={isLoading} className="flex items-center space-x-2">
                    <Save size={20} />
                    <span>{isLoading ? "Saving..." : "Save Changes"}</span>
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => resetForm("contact")}
                    className="flex items-center space-x-2"
                  >
                    <RefreshCw size={20} />
                    <span>Reset</span>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentManagement;
