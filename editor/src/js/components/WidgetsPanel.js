import React, { Component } from "react";
import WidgetIcon from "./WidgetIcon";
import Scrollbars from "react-custom-scrollbars";

class WidgetsPanel extends Component {
  constructor(props) {
    super(props);
    this.state = { widgets: window.elementsManager.getWidgetsList() };
  }
  render() {
    return (
      <div className="widget-panel-wrapper">
        <Scrollbars autoHide autoHideTimeout={500} autoHideDuration={200}>
          <div className="widget-panel">
            {this.state.widgets.map(widget => {
              return <WidgetIcon element={widget} key={widget.getName()} />;
            })}
          </div>
        </Scrollbars>
      </div>
    );
  }
}

export default WidgetsPanel;
