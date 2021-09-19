import React from 'react';
import { Grid, Loader, Header, Segment } from 'semantic-ui-react';
import swal from 'sweetalert';
import { AutoForm, ErrorsField, HiddenField, NumField, SelectField, SubmitField, TextField } from 'uniforms-semantic';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { useParams } from 'react-router';
import { Stuffs } from '../../api/stuff/StuffCollection';
import { updateMethod } from '../../api/base/BaseCollection.methods';
import { PAGE_IDS } from '../utilities/PageIDs';

const bridge = new SimpleSchema2Bridge(Stuffs._schema);

/** Renders the Page for editing a single document. */
const EditStuff = ({ doc, ready }) => {

  // On successful submit, insert the data.
  const submit = (data) => {
    const { name, quantity, condition, _id } = data;
    const collectionName = Stuffs.getCollectionName();
    const updateData = { id: _id, name, quantity, condition };
    updateMethod.callPromise({ collectionName, updateData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => swal('Success', 'Item updated successfully', 'success'));
  };

  return (ready) ? (
    <Grid id={PAGE_IDS.EDIT_STUFF} container centered>
      <Grid.Column>
        <Header as="h2" textAlign="center">Edit Stuff</Header>
        <AutoForm schema={bridge} onSubmit={data => submit(data)} model={doc}>
          <Segment>
            <TextField name='name' />
            <NumField name='quantity' decimal={false} />
            <SelectField name='condition' />
            <SubmitField value='Submit' />
            <ErrorsField />
            <HiddenField name='owner' />
          </Segment>
        </AutoForm>
      </Grid.Column>
    </Grid>
  ) : <Loader active>Getting data</Loader>;
};

// Require the presence of a Stuff document in the props object. Uniforms adds 'model' to the props, which we use.
EditStuff.propTypes = {
  doc: PropTypes.object,
  ready: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const { _id } = useParams();
  const documentId = _id;
  // Get access to Stuff documents.
  const subscription = Stuffs.subscribeStuff();
  // Determine if the subscription is ready
  const ready = subscription.ready();
  // Get the document
  const doc = Stuffs.findDoc(documentId);
  return {
    doc,
    ready,
  };
})(EditStuff);
