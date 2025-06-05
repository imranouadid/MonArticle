export default function Modal({ title, children, onClose, actions }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg animate-fade-in">
                <h2 className="text-lg font-bold text-gray-800 mb-4">{title}</h2>
                <div className="text-gray-600 mb-6">{children}</div>
                <div className="flex justify-end gap-3">{actions}</div>
            </div>
        </div>
    );
}
