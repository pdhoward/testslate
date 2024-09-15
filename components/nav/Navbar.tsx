import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { useUiContext } from "@/context/ui/useUiContext";

export default function Navbar() {
  const {openSideMenu} = useUiContext()

  return (
    <AppBar position="sticky" elevation={0}>
      <Toolbar>
        <IconButton size="large" edge="start" onClick={openSideMenu}>
          <MenuOutlinedIcon />
        </IconButton>
        <Typography variant="h6"> Open Jira</Typography>
      </Toolbar>
    </AppBar>
  );
}