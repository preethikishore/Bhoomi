import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { MDBDataTable } from "mdbreact";
import toastr from "toastr";
import { Row, Col, Card, CardBody, Button, Label } from "reactstrap";
//SweetAlert
import SweetAlert from "react-bootstrap-sweetalert";
import Select from "react-select";
import {
  getUsers,
  addUser,
  deleteUser,
  apiError,
  getPrivilagesOptions,
  getCompaniesOptions,
  getBranchesOptions,
  updateUser,
} from "../../store/actions";

// Redux
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { AvForm, AvField } from "availity-reactstrap-validation";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import "./user.scss";

const Users = (props) => {
  const [selectedPrivilage, setSelectedPrivilage] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [user, setUser] = useState({});
  const [userIdTobeUpdated, setUserIdToBeUpdated] = useState(null);
  const [userIdToBeDeleted, setUserIdToBeDeleted] = useState(null);
  const [confirmDeleteAlert, setConfirmDeleteAlert] = useState(null);

  const {
    users,
    addingUser,
    addUserResponse,
    deleteUserResponse,
    editUserResponse,
    error,
  } = useSelector((state) => state.users);

  const privilagesOptions = useSelector(
    (state) => state.privilages.privilagesOptions
  );
  const companiesOptions = useSelector(
    (state) => state.companies.companiesOptions
  );
  const branchesOptions = useSelector(
    (state) => state.branches.branchesOptions
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUsers());
    dispatch(getPrivilagesOptions());
    dispatch(getCompaniesOptions());
  }, []);

  useEffect(() => {
    if (selectedCompany !== null) {
      dispatch(getBranchesOptions(selectedCompany.value));
    }
  }, [selectedCompany]);

  useEffect(() => {
    if (addUserResponse.type === "success") {
      toastr.success(addUserResponse.message);
    } else if (addUserResponse.type === "failure") {
      toastr.error(error.data.message, addUserResponse.message);
    }
  }, [addUserResponse]);

  useEffect(() => {
    if (deleteUserResponse.type === "success") {
      toastr.success(deleteUserResponse.message);
    } else if (deleteUserResponse.type === "failure") {
      toastr.error(error.data.message, deleteUserResponse.message);
    }
  }, [deleteUserResponse]);

  useEffect(() => {
    if (editUserResponse.type === "success") {
      toastr.success(editUserResponse.message);
      setUserIdToBeUpdated(null);
    } else if (editUserResponse.type === "failure") {
      toastr.error(error.data.message, editUserResponse.message);
    }
  }, [editUserResponse]);

  let preUpdateUser = (user) => {
    let privilage =
      privilagesOptions &&
      privilagesOptions.data &&
      privilagesOptions.data.find(
        (privilage) => privilage._id === user.privilage
      );

    if (privilage) {
      privilage = { label: privilage.name, value: privilage._id };
      handleSelectedPrivilage(privilage);
    }
    setUserIdToBeUpdated(user._id);
    setUser({ ...user, password: "" });
  };

  let userData =
    users &&
    users.map((user) => {
      user.action = (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <i
            className="uil-edit-alt"
            style={{ fontSize: "1.3em", cursor: "pointer" }}
            onClick={() => {
              preUpdateUser(user);
            }}
          ></i>
          <i
            className="uil-trash-alt"
            style={{ fontSize: "1.3em", cursor: "pointer" }}
            onClick={() => {
              setUserIdToBeDeleted(user._id);
              setConfirmDeleteAlert(true);
            }}
          ></i>
        </div>
      );

      user.privilage = <div>{user.privilage && user.privilage.name}</div>;
      user.company = <div>{user.company && user.company.name}</div>;
      user.branch = <div>{user.branch && user.branch.name}</div>;

      return user;
    });

  const data = {
    columns: [
      {
        label: "#",
        field: "userId",
        sort: "asc",
        width: 150,
      },
      {
        label: "Name",
        field: "firstName",
        sort: "asc",
        width: 270,
      },
      {
        label: "Email",
        field: "email",
        sort: "asc",
        width: 200,
      },
      {
        label: "Mobile",
        field: "mobile",
        sort: "asc",
        width: 100,
      },
      {
        label: "Privilage",
        field: "privilage",
        sort: "asc",
        width: 150,
      },
      {
        label: "Company",
        field: "company",
        sort: "asc",
        width: 150,
      },
      {
        label: "Branch",
        field: "branch",
        sort: "asc",
        width: 100,
      },
      {
        label: "Action",
        field: "action",
        width: 100,
      },
    ],
    rows: userData,
  };

  let privilagesOptionsData =
    privilagesOptions &&
    privilagesOptions.data &&
    privilagesOptions.data.map((item) => {
      return {
        label: item.name,
        value: item._id,
      };
    });

  let companiesOptionsData =
    companiesOptions &&
    companiesOptions.data &&
    companiesOptions.data.map((item) => {
      return {
        label: item.name,
        value: item._id,
      };
    });

  let branchesOptionsData =
    branchesOptions &&
    branchesOptions.data &&
    branchesOptions.data.map((item) => {
      return {
        label: item.name,
        value: item._id,
      };
    });

  const privilagesOptionsGroup = [
    {
      options: privilagesOptionsData,
    },
  ];

  const companiesOptionsGroup = [
    {
      options: companiesOptionsData,
    },
  ];

  const branchesOptionsGroup = [
    {
      options: branchesOptionsData,
    },
  ];

  function handleChangeUser(e) {
    let name = e.target.name;
    let value = e.target.value;
    setUser({ ...user, [name]: value });
  }

  function handleSelectedPrivilage(value) {
    setSelectedPrivilage({ value });
    setUser({ ...user, privilage: value.value });
  }

  function handleSelectedCompany(value) {
    setSelectedCompany(value);
    setUser({ ...user, company: value.value });
  }
  function handleSelectedBranch(value) {
    setSelectedBranch(value);
    setUser({ ...user, branch: value.value });
  }

  // handleValidSubmit
  const handleValidSubmit = (event, values) => {
    userIdTobeUpdated ? dispatch(updateUser(user)) : dispatch(addUser(user));
  };

  return (
    <React.Fragment>
      {confirmDeleteAlert ? (
        <SweetAlert
          title=""
          showCancel
          confirmButtonText="Delete"
          confirmBtnBsStyle="success"
          cancelBtnBsStyle="danger"
          onConfirm={() => {
            dispatch(deleteUser(userIdToBeDeleted));
            setConfirmDeleteAlert(false);
          }}
          onCancel={() => setConfirmDeleteAlert(false)}
        >
          Are you sure you want to delete it?
        </SweetAlert>
      ) : null}
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Home" breadcrumbItem="Manage Users" />
          <Row>
            <Col xl="12">
              <Card>
                <CardBody>
                  <AvForm
                    className="needs-validation"
                    onValidSubmit={(e, v) => {
                      handleValidSubmit(e, v);
                    }}
                  >
                    <Row>
                      <Col md="3">
                        <div className="mb-3">
                          <Label htmlFor="validationCustom01">First name</Label>
                          <AvField
                            name="firstName"
                            placeholder="First name"
                            type="text"
                            errorMessage="Enter First Name"
                            className="form-control"
                            validate={{ required: { value: true } }}
                            id="validationCustom01"
                            value={user.firstName}
                            onChange={handleChangeUser}
                          />
                        </div>
                      </Col>
                      <Col md="3">
                        <div className="mb-3">
                          <Label htmlFor="validationCustom02">Last name</Label>
                          <AvField
                            name="lastName"
                            placeholder="Last name"
                            type="text"
                            errorMessage="Enter Last name"
                            className="form-control"
                            validate={{ required: { value: true } }}
                            id="validationCustom02"
                            value={user.lastName}
                            onChange={handleChangeUser}
                          />
                        </div>
                      </Col>

                      <Col md="3">
                        <div className="mb-3">
                          <Label htmlFor="validationCustom03">Email</Label>
                          <AvField
                            name="email"
                            placeholder="Email"
                            type="email"
                            errorMessage="Enter valid Email"
                            className="form-control"
                            validate={{ required: { value: true } }}
                            id="validationCustom03"
                            value={user.email}
                            onChange={handleChangeUser}
                          />
                        </div>
                      </Col>
                      <Col md="3">
                        <div className="mb-3">
                          <Label htmlFor="validationCustom03">Username</Label>
                          <AvField
                            name="username"
                            placeholder="Username"
                            type="text"
                            errorMessage="Enter valid Username"
                            className="form-control"
                            validate={{ required: { value: true } }}
                            id="validationCustom03"
                            value={user.username}
                            onChange={handleChangeUser}
                          />
                        </div>
                      </Col>
                      <Col md="3">
                        <div className="mb-3">
                          <Label htmlFor="validationCustom04">Mobile</Label>
                          <AvField
                            name="mobile"
                            placeholder="Mobile"
                            type="text"
                            errorMessage="Please provide a valid mobile."
                            className="form-control"
                            validate={{ required: { value: true } }}
                            id="validationCustom04"
                            value={user.mobile}
                            onChange={handleChangeUser}
                          />
                        </div>
                      </Col>
                      <Col md={4}>
                        <div className="mb-3">
                          <Label>Prililage</Label>
                          <Select
                            name="privilage"
                            value={selectedPrivilage}
                            onChange={(value) => {
                              handleSelectedPrivilage(value);
                            }}
                            options={privilagesOptionsGroup}
                            classNamePrefix="select2-selection"
                          />
                        </div>
                      </Col>
                      <Col md={4}>
                        <div className="mb-3">
                          <Label>Company</Label>
                          <Select
                            name="company"
                            value={selectedCompany}
                            onChange={(value) => {
                              handleSelectedCompany(value);
                            }}
                            options={companiesOptionsGroup}
                            classNamePrefix="select2-selection"
                          />
                        </div>
                      </Col>
                      <Col md={4}>
                        <div className="mb-3">
                          <Label>Branch</Label>
                          <Select
                            name="branch"
                            value={selectedBranch}
                            onChange={(value) => {
                              handleSelectedBranch(value);
                            }}
                            options={branchesOptionsGroup}
                            classNamePrefix="select2-selection"
                          />
                        </div>
                      </Col>
                      <Col md="3">
                        <div className="mb-3">
                          <Label htmlFor="validationCustom05">Password</Label>
                          <AvField
                            name="password"
                            placeholder="Password"
                            type="password"
                            errorMessage=" Please provide a valid password"
                            className="form-control"
                            validate={{ required: { value: true } }}
                            id="validationCustom05"
                            value={user.password}
                            onChange={handleChangeUser}
                          />
                        </div>
                      </Col>
                    </Row>

                    {/* <p
                      style={{
                        color:
                          addUserResponse.type === "success" ? "green" : "red",
                      }}
                    >
                      {addUserResponse.message}
                    </p>
                    {error.data && error.data.message ? (
                      <li
                        style={{
                          color: "red",
                          marginBottom: "1rem",
                        }}
                      >
                        {error.data.message}
                      </li>
                    ) : null} */}
                    {userIdTobeUpdated ? (
                      <Button
                        color="primary"
                        type="submit"
                        disabled={addingUser ? true : false}
                      >
                        {addingUser ? "Updating" : "Update"}
                      </Button>
                    ) : (
                      <Button
                        color="primary"
                        type="submit"
                        disabled={addingUser ? true : false}
                      >
                        {addingUser ? "Adding" : "Submit"}
                      </Button>
                    )}
                  </AvForm>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col className="col-12">
              <Card>
                <CardBody>
                  <MDBDataTable responsive bordered data={data} />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  // const { error } = state.Users;
  // return { error };
};

export default withRouter(connect(mapStateToProps, { apiError })(Users));

Users.propTypes = {
  error: PropTypes.any,
  users: PropTypes.array,
};
