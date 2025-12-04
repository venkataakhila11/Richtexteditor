import React, { useRef, useState, useEffect, useCallback } from 'react';
import EditorToolbar from './components/EditorToolbar';
import AIPanel from './components/AIPanel';
import HelpModal from './components/HelpModal';
import LinkModal from './components/LinkModal';
import { generateAIContent } from './services/geminiService';
import { GeminiActionType, AIState } from './types';

function App() {
  const editorRef = useRef<HTMLDivElement>(null);
  const savedSelectionRef = useRef<Range | null>(null);

  const [activeFormats, setActiveFormats] = useState<Record<string, boolean>>({});
  const [hasSelection, setHasSelection] = useState(false);
  
  // Modal States
  const [showHelp, setShowHelp] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [isLinkInsertionMode, setIsLinkInsertionMode] = useState(false);

  const [aiState, setAIState] = useState<AIState>({
    isLoading: false,
    error: null,
    generatedContent: null
  });

  // Track cursor position/selection state
  const checkSelection = useCallback(() => {
    // If AI has generated content, we don't want to lose the review state by clicking around
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const editor = editorRef.current;
      
      // Check if selection is inside editor
      if (editor && editor.contains(range.commonAncestorContainer)) {
        // hasSelection determines if "Rewrite" tools are available vs "Continue Writing"
        setHasSelection(selection.toString().length > 0);
        
        // Update active formats
        const formats: Record<string, boolean> = {};
        ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'insertOrderedList', 'insertUnorderedList', 'createLink'].forEach(cmd => {
          formats[cmd] = document.queryCommandState(cmd);
        });
        setActiveFormats(formats);
      }
    }
  }, []);

  useEffect(() => {
    document.addEventListener('selectionchange', checkSelection);
    return () => {
      document.removeEventListener('selectionchange', checkSelection);
    };
  }, [checkSelection]);

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      // Ensure we are saving a selection from the editor
      const range = sel.getRangeAt(0);
      const editor = editorRef.current;
      if (editor && editor.contains(range.commonAncestorContainer)) {
        savedSelectionRef.current = range.cloneRange();
      }
    }
  };

  const restoreSelection = () => {
      const sel = window.getSelection();
      // Restore range if we have one
      if (savedSelectionRef.current) {
          sel?.removeAllRanges();
          sel?.addRange(savedSelectionRef.current);
      }
      
      // CRITICAL: Always force focus back to editor element
      if (editorRef.current) {
        editorRef.current.focus();
      }
  };

  // Execute standard editor commands
  const handleCommand = (command: string, value: string | undefined = undefined) => {
    const editor = editorRef.current;
    if (!editor) return;

    if (command === 'createLink') {
      const selection = window.getSelection();
      
      // Validation: Must be inside editor
      if (!selection || selection.rangeCount === 0) {
        // Try to focus editor if no selection exists anywhere
        editor.focus();
        // Check again
      }
      
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) {
          alert("Please click inside the editor content first.");
          return;
      }

      const range = sel.getRangeAt(0);
      const isInsideEditor = editor.contains(range.commonAncestorContainer);
      
      if (!isInsideEditor) {
        // Attempt to move cursor to end of editor if user clicked button while outside
        editor.focus();
      }

      // 1. Save state immediately
      savedSelectionRef.current = sel.getRangeAt(0).cloneRange();
      
      // 2. Determine Mode (Insert new or Convert existing)
      const isCollapsed = sel.isCollapsed;
      setIsLinkInsertionMode(isCollapsed); 
      
      // 3. Open Custom Modal (No more prompt())
      setShowLinkModal(true);
      return;
    }

    // Standard formatting commands
    editor.focus();
    document.execCommand(command, false, value);
    checkSelection();
  };

  const handleLinkSubmit = (url: string, text?: string) => {
    // 1. Restore the cursor position exactly where it was
    restoreSelection();
    
    // 2. Execute Command based on mode
    if (isLinkInsertionMode && text) {
      // Insert new HTML link
      const linkHTML = `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>&nbsp;`;
      document.execCommand('insertHTML', false, linkHTML);
    } else {
      // Convert selected text to link
      document.execCommand('createLink', false, url);
    }
    
    checkSelection();
  };

  // Handle AI Operations
  const handleAIAction = async (action: GeminiActionType, customPayload?: string) => {
    if (!editorRef.current) return;

    // Save selection so we know what to replace/where to insert later
    saveSelection();

    setAIState({ ...aiState, isLoading: true, error: null, generatedContent: null });

    try {
      const selection = window.getSelection();
      let selectedText = "";
      
      // Default context is the whole document, but for CUSTOM_PROMPT we use customPayload as instruction
      let contextPayload = editorRef.current.innerText; 

      if (selection && selection.toString().length > 0 && editorRef.current.contains(selection.anchorNode)) {
        selectedText = selection.toString();
      }

      // If it's a custom prompt, we pass the user's instruction string as the context payload
      if (action === GeminiActionType.CUSTOM_PROMPT && customPayload) {
          contextPayload = customPayload;
      }

      const result = await generateAIContent(action, selectedText, contextPayload);
      
      setAIState({ isLoading: false, error: null, generatedContent: result });

    } catch (err: any) {
      console.error(err);
      setAIState({ 
        isLoading: false, 
        error: "Failed to generate content. Please check your API Key and try again.", 
        generatedContent: null 
      });
    }
  };

  const applyAIContent = () => {
    if (!editorRef.current || !aiState.generatedContent) return;

    restoreSelection();
    document.execCommand('insertHTML', false, aiState.generatedContent);
    
    // Reset state
    setAIState({ ...aiState, generatedContent: null });
    savedSelectionRef.current = null;
    checkSelection();
  };

  const discardAIContent = () => {
    setAIState({ ...aiState, generatedContent: null });
    savedSelectionRef.current = null;
    if (editorRef.current) {
        editorRef.current.focus();
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 flex justify-center items-center">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Main Editor Area */}
        <div className="lg:col-span-3 bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col h-[80vh]">
          <div className="bg-primary text-white p-4 flex justify-between items-center">
            <h1 className="text-xl font-bold tracking-wide">
              <i className="fa-solid fa-file-pen mr-2"></i>
              Rich Text Editor
            </h1>
            <div className="text-xs opacity-75 bg-white/20 px-2 py-1 rounded">
              v2.8 (Premium)
            </div>
          </div>

          <EditorToolbar 
            onCommand={handleCommand} 
            activeFormats={activeFormats} 
            onHelp={() => setShowHelp(true)}
          />

          <div className="flex-1 overflow-hidden relative">
             <div
                ref={editorRef}
                id="text-input"
                className="w-full h-full p-8 outline-none overflow-y-auto text-secondary text-base leading-relaxed"
                contentEditable={true}
                suppressContentEditableWarning={true}
                spellCheck={true}
                style={{ minHeight: '100%' }}
             >
                <p>Start writing your masterpiece here...</p>
                <p><br/></p>
             </div>
          </div>
          
          <div className="bg-gray-50 border-t border-gray-200 p-2 text-xs text-center text-gray-400">
             Words: {editorRef.current?.innerText.trim().split(/\s+/).filter(w => w.length > 0).length || 0}
          </div>
        </div>

        {/* AI Sidebar */}
        <div className="lg:col-span-1 h-[80vh]">
           <AIPanel 
             onAction={handleAIAction}
             onAccept={applyAIContent}
             onDiscard={discardAIContent}
             isLoading={aiState.isLoading}
             hasSelection={hasSelection}
             generatedContent={aiState.generatedContent}
           />
        </div>

        {/* Modals */}
        {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
        <LinkModal 
          isOpen={showLinkModal} 
          onClose={() => setShowLinkModal(false)}
          onSubmit={handleLinkSubmit}
          isInsertionMode={isLinkInsertionMode}
        />

      </div>
    </div>
  );
}

export default App;