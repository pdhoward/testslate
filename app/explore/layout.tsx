import { Box } from "@mui/material";
import Head from "next/head";
import Navbar from "@/components/nav/Navbar";
import { Sidebar } from '@/components/nav/Sidebar';
import { UIProvider } from '@/context/ui/useUiContext';

export default function Layout( { title = "Open Jira" , children}: { title: string , children: React.ReactNode} ) {
  return (
    <UIProvider>
      <Box sx={{ flexFlow: 1 }}>
        <Head>
          <title>{title}</title>
        </Head>

        <Navbar/>
        <Sidebar/>

        <Box sx={{ padding :'10px  20px' }}>
            { children }
        </Box>
      </Box>

    </UIProvider>
    
  )
}