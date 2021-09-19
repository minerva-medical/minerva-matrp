import React from 'react';
import { Message } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const UploadFixtureResult = ({ error, message }) => {
  if (error) {
    return (
      <Message negative>
        <Message.Header>Error loading fixture</Message.Header>
        <p>{message}</p>
      </Message>
    );
  }
  return (
    <Message positive>
      <Message.Header>Success loading fixture</Message.Header>
      <p>{message}</p>
    </Message>
  );
};

UploadFixtureResult.propTypes = {
  error: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
};

export default UploadFixtureResult;
