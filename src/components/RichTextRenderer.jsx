export default function RichTextRenderer({ content }) {
  const renderContent = (text) => {
    if (!text) return '';

    // Split by sections (--- line breaks)
    const sections = text.split(/\n---\n/);

    return sections.map((section, sectionIndex) => {
      // Split by headings (### )
      const lines = section.split('\n');
      const elements = [];

      lines.forEach((line, lineIndex) => {
        // Heading
        if (line.startsWith('### ')) {
          const headingText = line.replace(/^### /, '');
          elements.push(
            <h3 key={`heading-${sectionIndex}-${lineIndex}`} className="font-bold mt-6 mb-3" style={{ fontSize: 'clamp(1.1rem, 3vw, 1.5rem)' }}>
              {renderInlineFormatting(headingText)}
            </h3>
          );
        }
        // Empty line - paragraph break
        else if (line.trim() === '') {
          if (elements.length > 0 && elements[elements.length - 1] !== null) {
            elements.push(null);
          }
        }
        // Regular paragraph
        else {
          const renderedLine = renderInlineFormatting(line);
          elements.push(
            <p key={`para-${sectionIndex}-${lineIndex}`} className="mb-3 leading-relaxed" style={{ fontSize: 'inherit' }}>
              {renderedLine}
            </p>
          );
        }
      });

      return (
        <div key={`section-${sectionIndex}`} className="mb-6 pb-6 border-b border-gray-200 last:border-b-0">
          {elements}
        </div>
      );
    });
  };

  const renderInlineFormatting = (text) => {
    const parts = [];
    let lastIndex = 0;

    // Match bold, italic, underline, and underline tags
    const regex = /(\*\*[^\*]+\*\*|\*[^\*]+\*|<u>[^<]+<\/u>)/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }

      const matched = match[0];

      // Bold
      if (matched.startsWith('**') && matched.endsWith('**')) {
        const boldText = matched.slice(2, -2);
        parts.push(
          <strong key={`bold-${lastIndex}`} className="font-bold">
            {boldText}
          </strong>
        );
      }
      // Underline tag
      else if (matched.startsWith('<u>') && matched.endsWith('</u>')) {
        const underlineText = matched.slice(3, -4);
        parts.push(
          <u key={`underline-${lastIndex}`} className="underline">
            {underlineText}
          </u>
        );
      }
      // Italic
      else if (matched.startsWith('*') && matched.endsWith('*')) {
        const italicText = matched.slice(1, -1);
        parts.push(
          <em key={`italic-${lastIndex}`} className="italic">
            {italicText}
          </em>
        );
      }

      lastIndex = regex.lastIndex;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  return <div className="prose prose-sm max-w-none">{renderContent(content)}</div>;
}
