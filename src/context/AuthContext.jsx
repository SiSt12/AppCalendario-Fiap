const { createContext, useState, useContext, useEffect } = React;

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [weekStartDay, setWeekStartDay] = useState(0);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const loggedInUser = JSON.parse(storedUser);
            setUser(loggedInUser);
            const settings = JSON.parse(localStorage.getItem(`settings_${loggedInUser.id}`) || '{}');
            setWeekStartDay(settings.weekStartDay || 0);
        }
    }, []);

    const login = (email, password) => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const foundUser = users.find(u => u.email === email && u.password === password);

        if (foundUser) {
            setUser(foundUser);
            localStorage.setItem('user', JSON.stringify(foundUser));
            
            const settings = JSON.parse(localStorage.getItem(`settings_${foundUser.id}`) || '{}');
            setWeekStartDay(settings.weekStartDay || 0);

            const isNew = localStorage.getItem(`onboarding_complete_${foundUser.id}`);
            if (!isNew) {
                setShowOnboarding(true);
            }
            
            return true;
        }
        return false;
    };

    const register = (name, email, password) => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const existingUser = users.find(u => u.email === email);

        if (existingUser) {
            return { success: false, message: 'Este e-mail já está em uso.' };
        }

        const newUser = { id: Date.now(), name, email, password };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        setWeekStartDay(0);
        setShowOnboarding(true);

        return { success: true };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    const completeOnboarding = () => {
        if (user) {
            localStorage.setItem(`onboarding_complete_${user.id}`, 'true');
            setShowOnboarding(false);
        }
    };

    const updateWeekStartDay = (day) => {
        if (user) {
            const settings = { weekStartDay: day };
            localStorage.setItem(`settings_${user.id}`, JSON.stringify(settings));
            setWeekStartDay(day);
        }
    };

    const value = { user, login, logout, register, showOnboarding, completeOnboarding, weekStartDay, updateWeekStartDay };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

window.AuthProvider = AuthProvider;
window.useAuth = useAuth;
