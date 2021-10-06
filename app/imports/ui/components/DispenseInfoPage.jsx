import React from 'react';
import {
  Grid, Button, Segment, Header, Container, GridColumn, Item, ItemGroup, List, ListItem, ItemMeta,
  ItemContent, ItemDescription, Modal, ListHeader, Divider,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
// import { COMPONENT_IDS } from '../utilities/ComponentIDs';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
const DispenseInfoPage = ({ record }) => {
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
  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button size='mini' circular icon='info' color='linkedin'/>}
      size='large'
      dimmer='blurring'
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
                    <ItemMeta style={font2}>{record.drugType}</ItemMeta>
                    <Divider/>
                    <ItemDescription>
                      <List size='large'>
                        <ListItem><ListHeader>Brand</ListHeader> {record.brand}</ListItem>
                        <ListItem><ListHeader>Lot Number</ListHeader>{record.lotId}</ListItem>
                        <ListItem><ListHeader>Expiration Date</ListHeader>{record.expire}</ListItem>
                        <ListItem><ListHeader>Storage Location:</ListHeader>{record.location}</ListItem>
                        <Divider/>
                        <ListItem>
                          <ListHeader>Quantity Dispensed</ListHeader>{record.quantity} {record.isTabs ? 'tabs' : 'mL'}
                        </ListItem>
                        <List.Item><ListHeader>Patient Number</ListHeader>{record.dispensedTo}</List.Item>
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
        <Button color='black' onClick={() => setOpen(false)}>
            Close
        </Button>
        <Button
          className={COMPONENT_IDS.DRUG_EDIT}
          content="Edit"
          labelPosition='right'
          icon='edit'
          onClick={() => setOpen(false)}
          color='linkedin'
          // as={Link} to={`/edit/${info._id}`}
        />
      </Modal.Actions>
    </Modal>

  );

};

// Require a document to be passed to this component.
DispenseInfoPage.propTypes = {
  record: PropTypes.object.isRequired,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(DispenseInfoPage);
