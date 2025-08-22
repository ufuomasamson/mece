import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useContent } from "@/contexts/ContentContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { 
  Eye, 
  Trash2, 
  CheckCircle, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  MessageSquare,
  Calendar,
  MapPin,
  Award,
  Users,
  Target,
  FileText,
  Building,
  CreditCard
} from "lucide-react";

interface ParticipateSubmission {
  id: string;
  fullName: string;
  emailAddress: string;
  phoneNumber: string;
  whatsappNumber: string;
  telegramNumber?: string;
  bankName: string;
  accountNumber: string;
  stateOfOrigin: string;
  lgaOfOrigin: string;
  stateOfResidence: string;
  lgaOfResidence: string;
  registrationType: string;
  areasOfInterest: string[];
  otherArea?: string;
  passportPhoto?: string; // Changed from File | string to just string (data URL)
  submittedAt: string;
  status: 'pending' | 'reviewed' | 'approved' | 'rejected';
  notes?: string;
}

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  submittedAt: string;
  status: 'unread' | 'read' | 'replied';
  adminResponse?: string;
}

const SubmissionsManagement = () => {
  const { content, updateContent } = useContent();
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState("participate");
  const [selectedSubmission, setSelectedSubmission] = useState<ParticipateSubmission | ContactSubmission | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [adminResponse, setAdminResponse] = useState("");

  // Get submissions from API
  const [participateSubmissions, setParticipateSubmissions] = useState<ParticipateSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch submissions from API
  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!token) return;
      
      try {
        console.log('Fetching submissions with token:', token);
        const response = await fetch('http://localhost:5001/api/submissions/participate', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        console.log('Submissions response:', response.status, response.ok);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Submissions data:', data);
          
          // Transform the data to match the frontend interface
          const transformedData = data.map((submission: any) => {
            try {
              return {
                ...submission,
                // Parse areasOfInterest from JSON string to array with error handling
                areasOfInterest: submission.areas_of_interest ? 
                  (() => {
                    try {
                      return JSON.parse(submission.areas_of_interest);
                    } catch (e) {
                      console.warn('Failed to parse areas_of_interest:', submission.areas_of_interest);
                      return [];
                    }
                  })() : [],
                // Map database field names to frontend names
                fullName: submission.full_name || 'N/A',
                emailAddress: submission.email_address || 'N/A',
                phoneNumber: submission.phone_number || 'N/A',
                whatsappNumber: submission.whatsapp_number || 'N/A',
                telegramNumber: submission.telegram_number || '',
                bankName: submission.bank_name || 'N/A',
                accountNumber: submission.account_number || 'N/A',
                stateOfOrigin: submission.state_of_origin || 'N/A',
                lgaOfOrigin: submission.lga_of_origin || 'N/A',
                stateOfResidence: submission.state_of_residence || 'N/A',
                lgaOfResidence: submission.lga_of_residence || 'N/A',
                registrationType: submission.registration_type || 'N/A',
                otherArea: submission.other_area || '',
                passportPhoto: submission.passport_photo || '',
                submittedAt: submission.submitted_at || new Date().toISOString(),
                status: submission.status || 'pending',
                notes: submission.admin_notes || ''
              };
            } catch (error) {
              console.error('Error transforming submission:', error, submission);
              return null;
            }
          }).filter(Boolean); // Remove any null entries
          
          console.log('Transformed submissions data:', transformedData);
          setParticipateSubmissions(transformedData);
        } else {
          const errorData = await response.json();
          console.error('Submissions fetch error:', errorData);
        }
      } catch (error) {
        console.error('Error fetching submissions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmissions();
  }, [token]);

  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([]);

  // Fetch contact submissions from API
  useEffect(() => {
    const fetchContactSubmissions = async () => {
      if (!token) return;
      
      try {
        console.log('Fetching contact submissions with token:', token);
        const response = await fetch('http://localhost:5001/api/submissions/contact', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        console.log('Contact submissions response:', response.status, response.ok);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Contact submissions data:', data);
          setContactSubmissions(data);
        } else {
          const errorData = await response.json();
          console.error('Contact submissions fetch error:', errorData);
        }
      } catch (error) {
        console.error('Error fetching contact submissions:', error);
      }
    };

    fetchContactSubmissions();
  }, [token]);

  // Note: Submissions are now fetched from API, not stored in localStorage

  const updateParticipateSubmission = (id: string, updates: Partial<ParticipateSubmission>) => {
    setParticipateSubmissions(prev => 
      prev.map(sub => sub.id === id ? { ...sub, ...updates } : sub)
    );
  };

  const updateContactSubmission = (id: string, updates: Partial<ContactSubmission>) => {
    setContactSubmissions(prev => 
      prev.map(sub => sub.id === id ? { ...sub, ...updates } : sub)
    );
  };

  const deleteParticipateSubmission = (id: string) => {
    if (confirm("Are you sure you want to delete this submission?")) {
      setParticipateSubmissions(prev => prev.filter(sub => sub.id !== id));
      toast.success("Submission deleted successfully");
    }
  };

  const deleteContactSubmission = (id: string) => {
    if (confirm("Are you sure you want to delete this message?")) {
      setContactSubmissions(prev => prev.filter(sub => sub.id !== id));
      toast.success("Message deleted successfully");
    }
  };

  const addAdminNotes = (submissionId: string) => {
    if (adminNotes.trim()) {
      updateParticipateSubmission(submissionId, { 
        notes: adminNotes,
        status: 'reviewed' as const
      });
      setAdminNotes("");
      toast.success("Notes added successfully");
    }
  };

  const addAdminResponse = (submissionId: string) => {
    if (adminResponse.trim()) {
      updateContactSubmission(submissionId, { 
        adminResponse: adminResponse,
        status: 'replied' as const
      });
      setAdminResponse("");
      toast.success("Response sent successfully");
    }
  };

  const getStatusBadge = (status: string, type: 'participate' | 'contact') => {
    if (type === 'participate') {
      switch (status) {
        case "pending":
          return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
        case "reviewed":
          return <Badge variant="outline" className="bg-blue-100 text-blue-800">Reviewed</Badge>;
        case "approved":
          return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
        case "rejected":
          return <Badge variant="destructive" className="bg-red-100 text-red-800">Rejected</Badge>;
        default:
          return <Badge variant="outline">Unknown</Badge>;
      }
    } else {
      switch (status) {
        case "unread":
          return <Badge variant="secondary" className="bg-red-100 text-red-800">Unread</Badge>;
        case "read":
          return <Badge variant="outline" className="bg-blue-100 text-blue-800">Read</Badge>;
        case "replied":
          return <Badge className="bg-green-100 text-green-800">Replied</Badge>;
        default:
          return <Badge variant="outline">Unknown</Badge>;
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Submissions Management</h1>
        <p className="text-gray-600 mt-2">Manage participate form submissions and contact messages</p>
        
        {/* Debug Info */}
        <div className="mt-4 p-3 bg-gray-100 rounded-lg text-sm">
          <p><strong>Debug Info:</strong></p>
          <p>Token present: {token ? 'Yes' : 'No'}</p>
          <p>Token length: {token ? token.length : 0}</p>
          <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
          <p>Submissions count: {participateSubmissions.length}</p>
          <p>Last fetch: {new Date().toLocaleTimeString()}</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="participate">
            Registration Submissions ({participateSubmissions.length})
          </TabsTrigger>
          <TabsTrigger value="contact">
            Contact Messages ({contactSubmissions.length})
          </TabsTrigger>
        </TabsList>

        {/* Registration Submissions */}
        <TabsContent value="participate" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award size={20} />
                <span>Registration Form Submissions</span>
              </CardTitle>
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline" 
                size="sm"
                className="mt-2"
              >
                Refresh Data
              </Button>
            </CardHeader>
            <CardContent>
                                        <div className="space-y-4">
                            {isLoading ? (
                              <div className="text-center py-8 text-gray-500">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                                <p>Loading submissions...</p>
                              </div>
                            ) : participateSubmissions.length === 0 ? (
                              <div className="text-center py-8 text-gray-500">
                                <Users size={48} className="mx-auto mb-4 text-gray-300" />
                                <p>No registration submissions yet.</p>
                              </div>
                            ) : (
                  participateSubmissions.map((submission) => (
                    <div key={submission.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                                                                <div className="flex items-center space-x-3 mb-2">
                                        <h3 className="text-lg font-semibold text-gray-900">{submission.fullName}</h3>
                                        {getStatusBadge(submission.status, 'participate')}
                                      </div>

                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                        <div className="space-y-1">
                                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                                            <Mail size={16} />
                                            <span>{submission.emailAddress}</span>
                                          </div>
                                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                                            <Phone size={16} />
                                            <span>{submission.phoneNumber}</span>
                                          </div>
                                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                                            <Users size={16} />
                                            <span>{submission.whatsappNumber}</span>
                                          </div>
                                        </div>
                                        <div className="space-y-1">
                                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                                            <Building size={16} />
                                            <span>{submission.bankName} - {submission.accountNumber}</span>
                                          </div>
                                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                                            <MapPin size={16} />
                                            <span>{submission.stateOfOrigin}, {submission.lgaOfOrigin}</span>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="bg-gray-50 p-3 rounded-md mb-3">
                                        <p className="text-sm text-gray-700 mb-2">
                                          <strong>Registration Type:</strong> {submission.registrationType}
                                        </p>
                                                                                 <p className="text-sm text-gray-700 mb-2">
                                           <strong>Areas of Interest:</strong> {Array.isArray(submission.areasOfInterest) ? submission.areasOfInterest.join(', ') : 'Not specified'}
                                           {submission.otherArea && `, ${submission.otherArea}`}
                                         </p>
                                        <p className="text-sm text-gray-700">
                                          <strong>Residence:</strong> {submission.stateOfResidence}, {submission.lgaOfResidence}
                                        </p>
                                      </div>

                                                                {/* Passport Image Display */}
                                      {submission.passportPhoto && (
                                        <div className="mb-3">
                                          <p className="text-sm font-medium text-gray-700 mb-2">Passport Photo:</p>
                                          <img
                                            src={submission.passportPhoto}
                                            alt="Passport Photo"
                                            className="w-20 h-20 object-cover rounded-lg border border-gray-300"
                                          />
                                        </div>
                                      )}

                          {submission.notes && (
                            <div className="bg-blue-50 p-3 rounded-md mb-3">
                              <p className="text-sm text-blue-700">
                                <span className="font-medium">Admin Notes:</span> {submission.notes}
                              </p>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex space-x-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedSubmission(submission)}
                          >
                            <Eye size={16} />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newStatus = submission.status === 'pending' ? 'reviewed' : 
                                               submission.status === 'reviewed' ? 'approved' : 'pending';
                              updateParticipateSubmission(submission.id, { status: newStatus });
                              toast.success(`Status updated to ${newStatus}`);
                            }}
                          >
                            <CheckCircle size={16} />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteParticipateSubmission(submission.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>

                      {/* Admin Notes Input */}
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            placeholder="Add admin notes..."
                            value={adminNotes}
                            onChange={(e) => setAdminNotes(e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                          />
                          <Button
                            size="sm"
                            onClick={() => addAdminNotes(submission.id)}
                            disabled={!adminNotes.trim()}
                          >
                            Add Notes
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Messages */}
        <TabsContent value="contact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare size={20} />
                <span>Contact Form Messages</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contactSubmissions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare size={48} className="mx-auto mb-4 text-gray-300" />
                    <p>No contact messages yet.</p>
                  </div>
                ) : (
                  contactSubmissions.map((message) => (
                    <div key={message.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{message.name}</h3>
                            {getStatusBadge(message.status, 'contact')}
                          </div>
                          
                          <div className="mb-3">
                            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                              <Mail size={16} />
                              <span>{message.email}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Calendar size={16} />
                              <span>{formatDate(message.submittedAt)}</span>
                            </div>
                          </div>
                          
                          <div className="bg-gray-50 p-3 rounded-md mb-3">
                            <p className="text-sm text-gray-700">{message.message}</p>
                          </div>

                          {message.adminResponse && (
                            <div className="bg-green-50 p-3 rounded-md mb-3">
                              <p className="text-sm text-green-700">
                                <span className="font-medium">Admin Response:</span> {message.adminResponse}
                              </p>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex space-x-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedSubmission(message)}
                          >
                            <Eye size={16} />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newStatus = message.status === 'unread' ? 'read' : 
                                               message.status === 'read' ? 'replied' : 'read';
                              updateContactSubmission(message.id, { status: newStatus });
                              toast.success(`Status updated to ${newStatus}`);
                            }}
                          >
                            <CheckCircle size={16} />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteContactSubmission(message.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>

                      {/* Admin Response Input */}
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            placeholder="Add admin response..."
                            value={adminResponse}
                            onChange={(e) => setAdminResponse(e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                          />
                          <Button
                            size="sm"
                            onClick={() => addAdminResponse(message.id)}
                            disabled={!adminResponse.trim()}
                          >
                            Send Response
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Submission Detail Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Submission Details</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedSubmission(null)}
                >
                  ×
                </Button>
              </div>
              
              <div className="space-y-4">
                                            {('fullName' in selectedSubmission) ? (
                  // Participate submission
                                                  <div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <span className="font-medium">Full Name:</span> {selectedSubmission.fullName}
                                    </div>
                                    <div>
                                      <span className="font-medium">Email:</span> {selectedSubmission.emailAddress}
                                    </div>
                                    <div>
                                      <span className="font-medium">Phone:</span> {selectedSubmission.phoneNumber}
                                    </div>
                                    <div>
                                      <span className="font-medium">WhatsApp:</span> {selectedSubmission.whatsappNumber}
                                    </div>
                                  </div>

                                  <div className="mt-4 space-y-3">
                                    <div>
                                      <span className="font-medium">Bank Details:</span>
                                      <div className="mt-1 p-2 bg-gray-50 rounded text-gray-700">
                                        <p><strong>Bank:</strong> {selectedSubmission.bankName}</p>
                                        <p><strong>Account Number:</strong> {selectedSubmission.accountNumber}</p>
                                      </div>
                                    </div>

                                    <div>
                                      <span className="font-medium">Origin:</span>
                                      <p className="mt-1 text-gray-700">{selectedSubmission.stateOfOrigin}, {selectedSubmission.lgaOfOrigin}</p>
                                    </div>

                                    <div>
                                      <span className="font-medium">Residence:</span>
                                      <p className="mt-1 text-gray-700">{selectedSubmission.stateOfResidence}, {selectedSubmission.lgaOfResidence}</p>
                                    </div>

                                    <div>
                                      <span className="font-medium">Registration Type:</span>
                                      <p className="mt-1 text-gray-700">{selectedSubmission.registrationType}</p>
                                    </div>

                                                                         <div>
                                       <span className="font-medium">Areas of Interest:</span>
                                       <p className="mt-1 text-gray-700">
                                         {Array.isArray(selectedSubmission.areasOfInterest) ? selectedSubmission.areasOfInterest.join(', ') : 'Not specified'}
                                         {selectedSubmission.otherArea && `, ${selectedSubmission.otherArea}`}
                                       </p>
                                     </div>

                                    {selectedSubmission.passportPhoto && (
                                      <div>
                                        <span className="font-medium">Passport Photo:</span>
                                        <div className="mt-2">
                                          <img
                                            src={selectedSubmission.passportPhoto}
                                            alt="Passport Photo"
                                            className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                                          />
                                        </div>
                                      </div>
                                    )}
                      
                      {selectedSubmission.notes && (
                        <div>
                          <span className="font-medium">Admin Notes:</span>
                          <p className="mt-1 text-gray-700">{selectedSubmission.notes}</p>
                        </div>
                      )}
                      
                      <div>
                        <span className="font-medium">Submitted:</span>
                        <p className="mt-1 text-gray-700">{formatDate(selectedSubmission.submittedAt)}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Contact submission
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Name:</span> {selectedSubmission.name}
                      </div>
                      <div>
                        <span className="font-medium">Email:</span> {selectedSubmission.email}
                      </div>
                      <div>
                        <span className="font-medium">Status:</span> {selectedSubmission.status}
                      </div>
                      <div>
                        <span className="font-medium">Date:</span> {formatDate(selectedSubmission.submittedAt)}
                      </div>
                    </div>
                    
                    <div className="mt-4 space-y-3">
                      <div>
                        <span className="font-medium">Message:</span>
                        <p className="mt-1 text-gray-700">{selectedSubmission.message}</p>
                      </div>
                      
                      {selectedSubmission.adminResponse && (
                        <div>
                          <span className="font-medium">Admin Response:</span>
                          <p className="mt-1 text-gray-700">{selectedSubmission.adminResponse}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionsManagement;

