import React from 'react';
import {
  Grid, Button, Segment, Header, Container, GridColumn, Item, ItemGroup, List, ListItem,
  ItemContent, ItemDescription, Modal, ListHeader, Divider, Loader,
} from 'semantic-ui-react';
import swal from 'sweetalert';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { AutoForm, ErrorsField, HiddenField, LongTextField, SubmitField, TextField } from 'uniforms-semantic';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
import { Historicals } from '../../api/historical/HistoricalCollection';
import { updateMethod } from '../../api/base/BaseCollection.methods';

/** Renders a single row in the History Dispense Log table. See pages/DispenseLog.jsx. */

const bridge = new SimpleSchema2Bridge(Historicals._schema);

const DispenseInfoPage = ({ record, ready }) => {
  const [open, setOpen] = React.useState(false);
  const [secondOpen, setSecondOpen] = React.useState(false);
  // On successful submit, insert the data.

  const submit = (data) => {
    const { drug, brand, lotId, expire, quantity, isTabs, dateDispensed, dispensedFrom, dispensedTo, site, note, _id } = data;
    const collectionName = Historicals.getCollectionName();
    const updateData = { record: _id, drug, brand, lotId, expire, quantity, isTabs, dateDispensed, dispensedFrom, dispensedTo, site, note };
    updateMethod.callPromise({ collectionName, updateData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => swal('Success', 'Item updated successfully', 'success'));
    console.log(updateData);
  };

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

  return (ready) ? (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button size='mini' circular icon='info' color='linkedin'/>}
      size='large'
      id={COMPONENT_IDS.DRUG_PAGE}
    >
      <Modal.Header>Dispense Log Information</Modal.Header>
      <Modal.Content image>
        <Modal.Description>
          <Grid container divided columns='equal' stackable textAlign='justified'>
            <GridColumn width={6}>
              <ItemGroup relaxed>
                <Item>
                  <ItemContent>
                    <Header as='h2'>{record.drug}</Header>
                    <Divider/>
                    <ItemDescription>
                      <List size='large'>
                        <ListItem><ListHeader>Brand</ListHeader> {record.brand}</ListItem>
                        <ListItem><ListHeader>Lot Number</ListHeader>{record.lotId}</ListItem>
                        <ListItem><ListHeader>Expiration Date</ListHeader>{record.expire}</ListItem>
                        <ListItem><ListHeader>Dispense Location:</ListHeader>{record.site}</ListItem>
                        <Divider/>
                        <ListItem>
                          <ListHeader>Quantity Dispensed</ListHeader>{record.quantity} {record.isTabs ? 'tabs' : 'mL'}
                        </ListItem>
                        <ListItem><ListHeader>Patient Number</ListHeader>{record.dispensedTo}</ListItem>
                        <ListItem><ListHeader>Date Dispensed</ListHeader>{record.dateDispensed.toLocaleString()}</ListItem>
                        <ListItem><ListHeader>Dispensed By</ListHeader>{record.dispensedFrom}</ListItem>
                        <br/>
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
                        <ItemDescription style={font1}>{record.note}</ItemDescription>
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
        <Button color='black' floated= 'left' onClick={() => setOpen(false)}>Close</Button>
        <Button
          className={COMPONENT_IDS.DRUG_EDIT}
          content="Edit"
          labelPosition='right'
          icon='edit'
          onClick={() => setSecondOpen(true)}
          color='linkedin'
          size='small'
        />
      </Modal.Actions>
      <Modal
        onClose={() => setSecondOpen(false)}
        open={secondOpen}
      >
        <Modal.Header>Edit Notes</Modal.Header>
        <Modal.Content>
          <AutoForm schema={bridge} onSubmit={data => submit(data)} model={record}>
            <TextField name='drug' />
            <HiddenField name='brand' />
            <HiddenField name='lotId' />
            <HiddenField name='expire' />
            <HiddenField name='quantity' decimal={false} hidden/>
            <HiddenField name='isTabs'/>
            <HiddenField name='dateDispensed'/>
            <TextField name='dispensedFrom' readOnly/>
            <HiddenField name='dispensedTo'/>
            <HiddenField name='site'/>
            <LongTextField name='note' style={{ color: 'lightblue' }}/>
            <ErrorsField />
            <SubmitField value='Submit'/>
          </AutoForm>
        </Modal.Content>
        <Modal.Actions>
          <Button
            content='Close'
            color = 'black'
            floated = 'right'
            onClick={() => setSecondOpen(false)}
          />
        </Modal.Actions>
      </Modal>
    </Modal>
  ) : <Loader active>Getting data</Loader>;
};

// Require a document to be passed to this component.
DispenseInfoPage.propTypes = {
  record: PropTypes.object.isRequired,
  ready: PropTypes.bool.isRequired,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withTracker(() => {
  const subscription = Historicals.subscribeHistorical();
  const ready = subscription.ready();
  return {
    ready,
  };

})(DispenseInfoPage);
