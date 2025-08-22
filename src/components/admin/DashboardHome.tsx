import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useContent } from "@/contexts/ContentContext";
import { 
  Users, 
  MessageSquare, 
  FileText, 
  TrendingUp, 
  Calendar,
  Eye,
  Plus
} from "lucide-react";

const DashboardHome = () => {
  const { content } = useContent();

  // Real data from content context
  const stats = [
    {
      title: "Total Competitions",
      value: content.competitions.items.length.toString(),
      change: "+0",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Blog Posts",
      value: content.blog.posts.length.toString(),
      change: content.blog.posts.filter(p => p.status === 'published').length > 0 ? `+${content.blog.posts.filter(p => p.status === 'published').length}` : "+0",
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Services Offered",
      value: content.services.items.length.toString(),
      change: "+0",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Content Sections",
      value: Object.keys(content).length.toString(),
      change: "+0",
      icon: Eye,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  const recentActivities = [
    {
      type: "Content Updated",
      user: "Admin",
      time: "Just now",
      status: "completed"
    },
    {
      type: "Blog Post Created",
      user: "Admin",
      time: "1 hour ago",
      status: "completed"
    },
    {
      type: "Competition Added",
      user: "Admin",
      time: "2 hours ago",
      status: "completed"
    },
    {
      type: "Services Modified",
      user: "Admin",
      time: "1 day ago",
      status: "completed"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your website.</p>
        </div>
        <div className="flex space-x-3">
          <Button className="bg-primary hover:bg-primary/90">
            <Plus size={20} className="mr-2" />
            New Blog Post
          </Button>
          <Button variant="outline">
            <Calendar size={20} className="mr-2" />
            View Calendar
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp size={20} />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'pending' ? 'bg-yellow-400' : 
                    activity.status === 'completed' ? 'bg-green-400' : 'bg-blue-400'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.type}</p>
                    <p className="text-xs text-gray-500">{activity.user} • {activity.time}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <FileText size={20} className="mr-3" />
                Create New Blog Post
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Users size={20} className="mr-3" />
                Manage Competitions
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <MessageSquare size={20} className="mr-3" />
                Edit Website Content
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <TrendingUp size={20} className="mr-3" />
                View Analytics
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Content Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Hero Section</h3>
              <p className="text-sm text-blue-600">Title: {content.hero.title}</p>
              <p className="text-sm text-blue-600">Background: {content.hero.backgroundImage}</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <h3 className="text-lg font-semibold text-green-900 mb-2">Mission</h3>
              <p className="text-sm text-green-600">{content.mission.title}</p>
              <p className="text-xs text-green-600 mt-1 line-clamp-2">{content.mission.description}</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-900 mb-2">Services</h3>
              <p className="text-sm text-purple-600">{content.services.title}</p>
              <p className="text-xs text-purple-600 mt-1">{content.services.items.length} service categories</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardHome;
