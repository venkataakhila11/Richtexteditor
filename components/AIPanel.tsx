import React, { useState } from 'react';
import { GeminiActionType } from '../types';

interface AIPanelProps {
  onAction: (action: GeminiActionType, customPayload?: string) => void;
  onAccept: () => void;
  onDiscard: () => void;
  isLoading: boolean;
  hasSelection: boolean;
  generatedContent: string | null;
}

const AIPanel: React.FC<AIPanelProps> = ({ 
  onAction, 
  onAccept, 
  onDiscard, 
  isLoading, 
  hasSelection, 
  generatedContent 
}) => {
  const [customPrompt, setCustomPrompt] = useState('');

  const handleCustomSubmit = () => {
    if (!customPrompt.trim()) return;
    onAction(GeminiActionType.CUSTOM_PROMPT, customPrompt);
    setCustomPrompt('');
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 flex flex-col gap-4 h-full overflow-y-auto relative">
      <div className="flex items-center gap-2 text-primary font-bold text-lg border-b pb-3 border-gray-100">
        <i className="fa-solid fa-sparkles"></i>
        <span>Gemini AI</span>
      </div>

      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-500 gap-3">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm animate-pulse">Thinking...</p>
        </div>
      ) : generatedContent ? (
        // Review Mode UI
        <div className="flex flex-col h-full gap-3 animate-fade-in">
          <div className="flex items-center gap-2 text-green-600 font-medium text-sm">
             <i className="fa-solid fa-check-circle"></i>
             <span>Suggestion Ready</span>
          </div>
          
          <div className="bg-amber-50 border border-amber-100 p-3 rounded-lg text-xs text-amber-800">
            <p className="font-semibold mb-1">Review Mode</p>
            Gemini has generated a suggestion. The document has <b>not</b> been changed yet. Click "Apply" to accept the changes.
          </div>

          <div className="flex-1 overflow-y-auto bg-gray-50 p-3 rounded border border-gray-200 text-sm text-gray-700 shadow-inner">
             <div 
               className="prose prose-sm max-w-none"
               dangerouslySetInnerHTML={{ __html: generatedContent }} 
             />
          </div>

          <div className="flex gap-2 pt-2 border-t border-gray-100">
            <button
              onClick={onDiscard}
              className="flex-1 py-2 px-4 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors font-medium text-sm"
            >
              Discard
            </button>
            <button
              onClick={onAccept}
              className="flex-1 py-2 px-4 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors font-medium text-sm shadow-md"
            >
              {hasSelection ? 'Replace Selection' : 'Insert at Cursor'}
            </button>
          </div>
        </div>
      ) : (
        // Standard Action Menu
        <div className="flex flex-col gap-4">
          
          {/* Custom Prompt Section */}
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
            <label className="text-xs font-semibold text-blue-800 mb-1 block">
              Ask Gemini
            </label>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder={hasSelection ? "e.g., Make this funnier..." : "e.g., Write about World War II..."}
              className="w-full text-sm p-2 rounded border border-blue-200 focus:outline-none focus:border-blue-400 mb-2 resize-none h-20 bg-white"
            />
            <button
              onClick={handleCustomSubmit}
              disabled={!customPrompt.trim()}
              className="w-full py-1.5 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <i className="fa-solid fa-paper-plane mr-2"></i>
              Generate
            </button>
          </div>

          <div className="h-px bg-gray-100"></div>

          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            {hasSelection ? 'Quick Actions' : 'Tools'}
          </p>
          
          {hasSelection && (
            <>
              {/* Primary Actions */}
              <button
                onClick={() => onAction(GeminiActionType.REWRITE)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-active text-left transition-all group"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 grid place-items-center group-hover:bg-blue-200">
                  <i className="fa-solid fa-pen-nib"></i>
                </div>
                <div>
                  <div className="font-medium text-sm text-secondary">Rewrite</div>
                  <div className="text-xs text-gray-500">Improve clarity & flow</div>
                </div>
              </button>

              <button
                onClick={() => onAction(GeminiActionType.FIX_GRAMMAR)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-active text-left transition-all group"
              >
                <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 grid place-items-center group-hover:bg-green-200">
                  <i className="fa-solid fa-check-double"></i>
                </div>
                <div>
                  <div className="font-medium text-sm text-secondary">Fix Grammar</div>
                  <div className="text-xs text-gray-500">Correct spelling & grammar</div>
                </div>
              </button>

              <button
                onClick={() => onAction(GeminiActionType.SUMMARIZE)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-active text-left transition-all group"
              >
                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 grid place-items-center group-hover:bg-purple-200">
                  <i className="fa-solid fa-compress-alt"></i>
                </div>
                <div>
                  <div className="font-medium text-sm text-secondary">Summarize</div>
                  <div className="text-xs text-gray-500">Shorten selected text</div>
                </div>
              </button>

              <div className="grid grid-cols-2 gap-2 mt-1">
                <button
                   onClick={() => onAction(GeminiActionType.MAKE_FORMAL)}
                   className="flex flex-col items-center gap-1 p-2 rounded bg-gray-50 hover:bg-gray-100 text-xs text-gray-600 transition-colors"
                >
                  <i className="fa-solid fa-user-tie text-lg mb-1"></i> 
                  <span>Formal</span>
                </button>
                <button
                   onClick={() => onAction(GeminiActionType.MAKE_CASUAL)}
                   className="flex flex-col items-center gap-1 p-2 rounded bg-gray-50 hover:bg-gray-100 text-xs text-gray-600 transition-colors"
                >
                  <i className="fa-solid fa-mug-hot text-lg mb-1"></i> 
                  <span>Casual</span>
                </button>
                <button
                   onClick={() => onAction(GeminiActionType.SOFTEN_TONE)}
                   className="flex flex-col items-center gap-1 p-2 rounded bg-gray-50 hover:bg-gray-100 text-xs text-gray-600 transition-colors"
                >
                  <i className="fa-solid fa-feather text-lg mb-1"></i> 
                  <span>Soften</span>
                </button>
                <button
                   onClick={() => onAction(GeminiActionType.EMOJIFY)}
                   className="flex flex-col items-center gap-1 p-2 rounded bg-gray-50 hover:bg-gray-100 text-xs text-gray-600 transition-colors"
                >
                  <i className="fa-solid fa-icons text-lg mb-1"></i> 
                  <span>Emojify</span>
                </button>
              </div>
            </>
          )}

          {!hasSelection && (
             <button
             onClick={() => onAction(GeminiActionType.CONTINUE_WRITING)}
             className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md hover:shadow-lg transition-all"
           >
             <div className="w-8 h-8 rounded-full bg-white/20 grid place-items-center">
               <i className="fa-solid fa-magic"></i>
             </div>
             <div>
               <div className="font-medium text-sm">Continue Writing</div>
               <div className="text-xs text-white/80">Generate next paragraph</div>
             </div>
           </button>
          )}
        </div>
      )}
      
      <div className="mt-auto pt-4 border-t border-gray-100 text-center text-xs text-gray-400">
        Powered by Google Gemini
      </div>
    </div>
  );
};

export default AIPanel;