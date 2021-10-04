import React from 'react';
import { Grid, Header, Divider, Button } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import { PAGE_IDS } from '../utilities/PageIDs';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';

/** A simple static component to render some text for the landing page. */
const Landing = () => (
  <div className="landingPage">
    <div className="landing-center">
      <Grid id={PAGE_IDS.LANDING} verticalAlign='middle' textAlign='center' container centered>
        <Header className="landing-text" as="h1">MINERVA MEDICAL</Header>
      </Grid>
      <Divider section hidden/>
      <Grid columns={2} verticalAlign="top" textAlign="center" container>
        <Grid.Column>
          <Button size="massive" as={NavLink} activeClassName="" exact to="/signup" key='signup' inverted
            style={{ font: 'Lato' }}>REGISTER</Button>
        </Grid.Column>
        <Grid.Column>
          <Button size="massive" as={NavLink} activeClassName="" exact to="/signin" key='signin' inverted
            style={{ font: 'Lato' }}>LOGIN</Button>
        </Grid.Column>
      </Grid>
    </div>
  </div>

);
export default Landing;
