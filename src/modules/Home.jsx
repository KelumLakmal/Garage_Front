import { Accordion, AccordionDetails, AccordionSummary, Backdrop, Box, Button, Card, CardContent, CardMedia, CircularProgress, Grid, Paper, Typography } from '@mui/material'
import React, { useState } from 'react'
import homeImage from "../assets/home1.jpg"
import vehicleService from '../api/vehicleService';
import { useEffect } from 'react';
import { ExpandMore } from '@mui/icons-material';

const Home = () => {

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startIndex, setStartIndex] = useState(0);


  const fetchVehicles = async (paramObject) => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 0));
      const vehicles = await vehicleService.getAllVehicles(paramObject);
      console.log("vehic", vehicles);

      setVehicles(vehicles);

    } catch (err) {
      console.error("Error", err.message);
      window.alert(`You have following error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchVehicles();
  }, []);

  useEffect(() => {
    if (!vehicles.length) return;

    const interval = setInterval(() => {
      console.log("Timer");

      setStartIndex((prev) => (prev + 4) % vehicles.length);
    }, 10000);

    return () => clearInterval(interval);

  }, [vehicles]);

  // const visibleVehicles = (startIndex + 4) <= vehicles.length
  //   ? vehicles.slice(startIndex, startIndex + 4)
  //   : [
  //     ...vehicles.slice(startIndex),
  //     ...vehicles.slice(0, (startIndex + 4) % vehicles.length)
  //   ];
  // console.log(visibleVehicles);
  const visibleVehicles = vehicles.slice(startIndex, startIndex + 4);



  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Backdrop
          sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
          open={loading}
        >
          <CircularProgress color='inherit' />
        </Backdrop>
        <Grid container rowSpacing={1} columnSpacing={1}>
          <Grid size={{ md: 12, xs: 12 }}>
            <Box sx={{
              display: "flex",
              gap: 2,
              height: "80vh"
            }}>
              <Box sx={{ flex: 3 }}>
                <Box
                  component="img"
                  alt='Home Image'
                  src={homeImage}
                  sx={{
                    width: "100%",
                    // maxHeight: "400px",
                    // height: "500px",
                    height: "80vh",
                    objectFit: "cover",
                    borderRadius: 5
                  }}
                />

              </Box>
              <Box sx={{ flex: 1, overflowY: "auto" }}>
                {/* card */}

                {visibleVehicles.slice(0, 4).map((v) => {
                  return (v.imageUrl &&
                    <Card key={v.id} sx={{
                      mb: 2,
                      width: "100%",
                      transform: "scale(1)",
                      "&:hover": {
                        transform: "scale(1.05)"
                      },
                      transition: "transform 0.3s linear"
                    }} >
                      <CardMedia
                        sx={{ height: 150, }}
                        image={v?.imageUrl}
                      />
                      <CardContent>
                        <Typography variant="body2" color='text.secondary' component="div">Latest Repairs</Typography>
                      </CardContent>
                    </Card>
                  )
                }
                )}
              </Box>

            </Box>
          </Grid>

          <Grid size={{ md: 12, xs: 6 }}>

            <Box>
              <Accordion sx={{background: 'linear-gradient(90deg, #d4d5ddff, #ffffffff)'}}>
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                >
                  <Typography variant='body1' >
                    More informations
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                    fontSize: 14,
                    color: 'text.secondary',
                    gap: 1
                  }}>
                    <Typography sx={{
                      fontSize: 14
                    }}
                      color='text.secondary'
                    >
                      Email: vdvgvxgx.mail.com
                    </Typography>

                    <Typography sx={{ fontSize: 14}}>
                      Contact No: 06746490xs
                    </Typography>
                   
                  </Box>

                </AccordionDetails>
              </Accordion>
            </Box>
          </Grid>
        </Grid>

      </Box>
    </>
  )
}

export default Home