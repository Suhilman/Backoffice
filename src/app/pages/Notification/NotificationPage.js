import React from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import {
  Row,
  Col,
  Button,
  Form,
  Dropdown,
  InputGroup
  // ListGroup,
  // Container
} from "react-bootstrap";
import DataTable from "react-data-table-component";

import {
  Paper
  // FormGroup,
  // FormControl,
  // FormControlLabel,
  // Switch
} from "@material-ui/core";
import { Search, MoreHoriz } from "@material-ui/icons";

import ModalNotification from "./ModalNotification";
import ConfirmModal from "../../components/ConfirmModal";

import useDebounce from "../../hooks/useDebounce";
import "../style.css";

export const NotificationPage = () => {
  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState("");
  const [refresh, setRefresh] = React.useState(0);
  const { t } = useTranslation();
  const [stateAddModal, setStateAddModal] = React.useState(false);
  const [stateEditModal, setStateEditModal] = React.useState(false);
  const [stateDeleteModal, setStateDeleteModal] = React.useState(false);

  const [allNotifications, setAllNotifications] = React.useState([]);
  const [allPrivileges, setAllPrivileges] = React.useState([]);
  const [allAccessLists, setAllAccessLists] = React.useState([]);
  const [selectedNotification, setSelectedNotification] = React.useState({
    id: "",
    name: ""
  });

  const [search, setSearch] = React.useState("");

  const debouncedSearch = useDebounce(search, 1000);
  const enableLoading = () => setLoading(true);
  const disableLoading = () => setLoading(false);

  const initialNotification = {
    id: "",
    name: "",
    privileges: [
      {
        id: "",
        allow: false
      }
    ]
  };

  const NotificationSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, `${t("minimum3Character")}`)
      .max(50, `${t("maximum50Character")}`)
      .required(`${t("pleaseInputANotificationName")}`),
    privileges: Yup.array().of(
      Yup.object().shape({
        id: Yup.number(),
        allow: Yup.boolean()
      })
    )
  });
  const formikAddNotification = useFormik({
    initialValues: initialNotification,
    validationSchema: NotificationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const API_URL = process.env.REACT_APP_API_URL;

      console.log("Data yang ditambahkan", values)

      try {
        setAlert("");
        enableLoading();
        await axios.post(`${API_URL}/api/v1/devices/send-message/`, values);
        disableLoading();
        handleRefresh();
        closeAddModal();
      } catch (err) {
        setAlert(err.response?.data.message || err.message);
        disableLoading();
      }
    }
  });

  const validationAddNotification = (fieldname) => {
    if (formikAddNotification.touched[fieldname] && formikAddNotification.errors[fieldname]) {
      return "is-invalid";
    }

    if (formikAddNotification.touched[fieldname] && !formikAddNotification.errors[fieldname]) {
      return "is-valid";
    }

    return "";
  };

  const formikEditNotification = useFormik({
    initialValues: initialNotification,
    validationSchema: NotificationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const API_URL = process.env.REACT_APP_API_URL;
      console.log("values notification yang akan di edit", values)

      try {
        setAlert("");
        enableLoading();
        await axios.put(`${API_URL}/api/v1/devices/send-message/${values.id}`, values);


        const localPrivileges = values.privileges.map((item) => {
          const lowerName = item.name
            .split(" ")
            .join("_")
            .toLowerCase();

          return { name: lowerName, allow: item.allow, access: item.access };
        });

        const currLocalStorage = JSON.parse(localStorage.getItem("user_info"));

        if (currLocalStorage.privileges) {
          currLocalStorage.privileges = localPrivileges;
          localStorage.setItem("user_info", JSON.stringify(currLocalStorage));

          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          handleRefresh();
          disableLoading();
          closeEditModal();
        }
      } catch (err) {
        console.log("error edit notificationPage", err)
        setAlert(err.response?.data.message || err.message);
        disableLoading();
      }
    }
  });

  const validationEditNotification = (fieldname) => {
    if (formikEditNotification.touched[fieldname] && formikEditNotification.errors[fieldname]) {
      return "is-invalid";
    }

    if (
      formikEditNotification.touched[fieldname] &&
      !formikEditNotification.errors[fieldname]
    ) {
      return "is-valid";
    }

    return "";
  };

  const handleDeleteNotification = async (id) => {
    const API_URL = process.env.REACT_APP_API_URL;

    try {
      setAlert("");
      enableLoading();
      await axios.delete(`${API_URL}/api/v1/devices/send-message/${id}`);
      disableLoading();
      handleRefresh();
      closeDeleteModal();
    } catch (err) {
      setAlert(err.response?.data.message || err.message);
      disableLoading();
    }
  };

  const getNotifications = async (search) => {
    const API_URL = process.env.REACT_APP_API_URL;

    const filter = search ? `?name=${search}` : "";

    try {
      const userInfo = JSON.parse(localStorage.getItem('user_info'))
      const token = localStorage.getItem('token')

      const resPartition = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/subscription?business_id=${userInfo.business_id}`, {
        headers: { Authorization: token } 
       })
      const subPartitionId = resPartition.data.data[0].subscription_partition_id 
      const resSubsPartitionPrivileges = await axios.get(`${API_URL}/api/v1/subscription-partition-privilege?subscription_partition_id=${subPartitionId}`, {
        headers: {
          Authorization: token
        }
      });
      const privilegeDataOwner = resSubsPartitionPrivileges.data.data.map((item) => {
        return {
          id: item.Privilege.id,
          allow: false,
          name: item.Privilege.name,
          access: item.Privilege.Access.name,
          allowShow: item.allow
        };
      });

      console.log("data compare", privilegeDataOwner)

      // const { data } = await axios.get(`${API_URL}/api/v1/notification${filter}`);
      const { data } = await axios.get(`${API_URL}/api/v1/devices/send-message/development${filter}`);

      console.log("data all notifications", data.data)
      // data.data[0].Notification_Privileges[0].privilege_id
      // iniPrivilegenya[0].id && iniPrivilegenya[0].allowShow
      const array1 = []
      for (const data of data.data) {
        const cobi = data.Notification_Privileges.slice(0, 0)
        array1.push(cobi)
      }
      console.log("array 1 sebelum", array1)

      for (const [index, value] of data.data.entries()) {
        for(const value2 of privilegeDataOwner) {
          for (const value3 of value.Notification_Privileges) {
            if(value2.id === value3.privilege_id && value2.allowShow) {
              array1[index].push(value3)
            } 
            if(value2.id === value3.privilege_id && !value2.allowShow) {
              console.log("yang tidak masuk pengkondisian", value3)
              await axios.put(`${API_URL}/api/v1/devices/send-message/update-privilege`, {
                id: value3.id,
                allow: false
              })
            }
          }
        }
      }

      console.log("array 1 sesudah", array1)

      const array2 = []
      data.data.map(value => {
        value.Notification_Privileges = []
        array2.push(value)
      })
      array2.map((value, index) => {
        value.Notification_Privileges = array1[index]
      })
      console.log("data akhir", data.data)
      setAllNotifications(data.data);
    } catch (err) {
      setAllNotifications([]);
    }
  };

  // const getAccess = async () => {
  //   const API_URL = process.env.REACT_APP_API_URL;
  //   try {
  //     const { data } = await axios.get(`${API_URL}/api/v1/access`);
  //     setAllAccessLists(data.data);
  //   } catch (err) {
  //     setAllAccessLists([]);
  //   }
  // };

  const camelize = (str) => {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
  }

  const getPrivileges = async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    try {
      const userInfo = JSON.parse(localStorage.getItem('user_info'))
      const token = localStorage.getItem('token')

      const resPartition = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/subscription?business_id=${userInfo.business_id}`, {
        headers: { Authorization: token } 
       })
      const subPartitionId = resPartition.data.data[0].subscription_partition_id 
      const resSubsPartitionPrivileges = await axios.get(`${API_URL}/api/v1/subscription-partition-privilege?subscription_partition_id=${subPartitionId}&allow=1`, {
        headers: {
          Authorization: token
        }
      });
      const { data } = await axios.get(`${API_URL}/api/v1/privilege`);

      const accesses = [...new Set(data.data.map((item) => item.Access.name))];

      console.log("accesses", accesses)
      // output => ["Cashier", "Backend"]

      const privilegeData = data.data.map((item) => {
        return {
          id: item.id,
          allow: false,
          name: item.name,
          access: item.Access.name
        };
      });
      const privilegeDataOwner = resSubsPartitionPrivileges.data.data.map((item) => {
        return {
          id: item.Privilege.id,
          allow: false,
          name: camelize(item.Privilege.name),
          access: item.Privilege.Access.name,
          allowShow: item.allow
        };
      });

      // handle hide commisison management
      privilegeDataOwner.map((value, index) => {
        if(value.name === 'commissionManagement') {
          delete privilegeDataOwner[index]
        }
      })

      console.log("privilegeDataOwner", privilegeDataOwner)
      // output => {id: 1, allow: false, name: "Cashier Transaction", access: "Cashier"}

      formikAddNotification.setFieldValue("privileges", privilegeDataOwner);

      setAllAccessLists(accesses);
      setAllPrivileges(privilegeDataOwner);
    } catch (err) {
      setAllPrivileges([]);
    }
  };


  React.useEffect(() => {
    getPrivileges();
  }, []);

  React.useEffect(() => {
    getNotifications(debouncedSearch);
  }, [debouncedSearch, refresh]);

  const handleRefresh = () => setRefresh(refresh + 1);

  const handleSearch = (e) => setSearch(e.target.value);

  const showAddModal = () => setStateAddModal(true);
  const closeAddModal = () => {
    formikAddNotification.resetForm();
    formikAddNotification.setFieldValue("privileges", allPrivileges);
    setStateAddModal(false);
  };

  const showEditModal = (data) => {
    formikEditNotification.setFieldValue("id", data.id);
    formikEditNotification.setFieldValue("name", data.name);
    formikEditNotification.setFieldValue("privileges", data.privileges);

    setStateEditModal(true);
  };
  const closeEditModal = () => setStateEditModal(false);

  const showDeleteModal = (data) => {
    setAlert("");
    setSelectedNotification({
      id: data.id,
      name: data.name
    });
    setStateDeleteModal(true);
  };
  const closeDeleteModal = () => setStateDeleteModal(false);

  const dataNotification = () => {
    return allNotifications.map((item, index) => {
      const access = item.Notification_Privileges.filter((item) => item.allow).map(
        (item) => item.Privilege?.Access.name
      );
      const filterAccess = [...new Set(access)];
      const privilegeData = item.Notification_Privileges.map((val) => {
        return {
          id: val.privilege_id,
          name: camelize(val.Privilege.name),
          allow: val.allow,
          access: val.Privilege?.Access.name
        };
      });

      // handle hide commisison management
      privilegeData.map((value, index) => {
        if(value.name === 'commissionManagement') {
          delete privilegeData[index]
        }
      })

      return {
        id: item.id,
        no: index + 1,
        name: camelize(item.name) === 'superadmin' ? t('superadmin') : camelize(item.name) === 'admin' ? t('admin') : camelize(item.name) === 'common' ? t('common') : item.name,
        access: filterAccess.join(", "),
        privileges: privilegeData,
        default: item.is_deletable ? "No" : "Yes"
      };
    });
  };

  const columns = [
    {
      name: `${t('no')}`,
      selector: "no",
      sortable: true,
      width: "50px"
    },
    {
      name: `${t("name")}`,
      selector: "name",
      sortable: true
    },
    {
      name: `${t("access")}`,
      selector: "access",
      sortable: true
    },
    {
      name: `${t("default")}`,
      selector: "default",
      sortable: true
    },
    {
      name: `${t("actions")}`,
      cell: (rows) => {
        return (
          <Dropdown>
            <Dropdown.Toggle variant="secondary">
              <MoreHoriz color="action" />
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item as="button" onClick={() => showEditModal(rows)}>
              {t("edit")}
              </Dropdown.Item>
              <Dropdown.Item as="button" onClick={() => showDeleteModal(rows)}>
              {t("delete")}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        );
      }
    }
  ];

  // const ExpandableComponent = ({ data }) => {
  //   return (
  //     <>
  //       <ListGroup style={{ padding: "1rem", marginLeft: "1rem" }}>
  //         <ListGroup.Item>
  //           <Row>
  //             {data.privileges.length
  //               ? allAccessLists.map((access) => {
  //                   return (
  //                     <Col key={access.id}>
  //                       <Paper
  //                         elevation={2}
  //                         style={{ padding: "1rem", height: "100%" }}
  //                       >
  //                         <h5>{access.name} Access List</h5>

  //                         <FormControl
  //                           component="fieldset"
  //                           style={{ width: "100%" }}
  //                         >
  //                           <FormGroup row>
  //                             <Container style={{ padding: "0" }}>
  //                               {data.privileges.map((privilege, index) => {
  //                                 if (access.name === privilege.Access.name) {
  //                                   return (
  //                                     <Row
  //                                       key={index}
  //                                       style={{ padding: "0.5rem 1rem" }}
  //                                     >
  //                                       <Col style={{ alignSelf: "center" }}>
  //                                         <Form.Label>
  //                                           {privilege.Privilege.name}
  //                                         </Form.Label>
  //                                       </Col>
  //                                       <Col style={{ textAlign: "end" }}>
  //                                         <FormControlLabel
  //                                           key={privilege.Privilege.id}
  //                                           control={
  //                                             <Switch
  //                                               key={privilege.Privilege.id}
  //                                               value={privilege.Privilege.name}
  //                                               color="primary"
  //                                               checked={privilege.allow}
  //                                               style={{
  //                                                 cursor: "not-allowed"
  //                                               }}
  //                                             />
  //                                           }
  //                                         />
  //                                       </Col>
  //                                     </Row>
  //                                   );
  //                                 } else {
  //                                   return "";
  //                                 }
  //                               })}
  //                             </Container>
  //                           </FormGroup>
  //                         </FormControl>
  //                       </Paper>
  //                     </Col>
  //                   );
  //                 })
  //               : ""}
  //           </Row>
  //         </ListGroup.Item>
  //       </ListGroup>
  //     </>
  //   );
  // };

  const handleSelectAll = (state) => {
    let temp_field_props;
    let formik;
    if(stateAddModal) {
      temp_field_props = formikAddNotification.getFieldProps("privileges").value
      formik = formikAddNotification
    }
    if(stateEditModal) {
      temp_field_props = formikEditNotification.getFieldProps("privileges").value
      formik = formikEditNotification
    }
    let allow_false = 0
  
    temp_field_props.map(value => {
      if(value.access === state) {
        if(!value.allow) {
          allow_false += 1
        }
      }
    })

    if(allow_false === 0) {
      temp_field_props.map(value => {
          if(value.access === state) {
            value.allow = false
          }
        })
    } else {
      temp_field_props.map(value => {
        if(value.access === state) {
          value.allow = true
        }
      })
    }
    formik.setFieldValue("privileges", temp_field_props);
  }

  return (
    <>
      <ModalNotification
        t={t}
        state={stateAddModal}
        closeModal={closeAddModal}
        loading={loading}
        alert={alert}
        title={t("Send New Notification")}
        formikNotification={formikAddNotification}
        validationNotification={validationAddNotification}
        accessLists={allAccessLists}
        handleSelectAll={handleSelectAll}
      />

      <ModalNotification
        t={t}
        state={stateEditModal}
        closeModal={closeEditModal}
        loading={loading}
        alert={alert}
        title={`${t("editNotification")} - ${formikEditNotification.getFieldProps("name").value}`}
        formikNotification={formikEditNotification}
        validationNotification={validationEditNotification}
        accessLists={allAccessLists}
        handleSelectAll={handleSelectAll}
      />

      <ConfirmModal
        title={`${t("deleteNotification")} - ${selectedNotification.name}`}
        body={t("areYouSureWantToDelete?")}
        buttonColor="danger"
        state={stateDeleteModal}
        closeModal={closeDeleteModal}
        handleClick={() => handleDeleteNotification(selectedNotification.id)}
        loading={loading}
        alert={alert}
      />

      <Row>
        <Col>
          <Paper elevation={2} style={{ padding: "1rem", height: "100%" }}>
            <div className="headerPage">
              <div className="headerStart">
                <h3>{t("Notification Management")}</h3>
              </div>
              <div className="headerEnd">
                <Button
                  variant="success"
                  style={{ marginLeft: "0.5rem" }}
                  onClick={showAddModal}
                >
                  {t("Send Notification")}
                </Button>
              </div>
            </div>

            <div className="filterSection lineBottom">
              <Row>
                <Col>
                  <InputGroup className="pb-3">
                    <InputGroup.Prepend>
                      <InputGroup.Text style={{ background: "transparent" }}>
                        <Search />
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      placeholder={t("search")}
                      value={search}
                      onChange={handleSearch}
                    />
                  </InputGroup>
                </Col>
              </Row>
            </div>

            <DataTable
              noHeader
              pagination
              columns={columns}
              data={dataNotification()}
              // expandableRows
              // expandableRowsComponent={<ExpandableComponent />}
              style={{ minHeight: "100%" }}
              noDataComponent={t('thereAreNoRecordsToDisplay')}
            />
          </Paper>
        </Col>
      </Row>
    </>
  );
};
