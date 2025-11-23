const ConfirmModal = ({ title, message, onConfirm, onCancel, confirmText = 'Confirmar', cancelText = 'Cancelar' }) => {
    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[150] animate-fade-in">
            <div className="glass-effect rounded-2xl p-8 w-full max-w-md shadow-2xl animate-scale-in text-center">
                <h2 className="text-2xl font-bold text-black mb-4">{title}</h2>
                <p className="text-black mb-8">{message}</p>
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-3 bg-gray-300 hover:bg-gray-400 text-black rounded-lg transition-all font-semibold"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all font-semibold"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

window.ConfirmModal = ConfirmModal;
