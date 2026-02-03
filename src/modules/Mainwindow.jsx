import React, { useState } from "react";
import "./Mainwindow.css";
import { Outlet, Link } from "react-router-dom";

import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { useAuth } from "../auth/AuthContext";
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import { Avatar, Button, Collapse, IconButton, Menu, MenuItem } from "@mui/material";
import { AccountCircle, AccountCircleOutlined, AccountCircleRounded, AccountCircleSharp, AccountCircleTwoTone, ExpandLess, ExpandMore, PersonPinCircle, StarBorder } from "@mui/icons-material";
import userLoginImg from "../assets/userLogin.jpg";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined';
import ConstructionOutlinedIcon from '@mui/icons-material/ConstructionOutlined';
import SendIcon from '@mui/icons-material/Send';

const drawerWidth = 240;

const Mainwindow = () => {

  const { hasPermission, logOut, user } = useAuth();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [showWelcome, setShowWelcome] = useState(true);

  const handleMenuOpen = (event) => {
    // console.log("EVENT", event.currentTarget);
    setAnchorEl(event.currentTarget);
  }
  const hanldeMenuClose = () => {
    setAnchorEl(null);
  }
  const getUserName = () => {
    return user.userName.charAt(0) + user.userName.slice(1);
  }

  const MENU_ITEMS = [
    { label: "Home", path: "/main/home", permission: null, icon: <HomeOutlinedIcon /> },
    { label: "Student", path: "/main/student", permission: "STUDENT_VIEW", icon: <MailIcon /> },
    { label: "Customer", path: "/main/customer", permission: "CUSTOMER_VIEW", icon: <Person2OutlinedIcon fontSize="medium" /> },
    { label: "Vehicle", path: "/main/vehicle", permission: "VEHICLE_VIEW", icon: <DirectionsCarOutlinedIcon /> },
    { label: "Vehicle Repairs", path: "/main/vehicleRepairs", permission: null, icon: <ConstructionOutlinedIcon /> },
  ];



  // const filterMenus = () => {
  //   return MENU_ITEMS.filter((m) => !m.permission || hasPermission(m.permission));
  // }
  const userMenus = (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={hanldeMenuClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right"
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right"
      }}

    >
      <MenuItem onClick={hanldeMenuClose}> <ListItemIcon><PersonIcon /></ListItemIcon>Profile</MenuItem>
      <MenuItem onClick={() => { hanldeMenuClose(); logOut() }}><LogoutIcon sx={{ fontSize: 20, mr: 2 }} /> Log out</MenuItem>
      {/* <MenuItem onClick={() => { hanldeMenuClose(); }}><LogoutIcon sx={{ fontSize: 20, mr: 2 }} /> Log out</MenuItem> */}
    </Menu>
  );

  const [menu1Open, setMenu1Open] = useState(false);

  const handleMenu1Open = () => {
    setMenu1Open(!menu1Open);
  }


  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          // sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
          // className="app-bar"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundImage: "linear-gradient(120deg, rgba(27, 39, 181, 1), rgba(72, 85, 228, 1)) " }}
        >
          <Toolbar>
            <Box sx={{ flexGrow: 1 }} >
              {showWelcome && (
                <Typography
                  variant="h6"
                  noWrap
                  component="div"
                // className="welcome"
                // sx={{ background: 'red' }}
                // onAnimationEnd={() => setShowWelcome(false)}
                >
                  KNG GARAGE...
                </Typography>

              )}
            </Box>
            <Box sx={{
              display: "flex",
              alignItems: "center",
              // gap: 1
            }}>
              <IconButton
                size="large"
                color="inherit"
                edge="start"
                aria-haspopup="true"
                onClick={handleMenuOpen}
              >
                {/* <AccountCircle sx={{ fontSize: 28 }} /> */}
                {/* <Avatar alt="user icon" sx={{ width: 30, height: 30 }} src={userLoginImg} /> */}
                <Avatar alt="user icon" sx={{ width: 40, height: 40 }} src={user.imagepath || userLoginImg} />
              </IconButton>
              {/* <Typography variant="body1">{user.userName.charAt(0).toUpperCase() + user.userName.slice(1)}</Typography> */}
              <Typography variant="body1">{user.firstName + " " + user.lastName}</Typography>
              {userMenus}
            </Box>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: "auto" }}>
            <List>
              {MENU_ITEMS.filter((m) => !m.permission || hasPermission(m.permission)).map((menu, index) => (
                <ListItem key={index} disablePadding>
                  <ListItemButton component={Link} to={menu.path}>
                    {/* <ListItemIcon>{index % 2 == 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon> */}
                    <ListItemIcon>{menu.icon}</ListItemIcon>
                    <ListItemText primary={menu.label} />
                  </ListItemButton>
                </ListItem>
              ))}

            </List>
            <Divider />
            <List>
              {/* {["All mail", "Trash", "Spam"].map((text, index) => (
                <ListItem key={text} disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                    </ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItemButton>
                </ListItem>
              ))} */}
              <ListItem disablePadding>
                <ListItemButton onClick={handleMenu1Open}>
                  <ListItemIcon><SendIcon /></ListItemIcon>
                  <ListItemText primary='Menu 1' />
                  {menu1Open ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
              </ListItem>
              <Collapse in={menu1Open} timeout="auto" unmountOnExit>
                <List disablePadding >
                  <ListItem >
                    <ListItemButton sx={{ pl: 4 }}>
                      <ListItemIcon>
                        <StarBorder />
                      </ListItemIcon>
                      <ListItemText primary='Sub menu 1' />
                    </ListItemButton>
                  </ListItem>
                  <ListItem >
                    <ListItemButton sx={{ pl: 4 }}>
                      <ListItemIcon>
                        <StarBorder />
                      </ListItemIcon>
                      <ListItemText primary='Sub menu 2' />
                    </ListItemButton>
                  </ListItem>
                  <ListItem>
                    <ListItemButton sx={{ pl: 4 }}>
                      <ListItemIcon>
                        <StarBorder />
                      </ListItemIcon>
                      <ListItemText primary='Sub menu 3' />
                    </ListItemButton>
                  </ListItem>
                </List>
              </Collapse>
            </List>
          </Box>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          <Outlet />
        </Box>
      </Box>
    </>
  );
};

export default Mainwindow;
