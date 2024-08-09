"use client";
import React from "react";
import RoutingForm from "./components/RoutingForm";
import VisMap from "./components/VisMap";

export default function Routing() {
  return (
    <div className="flex flex-row">
      <div className="basis-1/4">
        <RoutingForm />
      </div>
      <div className="basis-3/4">
        <VisMap />
      </div>
    </div>
  );
}
