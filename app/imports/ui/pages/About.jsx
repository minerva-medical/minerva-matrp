import React from 'react';
import { Grid, Header, Icon, Image } from 'semantic-ui-react';
import { PAGE_IDS } from '../utilities/PageIDs';

/** A simple static component to render some text for the landing page. */
const About = () => (
  <div>
    <Grid id={PAGE_IDS.ABOUT_US} verticalAlign='middle' textAlign='center' container centered>
      <Grid.Column width={12}>
        <Image src='../images/minervaLogoBlack.png' size='medium' centered/>
        <Header as='h1' icon textAlign='center'>
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
          <a href="https://github.com/minerva-medical" target='_blank' rel='noreferrer'>
            <Icon link name='github' circular/>
            <span style={{ color: '#1e70bf', fontSize: '15px' }}>Our GitHub Organization</span>
          </a>
        </Header>
      </Grid.Column>
      <Grid.Column width={5}>
        <Header as="h4" icon textAlign="center">
          <a href="https://sites.google.com/view/hawaiihomeproject/about?authuser=0" target='_blank' rel='noreferrer'>
            <Icon link name='home' circular/>
            <span style={{ color: '#1e70bf', fontSize: '15px' }}>The Hawaii H.O.M.E Project</span>
          </a>
        </Header>
      </Grid.Column>
    </Grid>
  </div>
);

export default About;
