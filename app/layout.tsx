import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import 'material-icons/iconfont/material-icons.css';
import { SlateProvider } from '@/context/SlateContext'; 
import { TreeDataProvider } from '@/context/useTreeData';
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
        <TreeDataProvider>
          <SlateProvider >
            {children}
          </SlateProvider>
        </TreeDataProvider>
        <MuiXLicense />
      </body>
    </html>
  );
}
