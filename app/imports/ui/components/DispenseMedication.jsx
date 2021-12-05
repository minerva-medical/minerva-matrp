import React, { useState, useEffect } from 'react';
import { Grid, Header, Form, Button, Tab, Loader, Dropdown, Divider } from 'semantic-ui-react';
import swal from 'sweetalert';
import moment from 'moment';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Sites } from '../../api/site/SiteCollection';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
import { Medications, allowedUnits } from '../../api/medication/MedicationCollection';
import { dispenseTypes } from '../../api/historical/HistoricalCollection';
import { defineMethod, updateMethod } from '../../api/base/BaseCollection.methods';
import { distinct, getOptions, nestedDistinct } from '../utilities/Functions';
import DispenseMedicationSingle from './DispenseMedicationSingle';

/** handle submit for Dispense Medication. */
const submit = (fields, innerFields, callback) => {
  const { site, dateDispensed, dispensedTo, dispensedFrom, inventoryType, dispenseType, note } = fields;
  // const { lotId, drug, brand, expire, quantity, unit, donated, donatedBy, maxQuantity } = innerFields;
  // TODO: historical record should allow multiple drugs?
  const collectionName = Medications.getCollectionName();

  innerFields.forEach(innerField => {
    const { lotId, drug, brand, expire, quantity, unit, donated, donatedBy } = innerField;
    const medication = Medications.findOne({ drug }); // find the existing medication
    const { _id, lotIds } = medication;
    const targetIndex = lotIds.findIndex((obj => obj.lotId === lotId)); // find the index of existing the lotId
    const { quantity: targetQuantity } = lotIds[targetIndex];

    // if dispense quantity > lotId quantity:
    if (quantity > targetQuantity) {
      swal('Error', `${drug}, ${lotId} only has ${targetQuantity} ${unit} remaining.`, 'error');
    } else {
      // if dispense quantity < lotId quantity:
      if (quantity < targetQuantity) {
        lotIds[targetIndex].quantity -= quantity; // decrement the quantity
      } else {
        // else if dispense quantity === lotId quantity:
        lotIds.splice(targetIndex, 1); // remove the lotId
      }
      const updateData = { id: _id, lotIds };
      const element = { unit, lotId, brand, expire, quantity, donated, donatedBy };
      const definitionData = { inventoryType, dispenseType, dateDispensed, dispensedFrom, dispensedTo, site,
        name: drug, note, element };
      // TODO: fix promises, fix swal
      const promises = [
        updateMethod.callPromise({ collectionName, updateData }),
        defineMethod.callPromise({ collectionName: 'HistoricalsCollection', definitionData }),
      ];
      Promise.all(promises)
        .catch(error => swal('Error', error.message, 'error'))
        .then(() => {
          swal('Success', `${drug}, ${lotId} updated successfully`, 'success', { buttons: false, timer: 3000 });
          callback(); // resets the form
        });
    }
  });
};

/** validates the dispense medication form */
const validateForm = (fields, innerFields, callback) => {
  const submitFields = { ...fields, dispensedFrom: Meteor.user().username };
  const submitInnerFields = [...innerFields];

  if (fields.dispenseType !== 'Patient Use') { // handle non patient use dispense
    submitFields.dispensedTo = '-';
    submitFields.site = '-';
  }

  let errorMsg = '';
  // the required String fields
  const requiredFields = ['dispensedTo', 'site'];
  const requiredInnerFields = ['drug', 'lotId', 'brand', 'quantity'];

  // check required fields
  requiredFields.forEach(field => {
    if (!submitFields[field]) {
      errorMsg += `${field} cannot be empty.\n`;
    }
  });
  requiredInnerFields.forEach(field => {
    if (submitInnerFields.findIndex(obj => obj[field] === '') !== -1) {
      errorMsg += `${field} cannot be empty.\n`;
    }
  });

  if (errorMsg) {
    swal('Error', `${errorMsg}`, 'error');
  } else {
    /* eslint no-param-reassign: ["error", { "props": false }] */
    submitInnerFields.forEach(obj => {
      obj.quantity = parseInt(obj.quantity, 10);
    });
    submit(submitFields, submitInnerFields, callback);
  }
};

