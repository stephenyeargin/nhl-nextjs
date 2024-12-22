import React from 'react';
import PropTypes from 'prop-types';

const ContentExternal = ({ part }) => {
  const { _entityId, content } = part;

  return (
    <div key={_entityId} className="my-5 p-5">
      <div dangerouslySetInnerHTML={{ __html: content.html }} />
    </div>
  );
};

ContentExternal.propTypes = {
  part: PropTypes.shape({
    _entityId: PropTypes.string,
    content: PropTypes.shape({
      html: PropTypes.string,
    }),
  }),
};

export default ContentExternal;
