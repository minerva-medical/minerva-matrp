import React, { useState } from 'react';
import { Grid, Portal, Button, Segment, Header, Container, GridColumn, Item, ItemGroup, List, ListItem, ItemMeta,
  ItemContent, ItemExtra, ItemDescription } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
// import { COMPONENT_IDS } from '../utilities/ComponentIDs';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
const Drug = () => {
  const [state, setState] = useState({ open: false });
  const handleClose = () => setState({ open: false });
  const handleOpen = () => setState({ open: true });
  const { open } = state;

  const notes = {
    backgroundColor: '#DCDED1',
    borderRadius: '15px',
    padding: '20px',
    marginTop: '15px',
    marginLeft: '10px',
    marginRight: '-40px',
  };
  return (
    <Grid columns={2}>
      <Grid.Column>
        <Button
          content='Open Portal'
          disabled={open}
          positive
          onClick={handleOpen}
        />

        <Portal onClose={handleClose} open={open}>
          <Segment
            style={{
              left: '8%',
              position: 'fixed',
              top: '15%',
              zIndex: 1000,
              backgroundColor: 'white',
              borderRadius: '15px',
              paddingBottom: '30px',
              paddingLeft: '50px',
              paddingRight: '70px',
            }}
          >
            <Container>
              <Header as="h2" textAlign="center" style={{ paddingBottom: '20px', paddingTop: '20px' }}>Drug</Header>

              <Grid container divided columns='equal' stackable textAlign='justified'>
                <GridColumn>
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
                        <ItemExtra>
                          <Button size='medium'>Edit</Button>
                        </ItemExtra>
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
                                stroke. Prescribed as take 1 tab daily.
                            </ItemDescription>
                          </ItemContent>
                        </Item>
                      </ItemGroup>
                    </Container>
                  </Segment>
                </GridColumn>
              </Grid>
            </Container>
          </Segment>
        </Portal>
      </Grid.Column>
    </Grid>
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
