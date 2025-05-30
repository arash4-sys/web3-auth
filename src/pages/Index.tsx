
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";


const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center max-w-md mx-auto p-8">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">Welcome to Web3 App</h1>
        
        <div className="space-y-4">
          
            <>
              <Button 
                onClick={() => navigate('/login')} 
                className="w-full"
                size="lg"
              >
                Login
              </Button>
              <Button 
                onClick={() => navigate('/register')} 
                variant="outline"
                className="w-full"
                size="lg"
              >
                Create Account
              </Button>
              <Button 
                onClick={() => navigate('/verify')} 
                variant="outline"
                className="w-full"
                size="lg"
              >
                Verify Credentials
              </Button>
            </>
          
        </div>
      </div>
    </div>
  );
};

export default Index;
