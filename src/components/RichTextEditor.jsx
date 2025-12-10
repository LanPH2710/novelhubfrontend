import { useState, useRef } from 'react';

export default function RichTextEditor({ value, onChange, placeholder = 'Enter your content here...' }) {
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const textareaRef = useRef(null);

  const applyFormatting = (before, after = '') => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText =
      value.substring(0, start) +
      before +
      selectedText +
      after +
      value.substring(end);
    onChange(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 0);
  };

  const toggleBold = () => {
    applyFormatting('**', '**');
    setIsBold(!isBold);
  };

  const toggleItalic = () => {
    applyFormatting('*', '*');
    setIsItalic(!isItalic);
  };

  const toggleUnderline = () => {
    applyFormatting('<u>', '</u>');
    setIsUnderline(!isUnderline);
  };

  const insertHeading = () => {
    applyFormatting('\n### ', '\n');
  };

  const insertLineBreak = () => {
    applyFormatting('\n---\n', '');
  };

  return (
    <div className="border border-gray-300 rounded overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-100 border-b border-gray-300 p-2 sm:p-3 flex gap-1 sm:gap-2 flex-wrap">
        <button
          type="button"
          onClick={toggleBold}
          title="Bold (**text**)"
          className={`px-2 sm:px-3 py-1 sm:py-2 rounded text-xs sm:text-sm ${
            isBold ? 'bg-primary text-white' : 'bg-white border border-gray-300 hover:bg-gray-50'
          }`}
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={toggleItalic}
          title="Italic (*text*)"
          className={`px-2 sm:px-3 py-1 sm:py-2 rounded text-xs sm:text-sm ${
            isItalic ? 'bg-primary text-white' : 'bg-white border border-gray-300 hover:bg-gray-50'
          }`}
        >
          <em>I</em>
        </button>
        <button
          type="button"
          onClick={toggleUnderline}
          title="Underline (<u>text</u>)"
          className={`px-2 sm:px-3 py-1 sm:py-2 rounded text-xs sm:text-sm ${
            isUnderline ? 'bg-primary text-white' : 'bg-white border border-gray-300 hover:bg-gray-50'
          }`}
        >
          <u>U</u>
        </button>

        <div className="border-l border-gray-300"></div>

        <button
          type="button"
          onClick={insertHeading}
          title="Add Heading (### Heading)"
          className="px-2 sm:px-3 py-1 sm:py-2 rounded text-xs sm:text-sm bg-white border border-gray-300 hover:bg-gray-50"
        >
          H
        </button>
        <button
          type="button"
          onClick={insertLineBreak}
          title="Add Section Break"
          className="px-2 sm:px-3 py-1 sm:py-2 rounded text-xs sm:text-sm bg-white border border-gray-300 hover:bg-gray-50"
        >
          ―
        </button>
      </div>

      {/* Editor */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-48 sm:h-64 md:h-96 px-3 sm:px-4 py-2 sm:py-3 focus:outline-none resize-none font-mono text-xs sm:text-sm"
      />

      {/* Format Guide */}
      <div className="bg-gray-50 border-t border-gray-300 p-2 sm:p-3 text-xs text-gray-600 leading-relaxed">
        <strong>Guide:</strong> **bold** *italic* &lt;u&gt;underline&lt;/u&gt; ###heading
      </div>
    </div>
  );
}