/** Renders the Page for Dispensing Medication. */
const DispenseMedication = ({ ready, brands, drugs, lotIds, sites }) => {
  const [fields, setFields] = useState({
    site: '',
    dateDispensed: moment().format('YYYY-MM-DDTHH:mm'),
    dispensedTo: '',
    inventoryType: 'Medication',
    dispenseType: 'Patient Use',
    note: '',
  });
  const [innerFields, setInnerFields] = useState([
    {
      lotId: '',
      drug: '',
      brand: '',
      expire: '',
      quantity: '',
      unit: 'tab(s)',
      donated: false,
      donatedBy: '',
      maxQuantity: 0,
    },
  ]);
  const isDisabled = fields.dispenseType !== 'Patient Use';

  // update date dispensed every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setFields({ ...fields, dateDispensed: moment().format('YYYY-MM-DDTHH:mm') });
    }, 1000 * 60);
    return () => clearInterval(interval);
  });

  const handleChange = (event, { name, value }) => {
    setFields({ ...fields, [name]: value });
  };

  const handleChangeInner = (event, { index, name, value }) => {
    const newInnerFields = [...innerFields];
    newInnerFields[index] = { ...innerFields[index], [name]: value };
    setInnerFields(newInnerFields);
  };

  const handleCheck = (event, { index, name, checked }) => {
    const newInnerFields = [...innerFields];
    if (!checked) {
      newInnerFields[index] = { ...innerFields[index], [name]: checked, donatedBy: '' };
    } else {
      newInnerFields[index] = { ...innerFields[index], [name]: checked };
    }
    setInnerFields(newInnerFields);
  };

  // handle lotId select
  const onLotIdSelect = (event, { index, value: lotId }) => {
    const newInnerFields = [...innerFields];
    const target = Medications.findOne({ lotIds: { $elemMatch: { lotId } } });
    // if lotId is not empty:
    if (target) {
      // autofill the form with specific lotId info
      const targetLotId = target.lotIds.find(obj => obj.lotId === lotId);
      const { drug, unit } = target;
      const { brand, expire, quantity, donated, donatedBy } = targetLotId;
      newInnerFields[index] = { ...innerFields[index], lotId, drug, expire, brand, unit, donated, donatedBy,
        maxQuantity: quantity };
      setInnerFields(newInnerFields);
    } else {
      // else reset specific lotId info
      newInnerFields[index] = { ...innerFields[index], lotId, drug: '', expire: '', brand: '', unit: 'tab(s)',
        donated: false, donatedBy: '', maxQuantity: 0 };
      setInnerFields(newInnerFields);
    }
  };

  // handle add new drug
  const onAddDrug = () => {
    const newInnerFields = [...innerFields];
    newInnerFields.push({ lotId: '', drug: '', brand: '', expire: '', quantity: '', unit: 'tab(s)', donated: false,
      donatedBy: '', maxQuantity: 0 });
    setInnerFields(newInnerFields);
  };

  // handle remove drug
  const onRemoveDrug = () => {
    const newInnerFields = [...innerFields];
    newInnerFields.pop();
    setInnerFields(newInnerFields);
  };

  const clearForm = () => {
    setFields({ ...fields, site: '', dispensedTo: '', dispenseType: 'Patient Use', note: '' });
    setInnerFields([{ lotId: '', drug: '', brand: '', expire: '', quantity: '', unit: 'tab(s)', donated: false,
      donatedBy: '', maxQuantity: 0 }]);
  };

  if (ready) {
    return (
      <Tab.Pane id='dispense-form'>
        <Header as="h2">
          <Header.Content>
            <Dropdown inline name='dispenseType' options={getOptions(dispenseTypes)}
              onChange={handleChange} value={fields.dispenseType} />
              Dispense from Medication Inventory Form
            <Header.Subheader>
              <i>Please input the following information to dispense from the inventory, to the best of your abilities.</i>
            </Header.Subheader>
          </Header.Content>
        </Header>
        {/* Semantic UI Form used for functionality */}
        <Form>
          <Grid columns='equal' stackable>
            <Grid.Row>
              <Grid.Column>
                <Form.Input type="datetime-local" label='Date Dispensed' name='dateDispensed'
                  onChange={handleChange} value={fields.dateDispensed}/>
              </Grid.Column>
              <Grid.Column className='filler-column' />
              <Grid.Column className='filler-column' />
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Form.Input label='Dispensed By' name='dispensedFrom' onChange={handleChange}
                  value={'' || Meteor.user().username} readOnly/>
              </Grid.Column>
              <Grid.Column>
                <Form.Input label='Dispensed To' placeholder="Patient Number" disabled={isDisabled}
                  name='dispensedTo' onChange={handleChange} value={fields.dispensedTo} id={COMPONENT_IDS.DISPENSE_MED_PT_NUM}/>
              </Grid.Column>
              <Grid.Column>
                <Form.Select clearable search label='Site' options={getOptions(sites)} disabled={isDisabled}
                  placeholder="Kaka’ako" name='site'
                  onChange={handleChange} value={fields.site}/>
              </Grid.Column>
            </Grid.Row>
            {
              innerFields.map((innerField, index) => {
                const elements = [];
                elements.push(
                  <DispenseMedicationSingle lotIds={lotIds} drugs={drugs} brands={brands} fields={innerField}
                    handleChange={handleChangeInner} handleCheck={handleCheck} onLotIdSelect={onLotIdSelect}
                    allowedUnits={allowedUnits} index={index} key={`FORM_${index}`} />,
                );
                if (innerFields.length > 1 && index !== innerFields.length - 1) {
                  elements.push(
                    <Grid.Row style={{ padding: 0 }} key={`DIVIDER_${index}`}>
                      <Grid.Column>
                        <Divider fitted/>
                      </Grid.Column>
                    </Grid.Row>,
                  );
                }
                return elements;
              })
            }
            <Grid.Row style={{ padding: 0 }}>
              <Grid.Column style={{ display: 'flex', justifyContent: 'flex-end' }}>
                {
                  innerFields.length !== 1 &&
                  <Button negative compact icon='minus' content='Remove Drug' size='mini' onClick={onRemoveDrug}/>
                }
                <Button positive compact icon='add' content='Add New Drug' size='mini' onClick={onAddDrug} />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Form.TextArea label='Additional Notes' name='note' onChange={handleChange} value={fields.note}
                  placeholder="Please add any additional notes, special instructions, or information that should be known here."
                  id={COMPONENT_IDS.DISPENSE_MED_NOTES}/>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Form>
        <div className='buttons-div'>
          <Button className='clear-button' onClick={clearForm} id={COMPONENT_IDS.DISPENSE_MED_CLEAR}>Clear Fields</Button>
          <Button className='submit-button' floated='right' onClick={() => validateForm(fields, innerFields, clearForm)}>Submit</Button>
        </div>
      </Tab.Pane>
    );
  }
  return (<Loader active>Getting data</Loader>);
};

/** Require an array of Sites, Drugs, LotIds, and Brands in the props. */
DispenseMedication.propTypes = {
  sites: PropTypes.array.isRequired,
  drugs: PropTypes.array.isRequired,
  lotIds: PropTypes.array.isRequired,
  brands: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  const medSub = Medications.subscribeMedication();
  const siteSub = Sites.subscribeSite();
  return {
    sites: distinct('site', Sites),
    drugs: distinct('drug', Medications),
    lotIds: nestedDistinct('lotId', Medications),
    brands: nestedDistinct('brand', Medications),
    ready: siteSub.ready() && medSub.ready(),
  };
})(DispenseMedication);
