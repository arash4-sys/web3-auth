
import { createContext, useContext, useState, ReactNode } from 'react';
import { agent, issuer } from "../lib/Auth";

interface AuthContextType {
  userDID: null| string;
  loginByVC: () => Promise<void>;
  loginByPrivKey: (privKeyHex: string) => Promise<void>;
  register: (creds: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [userDID, setUserDID] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loginByVC = async () => {
    setIsLoading(true);
    try {// at the page loading getting jwt/vc stored in localStorage
      const VC: string = window.localStorage.getItem('VC');
      const VCJson = JSON.parse(VC);
      const result = await agent.verifyCredential({credential: VCJson.proof.jwt});
      if (!result.verified) {
        throw new Error('Bad VC');
      }
      console.log(result);
      setUserDID(result.issuer);
      
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginByPrivKey = async (privateKeyHex: string, email: string) => {
    setIsLoading(true);
    try {
      const key = await agent.keyManagerImport({
        kms: 'local',
        type: 'Secp256k1',
        privateKeyHex,
      });

      const identifier = await agent.didManagerCreate({
        provider: 'did:key',
        kms: 'local',
        options: { key },
      });

      const vc = await agent.createVerifiableCredential({
        credential: {
          issuer: { id: issuer.did },
          '@context': ['https://www.w3.org/2018/credentials/v1'],
          type: ['VerifiableCredential'],
          issuanceDate: new Date().toISOString(),
          credentialSubject: {
            id: identifier.did,
            email: email,
          },
        },
        proofFormat: 'jwt',
      });

      setUserDID(identifier.did);
      window.localStorage.setItem('VC', JSON.stringify(vc));

    } catch (err) {
      console.log('Invalid key', err);
    } finally {
      setIsLoading(false);
    }

    
  }

  const register = async (email: string) => {
    setIsLoading(true);
    try {
      
      const subject = await agent.didManagerCreate();
      const creds = await agent.createVerifiableCredential({
        credential: {
          issuer: { id: issuer.did },
          '@context': ['https://www.w3.org/2018/credentials/v1'],
          type: ['VerifiableCredential'],
          issuanceDate: new Date().toISOString(),
          credentialSubject: {
            id: subject.did,
            email: email,
          },
          },
          proofFormat: 'jwt',
        })
      
      
      window.localStorage.setItem('VC', JSON.stringify(creds));
      setUserDID(creds.issuer.id);

    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUserDID(null);
    localStorage.removeItem('user');
    localStorage.removeItem('VC');
  };

  return (
    <AuthContext.Provider value={{userDID, loginByPrivKey, loginByVC, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
