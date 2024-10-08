import {
    Box,
    Divider,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
  } from "@mui/material";
  import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";
  import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
  import {useUiContext} from "@/context/ui/useUiContext";
  
  const menuItems: string[] = ["Inbox", "Starred", "Send Email", "Drafts"];
  
  export const Sidebar = () => {
  
   const { sidemenuOpen, closeSideMenu} = useUiContext()
  
    return (
      <>
        <Drawer anchor={"left"} open={sidemenuOpen} onClose={closeSideMenu}  >
          <Box  sx={{ padding: "5px 10px", width: 250 }}>
            <Typography variant="h6">AI Exploration</Typography>
  
            <List>
              {menuItems.map((text, index) => (
                <ListItem key={text} disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      {index % 2 === 0 ? <InboxOutlinedIcon /> : <EmailOutlinedIcon />}
                    </ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
  
            <Divider/>
  
            <List>
              {menuItems.map((text, index) => (
                <ListItem key={text} disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      {index % 2 === 0 ? <InboxOutlinedIcon /> : <EmailOutlinedIcon />}
                    </ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>  
          </Box>
        </Drawer>
      </>
    );
  };