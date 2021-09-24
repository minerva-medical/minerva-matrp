import React from 'react';
import {
  Grid, Button, Segment, Header, Container, GridColumn, Item, ItemGroup, List, ListItem, ItemMeta,
  ItemContent, ItemDescription, Modal,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
// import { COMPONENT_IDS } from '../utilities/ComponentIDs';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
const Drug = () => {
  const [open, setOpen] = React.useState(false);
  const notes = {
    backgroundColor: '#CCE8F5',
    borderRadius: '15px',
    marginTop: '15px',
    marginLeft: '10px',
    marginRight: '100px',
  };
  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button>Show Modal</Button>}
      size='large'
      dimmer='blurring'
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
                    <Header as='h2'> Aspirin 81 mg</Header>
                    <ItemMeta>Nonsteroidal anti-inflammatory drug (NSAID)</ItemMeta>
                    <ItemDescription>
                      <List size='large'>
                        <ListItem>Brand: Bayer</ListItem>
                        <ListItem>Lot Number: 123456</ListItem>
                        <ListItem>Expiration Date: 09/16/2021</ListItem>
                        <ListItem>Quantity: 30 tabs</ListItem>
                        <ListItem>Supply: 300</ListItem>
                        <ListItem>Storage Location: Case 4</ListItem>
                        <ListItem>Received: Purchased</ListItem> <br/>
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
                        <ItemDescription>To be prescribed to patients that are at risk for myocardial infarction or
                              stroke. Prescribed as take 1 tab daily. Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                          quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
                          dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
                          sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </ItemDescription>
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
          content="Edit"
          labelPosition='right'
          icon='edit'
          onClick={() => setOpen(false)}
          color='linkedin'
          as={Link} to='/add'
        />
      </Modal.Actions>
    </Modal>

  );

};

// Require a document to be passed to this component.
Drug.propTypes = {
  stuff: PropTypes.shape({
    name: PropTypes.string,
    quantity: PropTypes.number,
    condition: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(Drug);
