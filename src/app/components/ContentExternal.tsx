import React from 'react';
import './ContentExternal.module.scss';

interface ExternalContent {
  html?: string;
  body?: string;
}
interface ExternalPart {
  _entityId: string;
  content: ExternalContent;
}
interface ContentExternalProps {
  part: ExternalPart;
}

const ContentExternal: React.FC<ContentExternalProps> = ({ part }) => {
  const { _entityId, content } = part;

  return (
    <div key={_entityId} className="my-5 p-5">
      <div
        className="content-external"
        dangerouslySetInnerHTML={{ __html: content.html || content.body || '' }}
      />
    </div>
  );
};

export default ContentExternal;
