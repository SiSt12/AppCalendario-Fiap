const { useState } = React;
const { useAuth } = window;

const Register = ({ onNavigate }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useAuth();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!name || !email || !password || !confirmPassword) {
            setError('Por favor, preencha todos os campos');
            return;
        }

        if (password !== confirmPassword) {
            setError('As senhas não coincidem');
            return;
        }

        if (password.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres');
            return;
        }

        const result = register(name, email, password);
        if (!result.success) {
            setError(result.error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 animate-fade-in">
            <div className="glass-effect rounded-3xl p-8 w-full max-w-md shadow-2xl animate-slide-up">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-black mb-2">Criar Conta</h1>
                    <p className="text-black">Junte-se a nós e comece a organizar</p>
                </div>

                {error && (
                    <div className="bg-red-500/20 border border-red-500 text-black px-4 py-3 rounded-lg mb-4 animate-scale-in">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-black font-medium mb-2">Nome</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="input-field w-full px-4 py-3 rounded-lg bg-white/90 border-2 border-transparent focus:border-primary-400 focus:outline-none"
                            placeholder="John Doe"
                        />
                    </div>

                    <div>
                        <label className="block text-black font-medium mb-2">E-mail</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-field w-full px-4 py-3 rounded-lg bg-white/90 border-2 border-transparent focus:border-primary-400 focus:outline-none"
                            placeholder="your@email.com"
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

                    <div>
                        <label className="block text-black font-medium mb-2">Confirmar Senha</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="input-field w-full px-4 py-3 rounded-lg bg-white/90 border-2 border-transparent focus:border-primary-400 focus:outline-none"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-primary w-full py-3 rounded-lg text-white font-semibold"
                    >
                        Criar Conta
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-black">
                        Já tem uma conta?{' '}
                        <button
                            onClick={() => onNavigate('login')}
                            className="text-black font-semibold hover:underline"
                        >
                            Entrar
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

// Export to window
window.Register = Register;
