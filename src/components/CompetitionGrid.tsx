import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { useState } from "react";
import { useContent } from "@/contexts/ContentContext";
import {
  Trophy,
  Sprout,
  Music,
  Palette,
  BookOpen,
  Calculator,
  MessageSquare,
  Shirt,
  Laptop,
  ChefHat,
  Mic,
  Lightbulb
} from "lucide-react";

const CompetitionGrid = () => {
  const { content } = useContent();
  const [selectedCompetition, setSelectedCompetition] = useState<number | null>(null);


  // Icon mapping for competitions
  const iconMap = {
    "SPORTS": Trophy,
    "AGRICULTURE": Sprout,
    "MUSIC/DANCE": Music,
    "ARTS AND CRAFTS": Palette,
    "SPELLING BEE": BookOpen,
    "MATHEMATICS": Calculator,
    "STORY TELLING": MessageSquare,
    "FASHION": Shirt,
    "TECHNOLOGY": Laptop,
    "FOOD PROCESSING": ChefHat,
    "SPOKEN WORDS": Mic,
    "INNOVATION": Lightbulb
  };

  const openModal = (index: number) => {
    setSelectedCompetition(index);
  };

  const closeModal = () => {
    setSelectedCompetition(null);
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">


        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent transform-gpu hover:scale-105 transition-transform duration-500 gradient-text">
            {content.competitions.title}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto transform-gpu hover:scale-105 transition-transform duration-500">
            {content.competitions.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {content.competitions.items.map((competition, index) => {
            const Icon = iconMap[competition.title as keyof typeof iconMap] || Trophy;

            return (
              <Card
                key={index}
                className="competition-card shadow-elegant hover:shadow-glow transition-all duration-500 transform-gpu hover:scale-105 hover:-rotate-1 group perspective-1000 card-hover-3d"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: 'rotateY(0deg) rotateX(0deg)',
                }}
                // Temporarily disabled 3D effects for debugging
                // onMouseMove={(e) => {
                //   const card = e.currentTarget;
                //   const rect = card.getBoundingClientRect();
                //   const x = e.clientX - rect.left;
                //   const y = e.clientY - rect.top;
                //   const centerX = rect.width / 2;
                //   const centerY = rect.height / 2;
                //   const rotateX = (y - centerY) / 15;
                //   const rotateY = (centerX - x) / 15;

                //   card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
                // }}
                // onMouseLeave={(e) => {
                //   e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
                // }}
              >
                {/* Image Section - All same size */}
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={competition.image}
                    alt={competition.title}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 ${competition.gradient} opacity-20 group-hover:opacity-30 transition-opacity duration-300`}></div>
                  {/* Icon Overlay */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                </div>

                {/* Content Section */}
                <CardContent className="p-6">
                  <CardTitle className="text-xl font-bold mb-3 text-primary group-hover:text-primary/80 transition-colors duration-300">
                    {competition.title}
                  </CardTitle>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {competition.shortDescription}
                  </p>
                  <Button
                    onClick={() => openModal(index)}
                    className="w-full bg-gradient-primary hover:bg-gradient-primary/90 text-white transform-gpu hover:scale-105 transition-all duration-300"
                  >
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>



      {/* Competition Modal */}
      {selectedCompetition !== null && (
        <Modal
          isOpen={selectedCompetition !== null}
          onClose={closeModal}
          title={content.competitions.items[selectedCompetition].title}
          icon={iconMap[content.competitions.items[selectedCompetition].title as keyof typeof iconMap] || Trophy}
        >
          <div className="space-y-6">
            {/* Modal Image */}
            <div className="relative overflow-hidden rounded-lg">
              <img
                src={content.competitions.items[selectedCompetition].image}
                alt={content.competitions.items[selectedCompetition].title}
                className="w-full h-64 object-cover"
              />
              <div className={`absolute inset-0 ${content.competitions.items[selectedCompetition].gradient} opacity-30`}></div>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              {content.competitions.items[selectedCompetition].fullContent.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-4 text-muted-foreground leading-relaxed">
                  {paragraph.replace(/\*\*(.*?)\*\*/g, '$1')}
                </p>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
};

export default CompetitionGrid;