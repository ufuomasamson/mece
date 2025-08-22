import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ContentProvider } from "@/contexts/ContentContext";
import { AuthProvider } from "@/contexts/AuthContext";
// import TestScene3D from "@/components/3d/TestScene3D"; // Removed
import Index from "./pages/Index";
import About from "./pages/About";
import Mission from "./pages/Mission";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Login from "@/components/auth/Login";
import AdminSetup from "@/components/auth/AdminSetup";
import PromoteToAdmin from "@/components/auth/PromoteToAdmin";
import Participate from "./pages/Participate";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ContentProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
                                <Route path="/about" element={<About />} />
                  <Route path="/mission" element={<Mission />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/admin-setup" element={<AdminSetup />} />
                  <Route path="/promote-admin" element={<PromoteToAdmin />} />
                  <Route path="/participate" element={<ProtectedRoute><Participate /></ProtectedRoute>} />
                  <Route path="/admin" element={<ProtectedRoute requireAdmin><Admin /></ProtectedRoute>} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ContentProvider>
  </QueryClientProvider>
);

export default App;
