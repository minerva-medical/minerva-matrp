import React, { useState } from 'react';
import { Form, Header, Segment } from 'semantic-ui-react';
import { loadFixtureMethod } from '../../api/base/BaseCollection.methods';
import UploadFixtureResult from './UploadFixtureResult';

const UploadFixture = () => {
  const [fileDataState, setFileData] = useState('');
  const [uploadResult, setUploadResult] = useState('');
  const [error, setError] = useState(false);
  const [uploadFixtureWorking, setUploadFixtureWorking] = useState(false);

  const readFile = (e) => {
    const files = e.target.files;
    // eslint-disable-next-line no-undef
    const reader = new FileReader();
    reader.readAsText(files[0]);
    reader.onload = (event) => {
      setFileData(event.target.result);
    };
  };

  const onSubmit = () => {
    const jsonData = fileDataState ? JSON.parse(fileDataState) : false;
    if (jsonData) {
      setUploadFixtureWorking(true);
      loadFixtureMethod.callPromise(jsonData)
        .then(result => { setUploadResult(result); })
        .catch(err => { setError(true); setUploadResult(err.message); })
        .finally(() => { console.log('finally'); setUploadFixtureWorking(false); });
    } else {
      setError(true);
      setUploadResult('No file specified');
    }
  };
  return (
    <Segment>
      <Header dividing>Upload DB Fixture</Header>
      <Form widths="equal" onSubmit={onSubmit}>
        <Form.Field>
          <Form.Input type="file" onChange={readFile} label="Fixture File" />
          <Form.Button basic color="green" loading={uploadFixtureWorking} type="Submit">
            Upload Fixture
          </Form.Button>
        </Form.Field>
      </Form>
      {uploadResult ? <UploadFixtureResult error={error} message={uploadResult} /> : ''}
    </Segment>
  );
};

export default UploadFixture;
