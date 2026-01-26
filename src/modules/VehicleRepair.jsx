import { Autocomplete, Box, Button, Checkbox, Chip, FormControl, FormHelperText, Grid, InputLabel, List, ListItemButton, ListItemIcon, ListItemText, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useEffect } from 'react';
import vehicleService from '../api/vehicleService';
import { Formik } from 'formik';
import { CheckBox, Girl } from '@mui/icons-material';
import * as Yup from 'yup';
import repairCategoryService from '../api/repairCategoryService';
import repairService from '../api/repairService';

const VehicleRepair = () => {

    const [vehicles, setVehicles] = useState([]);
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

    const [vehicleRepair, setVehicleRepair] = useState({
        vehicleId: 0,
        speedoMeter: 0,
        repairCategoryId: 0
    });

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
        console.log("TandferListData", transferListTableData);

    }, [transferListTableData]);

    useEffect(() => {
        fetchVehicles(null);
        fetchRepaircategories();
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
        repairCategoryId: Yup.number().required().moreThan(0, "Repair Category is Required")
    });

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

    // const deleteTransferListTableData = (id) => {
    //     setTransferListTableData((prev) => prev.filter((r) => r.id !== id) );
    // }

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container rowSpacing={2} columnSpacing={1} >
                    <Grid size={{ md: 8, xs: 12 }}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant='h6' gutterBottom>Vehicle Repair Form</Typography>
                            <Formik
                                enableReinitialize
                                initialValues={vehicleRepair}
                                validationSchema={validationSchema}
                            >
                                {({
                                    values,
                                    setFieldValue,
                                    handleChange,
                                    handleBlur,
                                    handleSubmit,
                                    touched,
                                    errors
                                }) => (
                                    <form>
                                        <Grid container spacing={2}>
                                            <Grid size={{ md: 12, xs: 12 }}>
                                                <Autocomplete
                                                    options={vehicles}
                                                    getOptionLabel={(option) => option.plateNumber || ""}
                                                    onChange={(event, newValue) =>
                                                        setFieldValue("vehicleId", newValue ? newValue.id : 0)
                                                    }
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
                                                            label="Select a Plate Number"
                                                            size='small'
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
                                                    // onBlur={(e) => {
                                                    //     console.log("BLuRR");
                                                    // }}

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
                                            {Boolean(values.repairCategoryId) && (
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
                                                {Boolean(transferListTableData.length) && (
                                                    <TableContainer>
                                                    <Table>
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell>Repair Category</TableCell>
                                                                <TableCell>Repair</TableCell>
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
                                                                    {/* <TableCell><Button size='small' variant='outlined' color='error'>Delete</Button></TableCell> */}
                                                                    <TableCell>
                                                                        <Chip
                                                                            label='delete'
                                                                            color='primary'
                                                                            variant='outlined'
                                                                            onClick={() => setTransferListTableData((prev) => prev.filter((r) => r.id !== repair.id)  )}
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
                                                    onPageChange={(event, newPage) => setPage(newPage) }
                                                    />
                                                </TableContainer>
                                                )}
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
                            <Typography variant='h6'>Vehicle Repair Search</Typography>


                        </Paper>
                    </Grid>
                    <Grid size={{ md: 12, xs: 12 }}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant='h6'> Repair Details</Typography>



                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}

export default VehicleRepair