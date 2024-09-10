
import React, { useState } from 'react';
import { cookies } from 'next/headers';
import HomePageComponent from '@/components/HomePageComponent';

export default function HomePage() {
  const defaultLayout = getDefaultLayout();

  return (
    <main className="h-48 p-1">      
      <HomePageComponent defaultLayout={defaultLayout} />
    </main>
  );
}

function getDefaultLayout() {
  const layout = cookies().get("react-resizable-panels:layout");
  if (layout) {
   return JSON.parse(layout.value);
  }
  return [20, 60, 20];
}
