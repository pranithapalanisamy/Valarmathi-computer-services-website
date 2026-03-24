import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth, db, signInWithGoogle, logOut } from "@/lib/firebase";
import { ref, get, set, serverTimestamp } from "firebase/database";

interface AuthContextType {
  user: User | null;
  role: string | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch or create user document in Realtime database
        const userRef = ref(db, `users/${currentUser.uid}`);
        const userSnap = await get(userRef);
        
        let userRole = "customer";

        if (userSnap.exists()) {
          userRole = userSnap.val().role || "customer";
        } else {
          // New user — default role is customer; admin must be set manually in Firebase
          await set(userRef, {
            displayName: currentUser.displayName,
            email: currentUser.email,
            photoURL: currentUser.photoURL,
            role: "customer",
            createdAt: serverTimestamp(),
          });
        }
        setRole(userRole);
      } else {
        setRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async () => {
    await signInWithGoogle();
  };


  const signOutUser = async () => {
    await logOut();
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, signIn, signOut: signOutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
