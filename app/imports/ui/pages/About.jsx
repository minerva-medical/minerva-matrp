import React from 'react';
import { Grid, Header, Icon, Item } from 'semantic-ui-react';
import { PAGE_IDS } from '../utilities/PageIDs';

/** A simple static component to render some text for the landing page. */
const About = () => (
  <Grid id={PAGE_IDS.ABOUT_US} verticalAlign='middle' textAlign='center' container centered>
    <Grid.Column width={12}>
      <Header as='h1' icon textAlign='center'>
        <Icon name='users' circular/>
        <Header.Content>About Us</Header.Content>
      </Header>
      <p>Minerva Medical is a project for ICS 414 at UH Manoa, the project page can be seen
        <a href="https://minerva-medical.github.io" target='_blank' rel='noreferrer'> here </a>
        or in the footer below. The application will keep track of supply inventory for the Medical Outreach Clinic.
        The Medical Outreach Clinic (or H.O.M.E project) helps provide medical care to residents around the island
        by means of a a mobile clinic.</p>
    </Grid.Column>

    <Grid.Column width={5}>
      <Header as="h4" icon textAlign="center">
        <Item href="https://github.com/minerva-medical" >
          <Icon link name='github' circular/>
          <a target='_blank' rel='noreferrer'>
          Our GitHub Organization</a>
        </Item>
      </Header>
    </Grid.Column>
    <Grid.Column width={5}>
      <Header as="h4" icon textAlign="center">
        <Item href="https://sites.google.com/view/hawaiihomeproject/about?authuser=0">
          <Icon link name='home' circular/>
          <a target='_blank' rel='noreferrer'>The Hawaii H.O.M.E Project</a>
        </Item>
      </Header>
    </Grid.Column>
  </Grid>
);

export default About;
