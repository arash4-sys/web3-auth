
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { agent } from "../lib/Auth";

const Verify = () => {
  const [VC, setVC] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!VC) {
      toast({
        title: "Enter verifiable credentials",
        description: "Empty verifiable credentials",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await agent.verifyCredential({credential: JSON.parse(VC).proof.jwt});
      if (result.verified) {
        toast({
        title: "Success",
        description: "Verifiable credentials are valid!",
      })
      return;
    }
    } catch {
        toast({
          title: 'Error validaing verifiable credentials',
          description: 'Verifiable credentials probably not valid',
        })
    }
    
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Verify credentials</h1>
          
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
        <div>
            <Label htmlFor="VC">Enter verifiable credentials to check</Label>
            <Input
              id="vcreds"
              type="text"
              value={VC}
              onChange={(e) => setVC(e.target.value)}
              placeholder="Enter verifiable credentials"
              className="mt-1"
            />
          </div>
          
          
          <Button
            type="submit"
            className="w-full"
          
          >
            Verify
          </Button>
        </form>

        <div className="mt-6 text-center">
        </div>
      </div>
    </div>
  );
};

export default Verify;
