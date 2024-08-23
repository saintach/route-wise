"use client";
import React from "react";
import RoutingForm from "./components/RoutingForm";
import VisMap from "./components/VisMap";

export default function Routing() {
  return (
    <div className="flex flex-row">
      <div className="basis-2/5">
        <RoutingForm />
      </div>
      <div className="basis-3/5">
        <VisMap />
      </div>
    </div>
  );
}
