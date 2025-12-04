import React from 'react';

interface HelpModalProps {
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="bg-primary p-4 flex justify-between items-center text-white">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <i className="fa-solid fa-circle-question"></i>
            Editor Guide
          </h2>
          <button onClick={onClose} className="hover:text-gray-200 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10">
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto text-secondary">
          
          <div className="space-y-3">
            <h3 className="font-semibold text-primary flex items-center gap-2 border-b border-gray-100 pb-2">
              <i className="fa-solid fa-link"></i>
              How to use Hyperlinks
            </h3>
            <div className="space-y-4 text-sm text-gray-600">
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">1</span>
                <div>
                  <p className="font-medium text-gray-800">Convert Text to Link</p>
                  <p>Highlight existing text, click the Link icon <i className="fa fa-link mx-1 text-gray-400"></i>, and paste your URL.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">2</span>
                <div>
                  <p className="font-medium text-gray-800">Insert New Link</p>
                  <p>Click the Link icon <i className="fa fa-link mx-1 text-gray-400"></i> without selecting anything. You will be asked for the URL first, then the text label.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
             <h3 className="font-semibold text-primary flex items-center gap-2 border-b border-gray-100 pb-2">
               <i className="fa-solid fa-wand-magic-sparkles"></i>
               AI Assistant
             </h3>
             <p className="text-sm text-gray-600">
               Select any text in the editor to unlock AI context menu actions like <b>Rewrite</b>, <b>Summarize</b>, or <b>Fix Grammar</b> in the sidebar.
             </p>
          </div>

        </div>
        <div className="p-4 bg-gray-50 text-right border-t border-gray-100">
          <button onClick={onClose} className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium shadow-sm">
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;