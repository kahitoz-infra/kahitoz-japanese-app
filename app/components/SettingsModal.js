"use client"

export default function SettingsModal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white dark:bg-black p-6 rounded-lg w-[90%] max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-xl font-bold text-gray-800 dark:text-gray-100"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}
