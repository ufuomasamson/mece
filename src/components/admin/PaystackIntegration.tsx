import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, CreditCard, Settings, Save, Eye, EyeOff } from "lucide-react";
import { API_ENDPOINTS } from "@/config/api";
import { useAuth } from "@/contexts/AuthContext";

const PaystackIntegration = () => {
  const { token } = useAuth();
  const [isConfigured, setIsConfigured] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [publicKey, setPublicKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  // Load existing configuration on component mount
  useEffect(() => {
    loadPaystackConfig();
  }, [token]);

  const loadPaystackConfig = async () => {
    if (!token) return;
    
    try {
      const response = await fetch(API_ENDPOINTS.ADMIN.PAYSTACK_SETTINGS, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Loaded Paystack config data:', data);
        
        if (data.settings && data.settings.public_key && data.settings.secret_key) {
          setPublicKey(data.settings.public_key);
          setSecretKey(data.settings.secret_key);
          setIsConfigured(true);
          console.log('Paystack config loaded successfully');
        } else {
          console.log('No valid Paystack config found:', data);
          setIsConfigured(false);
        }
      } else {
        console.error('Failed to load Paystack config:', response.status);
      }
    } catch (error) {
      console.error("Error loading Paystack config:", error);
    }
  };

  const handleSaveConfig = async () => {
    if (!publicKey.trim() || !secretKey.trim()) {
      setMessage({ type: "error", text: "Both Public Key and Secret Key are required" });
      return;
    }

    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch(API_ENDPOINTS.ADMIN.PAYSTACK_SETTINGS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          public_key: publicKey.trim(),
          secret_key: secretKey.trim(),
          is_active: true
        }),
      });

      if (response.ok) {
        setMessage({ type: "success", text: "Paystack configuration saved successfully!" });
        setIsConfigured(true);
        // Mask the secret key for display
        setSecretKey(secretKey.substring(0, 8) + "..." + secretKey.substring(secretKey.length - 4));
      } else {
        const errorData = await response.json();
        setMessage({ type: "error", text: errorData.message || "Failed to save configuration" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestConnection = async () => {
    if (!isConfigured) {
      setMessage({ type: "error", text: "Please configure Paystack first" });
      return;
    }

    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch(API_ENDPOINTS.PAYMENTS.CONFIG, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        setMessage({ type: "success", text: "Connection test successful! Paystack is working correctly." });
      } else {
        setMessage({ type: "error", text: "Connection test failed. Please check your API keys." });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Connection test failed. Please check your API keys." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetConfig = () => {
    setPublicKey("");
    setSecretKey("");
    setIsConfigured(false);
    setMessage({ type: "", text: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <CreditCard className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Paystack Payment Integration</h2>
      </div>

      {/* Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            Integration Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-3">
            {isConfigured ? (
              <>
                <CheckCircle className="h-6 w-6 text-green-600" />
                <span className="text-green-600 font-medium">Paystack is configured and ready</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-6 w-6 text-yellow-600" />
                <span className="text-yellow-600 font-medium">Paystack is not configured</span>
              </>
            )}
          </div>
          
          {isConfigured && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                ✅ Payment gateway is active. Users can now pay the ₦8,550 registration fee.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Configuration Card */}
      <Card>
        <CardHeader>
          <CardTitle>API Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <Label htmlFor="publicKey" className="text-sm font-medium">Public Key</Label>
              <Input
                id="publicKey"
                type="text"
                placeholder="pk_test_..."
                value={publicKey}
                onChange={(e) => setPublicKey(e.target.value)}
                className="mt-1 font-mono text-sm"
              />
            </div>
            
            <div>
              <Label htmlFor="secretKey" className="text-sm font-medium">Secret Key</Label>
              <div className="relative">
                <Input
                  id="secretKey"
                  type={showSecretKey ? "text" : "password"}
                  placeholder="sk_test_..."
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  className="mt-1 font-mono text-sm pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 h-6 w-6 p-0"
                  onClick={() => setShowSecretKey(!showSecretKey)}
                >
                  {showSecretKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Message Display */}
            {!token && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-red-800">
                  You must be logged in to configure Paystack settings.
                </AlertDescription>
              </Alert>
            )}
            
            {message.text && (
              <Alert className={message.type === "error" ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}>
                {message.type === "error" ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                <AlertDescription className={message.type === "error" ? "text-red-800" : "text-green-800"}>
                  {message.text}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="flex space-x-3">
              <Button 
                onClick={handleSaveConfig}
                disabled={isLoading || (!publicKey.trim() || !secretKey.trim()) || !token}
                className="flex-1"
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "Saving..." : "Save Configuration"}
              </Button>
              
              {isConfigured && (
                <Button 
                  onClick={handleTestConnection}
                  disabled={isLoading}
                  variant="outline"
                  className="flex-1"
                >
                  {isLoading ? "Testing..." : "Test Connection"}
                </Button>
              )}
            </div>

            {isConfigured && (
              <Button 
                onClick={handleResetConfig}
                variant="outline"
                className="w-full"
              >
                Reset Configuration
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Get Your API Keys</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gray-600">
            <p>1. Go to <a href="https://paystack.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">paystack.com</a> and log in to your account</p>
            <p>2. Navigate to <strong>Settings</strong> → <strong>API Keys & Webhooks</strong></p>
            <p>3. Copy your <strong>Public Key</strong> (starts with pk_test_ or pk_live_)</p>
            <p>4. Copy your <strong>Secret Key</strong> (starts with sk_test_ or sk_live_)</p>
            <p>5. Paste both keys above and click <strong>Save Configuration</strong></p>
            <p className="text-yellow-600 font-medium">⚠️ Use test keys for development and live keys for production</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaystackIntegration;
