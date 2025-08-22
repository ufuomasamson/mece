import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { Calendar, User } from "lucide-react";

const Blog = () => {
  return (
    <Layout>
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
              Blog
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Stories, insights, and updates from our community
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="shadow-elegant hover:shadow-glow transition-smooth">
              <CardHeader className="bg-gradient-primary text-primary-foreground">
                <CardTitle className="text-2xl">
                  Talent Show Brings Creativity and Community to the Stage
                </CardTitle>
                <div className="flex items-center space-x-4 text-primary-foreground/80">
                  <div className="flex items-center space-x-1">
                    <Calendar size={16} />
                    <span>December 2024</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User size={16} />
                    <span>MECE Team</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="prose prose-lg max-w-none space-y-6">
                  <p>
                    In an inspiring display of creativity and performance, a recent talent 
                    show organized by MECE Consolidated Limited brought together people of 
                    all ages to celebrate local talent and artistic expression.
                  </p>

                  <p>
                    Open to a wide range of participants, the event featured singing, dancing, 
                    spoken word, comedy, and other performances — each act adding a unique voice 
                    to the evening's celebration. From emotional vocals to high-energy routines, 
                    the stage became a platform for self-expression, courage, and joy.
                  </p>

                  <p>
                    Audience members responded with enthusiasm, cheering on every performer and 
                    creating a warm, encouraging atmosphere. While a panel of judges recognized 
                    standout acts, the event's true focus was on participation, support, and 
                    community spirit.
                  </p>

                  <blockquote className="border-l-4 border-primary pl-4 italic text-primary bg-primary/5 p-4 rounded-r-lg">
                    "It's not just about competition. It's about building confidence, creating opportunity, 
                    and bringing people together."
                    <footer className="text-sm text-muted-foreground mt-2">
                      — MECE Consolidated Limited Representative
                    </footer>
                  </blockquote>

                  <p>
                    The show concluded with promises of future editions, with MECE Consolidated Limited 
                    reaffirming its commitment to empowering individuals and promoting creativity 
                    across communities.
                  </p>

                  <p>
                    For many, the event was more than entertainment — it was a reminder of the talent 
                    that exists all around us, just waiting to be seen and heard.
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t">
                  <Button variant="outline" className="mr-4">
                    Share Article
                  </Button>
                  <Button>
                    Read More Stories
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="mt-12 text-center">
              <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
              <p className="text-muted-foreground mb-6">
                Subscribe to our newsletter for the latest stories and opportunities
              </p>
              <Button size="lg" className="bg-gradient-primary">
                Subscribe Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Blog;