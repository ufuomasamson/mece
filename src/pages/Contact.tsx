import React from "react";
import ContactForm from "@/components/ContactForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { useContent } from "@/contexts/ContentContext";

const Contact = () => {
  const { content } = useContent();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions about our competitions or want to learn more? 
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div>
            <ContactForm />
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="shadow-elegant transform-gpu hover:scale-105 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <p className="text-gray-600">{content.footer.contact?.email || "contact@mece.org.ng"}</p>
                    <p className="text-sm text-gray-500">We'll respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Phone className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Phone</h3>
                    <p className="text-gray-600">{content.footer.contact?.phone || "+234 8032160583"}</p>
                    <p className="text-sm text-gray-500">Available Monday - Friday, 9AM - 5PM</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Address</h3>
                    <p className="text-gray-600">{content.footer.contact?.address || "NO. 35, AJOSE ADEOGUN STREET, UTAKO, ABUJA, FCT, NIGERIA"}</p>
                    <p className="text-sm text-gray-500">Main office location</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Business Hours</h3>
                    <p className="text-gray-600">Monday - Friday: 9:00 AM - 5:00 PM</p>
                    <p className="text-gray-600">Saturday: 10:00 AM - 2:00 PM</p>
                    <p className="text-sm text-gray-500">Closed on Sundays and Public Holidays</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FAQ Section */}
            <Card className="shadow-elegant transform-gpu hover:scale-105 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">
                  Frequently Asked Questions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-b border-gray-200 pb-3">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    How do I register for competitions?
                  </h4>
                  <p className="text-gray-600 text-sm">
                    You can register for competitions through our Registration page. 
                    Simply fill out the form with your details and areas of interest.
                  </p>
                </div>
                
                <div className="border-b border-gray-200 pb-3">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    What are the age requirements?
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Age requirements vary by competition. Please check the specific 
                    competition details for eligibility criteria.
                  </p>
                </div>
                
                <div className="border-b border-gray-200 pb-3">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    How can I become a sponsor?
                  </h4>
                  <p className="text-gray-600 text-sm">
                    For sponsorship opportunities, please contact us directly 
                    and we'll discuss partnership options.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    When are the next competitions?
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Competition schedules are updated regularly. Check our 
                    website or contact us for the latest information.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
