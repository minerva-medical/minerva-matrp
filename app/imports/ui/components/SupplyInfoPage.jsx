import React, { useState } from 'react';
import {
  Grid, Button, Segment, Header, Container, GridColumn, Item, ItemGroup, List, ListItem,
  ItemContent, ItemDescription, Modal, ListHeader, Form,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import swal from 'sweetalert';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
import { Supplys } from '../../api/supply/SupplyCollection';
import { updateMethod } from '../../api/base/BaseCollection.methods';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
const SupplyInfoPage = ({ info, locate, quantity, note, donatedBy }) => {

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
    const exists = Supplys.findDoc(info._id);
    const { stock } = exists;
    const target = stock.find(obj => obj.location === locate);
    target.note = data;
    const updateData = { id: info._id, stock };
    const collectionName = Supplys.getCollectionName();
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
          const collectionName = Supplys.getCollectionName();
          const supply = info.supply;
          const supplies = Supplys.findOne({ supply });
          const { _id, stock } = supplies;
          const targetIndex = stock.findIndex((obj => obj.location === option));
          stock.splice(targetIndex, 1);
          const updateData = { id: _id, stock };
          updateMethod.callPromise({ collectionName, updateData })
            .catch(error => swal('Error', error.message, 'error'))
            .then(() => swal('Success', `${supply} updated successfully`, 'success', { buttons: false, timer: 3000 }));

        }
      });
  };
  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button size='mini' circular icon='info' color='linkedin' id={COMPONENT_IDS.SUPPLY_INFO_BUTTON}/>}
      size='large'
      id={COMPONENT_IDS.SUPPLY_INFO}
    >
      <Modal.Header>Drug Information</Modal.Header>
      <Modal.Content image>
        <Modal.Description>
          <Grid container divided columns='equal' stackable textAlign='justified'>
            <GridColumn width={6}>
              <ItemGroup relaxed>
                <Item>
                  <ItemContent>
                    <Header as='h2'>{info.supply}</Header>
                    <ItemDescription>
                      <List size='large'>
                        <ListItem><ListHeader>Supply Type</ListHeader> {info.supplyType}</ListItem>
                        <ListItem><ListHeader>Minimum Quantity</ListHeader>{info.minQuantity}</ListItem>
                        <ListItem><ListHeader>Quantity in Stock</ListHeader>{quantity}</ListItem>
                        <ListItem><ListHeader>Location</ListHeader>{locate}</ListItem>
                        <ListItem><ListHeader>Donated By</ListHeader>{donatedBy}</ListItem>
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
        <Button color='black' onClick={() => setOpen(false)} id={COMPONENT_IDS.SUPPLY_INFO_CLOSE}>
            Close
        </Button>
        <Button
          id={COMPONENT_IDS.SUPPLY_INFO_EDIT}
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
          onClick={() => deleteOption(locate)}
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
            <Grid id={COMPONENT_IDS.SUPPLY_EDIT_NOTE} container centered>
              <Grid.Column>
                <Header as="h3">{info.supply}</Header>
                <Header as="h4" color='grey' style={{ marginTop: '10px' }}>Location: {locate}</Header>
                <Form>
                  <Form.TextArea color='blue' label='Notes' name='note' onChange={handleNoteChange}
                    defaultValue={noteField}
                    id={COMPONENT_IDS.ADD_SUPPLY_INFO_NOTES} style={{ minHeight: 200 }}/>
                </Form>
              </Grid.Column>
            </Grid>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color='black' onClick={() => setSecondOpen(false)} id={COMPONENT_IDS.SUPPLY_INFO_EDIT_CLOSE}>
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
SupplyInfoPage.propTypes = {
  info: PropTypes.object.isRequired,
  quantity: PropTypes.number,
  note: PropTypes.string,
  locate: PropTypes.string,
  donatedBy: PropTypes.string,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(SupplyInfoPage);
