import { useState } from "react";
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const DRAWER_WIDTH = 260;

export default function AppShell() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [open, setOpen] = useState(false);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AppBar position='fixed' sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar>
          {isMobile && (
            <IconButton
              color='inherit'
              edge='start'
              onClick={() => setOpen(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant='h6' noWrap>
            Prepare JS ✅
          </Typography>
        </Toolbar>
      </AppBar>

      {isMobile ? (
        <Drawer
          open={open}
          onClose={() => setOpen(false)}
          sx={{ "& .MuiDrawer-paper": { width: DRAWER_WIDTH } }}
        >
          <Toolbar />
          <Sidebar onClose={() => setOpen(false)} />
        </Drawer>
      ) : (
        <Drawer
          variant='permanent'
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH,
              boxSizing: "border-box",
            },
          }}
        >
          <Toolbar />
          <Sidebar />
        </Drawer>
      )}

      <Box
        component='main'
        sx={{
          flexGrow: 1,
          px: { xs: 3, md: 5 },
          py: { xs: 3, md: 4 },
          mt: 10,
          maxWidth: 1140,
          mx: "auto",
          overflow: "auto",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
