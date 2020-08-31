import React from "react";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import {
  CssBaseline,
  Button,
  Paper,
  FormGroup,
  FormControl,
  FormControlLabel,
  Switch
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles({
  root: {
    "& .MuiTextField-root": {
      margin: "1rem",
      width: "25ch"
    }
  },
  header: {
    padding: "1rem",
    display: "flex",
    alignItems: "stretch",
    justifyContent: "space-between",
    position: "relative",
    width: "100%"
  },
  headerStart: {
    alignContent: "flex-start",
    borderRight: "1px solid #ebedf2",
    padding: "1rem"
  },
  headerEnd: {
    alignContent: "flex-end"
  },
  paperForm: {
    padding: "1rem"
  },
  paperHeader: {
    padding: "1rem",
    borderBottom: "1px solid #ebedf2"
  },
  margin: {
    margin: "1rem"
  }
});

export const AddStaffPage = () => {
  const classes = useStyles();
  const history = useHistory();

  const API_URL = process.env.REACT_APP_API_URL;
  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState("");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phonenumber, setPhonenumber] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [outletId, setOutletId] = React.useState("");
  const [roleId, setRoleId] = React.useState("");
  const [type, setType] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [allOutlets, setAllOutlets] = React.useState([]);
  const [allAccessLists, setAllAccessLists] = React.useState([]);
  const [allRoles, setAllRoles] = React.useState([]);
  const [filterPrivileges, setFilterPrivileges] = React.useState([]);
  const [cashierAccessList, setCashierAccessList] = React.useState([]);
  const [backendAccessList, setBackendAccessList] = React.useState([]);

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const getAllData = async () => {
    enableLoading();

    try {
      const accesses = await axios.get(`${API_URL}/api/v1/access`);
      setAllAccessLists(accesses.data.data);
    } catch (err) {
      setAllAccessLists([]);
    }

    try {
      const privileges = await axios.get(`${API_URL}/api/v1/privilege`);

      const filterPrivileges = privileges.data.data.filter(
        (item, index, self) => {
          return (
            self.findIndex(selfIndex => selfIndex.name === item.name) === index
          );
        }
      );

      setFilterPrivileges(filterPrivileges);
    } catch (err) {
      setFilterPrivileges([]);
    }

    try {
      const outlets = await axios.get(`${API_URL}/api/v1/outlet`);
      setAllOutlets(outlets.data.data);
    } catch (err) {
      setAllOutlets([]);
    }

    disableLoading();
  };

  const getRoleByOutlet = async (id) => {
    try {
      const roles = await axios.get(
        `${API_URL}/api/v1/role?outlet_id=${id}`
      );
      setAllRoles(roles.data.data);
    } catch (err) {
      setAllRoles([]);
    }
  };

  React.useEffect(() => {
    getAllData();
  }, []);

  const handleOutlet = e => {
    setOutletId(e.target.value);
    getRoleByOutlet(e.target.value);
  };

  const sendData = async () => {
    const allData = {
      name,
      email,
      password,
      phone_number: phonenumber,
      type,
      role_id: roleId,
      outlet_id: outletId
    };

    try {
      enableLoading();
      const staff = await axios.post(`${API_URL}/api/v1/staff`, allData);
      disableLoading();
      history.push("/staff");
    } catch (err) {
      disableLoading();
    }
  };

  return (
    <>
      <CssBaseline />

      <div className={classes.header}>
        <div className={classes.headerStart}>
          <h3>Add Staff</h3>
        </div>
        <div className={classes.headerEnd}>
          <Link to="/staff">
            <Button variant="contained">Cancel</Button>
          </Link>
          <Button
            variant="contained"
            style={{ color: "white" }}
            color="primary"
            onClick={() => sendData()}
          >
            Save
            {loading && (
              <span className="ml-3 mr-3 spinner spinner-white"></span>
            )}
          </Button>
        </div>
      </div>

      {alert ? (
        <div className="mb-10 alert alert-custom alert-light-danger alert-dismissible">
          <div className="alert-text font-weight-bold">{alert}</div>
        </div>
      ) : (
        ""
      )}

      <div className="row">
        <div className="col-md-12">
          <Paper elevation={1} className={classes.paperForm}>
            <div className={classes.paperHeader}>
              <h5>Staff Data (Staff/Manager)</h5>
            </div>

            <form className="kt-form" style={{ padding: "1rem" }}>
              <div className="form-group">
                <label>Outlet</label>
                <select
                  className="form-control"
                  defaultValue={"Default"}
                  onChange={handleOutlet}
                >
                  <option value="Default" disabled hidden>
                    Choose outlet
                  </option>
                  {allOutlets.map(item => {
                    return (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="form-group">
                <label>Type</label>
                <select
                  className="form-control"
                  defaultValue={"Default"}
                  onChange={e => setType(e.target.value)}
                >
                  <option value="Default" disabled hidden>
                    Choose type
                  </option>
                  <option value="Staff">Staff</option>
                  <option value="Manager">Manager</option>
                </select>
              </div>

              <div className="form-group">
                <label>Role</label>
                <select
                  className="form-control"
                  defaultValue={"Default"}
                  onChange={e => setRoleId(e.target.value)}
                >
                  <option value="Default" disabled hidden>
                    Choose role
                  </option>
                  {allRoles.map(item => {
                    return (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter Phone Number"
                  value={phonenumber}
                  onChange={e => setPhonenumber(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter Confirm Password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                />
              </div>
            </form>
          </Paper>
        </div>

        {allAccessLists.map(access => {
          return (
            <div key={access.id} className="col-md-6 mt-5">
              <Paper className={classes.paperForm} elevation={1}>
                <div className={classes.paperHeader}>
                  <h5>{access.name} Access List</h5>
                </div>

                <FormControl component="fieldset">
                  <FormGroup row>
                    {filterPrivileges.map(privilege => {
                      return (
                        <FormControlLabel
                          key={privilege.id}
                          control={
                            <Switch
                              key={privilege.id}
                              value={privilege.name}
                              color="primary"
                              disabled
                            />
                          }
                          label={privilege.name}
                          labelPlacement="start"
                        />
                      );
                    })}
                  </FormGroup>
                </FormControl>
              </Paper>
            </div>
          );
        })}
      </div>
    </>
  );
};
