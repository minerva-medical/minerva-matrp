import React from 'react';
import {
  Grid, Button, Segment, Header, Container, GridColumn, Item, ItemGroup, List, ListItem, ItemMeta,
  ItemContent, ItemDescription, Modal, ListHeader,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';

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
  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      trigger={<Button size='mini' circular icon='info' color='linkedin' />}
      open={open}
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
                    <Header as='h2'>{info.drug}</Header>
                    <ItemMeta style={font2}>{info.drugType}</ItemMeta>
                    <ItemDescription>
                      <List size='large'>
                        <ListItem><ListHeader>Brand</ListHeader> {info.brand}</ListItem>
                        <ListItem><ListHeader>Lot Number</ListHeader>{info.lotId}</ListItem>
                        <ListItem><ListHeader>Expiration Date</ListHeader>{info.expire}</ListItem>
                        <ListItem><ListHeader>Minimum Quantity</ListHeader>{info.minQuantity}</ListItem>
                        <ListItem><ListHeader>Quantity in Stock:</ListHeader>{info.quantity}</ListItem>
                        <ListItem><ListHeader>tabs or mL</ListHeader>{info.isTabs ? 'tabs' : 'mL'}</ListItem>
                        <ListItem><ListHeader>Storage Location:</ListHeader>{info.location}</ListItem>
                        <ListItem><ListHeader>Purchased?</ListHeader>         {
                          info.purchased ?
                            'Item Purchased'
                            :
                            'Item not purchased'
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
DrugPage.propTypes = {
  info: PropTypes.object.isRequired,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(DrugPage);
