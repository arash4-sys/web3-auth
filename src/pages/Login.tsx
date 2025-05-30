
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [privateKey, setPrivateKey] = useState("");
  const [email, setEmail] = useState("");

  const { loginByVC, loginByPrivKey, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (privateKey) {
      
      try {
        await loginByPrivKey(privateKey);
        navigate('/dashboard');
      } catch {
        toast({
          title: "Invalid private key",
          description: "Logged in successfully!",  
        })
      }
    } else {
      
      try {
        await loginByVC();
        toast({
          title: "Success",
          description: "Logged in successfully!",
        });
        navigate("/dashboard");
      } catch (error) {
        toast({
          title: "Error invalid verifiable credentials",
          description: "Invalid verifiable credentials, try logging in by private key",
          variant: "destructive",
        });
        
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-600 mt-2">Sign in</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
        <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="privateKey">* Private Key(in hex format)</Label>
            <Input
              id="privateKey"
              type="text"
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
              placeholder="Enter your private key in hex format"
              className="mt-1"
            />
          </div>
          
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 hover:text-blue-500 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
