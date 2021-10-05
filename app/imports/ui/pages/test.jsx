import React from 'react';
import { Table } from 'semantic-ui-react';
import Drug from '../components/DrugPage';

/** A simple static component to render some text for the landing page. */
const Test = () => <Table celled selectable>
  <Table.Header>
    <Table.Row>
      <Table.HeaderCell>Name</Table.HeaderCell>
      <Table.HeaderCell>Status</Table.HeaderCell>
      <Table.HeaderCell>Notes</Table.HeaderCell>
    </Table.Row>
  </Table.Header>

  <Table.Body>
    <Table.Row>
      <Table.Cell>John</Table.Cell>
      <Table.Cell>No Action</Table.Cell>
      <Table.Cell selectable>
        <a><Drug/></a>
      </Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>Jamie</Table.Cell>
      <Table.Cell>Approved</Table.Cell>
      <Table.Cell selectable>
        <a href='#'>Edit</a>
      </Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>Jill</Table.Cell>
      <Table.Cell>Denied</Table.Cell>
      <Table.Cell selectable>
        <a href='#'>Edit</a>
      </Table.Cell>
    </Table.Row>
    <Table.Row warning>
      <Table.Cell>John</Table.Cell>
      <Table.Cell>No Action</Table.Cell>
      <Table.Cell selectable warning>
        <a href='#'>Requires change</a>
      </Table.Cell>
    </Table.Row>
  </Table.Body>
</Table>;

export default Test;
