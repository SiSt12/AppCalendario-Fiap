const MultiSelectToolbar = ({ selectedCount, onDelete, onCancel }) => {
    if (selectedCount === 0) return null;

    return (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 w-full max-w-md z-[100]">
            <div className="glass-effect rounded-xl p-4 shadow-2xl flex justify-between items-center animate-slide-up">
                <p className="font-semibold text-black">{selectedCount} evento(s) selecionado(s)</p>
                <div className="flex gap-2">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-sm bg-gray-300 hover:bg-gray-400 text-black rounded-lg transition-all"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onDelete}
                        className="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all"
                    >
                        Excluir Seleção
                    </button>
                </div>
            </div>
        </div>
    );
};

window.MultiSelectToolbar = MultiSelectToolbar;