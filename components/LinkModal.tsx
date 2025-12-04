import React, { useState, useEffect } from 'react';

interface LinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (url: string, text?: string) => void;
  isInsertionMode: boolean; // True if we are inserting new link (no selection)
}

const LinkModal: React.FC<LinkModalProps> = ({ isOpen, onClose, onSubmit, isInsertionMode }) => {
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setUrl('');
      setText('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (!url.trim()) return;
    
    // Auto-prepend http if missing
    const finalUrl = /^https?:\/\//i.test(url) ? url : `http://${url}`;
    
    onSubmit(finalUrl, isInsertionMode ? text : undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="bg-primary p-4 flex justify-between items-center text-white">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <i className="fa-solid fa-link"></i>
            {isInsertionMode ? 'Insert Link' : 'Edit Link'}
          </h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Destination URL
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="example.com"
              className="w-full p-2 border border-gray-300 rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              autoFocus
            />
          </div>

          {isInsertionMode && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Text to Display
              </label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Click here"
                className="w-full p-2 border border-gray-300 rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              />
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded text-gray-600 hover:bg-gray-100 font-medium text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!url.trim() || (isInsertionMode && !text.trim())}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-600 font-medium text-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Apply Link
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LinkModal;