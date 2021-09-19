import React from 'react';
import { Container, Table, Header, Loader } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Stuffs } from '../../api/stuff/StuffCollection';
import StuffItem from '../components/StuffItem';
import { PAGE_IDS } from '../utilities/PageIDs';

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
const ListStuff = ({ ready, stuffs }) => ((ready) ? (
  <Container id={PAGE_IDS.LIST_STUFF}>
    <Header as="h2" textAlign="center">List Stuff</Header>
    <Table celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Name</Table.HeaderCell>
          <Table.HeaderCell>Quantity</Table.HeaderCell>
          <Table.HeaderCell>Condition</Table.HeaderCell>
          <Table.HeaderCell>Edit</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {stuffs.map((stuff) => <StuffItem key={stuff._id} stuff={stuff} />)}
      </Table.Body>
    </Table>
  </Container>
) : <Loader active>Getting data</Loader>);

// Require an array of Stuff documents in the props.
ListStuff.propTypes = {
  stuffs: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => {
  // Get access to Stuff documents.
  const subscription = Stuffs.subscribeStuff();
  // Determine if the subscription is ready
  const ready = subscription.ready();
  // Get the Stuff documents and sort them by name.
  const stuffs = Stuffs.find({}, { sort: { name: 1 } }).fetch();
  return {
    stuffs,
    ready,
  };
})(ListStuff);
