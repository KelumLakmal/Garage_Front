import { Alert, Autocomplete, Backdrop, Box, Button, CircularProgress, FormControl, FormHelperText, Grid, inputAdornmentClasses, InputLabel, MenuItem, Paper, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material'
import { Formik } from 'formik';
import React, { useRef, useState } from 'react'
import brandService from '../api/brandService';
import { useEffect } from 'react';
import { getAllCustomers } from '../api/customerService';
import * as Yup from 'yup';
import useConfirmDialog, { ACTIONS } from './useConfirmDialog';
import ConfirmDialog from './ConfirmDialog';
import vehicleService from '../api/vehicleService';
import SnackbarCustom from './SnackbarCustom';
import useImagePreview from '../utils/useImagePreview';
import useBtnPermission from '../utils/useBtnPermission';
import { MultilineChart } from '@mui/icons-material';
import useResponseHandler from '../utils/useResponseHandler';

const Vehicle = () => {
    const [loading, setLoading] = useState(false);
    const [brands, setBrands] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [vehicle, setVehicle] = useState({
        id: 0,
        plateNumber: "",
        model: "",
        brandId: 0,
        customerId: 0,
        image: null
    });

    const fileInputRef = useRef(null);

    const [vehicles, setVehicles] = useState([]);
    const [selectedVehicle, setSelectedVehicle] = useState(null);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    // const [preview, setPreview] = useState(null);
    const [filterText, setFilterText] = useState("");

    const { responseCreator } = useResponseHandler();

    const [responseErrors, setResponseErrors] = useState(null);

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
            const { code, message } = responseCreator(err.response);
            if (code === 0) {
                window.alert(`You have following error: ${message}`);
            } else {
                setResponseErrors(message);
            }
            // window.alert(`You have following error: ${err.message}`);
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
            // window.alert(`You have following error: ${err.message}`);
           const { code, message } = responseCreator(err.response);
            if (code === 0) {
                window.alert(`You have following error: ${message}`);
            } else {
                setResponseErrors(message);
            }
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
            console.error("Error", err);
            const { code, message } = responseCreator(err.response);
            if (code === 0) {
                window.alert(`You have following error: ${message}`);
            } else {
                setResponseErrors(message);
            }
            console.log(`Your Errors: ${code} ${message}`);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchBrands();
        fetchCustomers();
        fetchVehicles(null);
    }, []);

    // useEffect(() => {
    //     console.log("Vehicke", vehicle);
    // }, [vehicle]);

    const {
        isOpen,
        actionType,
        pendingValues,
        pendingActions,
        operationModule,
        openDialog,
        closeDialog

    } = useConfirmDialog();

    const {
        btnAddEnabled,
        btnUpdateEnabled,
        btnDeleteEnabled
    } = useBtnPermission("VEHICLE");

    const {
        file: imageFile,
        preview,
        handleFileChange,
        clear: imageClear,
        showImage
    } = useImagePreview();

    const handleRowClick = (vehicle) => {
        console.log("Clicked", vehicle);
        const seletedVehicleCustomObject = {
            id: vehicle.id,
            plateNumber: vehicle.plateNumber,
            model: vehicle.model,
            brandId: vehicle.brand.id,
            customerId: vehicle.customer.id
        };
        // setPreview(vehicle?.imageUrl);
        showImage(vehicle?.imageUrl);
        setVehicle(seletedVehicleCustomObject);
        setSelectedVehicle(seletedVehicleCustomObject);
    }

    const handleSave = (values, formikActions) => {
        console.log("Form Values", values);
        openDialog(ACTIONS.ADD, values, formikActions, "save vehicle:");
    }

    const handleUpdate = async (values, formikActions, validateForm) => {
        const formErrorsObject = await validateForm();
        // console.log("ValidationErors", formErrorsObject);
        const errorObjectKeys = Object.keys(formErrorsObject);

        if (errorObjectKeys.length) {
            return;
        }
        openDialog(ACTIONS.UPDATE, values, formikActions, "update vehicle:");
    }

    const handleDelete = (values, formikActions) => {
        openDialog(ACTIONS.DELETE, values, formikActions, "delete vehicle:");
    }

    const handleClearForm = (resetForm) => {
        console.log("clera");

        // if (preview) {
        //     URL.revokeObjectURL(preview);
        // }
        setVehicle({
            id: 0,
            plateNumber: "",
            model: "",
            brandId: 0,
            customerId: 0,
            image: null
        });
        setResponseErrors(null);
        if (resetForm) resetForm();
        // setPreview(null);
        imageClear();
        setSelectedVehicle(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }

    }

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

    const confirmSave = async (pendingValues, pendingActions) => {
        if (!pendingValues) return;

        const formData = new FormData();

        formData.append("plateNumber", pendingValues.plateNumber);
        formData.append("model", pendingValues.model);
        formData.append("brandId", pendingValues.brandId);
        formData.append("customerId", pendingValues.customerId);

        if (pendingValues.image) {
            formData.append("image", pendingValues.image);
        }

        // const vehicleSaveModel = {
        //     plateNumber: pendingValues.plateNumber,
        //     model: pendingValues.model,
        //     brandId: pendingValues.brandId,
        //     customerId: pendingValues.customerId
        // };

        try {
            setLoading(true);
            const response = await vehicleService.saveVehicle(formData);
            console.log("VehicleSaveResponse", response);
            if (response.status === 201 && response.data !== null) {
                setSnackbarMessage(`Vehicle ${pendingValues.plateNumber} saved successfully...`);
                setSnackbarOpen(true);
                await fetchVehicles(null);
                setPage(0);
                handleClearForm(pendingActions.resetForm);
                // pendingActions?.resetForm();
            }
        } catch (err) {
            console.error("Vehicle save failed:", err);
            const { code, message } = responseCreator(err.response);
            setResponseErrors(message);
        } finally {
            console.log("FINAL");
            setLoading(false);
            closeDialog();
        }
    }

    const confirmUpdate = async (pendingValues, pendingActions) => {
        if (!pendingValues) return;

        const formData = new FormData();
        formData.append("plateNumber", pendingValues.plateNumber);
        formData.append("model", pendingValues.model);
        formData.append("brandId", pendingValues.brandId);
        formData.append("customerId", pendingValues.customerId);

        if (pendingValues.image) {
            formData.append("image", pendingValues.image);
        }

        // const vehicleUpdateModel = {
        //     plateNumber: pendingValues.plateNumber,
        //     model: pendingValues.model,
        //     brandId: pendingValues.brandId,
        //     customerId: pendingValues.customerId
        // };
        const vehicleId = pendingValues.id;
        try {
            setLoading(true);
            const response = await vehicleService.updateVehicle(vehicleId, formData);
            console.log("Vehicle-Update", response);
            if (response.data !== null) {
                setSnackbarMessage(`Vehicle ${pendingValues?.plateNumber} updated successfully...`);
                setSnackbarOpen(true);
                await fetchVehicles(null);
                setPage(0);
                handleClearForm(pendingActions?.resetForm);
            }
        } catch (err) {
            console.error("Vehicle update failed:", err);
            const { code, message } = responseCreator(err.response);
            setResponseErrors(message);
        } finally {
            setLoading(false);
            closeDialog();
        }
    }

    const confirmDelete = async (pendingValues, pendingActions) => {
        if (!pendingValues) return;

        const deletedId = pendingValues.id;
        try {
            setLoading(true);
            const response = await vehicleService.deleteVehicle(deletedId);
            console.log("Vehicle-delete-Response", response);
            if (response.data !== null) {
                setSnackbarMessage(`Vehicle ${pendingValues?.plateNumber} deleted successfully...`);
                setSnackbarOpen(true);
                await fetchVehicles(null);
                setPage(0);
                handleClearForm(pendingActions?.resetForm);
            }
        } catch (err) {
            console.error("Vehicle delete failed:", err);
            const { code, message } = responseCreator(err.response);
            setResponseErrors(message);
        } finally {
            setLoading(false);
            closeDialog();
        }
    }

    const handleSearch = async (values) => {
        console.log("SeachVales", values);
        const paramObject = Object.fromEntries(Object.entries(values).filter(([_, v]) => v !== null && v !== undefined && (
            (typeof v === "number" && v > 0) || (typeof v === "string" && v.trim() !== "")
        )));

        console.log("FinalObject", paramObject);
        await fetchVehicles(paramObject);
        setPage(0);
    }
    const handleSearchClear = async (resetForm) => {
        resetForm();
        await fetchVehicles(null);
        setFilterText("");
        setPage(0);

    }

    const filteredVehicles = vehicles.filter((vehicle) => {
        const search = filterText.trim().toLowerCase();

        return (vehicle.plateNumber?.toLowerCase().includes(search) ||
            vehicle.brand.name?.toLowerCase().includes(search) ||
            vehicle.model?.toLowerCase().includes(search) ||
            vehicle.customer.name?.toLowerCase().includes(search)
        );
    });


    const validationSchema = Yup.object({
        plateNumber: Yup.string().required("Plate No is required"),
        brandId: Yup.number().required("Brand is required").moreThan(0, "Brand is required"),
        customerId: Yup.number().required("Customer is required").moreThan(0, "Owner is required"),
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
                            <Typography variant='h6' gutterBottom
                                sx={{
                                    background: 'linear-gradient(120deg, #10097cff, #b3b5e8ff)',
                                    padding: 1,
                                    color: "#fff",
                                    mb: 2,
                                    borderRadius: "5px"
                                }}

                            >
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
                                    resetForm,
                                    handleChange,
                                    handleBlur,
                                    handleSubmit,
                                    setFieldValue,
                                    setFieldTouched,
                                    validateForm
                                }) => (
                                    <form onSubmit={handleSubmit}>
                                        <Grid container spacing={2}>
                                            <Grid size={{ md: 12, xs: 12 }}>
                                                <TextField
                                                    // size='small'
                                                    name='plateNumber'
                                                    size="small"
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
                                                <Autocomplete
                                                    sx={{
                                                        width: "100%"
                                                    }}
                                                    options={brands}
                                                    getOptionLabel={(option) => option.name || ""}
                                                    onChange={(event, newValue) =>
                                                        setFieldValue("brandId", newValue ? newValue.id : 0)
                                                    }
                                                    value={brands.find((b) => b.id === values.brandId) ?? null}
                                                    onBlur={() => setFieldTouched("brandId", true)}
                                                    renderOption={(props, option) => {
                                                        const { key, ...rest } = props;
                                                        return (
                                                            <Box
                                                                key={key}
                                                                component="li"
                                                                {...rest}
                                                            >
                                                                <Box sx={{
                                                                    display: "flex",
                                                                    flexDirection: "row",
                                                                    alignItems: "center"
                                                                }}>
                                                                    <Typography>{option.name}</Typography>
                                                                    <Box
                                                                        component="img"
                                                                        src={option?.brandImageUrl}
                                                                        alt="brand logo"
                                                                        sx={{
                                                                            width: 30,
                                                                            height: "auto",
                                                                            boxSizing: "border-box",
                                                                            objectFit: "cover"
                                                                        }}
                                                                    />
                                                                </Box>

                                                            </Box>
                                                        )

                                                    }

                                                    }
                                                    renderInput={(params) => {
                                                        const selectedBrand = brands.find((b) => b.id === values.brandId);
                                                        return (
                                                            <TextField
                                                                {...params}
                                                                InputProps={{
                                                                    ...params.InputProps,
                                                                    startAdornment: selectedBrand ? (
                                                                        <Box
                                                                            component="img"
                                                                            src={selectedBrand.brandImageUrl}
                                                                            alt='brand logo'
                                                                            sx={{
                                                                                width: 30,
                                                                                height: 'auto',
                                                                                // ml: 10,
                                                                                boxSizing: 'border-box',
                                                                                objectFit: 'cover',
                                                                            }}
                                                                        />
                                                                    ) : null


                                                                }}
                                                                label="Select a Brand *"
                                                                size="small"
                                                                error={touched.brandId && Boolean(errors.brandId)}
                                                                helperText={touched.brandId && errors.brandId}

                                                            />

                                                        )

                                                    }}
                                                />
                                                {/* <FormControl variant='outlined' fullWidth size='small' error={touched.brandId && Boolean(errors.brandId)} >
                                                    <InputLabel id='brandId' >Select a Brand *</InputLabel>
                                                    <Select
                                                        labelId='brandId'
                                                        label='Select a Brand *'
                                                        name='brandId'
                                                        value={values.brandId || ''}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                    >
                                                        <MenuItem value={0} disabled>Pick a brand</MenuItem>
                                                        {brands.map((brand) => (
                                                            <MenuItem key={brand.id} value={brand.id}>
                                                                <Box sx={{
                                                                    display: "flex",
                                                                    flexDirection: "row",
                                                                    // justifyContent: "center",
                                                                    gap: 1
                                                                }}>
                                                                    <Typography>{brand.name}</Typography>
                                                                    <Box component={'img'}
                                                                        src={brand.brandImageUrl}
                                                                        alt='brand logo'
                                                                        sx={{
                                                                            width: 30,
                                                                            height: 'auto',
                                                                            // ml: 10,
                                                                            boxSizing: 'border-box',
                                                                            objectFit: 'cover'
                                                                        }}
                                                                    />
                                                                </Box>
                                                            </MenuItem>
                                                        )
                                                        )}

                                                    </Select>
                                                    {touched.brandId && errors.brandId && (
                                                        <FormHelperText>{errors.brandId}</FormHelperText>
                                                    )}
                                                </FormControl> */}
                                            </Grid>
                                            <Grid size={{ md: 12, xs: 12 }}>
                                                <TextField
                                                    name='model'
                                                    size="small"
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
                                                <Autocomplete
                                                    options={customers}
                                                    getOptionLabel={(option) => option.name || ""}
                                                    onChange={(event, newValue) => setFieldValue("customerId", newValue ? newValue.id : 0)}
                                                    value={customers.find((c) => c.id === values.customerId) ?? null}
                                                    onBlur={() => setFieldTouched("customerId", true)}
                                                    // isOptionEqualToValue={(option, value) => option.id === value.id}
                                                    renderOption={(props, option) => {
                                                        const { key, ...rest } = props;
                                                        return (
                                                            <Box
                                                                key={key}
                                                                component="li"
                                                                {...rest}
                                                            >
                                                                <Box
                                                                    sx={{
                                                                        display: "flex",
                                                                        flexDirection: "row",
                                                                        alignItems: "center",
                                                                        gap: 1,
                                                                    }}
                                                                >
                                                                    <Typography fontWeight={500} >{option.name}</Typography>
                                                                    <Typography color='text.secondary'>{option.nic}</Typography>
                                                                </Box>

                                                            </Box>
                                                        )

                                                    }}

                                                    renderInput={(params) => {
                                                        const selectedCustomer = customers.find((c) => c.id === values.customerId);
                                                        return (
                                                            <TextField
                                                                {...params}
                                                                label="Select Owner *"
                                                                size='small'
                                                                error={touched.customerId && Boolean(errors.customerId)}
                                                                helperText={touched.customerId && errors.customerId}
                                                                InputProps={{
                                                                    ...params.InputProps,
                                                                    endAdornment: (
                                                                        <>
                                                                            {selectedCustomer && (
                                                                                <Box
                                                                                    sx={{
                                                                                        display: "flex",
                                                                                        alignItems: "center",
                                                                                        gap: 1,
                                                                                    }}
                                                                                >
                                                                                    <Typography color='primary' fontWeight={500}>{selectedCustomer.name}</Typography>
                                                                                    <Typography fontWeight={500} color='primary'>{'(NIC): ' + selectedCustomer.nic}</Typography>
                                                                                </Box>
                                                                            )}
                                                                            {params.InputProps.endAdornment}
                                                                        </>
                                                                    )
                                                                    // endAdornment: selectedCustomer ? (
                                                                    //     <Box
                                                                    //         sx={{
                                                                    //             display: "flex",
                                                                    //             alignItems: "center",
                                                                    //             gap: 1,
                                                                    //         }}
                                                                    //     >
                                                                    //         <Typography color='primary' fontWeight={500}>{selectedCustomer.name}</Typography>
                                                                    //         <Typography fontWeight={500} color='primary'>{'(NIC): ' + selectedCustomer.nic }</Typography>
                                                                    //     </Box>
                                                                    // ) : null
                                                                }}
                                                            />
                                                        )

                                                    }}
                                                />
                                                {/* <FormControl variant='outlined' fullWidth size='small'
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
                                                            <MenuItem key={customer.id} value={customer.id} >
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
                                                </FormControl> */}
                                            </Grid>

                                            <Grid size={{ md: 12, xs: 12 }}>
                                                <Button variant='outlined' component='label' size='small'>
                                                    Upload image
                                                    <input
                                                        ref={fileInputRef}
                                                        type='file'
                                                        hidden
                                                        accept='image/*'
                                                        // onChange={(event) => {
                                                        //     const file = event.currentTarget.files[0];
                                                        //     if (!file) return;
                                                        //     if (preview) {
                                                        //         URL.revokeObjectURL(preview);
                                                        //     }
                                                        //     console.log("ImageFile:", file);
                                                        //     setFieldValue("image", file);
                                                        //     console.log("URL", URL.createObjectURL(file));
                                                        //     setPreview(URL.createObjectURL(file));
                                                        // }}
                                                        onChange={(event) => {
                                                            handleFileChange(event);
                                                            setFieldValue("image", event.target.files[0]);
                                                        }}
                                                    />
                                                </Button>
                                            </Grid>
                                            <Grid size={{ md: 6, xs: 6 }}>
                                                {preview && (
                                                    <Box sx={{
                                                        // width: 200,
                                                        // height: 100,
                                                        // border: '2px solid red'
                                                    }}
                                                    >
                                                        <Box
                                                            component={'img'}
                                                            src={preview}
                                                            alt='Vehicle Image'
                                                            sx={{
                                                                width: '100%',
                                                                height: 'auto',
                                                                objectFit: 'contain',
                                                                borderRadius: 5
                                                            }}
                                                        />
                                                        {/* <img
                                                            src={preview}
                                                            alt='Vehicle Image'
                                                            style={{
                                                                width: '100%',
                                                                height: 'auto',
                                                                objectFit: 'contain',
                                                                borderRadius: '8px',
                                                                // filter: 'drop-shadow(2px 2px 5px black)'
                                                            }}
                                                        /> */}
                                                    </Box>
                                                )}

                                            </Grid>



                                            <Grid size={{ md: 12, xs: 12 }}>
                                                <Stack spacing={1} direction="row">
                                                    <Button
                                                        variant='contained'
                                                        sx={{ width: 120 }}
                                                        type='submit'
                                                        disabled={selectedVehicle || !btnAddEnabled}
                                                    >
                                                        Add
                                                    </Button>
                                                    <Button
                                                        variant='contained'
                                                        sx={{ width: 120 }}
                                                        disabled={!selectedVehicle || !btnUpdateEnabled}
                                                        onClick={async () => await handleUpdate(values, formikActions, validateForm)}
                                                    >
                                                        Update
                                                    </Button>
                                                    <Button
                                                        variant='contained'
                                                        sx={{ width: 120 }}
                                                        disabled={!selectedVehicle || !btnDeleteEnabled}
                                                        onClick={() => handleDelete(values, formikActions)}
                                                    >
                                                        Delete
                                                    </Button>
                                                    <Button
                                                        variant='contained'
                                                        sx={{ width: 120 }}
                                                        onClick={() =>
                                                            handleClearForm((resetForm))}
                                                    >
                                                        Clear
                                                    </Button>
                                                </Stack>
                                            </Grid>
                                            {responseErrors && (
                                                <Grid size={{ md: 12, xs: 12 }}>
                                                    <Typography align="center" variant="body2" color="error">{responseErrors}</Typography>
                                                </Grid>
                                            )}
                                        </Grid>

                                    </form>
                                )}
                            </Formik>
                        </Paper>
                    </Grid>
                    <Grid size={{ md: 4, xs: 12 }}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant='h6' gutterBottom
                                sx={{
                                    background: 'linear-gradient(120deg, #10097cff, #b3b5e8ff)',
                                    padding: 1,
                                    color: "#fff",
                                    mb: 2,
                                    borderRadius: "5px"
                                }}
                            >
                                Vehicle Search
                            </Typography>
                            <Formik
                                initialValues={{
                                    plateNumber: "",
                                    brandId: 0,
                                    customerId: 0
                                }}
                                onSubmit={handleSearch}

                            >
                                {({
                                    values,
                                    setFieldValue,
                                    handleBlur,
                                    handleChange,
                                    handleSubmit,
                                    resetForm

                                }) => {
                                    // const isBtnSearchDisabled = !Object.values(values).some((v) =>
                                    //     (typeof v === "string" && v.trim() !== "") || (typeof v === "number" && v > 0)
                                    // );
                                    const isBtnSearchDisabled = !Object.values(values).some((v) => v !== 0 && v !== "");

                                    return (<form onSubmit={handleSubmit}>
                                        <Grid container spacing={2}>
                                            <Grid size={{ md: 12, xs: 12 }}>
                                                <TextField
                                                    name='plateNumber'
                                                    size='small'
                                                    variant='outlined'
                                                    label='Plate No'
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
                                                <FormControl variant='outlined' fullWidth size='small'>
                                                    <InputLabel id='brandId' >Select a Brand </InputLabel>
                                                    <Select
                                                        labelId='brandId'
                                                        label='Select a Brand '
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
                                                </FormControl>
                                            </Grid>
                                            <Grid size={{ md: 12, xs: 12 }}>
                                                <FormControl variant='outlined' fullWidth size='small'>
                                                    <InputLabel id='customerId' >Select a Owner </InputLabel>
                                                    <Select
                                                        labelId='customerId'
                                                        label='Select a Owner '
                                                        name='customerId'
                                                        value={values.customerId || ''}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        renderValue={(selected) => {
                                                            var customer = customers.find(c => c.id == selected);
                                                            return customer ? `${customer.name} (NIC: ${customer.nic})` : "";
                                                        }}
                                                    >
                                                        <MenuItem value={0} disabled>Pick a Owner</MenuItem>
                                                        {customers.map((customer) => (

                                                            <MenuItem key={customer.id} value={customer.id}>
                                                                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
                                                                    <Typography fontWeight={500}>{customer.name}</Typography>
                                                                    <Typography color='text.secondary'>{customer.nic}</Typography>
                                                                </Box>
                                                            </MenuItem>
                                                        )
                                                        )}
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid size={{ md: 12, xs: 12 }}>
                                                <Stack direction={'row'} spacing={1}>
                                                    <Button
                                                        sx={{
                                                            width: 120
                                                        }}
                                                        variant='contained'
                                                        type='submit'
                                                        disabled={isBtnSearchDisabled}
                                                    >
                                                        Search
                                                    </Button>
                                                    <Button
                                                        sx={{
                                                            width: 120
                                                        }}
                                                        variant='contained'
                                                        onClick={async () => await handleSearchClear(resetForm)}
                                                    >
                                                        Clear
                                                    </Button>
                                                </Stack>

                                            </Grid>

                                        </Grid>
                                    </form>);
                                }
                                }
                            </Formik>
                        </Paper>
                    </Grid>
                    <Grid size={{ md: 12, xs: 12 }}>
                        <Paper sx={{ p: 0 }}>
                            <Typography variant='h6' gutterBottom
                                sx={{
                                    background: 'linear-gradient(120deg, #10097cff, #b3b5e8ff)',
                                    padding: 1,
                                    color: "#fff",
                                    mb: 2,
                                    borderRadius: "5px"
                                }}
                            >
                                Vehicle Details
                            </Typography>
                            <Box textAlign='right'>
                                <TextField
                                    label="Search By Table Results"
                                    variant='outlined'
                                    placeholder="Enter search values"
                                    size='small'
                                    sx={{
                                        width: '20%',
                                        "& .MuiInputBase-input": {
                                            padding: "8px 8px", // reduce input padding
                                            fontSize: "1rem", // smaller font
                                        },
                                        align: 'right'
                                    }}
                                    onChange={(e) => {
                                        setFilterText(e.target.value.trim());
                                        setPage(0);
                                    }}
                                    value={filterText}
                                />
                            </Box>
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
                                        {filteredVehicles.length ? filteredVehicles.slice(
                                            page * rowsPerPage,
                                            page * rowsPerPage + rowsPerPage
                                        ).map((vehicle) => (
                                            <TableRow
                                                key={vehicle.id}
                                                hover
                                                onClick={() => handleRowClick(vehicle)}
                                                selected={selectedVehicle?.id === vehicle.id}
                                                sx={{
                                                    cursor: 'pointer',
                                                    "&.Mui-selected": {
                                                        backgroundColor: "rgb(206, 209, 228)",
                                                        transition: "background-color 0.3s linear",
                                                    },
                                                    "&.Mui-selected:hover": {
                                                        backgroundColor: "rgb(197, 203, 235)",
                                                    }

                                                }}
                                            >
                                                <TableCell>{vehicle.plateNumber}</TableCell>
                                                {/* <TableCell>{vehicle.brand.name}</TableCell> */}

                                                <TableCell>
                                                    <Box
                                                        component={'img'}
                                                        src={vehicle.brand?.brandImageUrl}
                                                        alt={`${vehicle.brand.name}-logo`}
                                                        sx={{
                                                            height: 30,
                                                            width: 40,
                                                            objectFit: 'contain'
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>{vehicle.model}</TableCell>
                                                <TableCell>{vehicle.customer.name}</TableCell>
                                            </TableRow>
                                        )) : (
                                            <TableRow>
                                                <TableCell colSpan={4}>
                                                    <Alert severity='warning'
                                                        sx={{ justifyContent: 'center', }}
                                                    >
                                                        <Typography align='center'>
                                                            No records to display.
                                                        </Typography>
                                                    </Alert>

                                                </TableCell>
                                            </TableRow>

                                        )}

                                        {/* {vehicles.slice(
                                            page * rowsPerPage,
                                            page * rowsPerPage + rowsPerPage
                                        ).map((vehicle) => (
                                            <TableRow
                                                key={vehicle.id}
                                                hover
                                                onClick={() => handleRowClick(vehicle)}
                                                selected={selectedVehicle?.id === vehicle.id}
                                                sx={{
                                                    cursor: 'pointer',
                                                    "&.Mui-selected": {
                                                        backgroundColor: "##daf2eaff",
                                                        transition: "background-color 0.3s linear",
                                                    },
                                                    "&.Mui-selected:hover": {
                                                        backgroundColor: "#daf2eaff",
                                                    }

                                                }}
                                            >
                                                <TableCell>{vehicle.plateNumber}</TableCell>
                                                <TableCell>{vehicle.brand.name}</TableCell>
                                                <TableCell>{vehicle.model}</TableCell>
                                                <TableCell>{vehicle.customer.name}</TableCell>
                                            </TableRow>
                                        ))} */}

                                    </TableBody>
                                </Table>
                                <TablePagination
                                    component={"div"}
                                    count={filteredVehicles.length}
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