import React from 'react';
import {
  Grid, Button, Segment, Header, Container, GridColumn, Item, ItemGroup, List, ListItem,
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

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button size='mini' circular icon='info' color='linkedin' id={COMPONENT_IDS.DISPENSE_INFO_BUTTON}/>}
      size='large'
      dimmer='blurring'
      id={COMPONENT_IDS.DISPENSE_INFO}
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
                          <ListHeader>Quantity Dispensed</ListHeader>{record.quantity} {record.unit}
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
        <Button color='black' onClick={() => setOpen(false)} id={COMPONENT_IDS.DISPENSE_INFO_BUTTON}> Close</Button>
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
