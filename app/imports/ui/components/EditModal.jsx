import React from 'react';
import {
  Grid, Button, Segment, Header, Modal, Loader,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { AutoForm, ErrorsField, SubmitField, LongTextField, TextField, NumField, HiddenField } from 'uniforms-semantic';
// import { withRouter } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { useParams } from 'react-router';
import swal from 'sweetalert';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
import { Medications } from '../../api/medication/MedicationCollection';
import { updateMethod } from '../../api/base/BaseCollection.methods';
import { PAGE_IDS } from '../utilities/PageIDs';

const bridge = new SimpleSchema2Bridge(Medications._schema);

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
const EditModal = ({ doc, ready }) => {
  const [open, setOpen] = React.useState(false);

  const submit = (data) => {
    const { drug, drugType, brand, lotId, expire, minQuantity, quantity, unit, location, donated, note, _id } = data;
    const collectionName = Medications.getCollectionName();
    const updateData = {
      id: _id,
      drug,
      drugType,
      brand,
      lotId,
      expire,
      minQuantity,
      quantity,
      unit,
      location,
      donated,
      note,
    };
    updateMethod.callPromise({ collectionName, updateData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => swal('Success', 'Item updated successfully', 'success'));
  };

  return (ready) ? (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button size='mini' circular icon='info' color='linkedin' id={COMPONENT_IDS.DRUG_PAGE_BUTTON}/>}
      size='large'
      id={COMPONENT_IDS.DRUG_PAGE}
    >
      <Modal.Header>Drug Information</Modal.Header>
      <Modal.Content image>
        <Modal.Description>
          <Grid id={PAGE_IDS.EDIT_STUFF} container centered>
            <Grid.Column>
              <Header as="h2" textAlign="center">Edit Notes</Header>

              <AutoForm schema={bridge} onSubmit={data => submit(data)} model={doc}>
                <Segment>
                  <TextField name='drug' readOnly/>
                  <TextField name='drugType' readOnly/>
                  <TextField name='brand' readOnly/>
                  <TextField name='lotId' readOnly/>
                  <TextField name='expire' readOnly/>
                  <NumField name='minQuantity' decimal={false} readOnly/>
                  <NumField name='quantity' decimal={false} readOnly/>
                  <HiddenField name='unit'/>
                  <TextField name='location' readOnly/>
                  <HiddenField name='donated' readOnly/>
                  <LongTextField name='note' style={{ color: 'lightblue' }}/>
                  <SubmitField value='Submit'/>
                  <ErrorsField />
                </Segment>
              </AutoForm>
            </Grid.Column>
          </Grid>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button color='black' onClick={() => setOpen(false)} id={COMPONENT_IDS.DRUG_CLOSE}>
            Close
        </Button>
      </Modal.Actions>
    </Modal>
  ) : <Loader active>Getting data</Loader>;

};

// Require a document to be passed to this component.
EditModal.propTypes = {
  doc: PropTypes.object,
  ready: PropTypes.bool.isRequired,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
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
})(EditModal);
