import React from "react";

const ProgressBarInit = window.altrpLibs.Blueprint.ProgressBar;

class ProgressBarWidget extends Component {
  constructor(props) {
    super(props);

    this.state = {
      settings: props.element.getSettings(),
    };

    props.element.component = this;

    if (window.elementDecorator) {
      window.elementDecorator(this);
    }
    if(props.baseRender){
      this.render = props.baseRender(this);
    }
  }

  render() {
    let value = this.props.element.getContent("value") || "100";
    let maxValue = this.props.element.getContent("max_value");

    if(!isNaN(value)) {
      value = parseInt(value) * 0.01;

      if(maxValue && !isNaN(maxValue)) {
        maxValue = parseInt(maxValue) * 0.01;

        if(value > maxValue) {
          value = maxValue
        }
      }
    }

    const settings = {
      stripes: this.props.element.getResponsiveSetting("stripes", "", true),
      animate: this.props.element.getResponsiveSetting("animate", "", true)
    }

    return (
      <ProgressBarInit {...settings} value={!_.isString(value) ? value : 100}/>
    );
  }
}

export default ProgressBarWidget;
