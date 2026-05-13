import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, getIdTokenResult } from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const googleProvider = new GoogleAuthProvider();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [authClaims, setAuthClaims] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            if (user) {
                try {
                    const token = await getIdTokenResult(user, true);
                    setAuthClaims(token.claims || {});
                } catch (error) {
                    console.error('Failed to load auth claims:', error);
                    setAuthClaims({});
                }
            } else {
                setAuthClaims({});
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const googleSignIn = () => {
        return signInWithPopup(auth, googleProvider);
    };

    const logout = () => {
        return signOut(auth);
    };

    const refreshAuthClaims = async () => {
        if (!auth.currentUser) {
            setAuthClaims({});
            return {};
        }

        const token = await getIdTokenResult(auth.currentUser, true);
        setAuthClaims(token.claims || {});
        return token.claims || {};
    };

    const value = {
        currentUser,
        authClaims,
        login,
        googleSignIn,
        logout,
        refreshAuthClaims
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
