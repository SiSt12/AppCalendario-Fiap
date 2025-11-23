const InfoModal = ({ title, message, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[200] animate-fade-in">
            <div className="glass-effect rounded-2xl p-8 w-full max-w-md shadow-2xl animate-scale-in text-center">
                <h2 className="text-2xl font-bold text-black mb-4">{title}</h2>
                <p className="text-black mb-8">{message}</p>
                <div className="flex justify-center">
                    <button
                        onClick={onClose}
                        className="w-full max-w-xs py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all font-semibold"
                    >
                        Entendido
                    </button>
                </div>
            </div>
        </div>
    );
};

window.InfoModal = InfoModal;