import { Backdrop, Box, CircularProgress, Grid, Paper, Typography } from '@mui/material'
import React, { useState } from 'react'

const Vehicle = () => {
    const [loading, setLoading] = useState(false);

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

                <Grid container rowSpacing={2} columnSpacing={1}>
                    <Grid size={{ md: 8, xs: 12 }}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant='h4'>
                                Vehicle Form
                            </Typography>
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
                        </Paper>
                    </Grid>
                </Grid>


            </Box>


        </>
    )
}

export default Vehicle