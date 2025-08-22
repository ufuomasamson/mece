import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Mail,
  Reply,
  Archive,
  MoreHorizontal
} from "lucide-react";

const ContactSubmissions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Mock data - in real app, this would come from API
  const contacts = [
    {
      id: "001",
      name: "Alice Johnson",
      email: "alice.johnson@email.com",
      phone: "+234 803 111 2222",
      subject: "General Inquiry",
      message: "I would like to know more about your services and how I can get involved with your organization.",
      status: "unread",
      submittedAt: "2024-01-15T11:20:00Z",
      priority: "medium"
    },
    {
      id: "002",
      name: "Bob Wilson",
      email: "bob.wilson@email.com",
      phone: "+234 803 222 3333",
      subject: "Partnership Opportunity",
      message: "I represent a local business and would like to discuss potential partnership opportunities with MECE.",
      status: "read",
      submittedAt: "2024-01-14T16:30:00Z",
      priority: "high"
    },
    {
      id: "003",
      name: "Carol Davis",
      email: "carol.davis@email.com",
      phone: "+234 803 333 4444",
      subject: "Volunteer Interest",
      message: "I'm interested in volunteering for your events and would like to know what opportunities are available.",
      status: "replied",
      submittedAt: "2024-01-13T10:15:00Z",
      priority: "medium"
    },
    {
      id: "004",
      name: "David Brown",
      email: "david.brown@email.com",
      phone: "+234 803 444 5555",
      subject: "Event Information",
      message: "I saw your upcoming event announcement and would like more details about registration and participation.",
      status: "archived",
      submittedAt: "2024-01-12T13:45:00Z",
      priority: "low"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "unread":
        return <Badge variant="default" className="bg-blue-100 text-blue-800">Unread</Badge>;
      case "read":
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Read</Badge>;
      case "replied":
        return <Badge variant="default" className="bg-green-100 text-green-800">Replied</Badge>;
      case "archived":
        return <Badge variant="outline" className="bg-gray-50 text-gray-600">Archived</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive" className="bg-red-100 text-red-800">High</Badge>;
      case "medium":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case "low":
        return <Badge variant="outline" className="bg-gray-100 text-gray-600">Low</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || contact.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contact Submissions</h1>
          <p className="text-gray-600 mt-2">Manage and respond to all contact form submissions.</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download size={20} className="mr-2" />
            Export Data
          </Button>
          <Button>
            <Filter size={20} className="mr-2" />
            Advanced Filter
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, email, or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Contacts Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Contact Messages ({filteredContacts.length})</span>
            <div className="text-sm text-gray-500">
              {filteredContacts.filter(c => c.status === "unread").length} unread
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Contact Info</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Subject</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Priority</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Submitted</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.map((contact) => (
                  <tr key={contact.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 ${
                    contact.status === "unread" ? 'bg-blue-50' : ''
                  }`}>
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium text-gray-900">{contact.name}</div>
                        <div className="text-sm text-gray-500">{contact.email}</div>
                        <div className="text-sm text-gray-500">{contact.phone}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="max-w-xs">
                        <div className="font-medium text-gray-900">{contact.subject}</div>
                        <div className="text-sm text-gray-500 truncate">{contact.message}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {getPriorityBadge(contact.priority)}
                    </td>
                    <td className="py-4 px-4">
                      {getStatusBadge(contact.status)}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500">
                      {formatDate(contact.submittedAt)}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye size={16} className="mr-1" />
                          View
                        </Button>
                        {contact.status !== "replied" && (
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            <Reply size={16} className="mr-1" />
                            Reply
                          </Button>
                        )}
                        {contact.status !== "archived" && (
                          <Button size="sm" variant="secondary">
                            <Archive size={16} className="mr-1" />
                            Archive
                          </Button>
                        )}
                        <Button size="sm" variant="ghost">
                          <MoreHorizontal size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactSubmissions;
