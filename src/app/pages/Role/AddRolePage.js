import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  CssBaseline,
  Button,
  Paper,
  FormGroup,
  FormControl,
  FormControlLabel,
  Switch,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
  root: {
    '& .MuiTextField-root': {
      margin: '1rem',
      width: '25ch',
    },
  },
  header: {
    padding: '1rem',
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    position: 'relative',
    width: '100%',
  },
  headerStart: {
    alignContent: 'flex-start',
    borderRight: '1px solid #ebedf2',
    padding: '1rem',
  },
  headerEnd: {
    alignContent: 'flex-end',
  },
  paperForm: {
    padding: '1rem',
  },
  paperHeader: {
    padding: '1rem',
    borderBottom: '1px solid #ebedf2',
  },
  margin: {
    margin: '1rem',
  },
});

export const AddRolePage = () => {
  const classes = useStyles();

  const API_URL = process.env.REACT_APP_API_URL;
  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState('');
  const [outletId, setOutletId] = React.useState('');
  const [name, setName] = React.useState('');
  const [allAccessLists, setAllAccessLists] = React.useState([]);
  const [allPrivileges, setAllPrivileges] = React.useState([]);
  const [allOutlets, setAllOutlets] = React.useState([]);
  const [allRoles, setAllRoles] = React.useState([]);
  const [filterPrivileges, setFilterPrivileges] = React.useState([]);
  const [cashierAccessList, setCashierAccessList] = React.useState([]);
  const [backendAccessList, setBackendAccessList] = React.useState([]);

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const getAllData = async () => {
    try {
      enableLoading();

      const accesses = await axios.get(`${API_URL}/api/v1/access`);
      const privileges = await axios.get(`${API_URL}/api/v1/privilege`);
      const roles = await axios.get(`${API_URL}/api/v1/role`);

      const filterPrivileges = privileges.data.data.filter(
        (item, index, self) => {
          return (
            self.findIndex((selfIndex) => selfIndex.name === item.name) ===
            index
          );
        }
      );

      setAllAccessLists(accesses.data.data);
      setAllPrivileges(privileges.data.data);
      setAllRoles(roles.data.data);
      setFilterPrivileges(filterPrivileges);

      disableLoading();
    } catch (err) {
      setAllAccessLists([]);
      setAllPrivileges([]);
      disableLoading();
    }
  };

  React.useEffect(() => {
    getAllData();
  }, []);

  const handleAccessListStaff = (e, access_id) => {
    const status = e.target.checked;
    const privilegeName = e.target.value;

    if (status && access_id === 1) {
      setCashierAccessList([
        ...cashierAccessList,
        { access_id, privilegeName },
      ]);
    } else if (!status && access_id === 1) {
      const filter = cashierAccessList.filter((item) => {
        if (item.privilegeName === privilegeName) {
          return item.access_id !== access_id;
        } else {
          return item;
        }
      });
      setCashierAccessList(filter);
    } else if (status && access_id === 2) {
      setBackendAccessList([
        ...backendAccessList,
        { access_id, privilegeName },
      ]);
    } else {
      const filter = backendAccessList.filter((item) => {
        if (item.privilegeName === privilegeName) {
          return item.access_id !== access_id;
        } else {
          return item;
        }
      });
      setBackendAccessList(filter);
    }
  };

  const sendData = () => {
    const cashierData = allPrivileges
      .filter((privilege) => {
        for (const item of cashierAccessList) {
          if (privilege.name === item.privilegeName) {
            return privilege;
          }
        }
      })
      .map((privilege) => {
        for (const item of cashierAccessList) {
          return {
            privilege_id: privilege.id,
            access_id: item.access_id,
          };
        }
      });

    const backendData = allPrivileges
      .filter((privilege) => {
        for (const item of backendAccessList) {
          if (privilege.name === item.privilegeName) {
            return privilege;
          }
        }
      })
      .map((privilege) => {
        for (const item of backendAccessList) {
          return {
            privilege_id: privilege.id,
            access_id: item.access_id,
          };
        }
      });

    const allData = {
      outlet_id: outletId,
      name,
      accessPrivileges: [...cashierData, ...backendData],
    };
  };

  return (
    <>
      <CssBaseline />

      <div className={classes.header}>
        <div className={classes.headerStart}>
          <h3>Add Role</h3>
        </div>
        <div className={classes.headerEnd}>
          <Link to="/role">
            <Button variant="outlined">Cancel</Button>
          </Link>
          <Button variant="outlined" color="primary">
            Save
          </Button>
        </div>
      </div>

      {alert ? (
        <div className="mb-10 alert alert-custom alert-light-danger alert-dismissible">
          <div className="alert-text font-weight-bold">{alert}</div>
        </div>
      ) : (
        ''
      )}

      <div className="row">
        <div className="col-md-12">
          <Paper elevation={1} className={classes.paperForm}>
            <div className={classes.paperHeader}>
              <h5>Staff Data (Staff/Manager)</h5>
            </div>

            <div className="form-group">
              <label>Outlet</label>
              <select
                className="form-control"
                value={outletId}
                onChange={(e) => setOutletId(e.target.value)}
              >
                {allOutlets.map((item) => {
                  return (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
            </div>

            <form className="kt-form" style={{ padding: '1rem' }}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </form>
          </Paper>
        </div>

        {allAccessLists.map((access) => {
          return (
            <div className="col-md-6 mt-5">
              <Paper
                key={access.id}
                className={classes.paperForm}
                elevation={1}
              >
                <div className={classes.paperHeader}>
                  <h5>{access.name} Access List</h5>
                </div>

                <FormControl component="fieldset">
                  <FormGroup row>
                    {filterPrivileges.map((privilege) => {
                      return (
                        <FormControlLabel
                          key={privilege.id}
                          control={
                            <Switch
                              key={privilege.id}
                              // checked={stateSwitch}
                              value={privilege.name}
                              onChange={(e) =>
                                handleAccessListStaff(e, access.id)
                              }
                              color="primary"
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
