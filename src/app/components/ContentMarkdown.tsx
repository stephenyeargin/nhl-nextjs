import React from 'react';
import { formatMarkdownContent } from '../utils/formatters';

interface MarkdownPart {
  _entityId: string;
  content: string;
}
interface ContentMarkdownProps {
  part: MarkdownPart;
}

const ContentMarkdown: React.FC<ContentMarkdownProps> = ({ part }) => {
  const { _entityId, content } = part;

  return (
    <div key={_entityId} className="my-5">
      <div dangerouslySetInnerHTML={{ __html: formatMarkdownContent(content) }} />
    </div>
  );
};

export default ContentMarkdown;
