import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/Layout";

const About = () => {
  return (
    <Layout>
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
              About Us
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Welcome to Mece Consolidated Limited
            </p>
          </div>

          <Card className="shadow-elegant">
            <CardContent className="p-8 md:p-12">
              <h2 className="text-3xl font-bold mb-6 text-primary">
                Empowering Innovation, Talent, and Sustainable Growth
              </h2>
              
              <div className="space-y-6 text-lg leading-relaxed">
                <p>
                  At Mece Consolidated Limited, we are committed to discovering, developing, and promoting 
                  diverse talents and creative potential across all sectors. From sports—including football, 
                  volleyball, athletics, and racing—to arts such as music, modeling, and cultural promotion, 
                  we create opportunities for individuals to showcase and grow their abilities.
                </p>
                
                <p>
                  We go beyond talent to support innovation and enterprise. Whether it's engineering machines, 
                  producing chemicals, designing fabrics, crafting beverages, or empowering agriculture—we 
                  provide the platform and resources for ideas to become impactful solutions.
                </p>
                
                <div className="grid md:grid-cols-2 gap-8 mt-12">
                  <div className="bg-gradient-primary p-6 rounded-lg text-primary-foreground">
                    <h3 className="text-2xl font-bold mb-4">Our Approach</h3>
                    <p>
                      We believe that every individual has unique talents and potential waiting to be unlocked. 
                      Our comprehensive approach combines mentorship, resources, and platforms to help people 
                      transform their passions into profitable ventures.
                    </p>
                  </div>
                  
                  <div className="bg-gradient-secondary p-6 rounded-lg text-primary-foreground">
                    <h3 className="text-2xl font-bold mb-4">Our Impact</h3>
                    <p>
                      Through our diverse programs and services, we've helped countless individuals across 
                      various sectors achieve their dreams, from athletes securing professional contracts 
                      to entrepreneurs launching successful businesses.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default About;