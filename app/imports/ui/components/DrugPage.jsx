import React from 'react';
import {
  Grid, Button, Segment, Header, Container, GridColumn, Item, ItemGroup, List, ListItem, ItemMeta,
  ItemContent, ItemDescription, Modal, Icon,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
// import { COMPONENT_IDS } from '../utilities/ComponentIDs';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
const DrugPage = (drug) => {
  const [open, setOpen] = React.useState(false);
  const notes = {
    backgroundColor: '#CCE8F5',
    borderRadius: '15px',
    marginTop: '15px',
    marginLeft: '10px',
    marginRight: '110px',
  };
  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button size='mini' circular icon='info' color='linkedin' />}
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
                    <Header as='h2'>{drug.drug}</Header>
                    <ItemMeta>{drug.drugType}</ItemMeta>
                    <ItemDescription>
                      <List size='large'>
                        <ListItem>Brand: {drug.brand}</ListItem>
                        <ListItem>Lot Number: {drug.lotId}</ListItem>
                        <ListItem>Expiration Date: {drug.expire}</ListItem>
                        <ListItem>Quantity: {drug.quantity}{drug.minQuantity}</ListItem>
                        <ListItem>tabs or mL: {drug.isTabs ? 'tabs' : 'mL'}</ListItem>
                        <ListItem>Storage Location: </ListItem>
                        <ListItem>Received:         {
                          drug.purchased ?
                            <Icon name='check' color='green'/>
                            :
                            <Icon name='x' color='red'/>
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
                        <ItemDescription>{drug.note}</ItemDescription>
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
          as={Link} to={`/edit/${drug._id}`}
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
