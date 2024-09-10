
import React, { useState } from 'react';
import { cookies } from 'next/headers';
import HomePageComponent from '@/components/HomePageComponent';

export default function HomePage() {
  const defaultLayout = getDefaultLayout();

  return (
    <main className="h-48 p-1">
      <p>
        This component uses both <code>cookies</code> and{" "}
        <code>localStorage</code> to persist the last layout value. Resize the
        panel below and then reload the page to see.
      </p>
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
