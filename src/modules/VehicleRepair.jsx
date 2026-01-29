import { Autocomplete, Backdrop, Box, Button, Checkbox, Chip, CircularProgress, FormControl, FormHelperText, Grid, InputLabel, List, ListItemButton, ListItemIcon, ListItemText, MenuItem, Paper, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useEffect } from 'react';
import vehicleService from '../api/vehicleService';
import { Formik } from 'formik';
import { CheckBox, Girl, TabUnselected } from '@mui/icons-material';
import * as Yup from 'yup';
import repairCategoryService from '../api/repairCategoryService';
import repairService from '../api/repairService';
import useConfirmDialog, { ACTIONS } from './useConfirmDialog';
import ConfirmDialog from './ConfirmDialog';
import vehicleRepairService from '../api/vehicleRepairService';
import SnackbarCustom from './SnackbarCustom';

const VehicleRepair = () => {

    const [vehicles, setVehicles] = useState([]);
    const [vehicleRepairs, setVehicleRepairs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [repairCategories, setRepairCategories] = useState([]);
    const [repairsByCategoryId, setRepairsByCategoryId] = useState([]);
    const [repairIdsForTrnasferList, setRepairIdsForTrnasferList] = useState([]);
    const [transferListTableData, setTransferListTableData] = useState([]);

    const [left, setLeft] = useState([]);
    const [right, setRight] = useState([]);
    const [checked, setChecked] = useState([]);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [pageForViewTable, setPageForViewTable] = useState(0);
    const [rowsPerPageForViewTable, setRowsPerPageForViewTable] = useState(5);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const [selectedVehicleRepair, setSelectedVehicleRepair] = useState(null);

    const [vehicleRepair, setVehicleRepair] = useState({
        id: 0,
        vehicleId: 0,
        speedoMeter: 0,
        repairCategoryId: 0,
        note: null,
        repairId: 0,
        isEditMode: Boolean(selectedVehicleRepair)
    });

    const isEditMode = Boolean(selectedVehicleRepair);

    const handleRowClick = async (vehicleRepair) => {
        const vehicleRepairObject = {
            id: vehicleRepair.id,
            vehicleId: vehicleRepair.vehicle.id,
            speedoMeter: vehicleRepair.speedoMeter,
            repairCategoryId: vehicleRepair.repair.repairCategory.id,
            repairId: vehicleRepair.repair.id,
            note: vehicleRepair.note
        };
        console.log("ClickRow", vehicleRepair);

        await getRepairsByCategoryId(vehicleRepairObject.repairCategoryId);

        setSelectedVehicleRepair(vehicleRepairObject);
        setVehicleRepair({
            id: vehicleRepairObject.id,
            vehicleId: vehicleRepairObject.vehicleId,
            // vehicleId: 0,
            speedoMeter: vehicleRepairObject.speedoMeter,
            repairCategoryId: vehicleRepairObject.repairCategoryId,
            note: vehicleRepairObject.note,
            repairId: vehicleRepairObject.repairId,
            // repairId: 0,
            isEditMode: true
        });

    }

    const {
        isOpen,
        actionType,
        pendingActions,
        pendingValues,
        operationModule,
        openDialog,
        closeDialog
    } = useConfirmDialog();

    const fetchVehicles = async (paramObject) => {
        try {
            setLoading(true);
            await new Promise((resolve) => setTimeout(resolve, 0));
            const vehicles = await vehicleService.getAllVehicles(paramObject);
            setVehicles(vehicles);

        } catch (err) {
            console.error("Error", err);
            window.alert(`You have following error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }

    const fetchVehicleRepairs = async () => {
        try {
            setLoading(true);
            await new Promise((resolve) => setTimeout(resolve, 0));
            const vehicleRepairs = await vehicleRepairService.getAllVehicleRepairs();
            setVehicleRepairs(vehicleRepairs);

        } catch (err) {
            console.error("Error", err.message);
            window.alert(`You have following error: ${err.message}`);
        }
        finally {
            setLoading(false);
        }
    }

    const fetchRepaircategories = async () => {
        try {
            setLoading(true);
            await new Promise((resolve) => setTimeout(resolve, 0));
            const repairCategories = await repairCategoryService.getAllRepairCategories();
            console.log("Catego", repairCategories);

            setRepairCategories(repairCategories);
        } catch (err) {
            console.error("Error", err.message);
            window.alert(`You have following error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }

    const getRepairsByCategoryId = async (id) => {
        try {
            setLoading(true);
            await new Promise((resolve) => setTimeout(resolve, 0));
            const repairsByCategoryId = await repairService.getRepairsByCategoryId(id);
            setRepairsByCategoryId(repairsByCategoryId);
            // const repairIds = repairsByCategoryId.map((r) => r.id);
            setLeft(repairsByCategoryId);
            setRight([]);
            setChecked([]);
            // console.log("IDS", repairIds);
            // setRepairIdsForTrnasferList(repairIds);

        } catch (err) {
            console.error("Error", err.message);
            window.alert(`You have following error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }

    // useEffect(() => {
    //     console.log("RepairsBtCat", repairsByCategoryId);

    // }, [repairsByCategoryId]);
    useEffect(() => {
        console.log("VehilceRepairObject", vehicleRepair);

    }, [vehicleRepair]);

    useEffect(() => {
        fetchVehicles(null);
        fetchRepaircategories();
        fetchVehicleRepairs();
    }, []);

    useEffect(() => {
        const maxPage = Math.max(0, Math.ceil(transferListTableData.length / rowsPerPage) - 1);
        if (page > maxPage) {
            setPage(maxPage);
        }
    }
        , [transferListTableData.length, rowsPerPage, page]);

    const validationSchema = Yup.object({
        vehicleId: Yup.number().required().moreThan(0, "Plate Number is required"),
        repairCategoryId: Yup.number().required().moreThan(0, "Repair Category is Required"),
        speedoMeter: Yup.number()
            .transform((value, originalValue) => originalValue === "" ? undefined : Number(originalValue))
            .typeError("Only numbers are allowed"),

        repairId: Yup.number().when("isEditMode", {
            is: true,
            then: (schema) => schema.required().moreThan(0, "Repair is Required"),
            otherwise: (schema) => schema.notRequired()
        })
    });

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    }

    // const insterSection = (a, b) => {
    //     return a.filter((value) => b.includes(value));
    // }

    // const not = (a, b) => {
    //     return a.filter((value) => !b.includes(value))
    // }

    const insterSection = (a, bIds) => {
        return a.filter((item) => bIds.includes(item.id));
    }

    const not = (a, b) => {
        return a.filter((item) => !b.some((x) => x.id === item.id));
    }

    const leftChecked = insterSection(left, checked);
    const rightChecked = insterSection(right, checked);

    // const handleToggle = (itemId) => {
    //     const currentIndex = checked.indexOf(itemId);
    //     const newCheckedAry = [...checked];

    //     if (currentIndex == -1) {
    //         newCheckedAry.push(itemId);
    //     } else {
    //         newCheckedAry.splice(currentIndex, 1)
    //     }
    //     setChecked(newCheckedAry);
    // }

    const handleToggle = (id) => {
        setChecked((prev) => {
            return prev.includes(id)
                ? prev.filter((x) => x !== id)
                : [...prev, id]
        });
    }

    const handleCheckRight = () => {
        setRight((prev) => [...prev, ...leftChecked]);
        setLeft((prev) => not(prev, leftChecked));
        setChecked([]);
    }
    const handleCheckLeft = () => {
        setLeft((prev) => [...prev, ...rightChecked]);
        setRight((prev) => not(prev, rightChecked));
        setChecked([]);
    }



    // const handleCheckRight = () => {
    //     setRight(right.concat(leftChecked));
    //     setLeft(not(left, leftChecked));
    //     setChecked(not(checked, leftChecked));
    // }

    // const handleCheckLeft = () => {
    //     setLeft(left.concat(rightChecked));
    //     setRight(not(right, rightChecked));
    //     setChecked(not(checked, rightChecked));
    // }


    const customList = (items) => (
        <Paper sx={{ width: 200, height: 230, overflow: 'auto' }}>
            <List dense component='div' role='list'>
                {items.map((item) => {
                    const labelId = `transfer-list-item-${item.id}-label`;
                    return (
                        <ListItemButton
                            key={item.id}
                            role="listitem"
                            // onClick={() => handleToggle(itemId)}
                            onClick={() => handleToggle(item.id)}
                        >
                            <ListItemIcon>
                                <Checkbox
                                    tabIndex={-1}
                                    disableRipple
                                    checked={checked.includes(item.id)}
                                    inputProps={{
                                        'aria-labelledby': item.id
                                    }}
                                />
                            </ListItemIcon>
                            {/* <ListItemText id={labelId} primary={repairsByCategoryId.find((r) => r.id === itemId)?.name} /> */}
                            <ListItemText id={labelId} primary={item.name} />
                        </ListItemButton>
                    );

                })}

            </List>

        </Paper>
    );

    const fillTransferListTable = () => {

        // setTransferListTableData((prev) => {
        //     const newItems = right.filter((r) => !prev.some((data) => data.id === r.id));
        //     return [...prev, ...newItems];

        // });
        setTransferListTableData((prev) => {
            const existingIds = prev.map((r) => r.id);
            const newItems = right.filter((r) => !existingIds.includes(r.id));
            return [...prev, ...newItems];
        });
        setRight([]);
    }

    const handleClearForm = (resetForm) => {
        setVehicleRepair({
            vehicleId: 0,
            speedoMeter: 0,
            repairCategoryId: 0
        });
        setTransferListTableData([]);

        if (resetForm) resetForm();
        setSelectedVehicleRepair(null);
    }

    const handleSave = (values, formikActions) => {

        openDialog(ACTIONS.ADD, values, formikActions, "save vehicle repairs");
    }

    const handleUpdate = async (values, formikActions, { validateForm, setTouched }) => {
        const errors = await validateForm();
        console.log("UpdateFormValidation", errors);

        const errorObjectKeys = Object.keys(errors);
        if (errorObjectKeys.length) {
            const errorTouchObject = errorObjectKeys.reduce((acc, item) => {
                acc[item] = true;
                return acc;
            }, {});
            setTouched(errorTouchObject, true);

            return;
        }
        console.log("UpdateFormValues", values);
        openDialog(ACTIONS.UPDATE, values, formikActions, "update vehicle repair");
    }

    const handleDelete = (values, formikActions) => {
        openDialog(ACTIONS.DELETE, values, formikActions, "delete repair for:");
    }

    const handleConfirm = async () => {
        if (actionType === ACTIONS.ADD) {
            await confirmSave(pendingValues, pendingActions)
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

        const repairInfos = transferListTableData.map((r) => ({
            repairId: r.id,
            note: r.note ? r.note.trim() : null
        }));

        if (!repairInfos.length) return;

        const saveObject = {
            vehicleId: pendingValues?.vehicleId,
            speedoMeter: pendingValues.speedoMeter ? Number(pendingValues.speedoMeter) : 0,
            repairsInfos: repairInfos
        };
        console.log("final", saveObject);

        try {
            setLoading(true);
            const response = await vehicleRepairService.saveVehicleRepairs(saveObject);
            console.log("SaveResponse", response);
            if (response.status === 201 && response.data !== null) {
                const seletedVehicle = vehicles.find((v) => v.id === pendingValues?.vehicleId);
                if (seletedVehicle) {
                    setSnackbarMessage(`Repairs for ${seletedVehicle.plateNumber} saved successfully...`);
                    setSnackbarOpen(true);
                }
                setPage(0);
                handleClearForm(pendingActions?.resetForm);
                await fetchVehicleRepairs();
            }

        } catch (err) {
            console.error("VehicleRepairSaveFailed", err);
        } finally {
            setLoading(false);
            closeDialog();
        }

    }

    const confirmUpdate = async (pendingValues, pendingActions) => {
        if (!pendingValues) return;

        const vehicleRepairUpdateObject = {
            vehicleId: pendingValues.vehicleId,
            repairId: pendingValues.repairId,
            speedoMeter: pendingValues.speedoMeter ? Number(pendingValues.speedoMeter) : 0,
            note: (pendingValues.note === "" || pendingValues.note === null) ? null : pendingValues.note.trim()
        };

        console.log("FinalUpdateObjetc", vehicleRepairUpdateObject);
        const vehicleRepairId = pendingValues.id;

        try {
            setLoading(true);
            const response = await vehicleRepairService.updateVehicleRepair(vehicleRepairId, vehicleRepairUpdateObject);
            console.log("VRUpdateResponse", response);
            if (response.data !== null) {
                const vehicle = vehicles.find((v) => v.id === pendingValues?.vehicleId);
                if (vehicle) {
                    setSnackbarMessage(`Repair for ${vehicle.plateNumber} updated successfully...`);
                    setSnackbarOpen(true);
                }
                setPage(0);
                handleClearForm(pendingActions?.resetForm);
                await fetchVehicleRepairs();
            }
        } catch (err) {
            console.error("VehicleRepairUpdateFailed", err);
        } finally {
            setLoading(false);
            closeDialog();
        }
    }

    const confirmDelete = async (pendingValues, pendingActions) => {
        if (!pendingValues) return;

        const deleteId = pendingValues.id;

        try {
            setLoading(true);
            const response = await vehicleRepairService.deleteVehicleRepair(deleteId);
            console.log("DeleteResponse", response);
            if (response.data !== null) {
                const vehicle = vehicles.find((v) => v.id === pendingValues?.vehicleId);

                if (vehicle) {
                    setSnackbarMessage(`Repair for ${vehicle.plateNumber} deleted successfully...`);
                    setSnackbarOpen(true);
                }
                setPage(0);
                handleClearForm(pendingActions?.resetForm);
                await fetchVehicleRepairs();
            }

        } catch (err) {
            console.error("VehicleRepairDeleteFailed", err);
        } finally {
            setLoading(false);
            closeDialog();
        }
    }


    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <Backdrop
                    sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
                    open={loading}
                >
                    <CircularProgress color='inherit' />
                </Backdrop>

                <ConfirmDialog
                    isOpen={isOpen}
                    title={actionType === ACTIONS.ADD
                        ? 'Confirmation Saving '
                        : actionType === ACTIONS.UPDATE
                            ? 'Confirmation Updating'
                            : 'Confirmation deleting'
                    }
                    message={`Are you sure you want to ${operationModule} ${vehicles.find((v) => v.id === pendingValues?.vehicleId)?.plateNumber}`}
                    onClose={closeDialog}
                    onConfirm={async () => await handleConfirm()}

                />

                <SnackbarCustom
                    open={snackbarOpen}
                    snackbarClose={handleSnackbarClose}
                    snackbarMessage={snackbarMessage}
                />
                <Grid container rowSpacing={2} columnSpacing={1} >
                    <Grid size={{ md: 8, xs: 12 }}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant='h6' gutterBottom>Vehicle Repair Form</Typography>
                            <Formik
                                enableReinitialize
                                initialValues={vehicleRepair}
                                validationSchema={validationSchema}
                                onSubmit={handleSave}
                            >
                                {({
                                    values,
                                    setFieldValue,
                                    setFieldTouched,
                                    handleChange,
                                    handleBlur,
                                    handleSubmit,
                                    formikActions,
                                    // formikHelpers,
                                    validateForm,
                                    setTouched,
                                    resetForm,
                                    touched,
                                    errors
                                }) => (
                                    <form onSubmit={handleSubmit}>
                                        <Grid container spacing={2}>
                                            <Grid size={{ md: 12, xs: 12 }}>
                                                <Autocomplete
                                                    disabled={isEditMode}
                                                    options={vehicles}
                                                    getOptionLabel={(option) => option.plateNumber || ""}
                                                    onChange={(event, newValue) =>
                                                        setFieldValue("vehicleId", newValue ? newValue.id : 0)
                                                    }
                                                    onBlur={() => setFieldTouched("vehicleId", true)}
                                                    value={vehicles.find((v) => v.id === values.vehicleId) ?? null}
                                                    // renderOption={(props, option) => {
                                                    //     const { key, ...rest } = props;
                                                    //     return (
                                                    //         <Box key={key}
                                                    //             component="li"
                                                    //             {...rest}
                                                    //         >
                                                    //             <Box
                                                    //              sx={{
                                                    //                 display: "flex",
                                                    //                 alignItems: "center",
                                                    //                 gap: 2,
                                                    //              }}
                                                    //             >
                                                    //                 <Typography>{option.plateNumber}</Typography>
                                                    //                 <Typography color='text.secondary'>{`${option.customer.name} (NIC:) ${option.customer.nic}`}</Typography>
                                                    //             </Box>
                                                    //         </Box>
                                                    //     )
                                                    // }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Select a Plate Number *"
                                                            size='small'
                                                            error={touched.vehicleId && Boolean(errors.vehicleId)}
                                                            helperText={touched.vehicleId && errors.vehicleId}
                                                        />
                                                    )}
                                                />

                                            </Grid>
                                            <Grid size={{ md: 12, xs: 12 }}>
                                                <FormControl variant='outlined' fullWidth size='small' error={touched.repairCategoryId && Boolean(errors.repairCategoryId)}
                                                >
                                                    <InputLabel id='categoryId'>Select Repair Category *</InputLabel>
                                                    <Select
                                                        labelId='categoryId'
                                                        label='Select Repair Category *'
                                                        name='repairCategoryId'
                                                        onChange={async (e) => {
                                                            handleChange(e);
                                                            await getRepairsByCategoryId(e.target.value);
                                                        }}
                                                        value={values.repairCategoryId || ''}
                                                        onBlur={handleBlur}

                                                    >
                                                        <MenuItem value={0} disabled>Pick a Category</MenuItem>
                                                        {repairCategories.map((rc) => (
                                                            <MenuItem key={rc.id} value={rc.id}>{rc.name}</MenuItem>
                                                        ))}

                                                    </Select>
                                                    {touched.repairCategoryId && errors.repairCategoryId && (
                                                        <FormHelperText>{errors.repairCategoryId}</FormHelperText>
                                                    )}
                                                </FormControl>
                                            </Grid>
                                            {!isEditMode && values.repairCategoryId > 0 && (
                                                <Grid size={{ md: 12, xs: 12 }}>
                                                    <Grid
                                                        container
                                                        spacing={2}
                                                        sx={{ justifyContent: 'center', alignItems: 'center' }}
                                                    >
                                                        <Grid>{customList(left)}</Grid>
                                                        <Grid>
                                                            <Grid container direction='column' sx={{ alignItems: 'center' }}>
                                                                <Button
                                                                    variant='outlined'
                                                                    size='small'
                                                                    sx={{ my: 0.5 }}
                                                                    onClick={handleCheckRight}
                                                                    disabled={left.length === 0}
                                                                >
                                                                    &gt;
                                                                </Button>
                                                                <Button
                                                                    variant='outlined'
                                                                    size='small'
                                                                    sx={{ my: 0.5 }}
                                                                    onClick={handleCheckLeft}
                                                                    disabled={right.length === 0}
                                                                >
                                                                    &lt;
                                                                </Button>
                                                            </Grid>
                                                        </Grid>
                                                        <Grid>{customList(right)}</Grid>
                                                    </Grid>
                                                    <Box
                                                        textAlign='right'
                                                    >
                                                        <Button
                                                            variant='contained'
                                                            // color='info'
                                                            sx={{
                                                                textTransform: 'none',
                                                                my: 2
                                                            }}
                                                            onClick={fillTransferListTable}
                                                            disabled={right.length === 0}
                                                        >
                                                            Add Repairs
                                                        </Button>
                                                    </Box>
                                                    {transferListTableData.length > 0 && (
                                                        <TableContainer>
                                                            <Table>
                                                                <TableHead>
                                                                    <TableRow>
                                                                        <TableCell>Repair Category</TableCell>
                                                                        <TableCell>Repair</TableCell>
                                                                        <TableCell>Note</TableCell>
                                                                        <TableCell>Actions</TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    {/* {transferListTableData} */}
                                                                    {transferListTableData
                                                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                                        .map((repair) => (
                                                                            <TableRow key={repair?.id}>
                                                                                <TableCell>{repair?.repairCategory?.name}</TableCell>
                                                                                <TableCell>{repair?.name}</TableCell>
                                                                                <TableCell>
                                                                                    <TextField
                                                                                        size='small'
                                                                                        placeholder='Enter Note'
                                                                                        variant='outlined'
                                                                                        onChange={(e) => {
                                                                                            setTransferListTableData((prev) => {
                                                                                                return prev.map((item) => {
                                                                                                    const newItem = item.id === repair.id
                                                                                                        ? { ...item, note: e.target.value }
                                                                                                        : item;
                                                                                                    return newItem;
                                                                                                });
                                                                                            });
                                                                                        }}
                                                                                        value={repair.note || ""}
                                                                                    />
                                                                                </TableCell>
                                                                                <TableCell>
                                                                                    <Chip
                                                                                        label='delete'
                                                                                        color='primary'
                                                                                        variant='outlined'
                                                                                        onClick={() => setTransferListTableData((prev) => prev.filter((r) => r.id !== repair.id))}
                                                                                    />
                                                                                </TableCell>
                                                                            </TableRow>
                                                                        )
                                                                        )}
                                                                </TableBody>
                                                            </Table>
                                                            <TablePagination
                                                                component='div'
                                                                count={transferListTableData.length}
                                                                page={page}
                                                                rowsPerPage={rowsPerPage}
                                                                rowsPerPageOptions={[5, 10, 15, 20]}
                                                                onRowsPerPageChange={(e) => {
                                                                    setRowsPerPage(parseInt(e.target.value, 10));
                                                                    setPage(0);
                                                                }}
                                                                onPageChange={(event, newPage) => setPage(newPage)}
                                                            />
                                                        </TableContainer>
                                                    )}
                                                </Grid>
                                            )}
                                            <Grid size={{ md: 12, xs: 12 }}>
                                                {isEditMode && (
                                                    <Autocomplete
                                                        disabled={values.repairCategoryId === 0}
                                                        options={repairsByCategoryId}
                                                        getOptionLabel={(option) => option.name || ""}
                                                        onChange={(event, newValue) => setFieldValue("repairId", newValue ? newValue.id : 0)}
                                                        value={repairsByCategoryId.find((r) => r.id === values.repairId) ?? null}
                                                        onBlur={() => setFieldTouched("repairId", true)}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="Select a Repair *"
                                                                size='small'
                                                                error={touched.repairId && Boolean(errors.repairId)}
                                                                helperText={touched.repairId && errors.repairId}
                                                            />
                                                        )}
                                                    />
                                                )}

                                            </Grid>
                                            <Grid size={{ md: 12, xs: 12 }}>
                                                <TextField
                                                    name='speedoMeter'
                                                    size='small'
                                                    fullWidth
                                                    variant='outlined'
                                                    label='Speedometer Reading(km)'
                                                    onChange={(e) => {
                                                        setFieldValue('speedoMeter', e.target.value.replace(/^\s+/, ""));
                                                        // handleChange(e);
                                                    }}
                                                    value={values.speedoMeter}
                                                    onBlur={(e) => {
                                                        handleBlur(e);
                                                        setFieldValue('speedoMeter', e.target.value.trim());
                                                    }}
                                                    error={touched.speedoMeter && Boolean(errors.speedoMeter)}
                                                    helperText={touched.speedoMeter && errors.speedoMeter}

                                                />
                                            </Grid>
                                            {isEditMode && (
                                                <Grid size={{ md: 12, xs: 12 }}>
                                                    <TextField
                                                        name='note'
                                                        size='small'
                                                        fullWidth
                                                        variant='outlined'
                                                        label='Note'
                                                        onChange={(e) => setFieldValue("note", e.target.value.replace(/^\s+/, ""))}
                                                        value={values.note || ''}
                                                        onBlur={(e) => {
                                                            handleBlur(e);
                                                            setFieldValue("note", e.target.value.trim());
                                                        }}
                                                    />
                                                </Grid>
                                            )}
                                            <Grid size={{ md: 12, xs: 12 }}>
                                                <Stack direction='row' spacing={1}>
                                                    <Button
                                                        variant='contained'
                                                        sx={{ width: 120 }}
                                                        type='submit'
                                                        disabled={isEditMode || transferListTableData.length === 0}

                                                    >
                                                        Add
                                                    </Button>
                                                    <Button
                                                        variant='contained'
                                                        sx={{ width: 120 }}
                                                        disabled={!isEditMode}
                                                        onClick={() => handleUpdate(values, formikActions, { validateForm, setTouched })}
                                                    >
                                                        Update
                                                    </Button>
                                                    <Button
                                                        variant='contained'
                                                        sx={{ width: 120 }}
                                                        disabled={!isEditMode}
                                                        onClick={() => handleDelete(values, formikActions)}
                                                    >
                                                        Delete
                                                    </Button>
                                                    <Button
                                                        variant='contained'
                                                        sx={{ width: 120 }}
                                                        onClick={() => handleClearForm(resetForm)}
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
                            <Typography variant='h6'>Vehicle Repair Search</Typography>


                        </Paper>
                    </Grid>
                    <Grid size={{ md: 12, xs: 12 }}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant='h6'> Repair Details</Typography>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Plate Number</TableCell>
                                            <TableCell>Category</TableCell>
                                            <TableCell>Repair</TableCell>
                                            <TableCell>SpeedoMeter(km)</TableCell>
                                            <TableCell>Note</TableCell>
                                            <TableCell>Repair Date</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {vehicleRepairs.slice(
                                            pageForViewTable * rowsPerPageForViewTable,
                                            pageForViewTable * rowsPerPageForViewTable + rowsPerPageForViewTable
                                        ).map((vr) => (
                                            <TableRow
                                                key={vr.id}
                                                hover
                                                selected={vr.id === selectedVehicleRepair?.id}
                                                onClick={async () => await handleRowClick(vr)}
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
                                                <TableCell>{vr.vehicle.plateNumber}</TableCell>
                                                <TableCell>{vr.repair.repairCategory.name}</TableCell>
                                                <TableCell>{vr.repair.name}</TableCell>
                                                <TableCell>{vr.speedoMeter || '-'}</TableCell>
                                                <TableCell>{vr.note || '-'}</TableCell>
                                                {/* <TableCell>{vr.repairedDate.split("T")[0]}</TableCell> */}
                                                {/* <TableCell>{vr.repairedDate ? new Date(vr.repairedDate).toISOString().split("T")[0] : "-"}</TableCell> */}
                                                <TableCell>
                                                    {vr.repairedDate ? new Date(vr.repairedDate).toLocaleDateString("en-GB", {
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric"
                                                    }) : "-"}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <TablePagination
                                    component='div'
                                    count={vehicleRepairs.length}
                                    rowsPerPageOptions={[5, 10, 15, 20]}
                                    page={pageForViewTable}
                                    rowsPerPage={rowsPerPageForViewTable}
                                    onPageChange={(event, newPage) => setPageForViewTable(newPage)}
                                    onRowsPerPageChange={(event) => {
                                        setRowsPerPageForViewTable(parseInt(event.target.value, 10));
                                        setPageForViewTable(0);
                                    }}
                                />
                            </TableContainer>


                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}

export default VehicleRepair