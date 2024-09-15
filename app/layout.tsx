import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import 'material-icons/iconfont/material-icons.css';

import { SlateProvider } from '@/context/SlateContext'; 
import { TreeDataProvider } from '@/context/useTreeData';
import { MetaDataProvider } from "@/context/useMetaData";
import MuiXLicense from './muixlicense';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Strategic Machines",
  description: "Prototype App",
};

export default function RootLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
  return (
    <html lang="en">
      <body className={inter.className}>
       
          <MetaDataProvider >        
            <TreeDataProvider>
              <SlateProvider >
                {children}
              </SlateProvider>
            </TreeDataProvider>          
          </MetaDataProvider>
        
        <MuiXLicense />
      </body>
    </html>
  );
}
