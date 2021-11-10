import React from 'react';
import {
  Grid, Button, Segment, Header, Container, GridColumn, Item, ItemGroup, List, ListItem, ItemMeta,
  ItemContent, ItemDescription, Modal, ListHeader,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import swal from 'sweetalert';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
import { Medications } from '../../api/medication/MedicationCollection';
import { removeItMethod } from '../../api/base/BaseCollection.methods';
// import { COMPONENT_IDS } from '../utilities/ComponentIDs';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
const DrugPage = ({ info }) => {
  const [open, setOpen] = React.useState(false);
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

  const deleteOption = (option, id) => {
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
          // if an existing medication uses the drug type
          removeItMethod.callPromise({ collectionName, instance: id })
            .catch(error => swal('Error', error.message, 'error'))
            .then(() => {
              swal('Success', `${option} deleted successfully`, 'success', { buttons: false, timer: 3000 });
            });

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
                        <ListItem><ListHeader>Brand</ListHeader> {info.brand}</ListItem>
                        <ListItem><ListHeader>Lot Number</ListHeader>{info.lotId}</ListItem>
                        <ListItem><ListHeader>Expiration Date</ListHeader>{info.expire}</ListItem>
                        <ListItem><ListHeader>Minimum Quantity</ListHeader>{info.minQuantity}</ListItem>
                        <ListItem><ListHeader>Quantity in Stock:</ListHeader>{info.quantity}</ListItem>
                        <ListItem><ListHeader>tabs or mL</ListHeader>{info.unit}</ListItem>
                        <ListItem><ListHeader>Storage Location:</ListHeader>{info.location}</ListItem>
                        <ListItem><ListHeader>Donated?</ListHeader>         {
                          info.donated ?
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
                        <ItemDescription style={font1}>{info.note}</ItemDescription>
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
          onClick={() => setOpen(false)}
          color='linkedin'
          as={Link} to={`/edit/${info._id}`}
        />
        <Button
          content="Delete"
          labelPosition='right'
          icon='trash alternate'
          color='red'
          onClick={() => deleteOption(info.drug, info._id)}
        />
      </Modal.Actions>
    </Modal>

  );

};

// Require a document to be passed to this component.
DrugPage.propTypes = {
  info: PropTypes.object.isRequired,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(DrugPage);
