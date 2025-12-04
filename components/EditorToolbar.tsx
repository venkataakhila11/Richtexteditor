import React from 'react';

interface EditorToolbarProps {
  onCommand: (command: string, value?: string) => void;
  activeFormats: Record<string, boolean>;
  onHelp: () => void;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({ onCommand, activeFormats, onHelp }) => {
  
  // Font list matched exactly to reference code
  const fontList = [
    "Arial",
    "Verdana",
    "Times New Roman",
    "Garamond",
    "Georgia",
    "Courier New",
    "cursive",
  ];

  const handleFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onCommand("fontName", e.target.value);
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onCommand("fontSize", e.target.value);
  };

  // Helper to prevent button from stealing focus from the editor
  const preventFocusLoss = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const renderButton = (id: string, iconClass: string, group: string = "") => (
    <button
      id={id}
      onMouseDown={preventFocusLoss}
      onClick={() => onCommand(id)}
      className={`h-8 w-8 grid place-items-center rounded border-none outline-none transition-colors duration-200 ${
        activeFormats[id] ? "bg-active text-primary shadow-inner" : "bg-white text-secondary hover:bg-gray-100"
      } ${group}`}
      title={id}
    >
      <i className={iconClass}></i>
    </button>
  );

  return (
    <div className="flex flex-wrap items-center gap-3 p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg sticky top-0 z-10">
      {/* Text Format */}
      <div className="flex gap-1">
        {renderButton("bold", "fa-solid fa-bold")}
        {renderButton("italic", "fa-solid fa-italic")}
        {renderButton("underline", "fa-solid fa-underline")}
        {renderButton("strikeThrough", "fa-solid fa-strikethrough")}
        {renderButton("superscript", "fa-solid fa-superscript")}
        {renderButton("subscript", "fa-solid fa-subscript")}
      </div>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      {/* List */}
      <div className="flex gap-1">
        {renderButton("insertOrderedList", "fa-solid fa-list-ol")}
        {renderButton("insertUnorderedList", "fa-solid fa-list")}
      </div>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      {/* Undo/Redo */}
      <div className="flex gap-1">
        {renderButton("undo", "fa-solid fa-rotate-left")}
        {renderButton("redo", "fa-solid fa-rotate-right")}
      </div>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      {/* Link */}
      <div className="flex gap-1">
        <button
          id="createLink"
          onMouseDown={preventFocusLoss}
          onClick={() => onCommand('createLink')}
          className={`h-8 w-8 grid place-items-center rounded border-none outline-none transition-colors duration-200 ${
            activeFormats['createLink'] ? "bg-active text-primary" : "bg-white text-secondary hover:bg-gray-100"
          }`}
          title="Hyperlink"
        >
          <i className="fa fa-link"></i>
        </button>
        {renderButton("unlink", "fa fa-unlink")}
      </div>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      {/* Alignment */}
      <div className="flex gap-1">
        {renderButton("justifyLeft", "fa-solid fa-align-left")}
        {renderButton("justifyCenter", "fa-solid fa-align-center")}
        {renderButton("justifyRight", "fa-solid fa-align-right")}
        {renderButton("justifyFull", "fa-solid fa-align-justify")}
      </div>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      {/* Indentation */}
      <div className="flex gap-1">
        {renderButton("indent", "fa-solid fa-indent")}
        {renderButton("outdent", "fa-solid fa-outdent")}
      </div>

      <div className="w-full h-px bg-gray-200 my-1 sm:hidden"></div>

      {/* Headings */}
      <select
        id="formatBlock"
        onChange={(e) => onCommand("formatBlock", e.target.value)}
        className="p-1 border border-gray-300 rounded text-sm bg-white hover:border-primary focus:outline-none focus:border-primary"
      >
        <option value="">Heading</option>
        <option value="H1">H1</option>
        <option value="H2">H2</option>
        <option value="H3">H3</option>
        <option value="H4">H4</option>
        <option value="H5">H5</option>
        <option value="H6">H6</option>
      </select>

      {/* Fonts */}
      <select
        id="fontName"
        onChange={handleFontChange}
        className="p-1 border border-gray-300 rounded text-sm bg-white hover:border-primary focus:outline-none focus:border-primary w-24"
      >
        <option value="">Font</option>
        {fontList.map((font) => (
          <option key={font} value={font}>
            {font}
          </option>
        ))}
      </select>

      <select
        id="fontSize"
        onChange={handleSizeChange}
        className="p-1 border border-gray-300 rounded text-sm bg-white hover:border-primary focus:outline-none focus:border-primary"
      >
        <option value="3">Size</option>
        {[1, 2, 3, 4, 5, 6, 7].map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>

      {/* Colors */}
      <div className="flex gap-3 items-center ml-auto">
        <div className="flex items-center gap-1 relative group">
          <input
            type="color"
            id="foreColor"
            onChange={(e) => onCommand("foreColor", e.target.value)}
            className="w-8 h-8 cursor-pointer opacity-0 absolute inset-0 z-10"
          />
          <div className="w-8 h-8 rounded border border-gray-300 bg-white grid place-items-center group-hover:border-primary">
            <i className="fa-solid fa-font text-gray-700"></i>
          </div>
        </div>
        <div className="flex items-center gap-1 relative group">
          <input
            type="color"
            id="backColor"
            onChange={(e) => onCommand("backColor", e.target.value)}
            className="w-8 h-8 cursor-pointer opacity-0 absolute inset-0 z-10"
          />
          <div className="w-8 h-8 rounded border border-gray-300 bg-white grid place-items-center group-hover:border-primary">
             <i className="fa-solid fa-highlighter text-gray-700"></i>
          </div>
        </div>
        
        {/* Help Button */}
        <button
          onClick={onHelp}
          className="h-8 w-8 grid place-items-center rounded-full bg-blue-50 text-primary hover:bg-blue-100 transition-colors ml-2"
          title="How to use"
        >
          <i className="fa-solid fa-circle-question"></i>
        </button>
      </div>
    </div>
  );
};

export default EditorToolbar;