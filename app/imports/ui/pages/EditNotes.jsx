import React from 'react';
import { Grid, Loader, Header, Segment } from 'semantic-ui-react';
import swal from 'sweetalert';
import { AutoForm, ErrorsField, HiddenField, SubmitField, TextField } from 'uniforms-semantic';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { useParams } from 'react-router';
import { Medications } from '../../api/medication/MedicationCollection';
import { updateMethod } from '../../api/base/BaseCollection.methods';
import { PAGE_IDS } from '../utilities/PageIDs';

const bridge = new SimpleSchema2Bridge(Medications._schema);

/** Renders the Page for editing a single document. */
const EditNotes = ({ doc, ready }) => {

  // On successful submit, insert the data.
  const submit = (data) => {
    const { drug, drugType, brand, lotId, expire, minQuantity, quantity, isTabs, location, purchased, note, _id } = data;
    const collectionName = Medications.getCollectionName();
    const updateData = { id: _id, drug, drugType, brand, lotId, expire, minQuantity, quantity, isTabs, location, purchased, note };
    updateMethod.callPromise({ collectionName, updateData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => swal('Success', 'Item updated successfully', 'success'));
    console.log(updateData);
  };

  return (ready) ? (
    <Grid id={PAGE_IDS.EDIT_STUFF} container centered>
      <Grid.Column>
        <Header as="h2" textAlign="center">Edit Stuff</Header>
        <AutoForm schema={bridge} onSubmit={data => submit(data)} model={doc}>
          <Segment>
            <HiddenField name='drug' />
            <HiddenField name='drugType' />
            <HiddenField name='brand' />
            <HiddenField name='lotId' />
            <HiddenField name='expire' />
            <HiddenField name='minQuantity' decimal={false} />
            <HiddenField name='quantity' decimal={false} />
            <HiddenField name='isTabs'/>
            <HiddenField name='location' />
            <HiddenField name='purchased'/>
            <TextField name='note' />
            <SubmitField value='Submit' />
            <ErrorsField />
          </Segment>
        </AutoForm>
      </Grid.Column>
    </Grid>
  ) : <Loader active>Getting data</Loader>;
};

// Require the presence of a Stuff document in the props object. Uniforms adds 'model' to the props, which we use.
EditNotes.propTypes = {
  doc: PropTypes.object,
  ready: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const { _id } = useParams();
  const documentId = _id;
  // Get access to Stuff documents.
  const subscription = Medications.subscribeMedication();
  // Determine if the subscription is ready
  const ready = subscription.ready();
  // Get the document
  const doc = Medications.findDoc(documentId);
  return {
    doc,
    ready,
  };
})(EditNotes);
