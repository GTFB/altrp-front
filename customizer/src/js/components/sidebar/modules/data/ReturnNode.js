import * as React from "react";
import Chevron from "../../../../../../../editor/src/svgs/chevron.svg";
import store from "../../../../store/store";
import {setUpdatedNode} from "../../../../store/customizer-settings/actions";
import mutate from "dot-prop-immutable";
import {connect} from "react-redux";
import PropertyComponent from "../../PropertyComponent";

class ReturnNode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  changeByPath = (e, path) => {
    let node = this.getNode();
    let value = _.isString(e?.target?.value) ? e.target.value : e;
    node = mutate.set(node, `data.${path}`, value)
    store.dispatch(setUpdatedNode(node));
  }

  getNode() {
    let node = this.props.customizerSettingsData?.find(n => {
      return this.props.selectNode?.id == n.id
    });
    return node;
  }

  render() {
    const node = this.getNode();
    return (
      <div>
        <div className="settings-section open">
          <div className="settings-section__title d-flex">
            <div className="settings-section__icon d-flex">
              <Chevron/>
            </div>
            <div className="settings-section__label">Settings Return</div>
          </div>
          <div className="controllers-wrapper">
            <div className="controller-container controller-container_select">
              <div className="controller-container__label control-select__label controller-label">Return Value:</div>
              <PropertyComponent
                changeByPath={this.changeByPath}
                property={node.data.property || {}}
                path="property"/>
            </div>
          </div>
        </div>
        {/* ./settings-section */}

      </div>
    );
  }
}

function mapStateToProps(state) {
  return {customizerSettingsData: state.customizerSettingsData}
}

export default connect(mapStateToProps)(ReturnNode)
