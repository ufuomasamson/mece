import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  CheckCircle, 
  XCircle,
  MoreHorizontal
} from "lucide-react";

const ParticipateSubmissions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Mock data - in real app, this would come from API
  const submissions = [
    {
      id: "001",
      name: "John Doe",
      email: "john.doe@email.com",
      phone: "+234 803 123 4567",
      competition: "SPORTS",
      message: "I'm interested in participating in the sports competition. I have experience in football and basketball.",
      status: "pending",
      submittedAt: "2024-01-15T10:30:00Z",
      read: false
    },
    {
      id: "002",
      name: "Jane Smith",
      email: "jane.smith@email.com",
      phone: "+234 803 234 5678",
      competition: "MUSIC/DANCE",
      message: "I'm a singer and would love to participate in the music competition. I can sing various genres.",
      status: "approved",
      submittedAt: "2024-01-14T15:45:00Z",
      read: true
    },
    {
      id: "003",
      name: "Mike Johnson",
      email: "mike.johnson@email.com",
      phone: "+234 803 345 6789",
      competition: "TECHNOLOGY",
      message: "I'm a software developer and want to showcase my skills in the technology competition.",
      status: "rejected",
      submittedAt: "2024-01-13T09:15:00Z",
      read: true
    },
    {
      id: "004",
      name: "Sarah Wilson",
      email: "sarah.wilson@email.com",
      phone: "+234 803 456 7890",
      competition: "ARTS AND CRAFTS",
      message: "I create handmade jewelry and would like to participate in the arts and crafts competition.",
      status: "pending",
      submittedAt: "2024-01-12T14:20:00Z",
      read: false
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "approved":
        return <Badge variant="default" className="bg-green-100 text-green-800">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive" className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = submission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.competition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || submission.status === statusFilter;
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
          <h1 className="text-3xl font-bold text-gray-900">Participate Submissions</h1>
          <p className="text-gray-600 mt-2">Manage and review all competition participation submissions.</p>
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
                placeholder="Search by name, email, or competition..."
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
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Submissions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Submissions ({filteredSubmissions.length})</span>
            <div className="text-sm text-gray-500">
              {filteredSubmissions.filter(s => !s.read).length} unread
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Competition</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Submitted</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.map((submission) => (
                  <tr key={submission.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 ${
                    !submission.read ? 'bg-blue-50' : ''
                  }`}>
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium text-gray-900">{submission.name}</div>
                        <div className="text-sm text-gray-500">{submission.email}</div>
                        <div className="text-sm text-gray-500">{submission.phone}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        {submission.competition}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      {getStatusBadge(submission.status)}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500">
                      {formatDate(submission.submittedAt)}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye size={16} className="mr-1" />
                          View
                        </Button>
                        {submission.status === "pending" && (
                          <>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              <CheckCircle size={16} className="mr-1" />
                              Approve
                            </Button>
                            <Button size="sm" variant="destructive">
                              <XCircle size={16} className="mr-1" />
                              Reject
                            </Button>
                          </>
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

export default ParticipateSubmissions;
