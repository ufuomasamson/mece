import { useState } from "react";
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  MessageSquare, 
  Settings, 
  Image, 
  PenTool,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Admin Dashboard Components
import DashboardHome from "@/components/admin/DashboardHome";
import ContentManagement from "@/components/admin/ContentManagement";
import BlogManagement from "@/components/admin/BlogManagement";
import SubmissionsManagement from "@/components/admin/SubmissionsManagement";
import PaystackIntegration from "@/components/admin/PaystackIntegration";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "content", label: "Content Management", icon: PenTool },
    { id: "blog", label: "Blog Management", icon: FileText },
    { id: "submissions", label: "Submissions", icon: Users },
    { id: "paystack", label: "Paystack Integration", icon: CreditCard },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardHome />;
      case "content":
        return <ContentManagement />;
      case "blog":
        return <BlogManagement />;
      case "submissions":
        return <SubmissionsManagement />;
      case "paystack":
        return <PaystackIntegration />;
      case "settings":
        return <div className="p-6"><h2 className="text-2xl font-bold">Settings</h2><p>Settings page coming soon...</p></div>;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b p-4 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
        <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out lg:transition-none`}>
          <div className="flex flex-col h-full">
            {/* Logo Section */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <img 
                  src="/images/mece-logo.png" 
                  alt="MECE Logo" 
                  className="h-10 w-auto"
                />
                <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 p-4 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                      activeTab === item.id
                        ? 'bg-primary text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Logout Section */}
            <div className="p-4 border-t border-gray-200">
              <Button
                variant="outline"
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut size={20} className="mr-3" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          <div className="p-6">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Admin;
