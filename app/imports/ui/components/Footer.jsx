import React from 'react';
import { Header, Image } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';

/** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
const Footer = () => {
  const divStyle = {
    paddingTop: '15px',
    backgroundColor: '#1D3E66',
    color: 'white',
    padding: '40px 100px 40px 100px',
    marginTop: '15px',
    marginLeft: '0px',
    marginRight: '0px',
    textAlign: 'center',
    alignItems: 'center',
  };
  return (
    <footer>
      <div style={divStyle} >
        <hr/>
        <Header inverted as='h3'>Designed by Minerva Medical</Header>
        <Image src = '../images/minervaLogo.png' size='tiny' centered/>
        <NavLink style={{ color: 'lightblue' }} exact to="/about" key="about" id="about">About</NavLink>
        <br/>
        <a style={{ color: 'lightblue' }} href="https://minerva-medical.github.io" target='_blank' rel='noreferrer'>
            Our Project Page</a>
      </div>
    </footer>
  );
};

export default Footer;
