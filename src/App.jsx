const { useState, useEffect } = React;
const { AuthProvider, useAuth } = window;
const { Login } = window;
const { Register } = window;
const { Calendar } = window;

const App = () => {
    const [route, setRoute] = useState('login');
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            setRoute('calendar');
        } else {
            setRoute('login');
        }
    }, [user]);

    const renderPage = () => {
        if (user) {
            return <Calendar />;
        }

        switch (route) {
            case 'register':
                return <Register onNavigate={setRoute} />;
            case 'login':
            default:
                return <Login onNavigate={setRoute} />;
        }
    };

    return renderPage();
};

// Render App
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <AuthProvider>
        <App />
    </AuthProvider>
);
