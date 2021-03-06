import React, { useState } from 'react';
import { Accordion, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const AdminDatabaseAccordion = ({ index, name, contents }) => {
  const [activeIndex, setActiveIndex] = useState(-1);

  const handleClick = (e, titleProps) => {
    e.preventDefault();
    // console.log(titleProps);
    const newIndex = activeIndex === titleProps.index ? -1 : titleProps.index;
    setActiveIndex(newIndex);
  };

  const prettyPrint = () => {
    let returnString = '';
    contents.forEach((s) => {
      returnString += `${JSON.stringify(s, null, 0)}\n`;
    });
    return returnString;
  };

  return (
    <Accordion styled fluid>
      <Accordion.Title active={activeIndex === index} index={index} onClick={handleClick}>
        <Icon name="dropdown" /> {name} ({contents.length})
      </Accordion.Title>
      <Accordion.Content active={activeIndex === index}>{prettyPrint()}</Accordion.Content>
    </Accordion>
  );
};

AdminDatabaseAccordion.propTypes = {
  index: PropTypes.number,
  contents: PropTypes.array,
  name: PropTypes.string,
};

export default AdminDatabaseAccordion;
