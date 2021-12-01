import React from 'react';
import { Grid, Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
import { getOptions } from '../utilities/Functions';

const DispenseMedicationSingle = ({ lotIds, drugs, brands, fields, handleChange, onLotIdSelect, allowedUnits }) => (
  // return (
  <>
    <Grid.Row>
      <Grid.Column>
        <Form.Select clearable search label='Lot Number' options={getOptions(lotIds)}
          placeholder="Z9Z99"
          name='lotId' onChange={onLotIdSelect} value={fields.lotId} id={COMPONENT_IDS.DISPENSE_MED_LOT}/>
      </Grid.Column>
      <Grid.Column>
        <Form.Select clearable search label='Drug Name' options={getOptions(drugs)}
          placeholder="Benzonatate Capsules"
          name='drug' onChange={handleChange} value={fields.drug}/>
      </Grid.Column>
      <Grid.Column>
        <Form.Select clearable search label='Brand' options={getOptions(brands)}
          placeholder="Zonatuss"
          name='brand' onChange={handleChange} value={fields.brand}/>
      </Grid.Column>
    </Grid.Row>
    <Grid.Row>
      <Grid.Column>
        {/* expiration date may be null */}
        <Form.Input type='date' label='Expiration Date' name='expire'
          onChange={handleChange} value={fields.expire}/>
      </Grid.Column>
      <Grid.Column>
        <Form.Group>
          <Form.Input label={fields.maxQuantity ? `Quantity (${fields.maxQuantity} remaining)` : 'Quantity'}
            type='number' min={1} name='quantity' className='quantity'
            onChange={handleChange} value={fields.quantity} placeholder='30' id={COMPONENT_IDS.DISPENSE_MED_QUANTITY}/>
          <Form.Select compact name='unit' onChange={handleChange} value={fields.unit} className='unit'
            options={getOptions(allowedUnits)} />
        </Form.Group>
      </Grid.Column>
      <Grid.Column>
        <Form.Field>
          <label>Donated</label>
          <Form.Group>
            <Form.Checkbox name='donated' className='donated-field'
              onChange={handleChange} checked={fields.donated}/>
            <Form.Input name='donatedBy' className='donated-by-field' placeholder='Donated By'
              onChange={handleChange} value={fields.donatedBy} disabled={!fields.donated} />
          </Form.Group>
        </Form.Field>
      </Grid.Column>
    </Grid.Row>
    <Grid.Row>
      <Grid.Column>
        <Form.TextArea label='Additional Notes' name='note' onChange={handleChange} value={fields.note}
          placeholder="Please add any additional notes, special instructions, or information that should be known here."
          id={COMPONENT_IDS.DISPENSE_MED_NOTES}/>
      </Grid.Column>
    </Grid.Row>
  </>
  // );
);

DispenseMedicationSingle.propTypes = {
  drugs: PropTypes.array.isRequired,
  lotIds: PropTypes.array.isRequired,
  brands: PropTypes.array.isRequired,
  fields: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  onLotIdSelect: PropTypes.func.isRequired,
  allowedUnits: PropTypes.array.isRequired,
};

export default DispenseMedicationSingle;
