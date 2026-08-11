import {
    createContext,
    useEffect,
    useState
} from "react";

import {
    getCurrentUser,
    login as loginRequest,
    logout as logoutRequest,
    register as registerRequest
} from "../services/authService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {

        try {

            const currentUser = await getCurrentUser();

            setUser(currentUser);

        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (data) => {

        const loggedInUser =
            await loginRequest(data);

        setUser(loggedInUser);

        return loggedInUser;
    };

    const register = async (data) => {

        return await registerRequest(data);
    };

    const logout = async () => {

        try {
            await logoutRequest();
        } finally {
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                register,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}