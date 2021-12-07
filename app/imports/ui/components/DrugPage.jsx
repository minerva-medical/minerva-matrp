import React, { useState } from 'react';
import {
  Grid, Button, Segment, Header, Container, GridColumn, Item, ItemGroup, List, ListItem, ItemMeta,
  ItemContent, ItemDescription, Modal, ListHeader, Form,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import swal from 'sweetalert';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
import { Medications } from '../../api/medication/MedicationCollection';
import { updateMethod } from '../../api/base/BaseCollection.methods';
import { PAGE_IDS } from '../utilities/PageIDs';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
const DrugPage = ({ info, lotId, brand, expire, quantity, note, donated, locate }) => {

  // useState for note field when editing notes.
  const [noteField, setNoteField] = useState(note);

  // useState to open and close modals
  const [open, setOpen] = React.useState(false);
  const [secondOpen, setSecondOpen] = React.useState(false);
  const notes = {
    backgroundColor: '#CCE8F5',
    borderRadius: '15px',
    marginTop: '15px',
    marginLeft: '10px',
    marginRight: '110px',
  };

  const font1 = {
    fontSize: '16px',
  };

  const font2 = {
    fontSize: '15px',
  };

  // used for onChange edit notes field
  const handleNoteChange = (event) => {
    setNoteField(event.target.value);
  };

  const submit = (data) => {
    const exists = Medications.findDoc(info._id);
    const { lotIds } = exists;
    const target = lotIds.find(obj => obj.lotId === lotId);
    target.note = data;
    const updateData = { id: info._id, lotIds };
    const collectionName = Medications.getCollectionName();
    updateMethod.callPromise({ collectionName, updateData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => swal('Success', 'Item updated successfully', 'success'));
  };

  const deleteOption = (option) => {
    swal({
      title: 'Are you sure?',
      text: `Do you really want to delete ${option}?`,
      icon: 'warning',
      buttons: [
        'No, cancel it!',
        'Yes, I am sure!',
      ],
      dangerMode: true,
    })
      .then((isConfirm) => {
        // if 'yes'
        if (isConfirm) {
          const collectionName = Medications.getCollectionName();
          const drug = info.drug;
          const medications = Medications.findOne({ drug });
          const { _id, lotIds } = medications;
          const targetIndex = lotIds.findIndex((obj => obj.lotId === option));
          lotIds.splice(targetIndex, 1);
          const updateData = { id: _id, lotIds };
          updateMethod.callPromise({ collectionName, updateData })
            .catch(error => swal('Error', error.message, 'error'))
            .then(() => swal('Success', `${drug} updated successfully`, 'success', { buttons: false, timer: 3000 }));

        }
      });
  };
  return (
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
          <Grid container divided columns='equal' stackable textAlign='justified'>
            <GridColumn width={6}>
              <ItemGroup relaxed>
                <Item>
                  <ItemContent>
                    <Header as='h2'>{info.drug}</Header>
                    <ItemMeta style={font2}>{info.drugType}</ItemMeta>
                    <ItemDescription>
                      <List size='large'>
                        <ListItem><ListHeader>Brand</ListHeader> {brand}</ListItem>
                        <ListItem><ListHeader>Lot Number</ListHeader>{lotId}</ListItem>
                        <ListItem><ListHeader>Expiration Date</ListHeader>{expire}</ListItem>
                        <ListItem><ListHeader>Minimum Quantity</ListHeader>{info.minQuantity}</ListItem>
                        <ListItem><ListHeader>Quantity in Stock</ListHeader>{quantity}</ListItem>
                        <ListItem><ListHeader>Location</ListHeader>{locate}</ListItem>
                        <ListItem><ListHeader>tabs or mL</ListHeader>{info.unit}</ListItem>
                        <ListItem><ListHeader>Donated?</ListHeader> {
                          donated ?
                            'Item donated'
                            :
                            'Item not donated'
                        }</ListItem> <br/>
                      </List>
                    </ItemDescription>
                  </ItemContent>
                </Item>
              </ItemGroup>
            </GridColumn>
            <GridColumn>
              <Segment style={notes}>
                <Container fluid>
                  <ItemGroup>
                    <Item>
                      <ItemContent>
                        <Header as='h3'>Notes</Header>
                        <ItemDescription style={font1}>{note}</ItemDescription>
                      </ItemContent>
                    </Item>
                  </ItemGroup>
                </Container>
              </Segment>
            </GridColumn>
          </Grid>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button color='black' onClick={() => setOpen(false)} id={COMPONENT_IDS.DRUG_CLOSE}>
            Close
        </Button>
        <Button
          id={COMPONENT_IDS.DRUG_EDIT}
          content="Edit"
          labelPosition='right'
          icon='edit'
          onClick={() => setSecondOpen(true)}
          color='linkedin'
        />
        <Button
          content="Delete"
          labelPosition='right'
          icon='trash alternate'
          color='red'
          onClick={() => deleteOption(lotId)}
        />
      </Modal.Actions>
      <Modal
        onClose={() => setSecondOpen(false)}
        open={secondOpen}
        size='small'
      >
        <Modal.Header>Edit Notes</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <Grid id={PAGE_IDS.EDIT_STUFF} container centered>
              <Grid.Column>
                <Header as="h3">{info.drug}</Header>
                <Header as="h4" color='grey' style={{ marginTop: '10px' }}>Lot Number: {lotId}</Header>
                <Form>
                  <Form.TextArea color='blue' label='Notes' name='note' onChange={handleNoteChange}
                    defaultValue={noteField}
                    id={COMPONENT_IDS.ADD_MEDICATION_NOTES} style={{ minHeight: 200 }}/>
                </Form>
              </Grid.Column>
            </Grid>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => setSecondOpen(false)} id={COMPONENT_IDS.EDIT_CLOSE}>
            Close
          </Button>
          <Button
            icon='check'
            content='Save Changes'
            onClick={() => submit(noteField)}
            color='linkedin'
          />
        </Modal.Actions>
      </Modal>
    </Modal>

  );

};

// Require a document to be passed to this component.
DrugPage.propTypes = {
  info: PropTypes.object.isRequired,
  lotId: PropTypes.string,
  brand: PropTypes.string,
  expire: PropTypes.string,
  quantity: PropTypes.number,
  note: PropTypes.string,
  locate: PropTypes.string,
  donated: PropTypes.bool,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(DrugPage);
