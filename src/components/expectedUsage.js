import React from 'react';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import classnames from 'classnames';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ReactSlider from 'react-slider';

import bemify from '../util/bemify';
import BigRadioButton from './bigRadioButton';
import TimeDropdown from './timeDropdown';
import ComingSoon from './comingSoon';

import {
  setStorageAmount,
  setEstimatedSpeed,
  setReason,
  setUptimeStart,
  setUptimeEnd,
  toggleAllDayUptime,
} from '../state/expectedUsage';

const bem = bemify('expectedUsage');

// TODO: show storage?
const useStorage = false;

const textareaPlaceholder = 'e.g. By using Gladius for a few hours I can finally put my network to good use. I plan to minimize its cost by renting my spare network bandwidth.';

const SliderField = ({ max, step, input, type, meta: { touched, error } }) => (
  <div key="sliderInputField" className="input form-group">
    <ReactSlider
      handleClassName="slider-handle"
      withBars
      max={max}
      step={step}
      {...input}
    />
  </div>
);

const TimeDropdownField = ({ disabled, input }) => (
  <TimeDropdown
    {...input}
    disabled={disabled}
  />
);

const CheckboxField = ({ input }) => {
  return (
    <BigRadioButton
      isCheckbox={true}
      on={input.value}
      className="mr-2"
      onClick={() => input.onChange(!input.value)}
    />
  );
};

const TextareaField = ({ input }) => {
  return (
    <textarea
      className="p-2"
      placeholder={textareaPlaceholder}
      {...input}
    />
  );
};

export function BaseExpectedUsage({
  onSubmit,
  handleSubmit,
  disableTimeDropdown,
  allDayValue,
  uptimeStartValue,
  uptimeEndValue,
  reason,
  storageAmount,
  estimatedSpeed,
  setStorageAmount,
  setEstimatedSpeed,
  setUptimeStart,
  setUptimeEnd,
  setReason,
  toggleAllDayUptime,
}) {
  let storageSlider = null;
  if (useStorage) {
    storageSlider = (
      <div className="col-12 mb-5">
        <div className="upload-speed-container mb-3">
          <span>Storage Amount</span>
          <span className="upload-speed">{storageAmount} Mb</span>
        </div>
        <div className="slider-container">
          <Field
            name="storageAmount"
            handleClassName="slider-handle"
            max={100}
            step={5}
            component={SliderField}
          />
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={classnames(bem())}>
      <div className="col-12 mb-5">
        <div className="upload-speed-container mb-3">
          <span>Upload Speed</span>
          <span className="upload-speed">
            {estimatedSpeed + (estimatedSpeed >= 100 ? '+' : '')} Mbps
          </span>
        </div>
        <div className="slider-container">
          <Field
            name="estimatedSpeed"
            handleClassName="slider-handle"
            max={100}
            step={5}
            component={SliderField}
          />
        </div>
      </div>
      {storageSlider}
      <ComingSoon className="mt-5 mb-5 pt-5 pb-3" textTop>
        <div className="col-12">
          <span className="mr-4">Daily Uptime</span>
          <Field
            name="uptimeStart"
            disabled={disableTimeDropdown}
            component={TimeDropdownField}
          />
          <span className="ml-2 mr-2">—</span>
          <Field
            name="uptimeEnd"
            disabled={disableTimeDropdown}
            component={TimeDropdownField}
          />
          <span className="all-day-container pl-4">
            <Field
              name="allDayUptime"
              component={CheckboxField}
            />
            All Day
          </span>
        </div>
      </ComingSoon>
      <div className="col-12">
        <div className="mb-2">Your default biography for applications</div>
        <Field
          name="reason"
          component={TextareaField}
        />
      </div>
    </form>
  );
}

BaseExpectedUsage.defaultProps = {
  onSubmit: () => {},
};

BaseExpectedUsage.propTypes = {
  disableTimeDropdown: PropTypes.bool,
  allDayValue: PropTypes.bool,
  uptimeStartValue: PropTypes.number,
  uptimeEndValue: PropTypes.number,
  reason: PropTypes.string,
  estimatedSpeed: PropTypes.number,
  setEstimatedSpeed: PropTypes.func,
  setUptimeStart: PropTypes.func,
  setUptimeEnd: PropTypes.func,
  setReason: PropTypes.func,
  toggleAllDayUptime: PropTypes.func,
};

const selector = formValueSelector('expectedUsage');
function mapStateToProps(state) {
  let { expectedUsage, form } = state;

  return {
    initialValues: expectedUsage,
    disableTimeDropdown: selector(state, 'allDayUptime'),
    allDayValue: expectedUsage.allDayUptime,
    uptimeStartValue: expectedUsage.uptimeStart,
    uptimeEndValue: expectedUsage.uptimeEnd,
    reason: expectedUsage.reason,
    storageAmount: expectedUsage.storageAmount,
    estimatedSpeed: form.expectedUsage && form.expectedUsage.values.estimatedSpeed,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setEstimatedSpeed: speed => dispatch(setEstimatedSpeed(speed)),
    setStorageAmount: storageAmount => dispatch(setStorageAmount(storageAmount)),
    setUptimeStart: uptimeStart => dispatch(setUptimeStart(uptimeStart)),
    setUptimeEnd: uptimeEnd => dispatch(setUptimeEnd(uptimeEnd)),
    setReason: textEvent => dispatch(setReason(textEvent.target.value)),
    toggleAllDayUptime: () => dispatch(toggleAllDayUptime()),
  };
}

BaseExpectedUsage = reduxForm({
  form: 'expectedUsage',
})(BaseExpectedUsage);

BaseExpectedUsage = connect(
  mapStateToProps,
  mapDispatchToProps
)(BaseExpectedUsage);

export default BaseExpectedUsage;
