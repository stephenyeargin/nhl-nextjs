import React from 'react';
import PropTypes from 'prop-types';
import './ContentExternal.scss';

const ContentExternal = ({ part }) => {
  const { _entityId, content } = part;

  return (
    <div key={_entityId} className="my-5 p-5">
      <div className="content-external" dangerouslySetInnerHTML={{ __html: content.html || content.body }} />
    </div>
  );
};

ContentExternal.propTypes = {
  part: PropTypes.shape({
    _entityId: PropTypes.string,
    content: PropTypes.shape({
      html: PropTypes.string,
      body: PropTypes.string,
    }),
  }),
};

export default ContentExternal;
