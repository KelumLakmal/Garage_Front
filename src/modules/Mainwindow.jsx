import React from "react";
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

const drawerWidth = 240;

const Mainwindow = () => {

  const { hasPermission } = useAuth();

  const MENU_ITEMS = [
    { label: "Home", path: "/main/home", permission: null },
    { label: "Student", path: "/main/student", permission: "STUDENT_VIEW" },
    { label: "Customer", path: "/main/customer", permission: "CUSTOMER_VIEW" },
    { label: "Vehicle", path: "/main/vehicle", permission: "VEHICLE_VIEW" },
  ];

  // const filterMenus = () => {
  //   return MENU_ITEMS.filter((m) => !m.permission || hasPermission(m.permission));
  // }

  

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        // sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, background: 'linear-gradient(120deg, #1d76a2ff, #b7dcefff)' }}
        >
          <Toolbar>
            <Typography variant="h6" noWrap component="div">
              Welcome Back...
            </Typography>
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
                    <ListItemIcon>{index % 2 == 0 ? <InboxIcon/> : <MailIcon/>}</ListItemIcon>
                    <ListItemText primary={menu.label}/>
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
