import React, { Component } from "react";
import axios from "axios";
import UserTopPanel from "./UserTopPanel";

export default class Plugins extends Component {
  constructor(props) {
    super(props);
    this.state = {
      plugins: [],
      activeHeader: 0,
    };
  }

  async componentWillMount() {
    const req = await axios.get("/admin/ajax/plugins");
    this.setState({
      plugins: req.data
    });

    window.addEventListener("scroll", this.listenScrollHeader)

    return () => {
      window.removeEventListener("scroll", this.listenScrollHeader)
    }
  }

  listenScrollHeader = () => {
    if (window.scrollY > 4 && this.state.activeHeader !== 1) {
      this.setState({
        activeHeader: 1
      })
    } else if (window.scrollY < 4 && this.state.activeHeader !== 0) {
      this.setState({
        activeHeader: 0
      })
    }
  }

  async updateChange(event, index) {
    this.state.plugins[index].enabled = event.target.checked;

    const pluginName = this.state.plugins[index].name;
    const value = event.target.checked;

    const req = await axios.post("/admin/ajax/plugins/switch", {
      name: pluginName,
      value: value
    });
    this.setState({
      plugins: this.state.plugins
    });
  }

  render() {
    return (
      <div className="admin-pages admin-page">
        <div className={this.state.activeHeader ? "admin-heading admin-heading-shadow" : "admin-heading"}>
          <div className="admin-heading-left">
            <div className="admin-breadcrumbs">
              <a className="admin-breadcrumbs__link" href="#">
                Plugins
              </a>
              <span className="admin-breadcrumbs__separator">/</span>
              <span className="admin-breadcrumbs__current">All Plugins</span>
            </div>
          </div>
          <UserTopPanel />
        </div>
        <div className="admin-content">
          <div className="row">
            {this.state.plugins.map((item, key) => {
              return (
                <div key={item.name} className="col-3 text-center border rounded mx-2">
                  <div className="mb-2">{item.name}</div>
                  <a href={item.url}><img
                    className="mb-2"
                    src={item.image}
                    style={{ maxWidth: "150px" }}
                    alt=""
                  ></img></a>
                  <div className="custom-control custom-switch">
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      id={`switch${key}`}
                      checked={item.enabled}
                      onChange={event => this.updateChange(event, key)}
                    ></input>
                    <label
                      className="custom-control-label"
                      htmlFor={`switch${key}`}
                    >
                      {item.enabled == true
                        ? "Plugin enabled"
                        : "Plugin disabled"}
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}
