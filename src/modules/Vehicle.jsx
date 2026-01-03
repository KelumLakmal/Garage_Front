import { Backdrop, Box, Button, CircularProgress, FormControl, FormHelperText, Grid, inputAdornmentClasses, InputLabel, MenuItem, Paper, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material'
import { Formik } from 'formik';
import React, { useState } from 'react'
import brandService from '../api/brandService';
import { useEffect } from 'react';
import { getAllCustomers } from '../api/customerService';
import * as Yup from 'yup';
import useConfirmDialog, { ACTIONS } from './useConfirmDialog';
import ConfirmDialog from './ConfirmDialog';
import vehicleService from '../api/vehicleService';
import SnackbarCustom from './SnackbarCustom';

const Vehicle = () => {
    const [loading, setLoading] = useState(false);
    const [brands, setBrands] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [vehicle, setVehicle] = useState({
        id: 0,
        plateNumber: "",
        model: "",
        brandId: 0,
        customerId: 0
    });

    const [vehicles, setVehicles] = useState([]);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };


    const fetchBrands = async () => {
        try {
            setLoading(true);
            await new Promise((resolve) => setTimeout(resolve, 0));
            const brands = await brandService.getAllBrands();
            setBrands(brands);
            console.log("Brands", brands);
        } catch (err) {
            console.error("Error", err.message);
            window.alert(`You have following error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            await new Promise((resolve) => setTimeout(resolve, 0));
            const customers = await getAllCustomers(null);
            setCustomers(customers);

        } catch (err) {
            console.error("Error", err.message);
            window.alert(`You have following error: ${err.message}`);
        } finally {
            setLoading(false);
        }

    }

    const fetchVehicles = async (paramObject) => {
        try {
            setLoading(true);
            await new Promise((resolve) => setTimeout(resolve, 0));
            const vehicles = await vehicleService.getAllVehicles(paramObject);
            setVehicles(vehicles);

        } catch (err) {
            console.error("Error", err.message);
            window.alert(`You have following error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchBrands();
        fetchCustomers();
        fetchVehicles(null);
    }, []);

    useEffect(() => {
        console.log("Vehicke", vehicle);
    }, [vehicle]);

    const {
        isOpen,
        actionType,
        pendingValues,
        pendingActions,
        operationModule,
        openDialog,
        closeDialog

    } = useConfirmDialog();

    const handleSave = (values, formikActions) => {
        console.log("Form Values", values);
        openDialog(ACTIONS.ADD, values, formikActions, "save vehicle:");
    }

    const handleUpdate = () => {

    }

    const handleDelete = () => {

    }

    const handleClearForm = () => {

    }

    const handleConfirm = async () => {
        if (actionType === ACTIONS.ADD) {
            await confirmSave(pendingValues, pendingActions);
        }

    }

    const confirmSave = async (pendingValues, pendingActions) => {
        if (!pendingValues) return;

        const vehicleSaveModel = {
            plateNumber: pendingValues.plateNumber,
            model: pendingValues.model,
            brandId: pendingValues.brandId,
            customerId: pendingValues.customerId
        };

        try {
            setLoading(true);
            const response = await vehicleService.saveVehicle(vehicleSaveModel);
            console.log("VehicleSaveResponse", response);
            if (response.status === 201 && response.data !== null) {
                setSnackbarMessage(`Vehicle ${pendingValues.plateNumber} saved successfully...`);
                setSnackbarOpen(true);
                await fetchVehicles(null);
                setPage(0);
                pendingActions?.resetForm();
            }
        } catch (err) {
            console.error("Vehicle save failed:", err);
        } finally {
            console.log("FINAL");
            setLoading(false);
            closeDialog();
        }
    }


    const validationSchema = Yup.object({
        plateNumber: Yup.string().required("Plate No is required"),
        brandId: Yup.number().required("Brand is required").moreThan(0, "Please select brand"),
        customerId: Yup.number().required("Customer is required").moreThan(0, "Please select customer"),
        model: Yup.string().trim().required("Model is required"),

    });

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                {/* <Typography variant='h4'>
                    Welcome Vehicle Page
                </Typography> */}
                <Backdrop
                    sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
                    open={loading}
                >
                    <CircularProgress color='inherit' />
                </Backdrop>

                <ConfirmDialog
                    isOpen={isOpen}
                    title={
                        actionType === ACTIONS.ADD
                            ? "Confirmation Saving"
                            : actionType === ACTIONS.UPDATE
                                ? "Confirmation Updating"
                                : "Confirmation Deleting"
                    }
                    message={`Are you sure you want to ${operationModule} ${pendingValues?.plateNumber}`}
                    onConfirm={async () => await handleConfirm()}
                    onClose={closeDialog}
                />

                <SnackbarCustom
                    open={snackbarOpen}
                    snackbarClose={handleSnackbarClose}
                    snackbarMessage={snackbarMessage}
                />


                <Grid container rowSpacing={2} columnSpacing={1}>
                    <Grid size={{ md: 8, xs: 12 }}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant='h4' gutterBottom>
                                Vehicle Form
                            </Typography>
                            <Formik
                                enableReinitialize
                                initialValues={vehicle}
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
                                    setFieldValue
                                }) => (
                                    <form onSubmit={handleSubmit}>
                                        <Grid container spacing={2}>
                                            <Grid size={{ md: 12, xs: 12 }}>
                                                <TextField
                                                    name='plateNumber'
                                                    variant='outlined'
                                                    label='Plate No *'
                                                    error={touched.plateNumber && Boolean(errors.plateNumber)}
                                                    helperText={touched.plateNumber && errors.plateNumber}
                                                    value={values.plateNumber}
                                                    onChange={(e) =>
                                                        setFieldValue(
                                                            "plateNumber",
                                                            e.target.value.replace(/^\s+/, ""))}
                                                    onBlur={(e) => {
                                                        handleBlur(e);
                                                        setFieldValue(
                                                            "plateNumber",
                                                            e.target.value.trim()
                                                        );
                                                    }}
                                                    fullWidth
                                                />
                                            </Grid>
                                            <Grid size={{ md: 12, xs: 12 }}>
                                                <FormControl variant='outlined' fullWidth error={touched.brandId && Boolean(errors.brandId)} >
                                                    <InputLabel id='brandId' >Select a Brand *</InputLabel>
                                                    <Select
                                                        labelId='brandId'
                                                        label='Select a Brand *'
                                                        // error={touched.brandId && Boolean(errors.brandId)}
                                                        // helperText={touched.brandId && errors.brandId}
                                                        name='brandId'
                                                        value={values.brandId || ''}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                    >
                                                        <MenuItem value={0} disabled>Pick a brand</MenuItem>
                                                        {brands.map((brand) => (

                                                            <MenuItem key={brand.id} value={brand.id}>
                                                                {brand.name}
                                                            </MenuItem>
                                                        )
                                                        )}

                                                    </Select>
                                                    {touched.brandId && errors.brandId && (
                                                        <FormHelperText>{errors.brandId}</FormHelperText>
                                                    )}
                                                    {/* <FormHelperText>Reqiuredddd</FormHelperText> */}
                                                </FormControl>
                                            </Grid>
                                            <Grid size={{ md: 12, xs: 12 }}>
                                                <TextField
                                                    name='model'
                                                    variant='outlined'
                                                    label='Enter Model *'
                                                    error={touched.model && Boolean(errors.model)}
                                                    helperText={touched.model && errors.model}
                                                    value={values.model}
                                                    onChange={(e) =>
                                                        setFieldValue(
                                                            "model",
                                                            e.target.value.replace(/^\s+/, "")
                                                        )
                                                    }
                                                    onBlur={(e) => {
                                                        handleBlur(e);
                                                        setFieldValue(
                                                            "model",
                                                            e.target.value.trim()
                                                        )
                                                    }}
                                                    fullWidth
                                                />
                                            </Grid>

                                            <Grid size={{ md: 12, xs: 12 }}>
                                                <FormControl variant='outlined' fullWidth
                                                    error={touched.customerId && Boolean(errors.customerId)}
                                                >
                                                    <InputLabel id='customerId' >Select Owner *</InputLabel>
                                                    <Select
                                                        labelId='customerId'
                                                        label='Select Owner *'

                                                        name='customerId'
                                                        value={values.customerId || ''}
                                                        onChange={handleChange}
                                                        renderValue={(selected) => {
                                                            const customer = customers.find(c => c.id === selected);

                                                            return customer ? `${customer.name} (NIC: ${customer.nic})` : "";
                                                        }}
                                                    >
                                                        <MenuItem value={0} disabled>Pick a customer</MenuItem>
                                                        {customers.map((customer) => (
                                                            <MenuItem key={customer.key} value={customer.id} >
                                                                <Box sx={{ display: 'flex', gap: 1, flexDirection: 'row' }}>
                                                                    <Typography fontWeight={500}>
                                                                        {customer.name}

                                                                    </Typography>
                                                                    <Typography color='text.secondary'>
                                                                        {customer.nic}

                                                                    </Typography>
                                                                </Box>
                                                            </MenuItem>

                                                            // <MenuItem key={customer.id} value={customer.id} >{customer.name + 'NIC' + customer.nic }</MenuItem>
                                                        ))}
                                                    </Select>
                                                    {touched.customerId && errors.customerId && (
                                                        <FormHelperText>{errors.customerId}</FormHelperText>
                                                    )}
                                                </FormControl>
                                            </Grid>

                                            <Grid size={{ md: 12, xs: 12 }}>
                                                <Stack spacing={1} direction="row">
                                                    <Button
                                                        variant='contained'
                                                        sx={{ width: 120 }}
                                                        type='submit'
                                                    >
                                                        Add
                                                    </Button>
                                                    <Button
                                                        variant='contained'
                                                        sx={{ width: 120 }}
                                                    >
                                                        Update
                                                    </Button>
                                                    <Button
                                                        variant='contained'
                                                        sx={{ width: 120 }}
                                                    >
                                                        Delete
                                                    </Button>
                                                    <Button
                                                        variant='contained'
                                                        sx={{ width: 120 }}
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
                        <Paper sx={{ p: 2 }}>
                            <Typography variant='h4'>
                                Vehicle Search
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid size={{ md: 12, xs: 12 }}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant='h4'>
                                Vehicle Details
                            </Typography>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Plate No</TableCell>
                                            <TableCell>Brand</TableCell>
                                            <TableCell>Model</TableCell>
                                            <TableCell>Owner</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {vehicles.slice(
                                            page * rowsPerPage,
                                            page * rowsPerPage + rowsPerPage
                                        ).map((vehicle) => (
                                            <TableRow
                                                key={vehicle.id}
                                                hover
                                            >
                                                <TableCell>{vehicle.plateNumber}</TableCell>
                                                <TableCell>{vehicle.brand.name}</TableCell>
                                                <TableCell>{vehicle.model}</TableCell>
                                                <TableCell>{vehicle.customer.name}</TableCell>
                                            </TableRow>
                                        ))}

                                    </TableBody>
                                </Table>
                                <TablePagination
                                    component={"div"}
                                    count={vehicles.length}
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
                        </Paper>
                    </Grid>
                </Grid>


            </Box>


        </>
    )
}

export default Vehicle