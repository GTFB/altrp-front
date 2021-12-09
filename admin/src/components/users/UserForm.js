import React, { Component } from "react";
import { Link } from "react-router-dom";
import Resource from "../../../../editor/src/js/classes/Resource";
import { Redirect, withRouter } from 'react-router-dom';
import AltrpSelect from "../altrp-select/AltrpSelect";
import {InputGroup, MenuItem} from "@blueprintjs/core";
import {MultiSelect} from "@blueprintjs/select";
//import TableForm from "../../../../admin/src/components/tables/TableForm";
/**
 * @class
 * @property {Resource} resource
 */

class UserForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id,
      user: {
        _roles: [],
        _permissions: []
      },
      usermeta: {
        roles: [],
        permissions: []
      },
      errors: [],
      redirectAfterSave: false,
      redirectAfterError: false,
      redirect_error_url: "/admin/users",
      rolesOptions: [],
      permissionsOptions: [],
      isPasswordChange: false
    };

    if (!this.state.id) {
      console.log(this.props.id)
    }

    this.resource = new Resource({ route: '/admin/ajax/users' });
    this.rolesOptions = new Resource({ route: '/admin/ajax/role_options' });
    this.permissionsOptions = new Resource({ route: '/admin/ajax/permissions_options' });

    this.saveUser = this.saveUser.bind(this);
  }

  async componentDidMount() {
    const rolesOptions = await this.rolesOptions.getAll();
    this.setState(state => ({ ...state, rolesOptions }));
    const permissionsOptions = await this.permissionsOptions.getAll();
    this.setState(state => ({ ...state, permissionsOptions }));
    if (!this.state.id) {
      return;
    }

    if (this.state.id) {

      let user_data = await this.resource.get(this.state.id);

      this.setState(state => {
        return { ...state, user: user_data }
      }, async () => {
        let usermeta_data = await this.resource.get(this.state.id + "/usermeta");

        this.setState(state => {
          return { ...state, usermeta: usermeta_data }
        });

      });
    }
  }

  async saveUser(e) {
    e.preventDefault();
    let res, usermeta_resource, usermeta_res;
    const { isPasswordChange, user: { password, password_confirmation}} = this.state;
    if (isPasswordChange && password !== password_confirmation) {
      return alert("Password doesn't match confirmation");
    }

    if (this.state.id) {
      res = await this.resource.put(this.state.id, this.state.user);
    } else {
      res = await this.resource.post(this.state.user);
    }

    if (res) {

      //Обновление меты
      usermeta_resource = new Resource({ route: '/admin/ajax/users/' + res.id + "/usermeta" });

      usermeta_res = await usermeta_resource.post(this.state.usermeta);

      if (usermeta_res) {
        this.setState(state => {
          return { ...state, redirectAfterSave: true }
        });
      }
      else {
        this.setState(state => {
          return { ...state, redirectAfterError: true, redirect_error_url: this.state.redirect_error_url + "/user/" + res.id }
        });
      }


    } else {
      /*this.setState(state=>{
          return {...state, value: {}}
      });*/
    }
  }

  changeValue = (e, source = "user") => {
    let field = e.target.name;
    let value = e.target.value;
    this.setState(state => {
      state = { ...state };
      state[source][field] = value;
      return state
    })
  }

  changeRolesHandler = roles => {
    this.setState({
      usermeta: {
        ...this.state.usermeta,
        roles: roles ? roles.map(role => role.value) : []
      },
      user: {
        ...this.state.user,
        _roles: roles ? roles.map(role => role.value) : []
      }
    })
  };

  changePermissionsHandler = permissions => {
    this.setState({
      usermeta: {
        ...this.state.usermeta,
        permissions: permissions ? permissions.map(permission => permission.value) : []
      },
      user: {
        ...this.state.user,
        _permissions: permissions ? permissions.map(permission => permission.value) : []
      }
    })
  };

  ItemPredicate(query, value) {

    if(!query) {
      return true
    }
    const index = _.findIndex(_.split(value.label, ""), char => {
      let similar = false;
      _.split(query, "").forEach(queryChar => {
        if(queryChar === char) {
          similar = true
        }
      });
      return similar
    });

    if(index !== -1) {
      return true
    } else {
      return false
    }
  }

  tagRenderer = (item) => {
    return item.label;
  };

  isItemSelectedRoles = (item) => {
    let itemString = JSON.stringify(item);
    let selectedString = JSON.stringify(this.state.user._roles || []);
    return selectedString.includes(itemString);
  };

  handleItemSelectRoles = (item) => {
    if (!this.isItemSelectedRoles(item)) {
      this.setState(state => {
        const copyRoles = state.user._roles || []
        copyRoles.push(item)
        return {
          ...state,
          user: {
            ...state.user,
            _roles: copyRoles
          },
          usermeta: {
            ...state.usermeta,
            roles: copyRoles
          }
        }
      });
    }
  };

  handleTagRemoveRoles = (item) => {
    this.setState(state => {
      const copyRoles = state.user._roles
      const copyUserMetaRoles = state.usermeta.roles
      return {
        ...state,
        user: {
          ...state.user,
          _roles: copyRoles.filter((i) => i.label !== item)
        },
        usermeta: {
          ...state.usermeta,
          roles: copyUserMetaRoles.filter((i) => i.label !== item)
        }
      }
    });
  };

  isItemSelectedPermissions = (item) => {
    let itemString = JSON.stringify(item);
    let selectedString = JSON.stringify(this.state.user._permissions || []);
    return selectedString.includes(itemString);
  };

  handleItemSelectPermissions = (item) => {
    if (!this.isItemSelectedPermissions(item)) {
      this.setState(state => {
        const copyPermissions = state.user._permissions || []
        copyPermissions.push(item)
        return {
          ...state,
          user: {
            ...state.user,
            _permissions: copyPermissions
          },
          usermeta: {
            ...state.usermeta,
            permissions: copyPermissions
          }
        }
      });
    }
  };

  handleTagRemovePermissions = (item) => {
    this.setState(state => {
      const copyPermissions = state.user._permissions
      const copyUserMetaPermissions = state.usermeta.permissions
      return {
        ...state,
        user: {
          ...state.user,
          _permissions: copyPermissions.filter((i) => i.label !== item)
        },
        usermeta: {
          ...state.usermeta,
          permissions: copyUserMetaPermissions.filter((i) => i.label !== item)
        }
      }
    });
  };

  render() {
    const { rolesOptions, permissionsOptions, isPasswordChange } = this.state;
    const { _roles: roles = [], _permissions: permissions = [] } = this.state.user;
    if (this.state.redirectAfterSave) {
      return <Redirect to={this.props.redirect_url} />
    }
    if (this.state.redirectAfterError) {
      return <Redirect to={this.state.redirect_error_url} />
    }

    return <form className="admin-form admin-form_newUsers" onSubmit={this.saveUser}>
     <div className="form-group__inline-wrapper">
       <div className="form-group form-group_width47">
         <label htmlFor="page-name" className="label__RobotoFont">Name</label>
         {/*<input type="text" id="name" name="name" required={1}*/}
         {/*       value={this.state.user.name || ''}*/}
         {/*       disabled={this.props.id}*/}
         {/*       onChange={(e) => { this.changeValue(e) }}*/}
         {/*       className="form-control" />*/}

         <InputGroup type="text" id="name" name="name" required={1}
                     value={this.state.user.name || ''}
                     disabled={this.props.id}
                     onChange={(e) => { this.changeValue(e) }}
                     className="form-control-blueprint"
         />
       </div>

       <div className="form-group form-group_width47">
         <label htmlFor="page-title" className="label__RobotoFont">Email</label>
         {/*<input type="email" id="email" name="email" required={1}*/}
         {/*       value={this.state.user.email || ''}*/}
         {/*       onChange={(e) => { this.changeValue(e) }}*/}
         {/*       disabled={this.props.id}*/}
         {/*       className="form-control" />*/}

         <InputGroup type="email" id="email" name="email" required={1}
                     value={this.state.user.email || ''}
                     onChange={(e) => { this.changeValue(e) }}
                     disabled={this.props.id}
                     className="form-control-blueprint"
         />
       </div>
     </div>

      <div className="form-group__inline-wrapper">
        {!this.state.id ?
          <div className="form-group form-group_width47">
            <label htmlFor="page-description" className="label__RobotoFont">Password</label>
            {/*<input type="password" id="password" name="password" required={1}*/}
            {/*       minlength={8}*/}
            {/*       value={this.state.user.password || ''}*/}
            {/*       onChange={(e) => { this.changeValue(e) }}*/}
            {/*       className="form-control" />*/}

            <InputGroup type="password" id="password" name="password" required={1}
                        minLength={8}
                        autoComplete="off"
                        value={this.state.user.password || ''}
                        onChange={(e) => { this.changeValue(e) }}
                        className="form-control-blueprint"
            />
          </div> : null}
        {!this.state.id ?
          <div className="form-group form-group_width47">
            <label htmlFor="page-description" className="label__RobotoFont">Confirm Password</label>
            {/*<input type="password" id="password_confirmation" name="password_confirmation" required={1}*/}
            {/*       minlength={8}*/}
            {/*       value={this.state.user.password_confirmation || ''}*/}
            {/*       onChange={(e) => { this.changeValue(e) }}*/}
            {/*       className="form-control" />*/}

            <InputGroup type="password" id="password_confirmation" name="password_confirmation" required={1}
                        minLength={8}
                        autoComplete="off"
                        value={this.state.user.password_confirmation || ''}
                        onChange={(e) => { this.changeValue(e) }}
                        className="form-control-blueprint"
            />
          </div> : null}
      </div>


     <div className="form-group__inline-wrapper">
       <div className="form-group form-group_width47">
         <label htmlFor="page-description" className="label__RobotoFont">First Name</label>
         {/*<input type="text" id="first_name" name="first_name"*/}
         {/*       value={this.state.usermeta.first_name || ''}*/}
         {/*       onChange={(e) => { this.changeValue(e, "usermeta") }}*/}
         {/*       className="form-control" />*/}

         <InputGroup type="text" id="first_name" name="first_name"
                     value={this.state.usermeta.first_name || ''}
                     onChange={(e) => { this.changeValue(e, "usermeta") }}
                     className="form-control-blueprint"
         />
       </div>

       <div className="form-group form-group_width47">
         <label htmlFor="page-description" className="label__RobotoFont">Second Name</label>
         {/*<input type="text" id="second_name" name="second_name"*/}
         {/*       value={this.state.usermeta.second_name || ''}*/}
         {/*       onChange={(e) => { this.changeValue(e, "usermeta") }}*/}
         {/*       className="form-control" />*/}

         <InputGroup type="text" id="second_name" name="second_name"
                     value={this.state.usermeta.second_name || ''}
                     onChange={(e) => { this.changeValue(e, "usermeta") }}
                     className="form-control-blueprint"
         />
       </div>
     </div>

      <div className="form-group__inline-wrapper">
        <div className="form-group form-group_width47">
          <label htmlFor="page-description" className="label__RobotoFont">Telegram ID</label>
          {/*<input type="text" id="telegram_user_id" name="telegram_user_id"*/}
          {/*       value={this.state.user.telegram_user_id || ''}*/}
          {/*       onChange={(e) => { this.changeValue(e) }}*/}
          {/*       className="form-control" />*/}

          <InputGroup type="text" id="telegram_user_id" name="telegram_user_id"
                      value={this.state.user.telegram_user_id || ''}
                      onChange={(e) => { this.changeValue(e) }}
                      className="form-control-blueprint"
          />
        </div>

        <div className="form-group form-group_width47">
          <label htmlFor="page-description" className="label__RobotoFont">Patronymic</label>
          {/*<input type="text" id="patronymic" name="patronymic"*/}
          {/*       value={this.state.usermeta.patronymic || ''}*/}
          {/*       onChange={(e) => { this.changeValue(e, "usermeta") }}*/}
          {/*       className="form-control" />*/}

          <InputGroup type="text" id="patronymic" name="patronymic"
                      value={this.state.usermeta.patronymic || ''}
                      onChange={(e) => { this.changeValue(e, "usermeta") }}
                      className="form-control-blueprint"
          />
        </div>
      </div>

      <div className="form-group__inline-wrapper">
        <div className="form-group form-group__multiSelectBlueprint form-group__multiSelectBlueprint-users form-group_width47">
          <label htmlFor="roles" className="label__RobotoFont">Roles</label>
          {/*<AltrpSelect id="roles"*/}
          {/*             closeMenuOnSelect={false}*/}
          {/*             value={_.filter(rolesOptions, r => roles && roles.indexOf(r.value) >= 0)}*/}
          {/*             isMulti={true}*/}
          {/*             onChange={this.changeRolesHandler}*/}
          {/*             options={rolesOptions} />*/}

          <MultiSelect tagRenderer={this.tagRenderer} id="roles"
                       items={rolesOptions}
                       itemPredicate={this.ItemPredicate}
                       noResults={<MenuItem disabled={true} text="No results." />}
                       fill={true}
                       placeholder="Select..."
                       selectedItems={this.state.usermeta.roles}
                       onItemSelect={this.handleItemSelectRoles}
                       itemRenderer={(item, {handleClick, modifiers, query}) => {
                         return (
                           <MenuItem
                             icon={this.isItemSelectedRoles(item) ? "tick" : "blank"}
                             text={item.label}
                             key={item.value}
                             onClick={handleClick}
                           />
                         )
                       }}
                       tagInputProps={{
                         onRemove: this.handleTagRemoveRoles,
                         large: false,
                       }}
                       popoverProps={{
                         usePortal: false
                       }}
          />
        </div>

        <div className="form-group form-group__multiSelectBlueprint form-group__multiSelectBlueprint-users overflow-blueprint__multiSelect form-group_width47">
          <label htmlFor="permissions" className="label__RobotoFont">Permissions</label>
          {/*<AltrpSelect id="permissions"*/}
          {/*             value={_.filter(permissionsOptions, p => permissions && permissions.indexOf(p.value) >= 0)}*/}
          {/*             closeMenuOnSelect={false}*/}
          {/*             isMulti={true}*/}
          {/*             onChange={this.changePermissionsHandler}*/}
          {/*             options={permissionsOptions} />*/}


          <MultiSelect tagRenderer={this.tagRenderer} id="permissions"
                       items={permissionsOptions}
                       itemPredicate={this.ItemPredicate}
                       noResults={<MenuItem disabled={true} text="No results." />}
                       fill={true}
                       placeholder="Select..."
                       selectedItems={this.state.usermeta.permissions}
                       onItemSelect={this.handleItemSelectPermissions}
                       itemRenderer={(item, {handleClick, modifiers, query}) => {
                         return (
                           <MenuItem
                             icon={this.isItemSelectedPermissions(item) ? "tick" : "blank"}
                             text={item.label}
                             key={item.value}
                             onClick={handleClick}
                           />
                         )
                       }}
                       tagInputProps={{
                         onRemove: this.handleTagRemovePermissions,
                         large: false,
                       }}
                       popoverProps={{
                         usePortal: false
                       }}
          />
        </div>
      </div>

      {this.state.id && <div className="form-group">
        <input type="checkbox" id="changePassword"
          checked={isPasswordChange}
          onChange={e => { this.setState({ isPasswordChange: e.target.checked }) }}
        />
        <label className="checkbox-label label__RobotoFont" htmlFor="changePassword">Change Password</label>
      </div>}

      {isPasswordChange && this.state.id && <>
        <div className="form-group">
          <label htmlFor="newPassword" className="label__RobotoFont">New Password</label>
          <input type="password" id="newPassword" name="password" required
            minLength={8}
            value={this.state.user.password || ''}
            onChange={this.changeValue}
            className="form-control" />
        </div>

        <div className="form-group">
          <label htmlFor="page-description" className="label__RobotoFont">Confirm Password</label>
          <input type="password" id="confirmNewPassword" name="password_confirmation" required
            minLength={8}
            value={this.state.user.password_confirmation || ''}
            onChange={this.changeValue}
            className="form-control" />
        </div>
      </>}

      <button className="btn btn_success">{this.state.id ? 'Save' : 'Add'}</button>
    </form>;
  }
}

export default UserForm;
