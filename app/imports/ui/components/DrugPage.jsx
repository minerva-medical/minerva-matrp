import React, { useState } from 'react';
import { Grid, Portal, Button, Segment, Header } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
// import { COMPONENT_IDS } from '../utilities/ComponentIDs';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
const Drug = () => {
  const [state, setState] = useState({ open: false });
  const handleClose = () => setState({ open: false });
  const handleOpen = () => setState({ open: true });

  const { open } = state;
  return (
    <Grid columns={2}>
      <Grid.Column>
        <Button
          content='Open Portal'
          disabled={open}
          positive
          onClick={handleOpen}
        />

        <Portal onClose={handleClose} open={open}>
          <Segment
            style={{
              left: '40%',
              position: 'fixed',
              top: '50%',
              zIndex: 1000,
            }}
          >
            <Header>This is a controlled portal</Header>
            <p>Portals have tons of great callback functions to hook into.</p>
            <p>To close, simply click the close button or click away</p>

            <Button
              content='Close Portal'
              negative
              onClick={handleClose}
            />
          </Segment>
        </Portal>
      </Grid.Column>
    </Grid>
  );

};

// Require a document to be passed to this component.
Drug.propTypes = {
  stuff: PropTypes.shape({
    name: PropTypes.string,
    quantity: PropTypes.number,
    condition: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(Drug);
