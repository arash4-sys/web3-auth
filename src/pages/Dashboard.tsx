
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { User, Settings, LogOut } from "lucide-react";

const Dashboard = () => {
  const { userDID, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userDID) {
      navigate("/login");
    }
  }, [userDID, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!userDID) {
    return null;
  }

  //JSON.parse(vc)['credentialSubject']['email'] 
  const email = JSON.parse(window.localStorage.getItem('VC'))['credentialSubject']['email'];
  const vc = window.localStorage.getItem('VC');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
            <Button 
              onClick={handleLogout} 
              variant="outline" 
              size="sm"
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Welcome back, {email}!</h2>
                <p className="text-gray-600">{userDID}</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">Your vc</p>
                  <p className="text-sm font-medium text-gray-600" style={{
                    flex: 1,
                    backgroundColor: "lightGrey",
                    wordBreak: "break-word"
                    }}>{vc}</p>
                
                </div>
              </div>
            </div>
            </div>   
        </div>
      </main>
    </div>
    
  );
};

export default Dashboard;
