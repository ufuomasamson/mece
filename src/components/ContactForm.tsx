import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Submit to backend API
      const response = await fetch('http://localhost:5001/api/submissions/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Contact submission successful:', result);
        
        toast({
          title: "Message Sent Successfully!",
          description: "Thank you for contacting us. We'll get back to you soon.",
        });
        
        // Reset form
        setFormData({
          name: "",
          email: "",
          message: "",
        });
      } else {
        const errorData = await response.json();
        console.error('Contact submission failed:', errorData);
        
        toast({
          title: "Submission Failed",
          description: errorData.error || "Failed to send message. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Contact submission error:', error);
      
      toast({
        title: "Network Error",
        description: "Failed to send message. Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="shadow-elegant transform-gpu hover:scale-105 hover:shadow-glow transition-all duration-500 perspective-1000">
      <CardHeader className="transform-gpu hover:scale-105 transition-transform duration-300">
        <CardTitle className="transform-gpu hover:scale-110 transition-transform duration-300">Contact Us</CardTitle>
        <p className="text-muted-foreground transform-gpu hover:scale-105 transition-transform duration-300">
          You can contact us by filling out this form.
        </p>
      </CardHeader>
      <CardContent className="transform-gpu hover:scale-105 transition-transform duration-300">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="transform-gpu hover:scale-105 transition-transform duration-300">
            <Label htmlFor="contact-name" className="transform-gpu hover:scale-105 transition-transform duration-300">Name *</Label>
            <Input
              id="contact-name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 transform-gpu hover:scale-105 hover:shadow-lg transition-all duration-300 focus:scale-105"
            />
          </div>

          <div className="transform-gpu hover:scale-105 transition-transform duration-300">
            <Label htmlFor="contact-email" className="transform-gpu hover:scale-105 transition-transform duration-300">E-mail *</Label>
            <Input
              id="contact-email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 transform-gpu hover:scale-105 hover:shadow-lg transition-all duration-300 focus:scale-105"
            />
          </div>

          <div className="transform-gpu hover:scale-105 transition-transform duration-300">
            <Label htmlFor="contact-message" className="transform-gpu hover:scale-105 transition-transform duration-300">Message *</Label>
            <Textarea
              id="contact-message"
              name="message"
              required
              value={formData.message}
              onChange={handleInputChange}
              className="mt-1 transform-gpu hover:scale-105 hover:shadow-lg transition-all duration-300 focus:scale-105"
              rows={5}
              placeholder="Tell us how we can help you..."
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-primary transform-gpu hover:scale-110 hover:shadow-2xl transition-all duration-300"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Submit"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContactForm;