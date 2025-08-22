import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import API_ENDPOINTS from '@/config/api';

// Define the structure for website content
export interface WebsiteContent {
  hero: {
    title: string;
    subtitle: string;
    tagline1: string;
    tagline2: string;
    backgroundImage: string;
  };
  mission: {
    title: string;
    description: string;
  };
  services: {
    title: string;
    description: string;
    items: Array<{
      title: string;
      items: string[];
    }>;
  };
  competitions: {
    title: string;
    description: string;
    items: Array<{
      title: string;
      shortDescription: string;
      fullContent: string;
      image: string;
      gradient: string;
    }>;
  };
  footer: {
    description: string;
    quickLinks: string[];
    services: string[];
  };
  about: {
    title: string;
    description: string;
    vision: string;
    values: string[];
  };
  blog: {
    title: string;
    description: string;
    posts: Array<{
      id: string;
      title: string;
      excerpt: string;
      content: string;
      author: string;
      publishedAt: string;
      status: 'draft' | 'published' | 'archived';
      tags: string[];
      image: string;
    }>;
  };
}

// Default content
const defaultContent: WebsiteContent = {
  hero: {
    title: "Welcome to Mece Consolidated Limited",
    subtitle: "Empowering Innovation, Talent, and Sustainable Growth",
    tagline1: "Fueling Dreams. Shaping Realities.",
    tagline2: "Your Vision, Our Platform.",
    backgroundImage: "/images/Hero-image.jpg"
  },
  mission: {
    title: "Our Mission",
    description: "To discover, develop, and empower talents and innovators across all fields by providing the support and global platforms they need to turn their passions into world-changing achievements."
  },
  services: {
    title: "Our Services",
    description: "We offer a wide range of services across multiple industries, empowering individuals and communities through innovation, opportunity, and passion. Whether you're a student, entrepreneur, athlete, creative talent, or farmer — we have something for you. Get in touch and let's bring your vision to life.",
    items: [
      {
        title: "Agriculture & Agribusiness",
        items: [
          "Modern crop and livestock farming",
          "Agro-processing and packaging",
          "Supply of agricultural machinery and tools",
          "Organic and sustainable farming support",
          "Training and agricultural consultancy"
        ]
      },
      {
        title: "Sports Development",
        items: [
          "Scouting and managing athletic talent",
          "Running sports academies and training programs",
          "Organizing tournaments and events",
          "Sponsorship and brand partnership support",
          "Supplying sports gear and building facilities"
        ]
      },
      {
        title: "Modelling & Fashion",
        items: [
          "Developing and managing models",
          "Hosting fashion shows and style events",
          "Branding and collaboration with fashion designers",
          "Professional photoshoots and portfolio creation",
          "Beauty and fashion product promotion"
        ]
      },
      {
        title: "Talent & Entertainment",
        items: [
          "Promoting music, dance, acting, and other talents",
          "Talent discovery programs and competitions",
          "Studio recording and content production",
          "Hosting events and providing entertainment services",
          "Coaching and career development support"
        ]
      },
      {
        title: "Machinery & Equipment",
        items: [
          "Sales and leasing of all types of machines",
          "Custom sourcing of industrial, construction, and farm equipment",
          "Installation, training, and technical support",
          "Smart tech and automation integration"
        ]
      },
      {
        title: "Food & Culinary Services",
        items: [
          "Food processing, packaging, and branding",
          "Catering for events, businesses, and individuals",
          "Culinary training and mentorship",
          "Support for restaurants, food trucks, and delivery services"
        ]
      },
      {
        title: "Educational Competitions",
        items: [
          "Organizing Spelling Bee and Mathematics challenges",
          "Science fairs and innovation contests",
          "Debate and public speaking events",
          "Inter-school quizzes and academic competitions",
          "Educational workshops and training sessions"
        ]
      },
      {
        title: "Additional Services",
        items: [
          "Digital solutions and tech innovations",
          "Youth empowerment and development programs",
          "Event planning and brand activation",
          "Custom project development tailored to your goals"
        ]
      }
    ]
  },
  competitions: {
    title: "Competition: Show Your Skill",
    description: "Discover your talents and turn them into opportunities. Choose your field and start your journey to success.",
    items: [
      {
        title: "SPORTS",
        shortDescription: "Turn Your Passion for Sports into Profit! Are you talented in sports? It's time to stop watching from the sidelines and start turning your skills into success!",
        fullContent: "**Turn Your Passion for Sports into Profit!**\n\nAre you talented in sports? It's time to stop watching from the sidelines and start turning your skills into success! Whether you're great at football, basketball, boxing, or any sport you love, there are real opportunities to earn and grow in the game.\n\nSports isn't just a hobby anymore — it's a career path, a business, and a chance to shine. Join tournaments, compete at higher levels, attract sponsorships, and build your brand. The world is full of scouts, clubs, and fans looking for the next big talent — and it could be YOU.\n\nDon't waste your gift. Step onto the field, show what you've got, and start making money doing what you love. Your future in sports starts now!",
        image: "/images/sport-card.jpg",
        gradient: "bg-gradient-primary"
      },
      {
        title: "AGRICULTURE",
        shortDescription: "Step Into Agriculture and Start Earning! Agriculture isn't just about farming — it's a business, a career, and a smart way to build wealth.",
        fullContent: "**Step Into Agriculture and Start Earning!**\n\nAgriculture isn't just about farming — it's a business, a career, and a smart way to build wealth. With the growing demand for food, natural products, and sustainable living, agriculture offers endless opportunities to make money.\n\nWhether it's crop farming, livestock, poultry, fishery, or agribusiness, there's space for you to grow and profit. You don't need to own huge land to start — with the right mindset, knowledge, and effort, you can turn even small ventures into successful businesses.\n\nThe market is wide, and people will always need food. So why wait? Step into agriculture today, use your skills, and watch your hard work turn into income. The land is ready — are you?",
        image: "/images/agriculture-card.jpg",
        gradient: "bg-gradient-secondary"
      },
      {
        title: "MUSIC/DANCE",
        shortDescription: "Turn Your Music Passion into Profit! Got talent? Whether you sing, rap, produce beats, or write songs, the music world is waiting for YOU!",
        fullContent: "**Turn Your Music Passion into Profit!**\n\nGot talent? Whether you sing, rap, produce beats, or write songs, the music world is waiting for YOU! This is your chance to step up, share your sound, and make real money doing what you love.\n\nWith so many platforms, gigs, and opportunities, music isn't just a hobby — it's a way to build your brand and your income. Don't just dream about stardom. Come in, show off your skills, connect with fans, and turn your passion into profit.\n\nThe stage is set, the audience is ready — it's your time to shine and get paid for it!",
        image: "/images/music-dance-card.jpg",
        gradient: "bg-gradient-primary"
      },
      {
        title: "ARTS AND CRAFTS",
        shortDescription: "Arts and crafts involve creating beautiful and functional items by hand, using materials like paper, fabric, wood, and clay.",
        fullContent: "**Arts and crafts**\n\ninvolve creating beautiful and functional items by hand, using materials like paper, fabric, wood, and clay. It's a creative way to express ideas, emotions, and culture.\n\nFrom painting and drawing to knitting and sculpting, arts and crafts inspire imagination, develop skills, and bring joy to both creators and collectors. Now's your chance to turn your creativity into cash!\n\nWhether you're an artist, crafter, or just love making things, come in and showcase your talent. Sell your handmade products, teach workshops, or join exhibitions—make your money through the art you love! Create, share, and earn!",
        image: "/images/arts-craft-card.jpg",
        gradient: "bg-gradient-secondary"
      },
      {
        title: "SPELLING BEE",
        shortDescription: "Ready to put your spelling skills to the test and turn your talent into cash? Join our spelling bee competition and start your own money-making journey!",
        fullContent: "**Ready to put your spelling skills to the test and turn your talent into cash?**\n\nJoin our spelling bee competition and start your own money-making journey! Whether you're a word wizard or just love a challenge, this is your chance to compete, learn, and win real prizes.\n\nStep up, spell your way to success, and watch your earnings grow. Don't miss out—come in and make your money with your brainpower!",
        image: "/images/spelling-bee-card.jpg",
        gradient: "bg-gradient-primary"
      },
      {
        title: "MATHEMATICS",
        shortDescription: "Unlock the power of numbers and turn your math skills into a money-making machine!",
        fullContent: "**Unlock the power of numbers and turn your math skills into a money-making machine!**\n\nWhether you love crunching numbers or want to boost your problem-solving game, this is your golden opportunity to earn big while doing what you enjoy.\n\nDon't just study math—make it work for you! Step in now, challenge yourself, and watch your earnings multiply!",
        image: "/images/mathematics-card.jpg",
        gradient: "bg-gradient-secondary"
      },
      {
        title: "STORY TELLING",
        shortDescription: "Storytelling is the timeless art of sharing experiences, ideas, and emotions through words.",
        fullContent: "**Storytelling is the timeless art of sharing experiences, ideas, and emotions through words.**\n\nStorytelling is the timeless art of sharing experiences, ideas, and emotions through words. It connects people, preserves culture, and brings imagination to life. Whether spoken, written, or performed, storytelling captures hearts and minds, making it a powerful tool for communication, education, and entertainment.\n\nEveryone has a story to tell—and every story has the power to inspire. Now's your moment to turn your stories into income! Step up, share your voice, and make your money through storytelling. Whether you're a natural narrator, writer, or performer, this is your stage. Come in, captivate your audience, and get rewarded for the stories only you can tell!",
        image: "/images/story-telling-caed.jpg",
        gradient: "bg-gradient-primary"
      },
      {
        title: "FASHION",
        shortDescription: "Fashion is a dynamic form of self-expression that reflects personality, culture, and creativity through clothing, accessories, and style.",
        fullContent: "**Fashion is a dynamic form of self-expression that reflects personality, culture, and creativity through clothing, accessories, and style.**\n\nFashion is a dynamic form of self-expression that reflects personality, culture, and creativity through clothing, accessories, and style. It evolves with time, influenced by trends, art, music, and society. From everyday wear to high-end couture, fashion plays a key role in shaping identity and making statements without words.\n\nNow's your chance to step into the world of fashion and turn your style into income! Whether you're a designer, model, stylist, or just passionate about trends, this is your runway to success. Come in, showcase your talent, and make your money in fashion—where creativity meets opportunity!",
        image: "/images/fashion-card.jpg",
        gradient: "bg-gradient-secondary"
      },
      {
        title: "TECHNOLOGY",
        shortDescription: "Technology refers to the tools, systems, and methods created by humans to solve problems, improve efficiency, and enhance daily life.",
        fullContent: "**Technology refers to the tools, systems, and methods created by humans to solve problems, improve efficiency, and enhance daily life.**\n\nTechnology refers to the tools, systems, and methods created by humans to solve problems, improve efficiency, and enhance daily life. It encompasses everything from simple inventions like the wheel to complex innovations such as artificial intelligence and the internet. Technology drives progress across industries, enabling faster communication, advanced healthcare, smarter transportation, and access to vast amounts of information.\n\nAs technology evolves, it continues to shape society, influence culture, and open new possibilities for the future. Now, step right in and start your own money-making machine! This is your chance to join us and turn your ideas, skills, or investments into real cash flow. Don't just watch others succeed—become part of the action, where every effort helps build your financial future. Come in, plug into the system, and watch your money work for you like a well-oiled machine. Let's make money together!",
        image: "/images/technology-card.jpg",
        gradient: "bg-gradient-primary"
      },
      {
        title: "FOOD PROCESSING",
        shortDescription: "Food processing is the transformation of raw ingredients into food products that are safe, tasty, and convenient to eat.",
        fullContent: "**Food processing is the transformation of raw ingredients into food products that are safe, tasty, and convenient to eat.**\n\nFood processing is the transformation of raw ingredients into food products that are safe, tasty, and convenient to eat. It includes methods like cleaning, cooking, freezing, drying, and packaging. Food processing helps extend shelf life, improve food quality, and ensure safety. It plays a vital role in feeding the world efficiently and supports the global food industry by making food available, accessible, and appealing.\n\nNow's your chance to turn your passion for food into profit! Come in, get involved, and be part of the booming food processing industry. Whether you want to learn, invest, or launch your own product, there's real money to be made. Join us and start building your food-based money-making machine today!",
        image: "/images/food-processing-card.jpg",
        gradient: "bg-gradient-secondary"
      },
      {
        title: "SPOKEN WORDS",
        shortDescription: "Spoken word is a powerful form of artistic expression where poetry, storytelling, and performance come alive.",
        fullContent: "**Spoken word is a powerful form of artistic expression where poetry, storytelling, and performance come alive.**\n\nIt's more than just words—it's emotion, rhythm, and voice used to inspire, challenge, and connect with others. Spoken word gives a platform to share personal stories, spark conversations, and make an impact through creativity.\n\nNow's your chance to turn your voice into income! Step up to the mic, share your truth, and make your money through spoken word. Whether you're a poet, performer, or passionate storyteller, this is your stage. Join us, let your words flow, and get rewarded for your talent!",
        image: "/images/spoken-word-card.jpg",
        gradient: "bg-gradient-primary"
      },
      {
        title: "INNOVATION",
        shortDescription: "Innovation is the process of turning creative ideas into solutions that improve lives, solve problems, or change the way we do things.",
        fullContent: "**Innovation is the process of turning creative ideas into solutions that improve lives, solve problems, or change the way we do things.**\n\nIt drives progress in every field—from technology and science to business and the arts. Innovation means thinking differently, challenging the norm, and creating something new or better. It's the spark behind inventions, breakthroughs, and the future.\n\nNow's your chance to turn your big ideas into big income! Step in, share your creativity, and be part of a space where innovation meets opportunity. Whether you're an inventor, thinker, or problem-solver, this is your moment to shine. Come in, contribute, and make your money by shaping the future!",
        image: "/images/innovation-card.jpg",
        gradient: "bg-gradient-secondary"
      }
    ]
  },
  footer: {
    description: "Empowering Innovation, Talent, and Sustainable Growth",
    quickLinks: ["Home", "About Us", "Mission/Vision", "Blog", "Contact", "Registration"],
    services: ["Talent Development", "Sports Management", "Agricultural Innovation", "Creative Arts & Music", "Technology Solutions"],
    contact: {
      phone: "+234 8032160583",
      email: "contact@mece.org.ng",
      address: "NO. 35, AJOSE ADEOGUN STREET, UTAKO, ABUJA, FCT, NIGERIA"
    }
  },
  about: {
    title: "About MECE Consolidated Limited",
    description: "We are a dynamic organization dedicated to empowering individuals and communities through innovation, talent development, and sustainable growth initiatives.",
    vision: "To be the leading platform for talent discovery and innovation across Africa and beyond.",
    values: ["Excellence", "Innovation", "Integrity", "Community", "Sustainability"]
  },
  blog: {
    title: "Our Blog",
    description: "Stay updated with the latest insights, success stories, and opportunities in talent development and innovation.",
    posts: []
  }
};

