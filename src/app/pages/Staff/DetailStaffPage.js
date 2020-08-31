import React from "react";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import {
  CssBaseline,
  Button,
  IconButton,
  Paper,
  FormGroup,
  FormControl,
  FormControlLabel,
  Switch
} from "@material-ui/core";
import { Edit } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";
import { Row, Col, Form } from "react-bootstrap";

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
    width: "100%",
    borderBottom: "1px solid #ebedf2"
  },
  headerStart: {
    alignContent: "flex-start",
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
  },
  title: {
    fontSize: "1rem",
    fontWeigth: "400"
  }
});

export const DetailStaffPage = props => {
  const classes = useStyles();
  const history = useHistory();
  const { staffId } = props.match.params;

  const API_URL = process.env.REACT_APP_API_URL;
  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState("");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phonenumber, setPhonenumber] = React.useState("");
  const [image, setImage] = React.useState("");
  const [outletId, setOutletId] = React.useState("");
  const [roleId, setRoleId] = React.useState("");
  const [type, setType] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [filterPrivileges, setFilterPrivileges] = React.useState([]);
  const [allTypes, setAllTypes] = React.useState([]);
  const [allRoles, setAllRoles] = React.useState([]);
  const [allOutlets, setAllOutlets] = React.useState([]);
  const [staff, setStaff] = React.useState("");
  const [preview, setPreview] = React.useState("");
  const [statePage, setStatePage] = React.useState("show");
  const imageFile = React.useRef();

  const cancelAxios = axios.CancelToken.source();

  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const getAllData = async () => {
    enableLoading();

    try {
      const privileges = await axios.get(`${API_URL}/api/v1/privilege`, {
        cancelToken: cancelAxios.token
      });

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

    try {
      const staff = await axios.get(`${API_URL}/api/v1/staff/${staffId}`, {
        cancelToken: cancelAxios.token
      });

      const staffData = staff.data.data;

      setName(staffData.name);
      setEmail(staffData.User.email);
      setImage(`${API_URL}/${staffData.profile_picture}`);
      setPhonenumber(staffData.phone_number || "");
      setType(staffData.User.type || "");
      setRoleId(staffData.User.role_id || "");
      setOutletId(staffData.outlet_id);
      setLocation(staffData.Outlet.Location.name || "");

      getRoleByOutlet(staffData.outlet_id);
    } catch (err) {
      setStaff("");
    }

    const types = ["Staff", "Manager", "Kasir", "Waiter"];
    setAllTypes(types);

    disableLoading();
  };

  const getRoleByOutlet = async id => {
    try {
      const roles = await axios.get(`${API_URL}/api/v1/role?outlet_id=${id}`);

      setAllRoles(roles.data.data);
    } catch (err) {
      setAllRoles([]);
    }
  };

  React.useEffect(() => {
    getAllData();
    return () => cancelAxios.cancel();
  }, []);

  const handleImage = e => {
    let preview;
    let img;

    if (e.target.files && e.target.files[0]) {
      preview = URL.createObjectURL(e.target.files[0]);
      img = e.target.files[0];
    } else {
      preview = "";
    }

    setImage(img);
    setPreview(preview);
  };

  const sendData = async e => {
    e.preventDefault();

    const allData = new FormData();
    allData.append("name", name);
    allData.append("email", email);
    allData.append("role_id", roleId);
    allData.append("type", type);
    allData.append("profile_picture", image);
    allData.append("phone_number", phonenumber);
    allData.append("outlet_id", outletId);

    let check = false;

    for (const [key, value] of allData.entries()) {
      if (!value) {
        setAlert(`Please input ${key}`);
        check = false;
      } else {
        setAlert("");
        check = true;
      }
    }

    if (!alert && check) {
      try {
        enableLoading();

        const staff = await axios.put(
          `${API_URL}/api/v1/staff/${staffId}`,
          allData
        );

        disableLoading();
        setAlert("");
        setStatePage("show");
      } catch (err) {
        setAlert(err.response.message);
        disableLoading();
      }
    }
  };

  const handleStatePage = () => {
    if (statePage === "show") {
      setStatePage("edit");
    } else {
      setStatePage("show");
    }
  };

  const handleOutlet = e => {
    setOutletId(e.target.value);
    getRoleByOutlet(e.target.value);
  };

  return (
    <>
      <CssBaseline />

      <div className={classes.header}>
        <div className={classes.headerStart}>
          <h3>Staff Details</h3>
        </div>
        <div className={classes.headerEnd}>
          <Link to="/staff">
            <Button variant="contained">Back to staff list</Button>
          </Link>
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
            <div className={classes.header}>
              <div className={classes.headerStart}>
                <h3>Staff Information</h3>
              </div>

              <div className={classes.headerEnd}>
                <Button
                  variant="contained"
                  color={statePage === "show" ? "primary" : "secondary"}
                  style={{ color: "white" }}
                  onClick={handleStatePage}
                >
                  {statePage === "show" ? "Edit Staff Data" : "Cancel"}
                </Button>

                {statePage === "show" ? (
                  ""
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ marginLeft: "1rem", color: "white" }}
                    onClick={sendData}
                  >
                    Save
                  </Button>
                )}
              </div>
            </div>

            <Row style={{ padding: "1rem" }}>
              <Col md={3}>
                <Paper
                  elevation={2}
                  style={{
                    width: "120px",
                    height: "120px",
                    overflow: "hidden",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundImage: `url(${preview || image})`
                  }}
                >
                  {statePage === "edit" ? (
                    <>
                      <input
                        accept="image/jpeg,image/png"
                        style={{ display: "none" }}
                        id="icon-button-file"
                        type="file"
                        onChange={handleImage}
                      />
                      <label htmlFor="icon-button-file">
                        <IconButton
                          color="secondary"
                          aria-label="upload picture"
                          component="span"
                          style={{
                            position: "absolute",
                            left: "-5px",
                            top: "-20px"
                          }}
                        >
                          <Edit />
                        </IconButton>
                      </label>
                    </>
                  ) : (
                    ""
                  )}
                </Paper>

                <p className="text-muted mt-1">
                  Allowed file types: .png, .jpg, .jpeg
                </p>
              </Col>

              <Col md={3}>
                <div className={classes.title}>Staff Name</div>
                {statePage === "show" ? (
                  <h5 className="mb-5">{name}</h5>
                ) : (
                  <Form.Control
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                )}

                <div className={classes.title}>Staff Email</div>
                {statePage === "show" ? (
                  <h5>{email}</h5>
                ) : (
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                )}
              </Col>

              <Col md={3}>
                <div className={classes.title}>Staff Role</div>
                {statePage === "show" ? (
                  allRoles.map(item => {
                    if (item.id === parseInt(roleId)) {
                      return (
                        <h5 key={item.id} className="mb-5">
                          {item.name}
                        </h5>
                      );
                    }
                  })
                ) : (
                  <Form.Control
                    as="select"
                    value={roleId}
                    onChange={e => setRoleId(e.target.value)}
                  >
                    {allRoles.map(item => {
                      return (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      );
                    })}
                  </Form.Control>
                )}

                <div className={classes.title}>Staff Type</div>
                {statePage === "show" ? (
                  <h5>{type}</h5>
                ) : (
                  <Form.Control
                    as="select"
                    value={type}
                    onChange={e => setType(e.target.value)}
                  >
                    {allTypes.map((item, index) => {
                      return (
                        <option key={index} value={item}>
                          {item}
                        </option>
                      );
                    })}
                  </Form.Control>
                )}
              </Col>

              <Col md={3}>
                <div className={classes.title}>Staff Location</div>
                {statePage === "show" ? (
                  <h5 className="mb-5">{location}</h5>
                ) : (
                  <Form.Control
                    as="select"
                    defaultValue={outletId}
                    onChange={handleOutlet}
                  >
                    {allOutlets.map(item => {
                      return (
                        <option key={item.id} value={item.id}>
                          {item.Location.name}
                        </option>
                      );
                    })}
                  </Form.Control>
                )}

                <div className={classes.title}>Staff Phone Number</div>
                {statePage === "show" ? (
                  <h5>{phonenumber}</h5>
                ) : (
                  <Form.Control
                    type="number"
                    value={phonenumber}
                    onChange={e => setPhonenumber(e.target.value)}
                  />
                )}
              </Col>
            </Row>

            <Row>
              <Col>
                <div className={classes.header}>
                  <div className={classes.headerStart}>
                    <h3>Access List</h3>
                  </div>
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
                              disabled
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
              </Col>
            </Row>
          </Paper>
        </div>

        {/*{allAccessLists.map(access => {
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
                              // checked={stateSwitch}
                              value={privilege.name}
                              onChange={e =>
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
        })}*/}
      </div>
    </>
  );
};
