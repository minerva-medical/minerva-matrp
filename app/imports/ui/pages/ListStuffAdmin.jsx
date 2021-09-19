import React from 'react';
import { Container, Table, Header, Loader } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Stuffs } from '../../api/stuff/StuffCollection';
import StuffItemAdmin from '../components/StuffItemAdmin';
import { PAGE_IDS } from '../utilities/PageIDs';

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
const ListStuffAdmin = ({ stuffs, ready }) => ((ready) ? (
  <Container id={PAGE_IDS.LIST_STUFF_ADMIN}>
    <Header as="h2" textAlign="center">List Stuff (Admin)</Header>
    <Table celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Name</Table.HeaderCell>
          <Table.HeaderCell>Quantity</Table.HeaderCell>
          <Table.HeaderCell>Condition</Table.HeaderCell>
          <Table.HeaderCell>Owner</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {stuffs.map((stuff) => <StuffItemAdmin key={stuff._id} stuff={stuff} />)}
      </Table.Body>
    </Table>
  </Container>
) : <Loader active>Getting data</Loader>);

// Require an array of Stuff documents in the props.
ListStuffAdmin.propTypes = {
  stuffs: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => {
  // Get access to Stuff documents.
  const subscription = Stuffs.subscribeStuffAdmin();
  // Determine if the subscription is ready
  const ready = subscription.ready();
  // Get the Stuff documents and sort by owner then name
  const stuffs = Stuffs.find({}, { sort: { owner: 1, name: 1 } }).fetch();
  // console.log(stuffs, ready);
  return {
    stuffs,
    ready,
  };
})(ListStuffAdmin);
