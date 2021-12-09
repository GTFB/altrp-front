import React, { Component } from "react";

class AddItemButton extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <button
        className={`altrp-btn-draw`}
        style={{
          margin: "5px 5px 5px 5px"
        }}
        onClick={this.props.onAddItem}
      >
        Добавить виджет
      </button>
    );
  }
}

export default AddItemButton;
