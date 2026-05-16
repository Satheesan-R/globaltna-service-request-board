"use client";

import React, { Suspense } from "react";
import JobDetailsClient from "./JobDetailsClient";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading request details...</div>}>
      <JobDetailsClient />
    </Suspense>
  );
}