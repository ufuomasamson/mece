import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { Target, Eye } from "lucide-react";

const Mission = () => {
  return (
    <Layout>
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
              Mission & Vision
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our driving force and future aspirations
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="shadow-elegant hover:shadow-glow transition-smooth">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="bg-gradient-primary p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <Target className="text-primary-foreground" size={32} />
                  </div>
                  <h2 className="text-3xl font-bold text-primary">Our Mission</h2>
                </div>
                
                <p className="text-lg leading-relaxed">
                  Our mission is to build a thriving ecosystem where creativity meets opportunity, 
                  and where individuals and communities are empowered to achieve excellence. 
                  With Mece Consolidated Limited, every skill has value, and every vision has a future.
                </p>
                
                <div className="mt-8 p-4 bg-primary/5 rounded-lg">
                  <p className="text-primary font-medium text-center">
                    "Fueling Dreams. Shaping Realities."
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-elegant hover:shadow-glow transition-smooth">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="bg-gradient-secondary p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <Eye className="text-primary-foreground" size={32} />
                  </div>
                  <h2 className="text-3xl font-bold text-accent">Our Vision</h2>
                </div>
                
                <p className="text-lg leading-relaxed">
                  To become a global leader in talent empowerment by creating a future where every skill, 
                  idea, and dream can thrive — regardless of background, location, or industry.
                </p>
                
                <div className="mt-8 p-4 bg-accent/5 rounded-lg">
                  <p className="text-accent font-medium text-center">
                    "Your Vision, Our Platform."
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-12 shadow-elegant">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-6 text-center">Our Core Values</h3>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4"></div>
                  <h4 className="font-semibold mb-2">Excellence</h4>
                  <p className="text-sm text-muted-foreground">Striving for the highest standards in everything we do</p>
                </div>
                <div className="text-center">
                  <div className="bg-secondary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4"></div>
                  <h4 className="font-semibold mb-2">Innovation</h4>
                  <p className="text-sm text-muted-foreground">Embracing new ideas and creative solutions</p>
                </div>
                <div className="text-center">
                  <div className="bg-accent/10 p-4 rounded-full w-16 h-16 mx-auto mb-4"></div>
                  <h4 className="font-semibold mb-2">Empowerment</h4>
                  <p className="text-sm text-muted-foreground">Enabling individuals to reach their full potential</p>
                </div>
                <div className="text-center">
                  <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4"></div>
                  <h4 className="font-semibold mb-2">Impact</h4>
                  <p className="text-sm text-muted-foreground">Creating meaningful change in communities</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Mission;