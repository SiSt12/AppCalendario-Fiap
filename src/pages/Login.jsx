const { useState } = React;
const { useAuth } = window;

const Login = ({ onNavigate }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Por favor, preencha todos os campos.');
            return;
        }

        const result = login(email, password);
        if (!result.success) {
            setError(result.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 animate-fade-in">
            <div className="glass-effect rounded-3xl p-8 w-full max-w-md shadow-2xl animate-slide-up">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-black mb-2">Bem-vindo!</h1>
                    <p className="text-black">Entre na sua conta</p>
                </div>

                {error && (
                    <div className="bg-red-500/20 border border-red-500 text-red-800 px-4 py-3 rounded-lg mb-4 animate-scale-in text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-black font-medium mb-2">E-mail</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-field w-full px-4 py-3 rounded-lg bg-white/90 border-2 border-transparent focus:border-primary-400 focus:outline-none"
                            placeholder="seu@email.com"
                        />
                    </div>

                    <div>
                        <label className="block text-black font-medium mb-2">Senha</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field w-full px-4 py-3 rounded-lg bg-white/90 border-2 border-transparent focus:border-primary-400 focus:outline-none"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-primary w-full py-3 rounded-lg text-white font-semibold"
                    >
                        Entrar
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-black">
                        Não tem uma conta?{' '}
                        <button
                            onClick={() => onNavigate('register')}
                            className="text-black font-semibold hover:underline"
                        >
                            Cadastre-se
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

window.Login = Login;
