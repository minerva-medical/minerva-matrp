import React, { useState } from 'react';
import {
  Grid, Button, Segment, Header, Container, GridColumn, Item, ItemGroup, List, ListItem,
  ItemContent, ItemDescription, Modal, ListHeader, Form,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import swal from 'sweetalert';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
import { Vaccinations } from '../../api/vaccination/VaccinationCollection';
import { updateMethod } from '../../api/base/BaseCollection.methods';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
const VaccineInfoPage = ({ info, lotId, expire, locate, quantity, note, brand }) => {

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

  // used for onChange edit notes field
  const handleNoteChange = (event) => {
    setNoteField(event.target.value);
  };

  const submit = (data) => {
    const exists = Vaccinations.findDoc(info._id);
    const { lotIds } = exists;
    const target = lotIds.find(obj => obj.lotId === lotId);
    target.note = data;
    const updateData = { id: info._id, lotIds };
    const collectionName = Vaccinations.getCollectionName();
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
          const collectionName = Vaccinations.getCollectionName();
          const vaccine = info.vaccine;
          const vaccinations = Vaccinations.findOne({ vaccine });
          const { _id, lotIds } = vaccinations;
          const targetIndex = lotIds.findIndex((obj => obj.lotId === option));
          lotIds.splice(targetIndex, 1);
          const updateData = { id: _id, lotIds };
          updateMethod.callPromise({ collectionName, updateData })
            .catch(error => swal('Error', error.message, 'error'))
            .then(() => swal('Success', `${vaccine} updated successfully`, 'success', { buttons: false, timer: 3000 }));

        }
      });
  };
  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button size='mini' circular icon='info' color='linkedin' id={COMPONENT_IDS.VACCINE_INFO_BUTTON}/>}
      size='large'
      id={COMPONENT_IDS.VACCINE_INFO}
    >
      <Modal.Header>Drug Information</Modal.Header>
      <Modal.Content image>
        <Modal.Description>
          <Grid container divided columns='equal' stackable textAlign='justified'>
            <GridColumn width={6}>
              <ItemGroup relaxed>
                <Item>
                  <ItemContent>
                    <Header as='h2'>{info.vaccine}</Header>
                    <ItemDescription>
                      <List size='large'>
                        <ListItem><ListHeader>Brand</ListHeader> {brand}</ListItem>
                        <ListItem><ListHeader>Lot Number</ListHeader>{lotId}</ListItem>
                        <ListItem><ListHeader>Expiration Date</ListHeader>{expire}</ListItem>
                        <ListItem><ListHeader>Minimum Quantity</ListHeader>{info.minQuantity}</ListItem>
                        <ListItem><ListHeader>Quantity in Stock</ListHeader>{quantity}</ListItem>
                        <ListItem><ListHeader>Location</ListHeader>{locate}</ListItem>
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
        <Button color='black' onClick={() => setOpen(false)} id={COMPONENT_IDS.VACCINE_INFO_CLOSE}>
            Close
        </Button>
        <Button
          id={COMPONENT_IDS.VACCINE_EDIT}
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
            <Grid id={COMPONENT_IDS.VACCINE_EDIT_NOTE} container centered>
              <Grid.Column>
                <Header as="h3">{info.vaccine}</Header>
                <Header as="h4" color='grey' style={{ marginTop: '10px' }}>Lot Number: {lotId}</Header>
                <Form>
                  <Form.TextArea color='blue' label='Notes' name='note' onChange={handleNoteChange}
                    defaultValue={noteField}
                    id={COMPONENT_IDS.ADD_VACCINATION_NOTES} style={{ minHeight: 200 }}/>
                </Form>
              </Grid.Column>
            </Grid>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => setSecondOpen(false)} id={COMPONENT_IDS.VACCINE_INFO_EDIT_CLOSE}>
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
VaccineInfoPage.propTypes = {
  info: PropTypes.object.isRequired,
  lotId: PropTypes.string,
  brand: PropTypes.string,
  expire: PropTypes.string,
  quantity: PropTypes.number,
  note: PropTypes.string,
  locate: PropTypes.string,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(VaccineInfoPage);
