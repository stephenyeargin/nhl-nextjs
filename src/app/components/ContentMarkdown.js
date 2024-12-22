import React from 'react';
import PropTypes from 'prop-types';
import { formatMarkdownContent } from '../utils/formatters';

const ContentMarkdown = ({ part }) => {

  const { _entityId, content } = part;

  return (
    <div key={_entityId} className="my-5">
      <div dangerouslySetInnerHTML={{ __html: formatMarkdownContent(content) }} />
    </div>
  );
};

ContentMarkdown.propTypes = {
  part: PropTypes.shape({
    _entityId: PropTypes.string,
    content: PropTypes.string,
  }),
};

export default ContentMarkdown;
