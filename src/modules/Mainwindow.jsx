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
import { Avatar, Button, IconButton, Menu, MenuItem } from "@mui/material";
import { AccountCircle, AccountCircleOutlined, AccountCircleRounded, AccountCircleSharp, AccountCircleTwoTone, PersonPinCircle } from "@mui/icons-material";
import userLoginImg from "../assets/userLogin.jpg"

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
    { label: "Home", path: "/main/home", permission: null },
    { label: "Student", path: "/main/student", permission: "STUDENT_VIEW" },
    { label: "Customer", path: "/main/customer", permission: "CUSTOMER_VIEW" },
    { label: "Vehicle", path: "/main/vehicle", permission: "VEHICLE_VIEW" },
    { label: "Vehicle Repairs", path: "/main/vehicleRepairs", permission: null },
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
    </Menu>
  );


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
                  Welcome Back...
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
                <Avatar alt="user icon" sx={{ width: 30, height: 30 }} src={userLoginImg} />
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
                    <ListItemIcon>{index % 2 == 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                    <ListItemText primary={menu.label} />
                  </ListItemButton>
                </ListItem>
              ))}


              {/* <ListItem disablePadding>
                <ListItemButton component={Link} to="/main/home">
                    <ListItemIcon>
                        <InboxIcon/>
                    </ListItemIcon>
                    <ListItemText primary= "Home" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/main/student">
                    <ListItemIcon>
                        <InboxIcon/>
                    </ListItemIcon>
                    <ListItemText primary= "Student" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/main/customer">
                    <ListItemIcon>
                        <MailIcon/>
                    </ListItemIcon>
                    <ListItemText primary= "Customer" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/main/vehicle">
                    <ListItemIcon>
                        <InboxIcon/>
                    </ListItemIcon>
                    <ListItemText primary= "Vehicle" />
                </ListItemButton>
              </ListItem> */}
            </List>
            <Divider />
            <List>
              {["All mail", "Trash", "Spam"].map((text, index) => (
                <ListItem key={text} disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                    </ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItemButton>
                </ListItem>
              ))}
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
