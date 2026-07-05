import { create } from 'zustand';
import { 
  User, 
  onAuthStateChanged, 
  signOut 
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/services/firebase/config';

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'user' | 'admin';
  createdAt: string;
}

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  initialized: boolean;
  setUser: (user: User | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => Promise<void>;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  loading: true,
  initialized: false,

  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),

  logout: async () => {
    try {
      await signOut(auth);
      set({ user: null, profile: null });
    } catch (error) {
      console.error("Logout Error:", error);
    }
  },

  checkAuth: () => {
    onAuthStateChanged(auth, async (user) => {
      set({ loading: true });
      if (user) {
        // Fetch additional user profile data from Firestore
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const profileData = docSnap.data() as UserProfile;
          set({ user, profile: profileData, loading: false, initialized: true });
        } else {
          // If no firestore profile yet, set basic info
          set({ 
            user, 
            profile: null, 
            loading: false, 
            initialized: true 
          });
        }
      } else {
        set({ user: null, profile: null, loading: false, initialized: true });
      }
    });
  },
}));