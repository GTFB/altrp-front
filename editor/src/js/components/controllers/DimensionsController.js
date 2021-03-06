import { controllerMapStateToProps } from "../../decorators/controller";
import React, { Component } from "react";
import { connect } from "react-redux";
import BindIcon from "../../../svgs/bind.svg";
import controllerDecorate from "../../decorators/controller";
import ResponsiveDdMenu from "../ResponsiveDdMenu";

class DimensionsController extends Component {
  constructor(props) {
    super(props);
    controllerDecorate(this);
    this.changeValue = this.changeValue.bind(this);
    this.changeBind = this.changeBind.bind(this);
    this.changeUnit = this.changeUnit.bind(this);
    let value = this.getSettings(this.props.controlId);
    // console.log(value);
    if (value === null && this.props.default) {
      value = this.props.default;
    }
    value = value || {};
    let units = this.props.units || ['px'];
    value.unit = value.unit || units[0];
    this.state = {
      value,
      show: true,
      // active: this.state.value.active,
      units
    };
  }
  changeUnit(e) {
    let value = this.getSettings(this.props.controlId) || this.getDefaultValue();
    let unit = e.target.dataset.unit;
    this._changeValue({
      ...value,
      unit
    });
  };

  getDefaultValue() {
    return '';
  }

  onKeyDown = (event) => {
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
  }

  changeValue(e) {
    let value = this.getSettings(this.props.controlId) || this.getDefaultValue();
    if (value.bind === true) {
      if (e.target.value <= 9999) {
        this._changeValue({
          ...value,
          left: e.target.value || 0,
          bottom: e.target.value || 0,
          top: e.target.value || 0,
          right: e.target.value || 0
        })
      }
    } else {
      let active = null;
      if (e.currentTarget != undefined) {
        active = e.currentTarget.dataset.active;
      }

      if (active === "top") {
        this._changeValue({
          ...value,
          top: e.target.value || 0,
        });
      }

      if (active === "right") {
        this._changeValue({
          ...value,
          right: e.target.value || 0,
        });
      }

      if (active === "bottom") {
        this._changeValue({
          ...value,
          bottom: e.target.value || 0,
        });
      }

      if (active === "left") {
        this._changeValue({
          ...value,
          left: e.target.value || 0,
        });
      }
    }

  }

  changeBind(e) {
    let value = this.getSettings(this.props.controlId) || this.getDefaultValue();
    this._changeValue({
      ...value,
      bind: !value.bind
    })
  }

  getDefaultValue() {
    return {
      left: '',
      top: '',
      bottom: '',
      right: '',
      unit: 'px',
    };
  }
  render() {

    if (this.state.show === false) {
      return '';
    }

    if (this.props.currentElement.getName() === 'image' &&
      this.props.controlId === "position_margin") {
      return '';
    }

    let value = this.getSettings(this.props.controlId) || this.getDefaultValue();

    return <div className="controller-container controller-container_dimensions">
      <div className="control-dimensions-header">
        <div className="controller-dimensions__label">
          {this.props.label}
        </div>
        <ResponsiveDdMenu />
        <div className="control-slider-type">
          {
            this.state.units.map(unit => {
              let classes = 'control-slider-type-box';
              if (value.unit === unit) {
                classes += ' control-slider-type-box_active';
              }
              return <div className={classes}
                key={unit}>
                <button onClick={this.changeUnit}
                  data-unit={unit}
                  className="control-slider-type-label">{unit}</button>
              </div>
            })
          }
        </div>
      </div>
      <div className="control-group">
        <div className="control-dimensions-container">
          <input className="control-field control-field-dimensions control-field-top-l"
            onKeyDown={this.onKeyDown}
            onChange={this.changeValue}
            data-active="top"

            value={value.top || ''}
            type="number" />
          <label className="control-field-top-l-label control-field-dimensions-label">TOP</label>
        </div>
        <div className="control-dimensions-container">
          <input className="control-field control-field-dimensions control-field-top-r"
            onChange={this.changeValue}
            data-active="right"

            value={value.right || ''}
            type="number" />
          <label className="control-field-top-r-label control-field-dimensions-label">RIGHT</label>
        </div>
        <div className="control-dimensions-container">
          <input className="control-field control-field-dimensions control-field-bot-l"
            onChange={this.changeValue}
            data-active="bottom"
            value={value.bottom || ''}
            type="number" />
          <label className="control-field-bot-l-label control-field-dimensions-label">BOTTOM</label>
        </div>
        <div className="control-dimensions-container">
          <input className="control-field control-field-dimensions control-field-bot-r"
            onChange={this.changeValue}
            data-active="left"
            value={value.left || ''}
            type="number" />
          <label className="control-field-bot-r-label control-field-dimensions-label">LEFT</label>
        </div>
        <div id="bind" className="control-field control-field-bind"
          style={value.bind ? { transition: "0s", backgroundColor: "#8E94AA", borderColor: "#8E94AA", } : {}}
          onClick={this.changeBind}>
          <BindIcon width="12" height="12" fill={value.bind ? "#FFF" : "#8E94AA"} />
        </div>
      </div>
    </div>
  }
}

function mapStateToProps(state) {
  return {
    currentElement: state.currentElement.currentElement,
    currentState: state.currentState,
    currentScreen: state.currentScreen
  };
}

export default connect(controllerMapStateToProps)(DimensionsController);
