import React, {Component} from "react";
import Resource from "../../../../editor/src/js/classes/Resource";
import AdminTable from "../AdminTable";
import {mbParseJSON} from "../../../../front-app/src/js/helpers";
import {withRouter} from "react-router";
import UserTopPanel from "../UserTopPanel";

class MenusList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menus: [],
      activeHeader: 0,
      currentPage: 1,
      menusSearch: ""
    }
    this.resource = new Resource({route: '/admin/ajax/menus'})
    this.itemsPerPage = 3;
  }

  async componentDidMount() {
    try {
      let menus = await this.resource.getAll();
      this.setState(state => ({...state, menus}));
    } catch (e) {
      console.error(e);
    }

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

  searchMenus = (e) => {
    e.preventDefault();
    this.updateMenus();
  }

  changeMenus = (e) => {
    this.setState( { menusSearch: e.target.value})
  }

  addNew = async()=>{
    try{
      let res = await this.resource.post({name: '', children: '[]'});
      res = res.data;
      this.props.history.push(`/admin/menus/${res.id}`)
    } catch (e) {
      if(e.res instanceof Promise){
        e = await e.res.then();
        e = mbParseJSON(e);
      } else if (e instanceof Promise){
        e = await e.then();
        e = mbParseJSON(e);
      }
      console.error(e);
      alert('Error: ' + e.message);
    }
  }

  updateMenus = async () => {
    let menus = await  this.resource.getQueried({ s: this.state.menusSearch });
    this.setState(state => ({...state, menus}))
  }

  render() {

    const { menus, currentPage, menusSearch } = this.state;

    return <div className="admin-pages admin-page">
      <div className={this.state.activeHeader ? "admin-heading admin-heading-shadow" : "admin-heading"}>
        <div className="admin-heading-left">
          <div className="admin-breadcrumbs">
            <div className="admin-breadcrumbs__current">Menus</div>
          </div>
          <button className="btn" onClick={this.addNew} >Add New</button>
        </div>
        <UserTopPanel />
      </div>
      <div className="admin-content">
        <AdminTable
          columns={[
            {
              name: 'name',
              title: 'Name',
              default: '(no Name)',
              url: true,
              editUrl: true,
              tag: 'Link'
            },
            {
              name: 'categories',
              title: 'Categories'
            }
          ]}

          quickActions={[
            {
              tag: "button",
              route: `/admin/ajax/menus/:id`,
              method: "delete",
              confirm: "Are You Sure?",
              after: () => {
                this.updateMenus()
              },
              className: "quick-action-menu__item_danger",
              title: "Delete"
            }
          ]}
          rows={menus.slice(
            currentPage * this.itemsPerPage - this.itemsPerPage,
            currentPage * this.itemsPerPage
          )}

          searchTables={{
            submit: this.searchMenus,
            value: menusSearch,
            change: this.changeMenus
          }}

          pageCount={Math.ceil(menus.length / this.itemsPerPage) || 1}
          currentPage={currentPage}
          changePage={page => {
            if (currentPage !== page) {
              this.setState({ currentPage: page });
            }
          }}
          itemsCount={menus.length}

          openPagination={true}
        />
      </div>
    </div>
  }
}

export default withRouter(MenusList)
