import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { useUiContext } from "@/context/ui/useUiContext";

export default function Navbar() {
  const {openSideMenu} = useUiContext()

  const handleClickIcon = () => {
    openSideMenu();
  }

  return (
    <AppBar position="sticky" elevation={0}>
      <Toolbar>
        <IconButton size="large" edge="start" onClick={handleClickIcon} >
          <MenuOutlinedIcon />
        </IconButton>
        <Typography variant="h6"> AI Exploration</Typography>
      </Toolbar>
    </AppBar>
  );
}