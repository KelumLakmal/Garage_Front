import {
  Alert,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Paper,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { Formik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import {
  getAllCustomers,
  saveCustomer,
  updateCustomer,
  deleteCustomer
} from "../api/customerService";
import { useEffect } from "react";
import { TimerTwoTone } from "@mui/icons-material";
import DialogCustom from "./DialogCustom";
import SnackbarCustom from "./SnackbarCustom";
import useConfirmDialog, { ACTIONS } from "./useConfirmDialog";
import ConfirmDialog from "./ConfirmDialog";
import './Customer.css';

const Customer = () => {
  const [loading, setLoading] = useState(false);
  // const [showNoRecords, setShowNoRecords] = useState(false);

  const [filterText, setFilterText] = useState("");

  // const [actionType, setActionType] = useState(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // const [pendingValues, setPendingValues] = useState(null);
  // const [pendingActions, setPendingActions] = useState(null);

  // const [open, setOpen] = useState(true);
  const [customer, setCustomer] = useState({
    id: 0,
    name: "",
    mobile: "",
    nic: "",
    email: "",
  });
  const [customers, setCustomers] = useState([]);
  // const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const {
    isOpen,
    actionType,
    pendingValues,
    pendingActions,
    operationModule,
    openDialog,
    closeDialog
  } = useConfirmDialog();

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleRowClick = (customer) => {
    setSelectedCustomer(customer);
    console.log("selected customer", customer);
    setCustomer(customer);
  };

  const handleClearForm = (formikActions) => {
    setSelectedCustomer(null);
    setCustomer({
      id: 0,
      name: "",
      mobile: "",
      nic: "",
      email: "",
    });
    formikActions?.resetForm();
    // formikActions();
  };

  // const handleSnackbarOpen = () => {
  //       setSnackbarOpen(close);

  // }

  const fetchCustomers = async (paramObject) => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 0));
      const customers = await getAllCustomers(paramObject);
      // setFilteredCustomers(customers);
      setCustomers(customers);
      console.log("Customers", customers);
    } catch (err) {
      console.error("Error:", err.message);
      window.alert(`You have error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers(null);
  }, []);
  //  useEffect(() => {
  //   setFilterText("");
  // }, [customers]);


  const handleConfirm = async () => {
    if (actionType === ACTIONS.ADD) {
      await confirmSave(pendingValues, pendingActions);
    }
    if (actionType === ACTIONS.UPDATE) {
      await confirmUpdate(pendingValues, pendingActions);
    }
    if (actionType === ACTIONS.DELETE) {
      await confirmDelete(pendingValues, pendingActions);
    }
  }

  const handleSave = (values, formikActions) => {
    // setPendingValues(values);
    // setPendingActions(formikActions);
    console.log("Add-Form:", values);
    // setActionType("ADD");
    openDialog(ACTIONS.ADD, values, formikActions, "save customer:");
  };

  const confirmSave = async (pendingValues, pendingActions) => {
    if (!pendingValues) return;

    const customerSaveModel = {
      name: pendingValues.name,
      mobile: pendingValues.mobile,
      nic: pendingValues.nic,
      email: pendingValues.email,
    };

    try {
      setLoading(true);
      const response = await saveCustomer(customerSaveModel);
      console.log("response", response);
      if (response.status == 201 && response.data != null) {
        setSnackbarMessage(
          `Customer ${pendingValues?.name} saved successfully...`
        );
        setSnackbarOpen(true);
        // const customers = await getAllCustomers(null);
        // setFilteredCustomers(customers);
        await fetchCustomers(null);
        setPage(0);

        pendingActions?.resetForm();
      }
    } catch (error) {
      console.error("Customer save failed:", error);
    } finally {
      setLoading(false);
      closeDialog();
    }
  }

  // const confirmSave = async () => {
  //   if (!pendingValues) return;

  //   const customerSaveModel = {
  //     name: pendingValues.name,
  //     mobile: pendingValues.mobile,
  //     nic: pendingValues.nic,
  //     email: pendingValues.email,
  //   };

  //   try {
  //     const response = await saveCustomer(customerSaveModel);
  //     console.log("response", response);
  //     if (response.status == 201 && response.data != null) {
  //       setSnackbarMessage(
  //         `Customer ${pendingValues?.name} saved successfully...`
  //       );
  //       setSnackbarOpen(true);
  //       const customers = await getAllCustomers();
  //       setCustomers(customers);

  //       pendingActions?.resetForm();
  //     }
  //   } catch (error) {
  //     console.error("Customer save failed:", error);
  //   } finally {
  //     setActionType(null);
  //     setPendingValues(null);
  //     setPendingActions(null);
  //   }
  // };

  const handleUpdate = (values, formikActions) => {
    // setPendingValues(values);
    // setPendingActions(formikActions);
    // setActionType("UPDATE");
    openDialog(ACTIONS.UPDATE, values, formikActions, "update customer:");
  };

  // const handleDelete = () => {};

  const confirmUpdate = async (pendingValues, pendingActions) => {
    if (!pendingValues) return;

    const customerUpdateModel = {
      name: pendingValues.name,
      mobile: pendingValues.mobile,
      nic: pendingValues.nic,
      email: pendingValues.email,
    };

    const customerId = pendingValues.id;

    try {
      setLoading(true);
      const response = await updateCustomer(customerId, customerUpdateModel);
      console.log("Update-Response", response);
      if (response != null && response.data != null) {
        setSnackbarMessage(`Customer ${pendingValues?.name} updated successfully...`);
        setSnackbarOpen(true);
        await fetchCustomers(null);
        setPage(0);
        handleClearForm(pendingActions);
        // pendingActions?.resetForm();
      }
    } catch (err) {
      console.error("Update-Eroor", err);
    } finally {
      setLoading(false);
      closeDialog();
    }
  };

  const handleDelete = (values, formikActions) => {
    openDialog(ACTIONS.DELETE, values, formikActions, "delete customer:");
    console.log("DeletedId:", values?.id);
  }

  const confirmDelete = async (pendingValues, pendingActions) => {
    console.log("deleted completed..");
    if (!pendingValues) return;

    const deletedId = pendingValues?.id
    try {
      setLoading(true);
      const response = await deleteCustomer(deletedId);
      console.log("Deleted Response", response);

      if (response != null && response.data != null) {
        await fetchCustomers(null);
        setPage(0);
        setSnackbarMessage(`Customer ${pendingValues?.name} deleted successfully...`);
        setSnackbarOpen(true);

        handleClearForm(pendingActions);
      }
    } catch (err) {
      console.error("Deleted Error", err);
    } finally {
      setLoading(false);
      closeDialog();
    }
  }

  const handleSearch = async (values) => {
    // const trimmedValues = {
    //   ...values,
    //   name: values?.name.trim(),
    //   mobile: values?.mobile.trim(),
    //   nic: values?.nic.trim()
    // };
    console.log("Seach Values", values);

    // const list = Object.entries(values);
    // console.log(list);
    // const filterList = list.filter(([_, v]) => v !== "" && v !== null && v !== undefined);
    // console.log("filter", filterList);
    // const paramObject = Object.fromEntries(filterList);
    // console.log("FinalObject", paramObject);

    const paramObject = Object.fromEntries(Object.entries(values).filter(([_, v]) => v !== "" && v !== null && v !== undefined));
    console.log("FinalObject", paramObject);
    await fetchCustomers(paramObject);
    setPage(0);
  }

  const handleSearchClear = async (resetForm) => {
    console.log("Testing");
    resetForm();
    await fetchCustomers(null);
    setFilterText("");
    setPage(0);
  }

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
  });

  const filteredCustomers = customers.filter((customer) => {
    const search = filterText.trim().toLowerCase();
    return (
      customer.name?.toLowerCase().includes(search) ||
      customer.mobile?.toLowerCase().includes(search) ||
      customer.nic?.toLowerCase().includes(search) ||
      customer.email?.toLowerCase().includes(search)
    );
  });

  const showNoRecords = filteredCustomers.length === 0 && filterText.trim() !== "";

  // useEffect(() => {
  //   if (filteredCustomers.length === 0 && !showNoRecords) {
  //     setShowNoRecords(true);

  //     const timer = setTimeout(() => {
  //       setShowNoRecords(false);
  //     }, 2000);

  //     return () => clearTimeout(timer);
  //   }

  // }, [filteredCustomers, showNoRecords]);

  // useEffect(() => {
  //   if (filteredCustomers.length === 0) {
  //     setShowNoRecords(true);
  //   }
  //   const timer = setTimeout(() => {
  //     setShowNoRecords(false);
  //   }, 2000);

  //   return () => clearTimeout(timer);
  // }, [filteredCustomers, ]);

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Backdrop
          sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        {/* <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "center", horizontal: "center" }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity="success"
            variant="filled"
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar> */}
        <SnackbarCustom
          open={snackbarOpen}
          snackbarClose={handleSnackbarClose}
          snackbarMessage={snackbarMessage}
        />

        <ConfirmDialog
          isOpen={isOpen}
          title={
            actionType === ACTIONS.ADD
              ? "Confirmation Saving"
              : actionType === ACTIONS.UPDATE
                ? "Confirmation Updating"
                : "Confirmation Deleting"
          }
          message={`Are you sure you want to ${operationModule} ${pendingValues?.name}`}
          onConfirm={async () => await handleConfirm()}
          onClose={closeDialog}
        />

        {/* <DialogCustom
          title={
            actionType === "ADD"
              ? "Confirmation Saving"
              : actionType === "UPDATE"
              ? "Confirmation Updating"
              : actionType === "DELETE"
              ? "Confirmation Deleting"
              : ""
          }
          isOpen={Boolean(actionType)}
          pendingValues={pendingValues}
          module_ActionName={
            actionType === "ADD"
              ? "save customer"
              : actionType === "UPDATE"
              ? "update customer"
              : actionType === "DELETE"
              ? "delete customer"
              : ""
          }
          // module_ActionName={"save customer"}
          handleConfirmClose={handleConfirmClose}
          confirmYes={
            actionType === "ADD"
              ? confirmSave
              : actionType === "UPDATE"
              ? confirmUpdate
              : actionType === "DELETE"
              ? confirmDelete
              : undefined
          }
        /> */}
        <Grid container rowSpacing={2} columnSpacing={1}>
          <Grid size={{ md: 8, xs: 12 }}>
            <Paper sx={{ p: 2 }}>
              {/* <Typography variant="h2">First</Typography> */}
              <Typography variant="h4" gutterBottom
              >
                Customer Form
              </Typography>
              <Formik
                enableReinitialize
                initialValues={customer}
                validationSchema={validationSchema}
                onSubmit={handleSave}
              >
                {({
                  values,
                  errors,
                  touched,
                  formikActions,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  setFieldValue,
                }) => (
                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                      <Grid size={{ md: 12, xs: 12 }}>
                        <TextField
                          name="name"
                          value={values.name}
                          // onChange={handleChange}
                          onChange={(e) =>
                            setFieldValue(
                              "name",
                              e.target.value.replace(/^\s+/, "")
                            )
                          }
                          // onBlur={handleBlur}
                          onBlur={(e) => {
                            handleBlur(e);
                            setFieldValue("name", e.target.value.trim());
                          }}
                          error={touched.name && Boolean(errors.name)}
                          helperText={touched.name && errors.name}
                          variant="outlined"
                          label="Name"
                          fullWidth
                        />
                      </Grid>
                      <Grid size={{ md: 12, xs: 12 }}>
                        <TextField
                          name="mobile"
                          value={values.mobile}
                          // onChange={handleChange}
                          onChange={(e) => setFieldValue("mobile", e.target.value.replace(/^\s+/, ""))}
                          // onBlur={handleBlur}
                          onBlur={(e) => {
                            handleBlur(e);
                            setFieldValue("mobile", e.target.value.trim());
                          }}
                          variant="outlined"
                          label="Mobile"
                          fullWidth
                        />
                      </Grid>
                      <Grid size={{ md: 12, xs: 12 }}>
                        <TextField
                          name="nic"
                          value={values.nic}
                          // onChange={handleChange}
                          onChange={(e) => setFieldValue("nic", e.target.value.replace(/^\s+/, ""))}
                          // onBlur={handleBlur}
                          onBlur={(e) => {

                            handleBlur(e);
                            setFieldValue("nic", e.target.value.trim());
                          }}
                          variant="outlined"
                          label="NIC"
                          fullWidth
                        />
                      </Grid>
                      <Grid size={{ md: 12, xs: 12 }}>
                        <TextField
                          name="email"
                          value={values.email}
                          // onChange={handleChange}
                          onChange={(e) => setFieldValue("email", e.target.value.replace(/^\s+/, ""))}
                          // onBlur={handleBlur}
                          onBlur={(e) => {
                            handleBlur(e);
                            setFieldValue("email", e.target.value.trim());
                          }}
                          variant="outlined"
                          label="Email"
                          fullWidth
                        />
                      </Grid>
                      <Grid size={{ md: 12, xs: 12 }}>
                        <Stack direction="row" spacing={1}>
                          <Button
                            sx={{ width: 120 }}
                            variant="contained"
                            type="submit"
                            disabled={!!selectedCustomer}
                          >
                            Add
                          </Button>
                          <Button
                            sx={{ width: 120 }}
                            variant="contained"
                            disabled={!selectedCustomer}
                            onClick={() => handleUpdate(values, formikActions)}
                          >
                            Update
                          </Button>
                          <Button
                            sx={{ width: 120 }}
                            variant="contained"
                            disabled={!selectedCustomer}
                            onClick={() => handleDelete(values, formikActions)}
                          >
                            Delete
                          </Button>
                          <Button
                            sx={{ width: 120 }}
                            variant="contained"
                            onClick={() => handleClearForm(formikActions)}
                          >
                            Clear
                          </Button>
                        </Stack>
                      </Grid>
                    </Grid>
                  </form>
                )}
              </Formik>
            </Paper>
          </Grid>
          <Grid size={{ md: 4, xs: 12 }}>
            <Paper sx={{ p: 2}}>
              <Typography variant="h4" gutterBottom

              >Customer Search</Typography>
              <Formik
                initialValues={{
                  name: "",
                  mobile: "",
                  nic: ""
                }}
                onSubmit={handleSearch}
              >
                {({
                  values,
                  resetForm,
                  handleSubmit,
                  setFieldValue,
                  handleBlur,
                  handleChange
                }) => {
                  const isBtnSearchDisabled = !Object.values(values).some((v) => v && v.trim() !== "");
                  return (
                    <form onSubmit={handleSubmit}>
                      <Grid container spacing={2}>
                        <Grid size={{ md: 12, xs: 12 }}>
                          <TextField
                            name="name"
                            value={values.name}
                            onBlur={(e) => {
                              // console.log("Blur");
                              handleBlur(e);
                              setFieldValue("name", e.target.value.trim());
                            }}
                            onChange={(e) =>
                              setFieldValue(
                                "name",
                                e.target.value.replace(/^\s+/, "")
                              )
                            }
                            variant="outlined"
                            label="Name"
                            fullWidth
                            placeholder="Search by name"
                          />
                        </Grid>
                        <Grid size={{ md: 12, xs: 12 }}>
                          <TextField
                            name="mobile"
                            value={values.mobile}
                            onBlur={(e) => {
                              handleBlur(e);
                              setFieldValue("mobile", e.target.value.trim());
                            }}
                            onChange={(e) =>
                              setFieldValue(
                                "mobile",
                                e.target.value.replace(/^\s+/, "")
                              )
                            }
                            variant="outlined"
                            label="Mobile"
                            fullWidth
                            placeholder="Search by mobile number"
                          />
                        </Grid>
                        <Grid size={{ md: 12, xs: 12 }}>
                          <TextField
                            name="nic"
                            value={values.nic}
                            onBlur={(e) => {
                              handleBlur(e);
                              setFieldValue("nic", e.target.value.trim());
                            }}
                            onChange={(e) =>
                              setFieldValue(
                                "nic",
                                e.target.value.replace(/^\s+/, "")
                              )
                            }
                            variant="outlined"
                            label="NIC"
                            fullWidth
                            placeholder="Search by NIC"
                          />
                        </Grid>
                        <Grid size={{ md: 12, xs: 12 }}>
                          <Stack direction="row" spacing={1}>
                            <Button
                              sx={{ width: 120 }}
                              variant="contained"
                              type="submit"
                              disabled={isBtnSearchDisabled}
                            >
                              Search
                            </Button>
                            <Button
                              sx={{ width: 120 }}
                              variant="contained"
                              onClick={async () => await handleSearchClear(resetForm)}

                            >
                              Clear
                            </Button>

                          </Stack>
                        </Grid>
                      </Grid>
                    </form>
                  );
                }

                }
              </Formik>
            </Paper>
          </Grid>
          <Grid size={{ md: 12, xs: 12 }}>
            <Paper>
              {/* <Typography variant="h2">Third</Typography> */}
              <Box sx={{ p: 0, }} >

                <Typography variant="h6" gutterBottom sx={
                  {
                    background: 'linear-gradient(120deg, #10097cff, #b3b5e8ff)',
                    padding: 1,
                    color: "#fff",
                    mb: 2,
                    borderRadius: "5px"
                  }
                }>
                  Result View
                </Typography>
                <Box sx={{ textAlign: "right" }}>
                  <TextField
                    label="Search By Table Results"
                    variant="outlined"
                    placeholder="Enter search values"
                    // sx={{ width: "28%", }}
                    size="small"
                    value={filterText}
                    onChange={(e) => {
                      setFilterText(e.target.value);
                      setPage(0);
                    }}
                    sx={{
                      width: "20%", // reduce width
                      "& .MuiInputBase-input": {
                        padding: "8px 8px", // reduce input padding
                        fontSize: "1rem", // smaller font
                      },
                      align: 'right'
                    }}
                  />
                </Box>
              </Box>
              {filteredCustomers.length ? (
                <TableContainer >
                  <Table >
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Mobile</TableCell>
                        <TableCell>NIC</TableCell>
                        <TableCell>Email</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredCustomers
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((customer) => (
                          <TableRow
                            key={customer.id}
                            hover
                            selected={selectedCustomer?.id === customer.id}
                            onClick={() => handleRowClick(customer)}
                            sx={{
                              cursor: "pointer",
                              // backgroundColor: selectedCustomer?.id == customer.id ? "#d2b9f1ff" : "inherit"
                              "&.Mui-selected": {
                                backgroundColor: "#daf2eaff",
                                transition: "background-color 0.3s linear",
                              },
                              "&.Mui-selected:hover": {
                                backgroundColor: "#daf2eaff",
                              },
                            }}
                          >
                            <TableCell>{customer.name}</TableCell>
                            <TableCell>{customer.mobile}</TableCell>
                            <TableCell>{customer.nic}</TableCell>
                            <TableCell>{customer.email}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                  <TablePagination
                    component="div"
                    count={filteredCustomers.length}
                    page={page}
                    onPageChange={(event, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(event) => {
                      setRowsPerPage(parseInt(event.target.value, 10));
                      setPage(0);
                    }}
                    rowsPerPageOptions={[5, 10, 15, 20]}
                  />
                </TableContainer>

              ) : showNoRecords && (
                <Alert severity="warning"
                  sx={{
                    justifyContent: "center",
                  }}
                >
                  <Typography align="center" >
                    No records to display.
                  </Typography>
                </Alert>
              )
              }

            </Paper>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Customer;