interface ContentContextType {
  content: WebsiteContent;
  updateContent: (section: keyof WebsiteContent, data: any) => void;
  updateSection: (section: keyof WebsiteContent, field: string, value: any) => void;
  addBlogPost: (post: any) => void;
  updateBlogPost: (id: string, updates: any) => void;
  deleteBlogPost: (id: string) => void;
  resetToDefault: () => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const useContent = () => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};

interface ContentProviderProps {
  children: ReactNode;
}

export const ContentProvider: React.FC<ContentProviderProps> = ({ children }) => {
  const [content, setContent] = useState<WebsiteContent>(defaultContent);
  const [isLoading, setIsLoading] = useState(true);

  // Load content from database on mount
  useEffect(() => {
    const loadContentFromDatabase = async () => {
      try {
        console.log('ContentContext - Loading from database...');
        const response = await fetch(API_ENDPOINTS.CONTENT.GET_ALL);
        if (response.ok) {
          const data = await response.json();
          console.log('ContentContext - Loaded from database:', data);
          
          // Convert database format to frontend format
          const convertedContent = convertDatabaseToFrontend(data);
          console.log('ContentContext - Converted content:', convertedContent);
          setContent(convertedContent);
        } else {
          console.log('ContentContext - Database load failed, using default');
          setContent(defaultContent);
        }
      } catch (error) {
        console.log('ContentContext - Database error, using default:', error);
        setContent(defaultContent);
      } finally {
        setIsLoading(false);
      }
    };

    loadContentFromDatabase();
  }, []);

  // Convert database format to frontend format
  const convertDatabaseToFrontend = (dbData: any): WebsiteContent => {
    const result: any = { ...defaultContent };
    
    Object.entries(dbData).forEach(([section, sectionData]: [string, any]) => {
      if (sectionData && typeof sectionData === 'object') {
        Object.entries(sectionData).forEach(([subsection, items]: [string, any]) => {
          if (items && typeof items === 'object') {
            Object.entries(items).forEach(([key, value]: [string, any]) => {
              if (subsection === 'main') {
                if (result[section]) {
                  result[section][key] = value;
                }
              } else if (subsection === 'contact' && section === 'footer') {
                if (!result.footer.contact) {
                  result.footer.contact = {};
                }
                result.footer.contact[key] = value;
              }
            });
          }
        });
      }
    });
    
    console.log('ContentContext - Converted from DB to frontend:', result);
    return result;
  };

  // Save to database whenever content changes
  useEffect(() => {
    if (!isLoading) {
      const saveContentToDatabase = async () => {
        try {
          console.log('ContentContext - Saving to database:', content);
          
          // Convert frontend format to database format
          const dbData = convertFrontendToDatabase(content);
          console.log('ContentContext - Converted to DB format:', dbData);
          
          const response = await fetch(API_ENDPOINTS.CONTENT.SAVE_ALL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(dbData),
          });
          
          if (response.ok) {
            console.log('ContentContext - Saved to database successfully');
          } else {
            console.error('ContentContext - Failed to save to database');
          }
        } catch (error) {
          console.error('ContentContext - Database save error:', error);
        }
      };

      saveContentToDatabase();
    }
  }, [content, isLoading]);

  // Convert frontend format to database format
  const convertFrontendToDatabase = (frontendData: WebsiteContent): any => {
    const result: any = {};
    
    // Convert hero section
    result.hero = {
      main: {
        title: frontendData.hero.title,
        subtitle: frontendData.hero.subtitle,
        tagline1: frontendData.hero.tagline1,
        tagline2: frontendData.hero.tagline2,
        backgroundImage: frontendData.hero.backgroundImage
      }
    };
    
    // Convert mission section
    result.mission = {
      main: {
        title: frontendData.mission.title,
        description: frontendData.mission.description
      }
    };
    
    // Convert services section
    result.services = {
      main: {
        title: frontendData.services.title,
        description: frontendData.services.description
      }
    };
    
    // Convert competitions section
    result.competitions = {
      main: {
        title: frontendData.competitions.title,
        description: frontendData.competitions.description
      }
    };
    
    // Convert about section
    result.about = {
      main: {
        title: frontendData.about.title,
        description: frontendData.about.description,
        vision: frontendData.about.vision
      }
    };
    
    // Convert blog section
    result.blog = {
      main: {
        title: frontendData.blog.title,
        description: frontendData.blog.description
      }
    };
    
    // Convert footer section
    result.footer = {
      main: {
        description: frontendData.footer.description
      },
      contact: {
        phone: frontendData.footer.contact?.phone || '',
        email: frontendData.footer.contact?.email || '',
        address: frontendData.footer.contact?.address || ''
      }
    };
    
    return result;
  };

  const updateContent = (section: keyof WebsiteContent, data: any) => {
    console.log('ContentContext - Updating content section:', section, 'with data:', data);
    setContent(prev => {
      const newContent = {
        ...prev,
        [section]: { ...prev[section], ...data }
      };
      console.log('ContentContext - New content state:', newContent);
      return newContent;
    });
  };

  const updateSection = (section: keyof WebsiteContent, field: string, value: any) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const addBlogPost = (post: any) => {
    setContent(prev => ({
      ...prev,
      blog: {
        ...prev.blog,
        posts: [post, ...prev.blog.posts]
      }
    }));
  };

  const updateBlogPost = (id: string, updates: any) => {
    setContent(prev => ({
      ...prev,
      blog: {
        ...prev.blog,
        posts: prev.blog.posts.map(post =>
          post.id === id ? { ...post, ...updates } : post
        )
      }
    }));
  };

  const deleteBlogPost = (id: string) => {
    setContent(prev => ({
      ...prev,
      blog: {
        ...prev.blog,
        posts: prev.blog.posts.filter(post => post.id !== id)
      }
    }));
  };

  const resetToDefault = () => {
    setContent(defaultContent);
  };

  const value: ContentContextType = {
    content,
    updateContent,
    updateSection,
    addBlogPost,
    updateBlogPost,
    deleteBlogPost,
    resetToDefault
  };

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
};
