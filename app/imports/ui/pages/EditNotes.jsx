import React from 'react';
import { Grid, Loader, Header, Segment } from 'semantic-ui-react';
import swal from 'sweetalert';
import { AutoForm, ErrorsField, HiddenField, SubmitField, LongTextField, TextField, NumField } from 'uniforms-semantic';
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

  const style = {
    borderRadius: '50px',
    width: '800px',
    marginLeft: '160px',
  };

  const button = {
    borderRadius: '30px',
    marginLeft: '0px',
    width: '80px',
    color: 'linkedin',
  };
  return (ready) ? (
    <Grid id={PAGE_IDS.EDIT_STUFF} container centered>
      <Grid.Column>
        <Header as="h2" textAlign="center">Edit Notes</Header>

        <AutoForm schema={bridge} onSubmit={data => submit(data)} model={doc} style={style}>
          <Segment>
            <TextField name='drug' readOnly/>
            <TextField name='drugType' readOnly/>
            <TextField name='brand' readOnly/>
            <TextField name='lotId' readOnly/>
            <TextField name='expire' readOnly/>
            <NumField name='minQuantity' decimal={false} readOnly/>
            <NumField name='quantity' decimal={false} readOnly/>
            <HiddenField name='isTabs'/>
            <TextField name='location' readOnly/>
            <HiddenField name='purchased'readOnly/>
            <LongTextField name='note' style={{ color: 'lightblue' }}/>
            <SubmitField value='Submit' style={button}/>
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
