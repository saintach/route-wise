## Route Wise

A Sustainable Travel Route Planner

Route Wise aims to provide value to users by supporting:

1. Informed decision making
2. Reduction in personal and overall CO2 emissions
3. Education and behavior change


https://github.com/user-attachments/assets/4babe700-63d7-42ed-8ad6-3d64ef1b7873



## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## APIs used

Route-E API: https://developer.nrel.gov/docs/transportation/routee-v1/

Google Maps API: https://developers.google.com/maps

Elevation API: https://developers.google.com/maps/documentation/elevation/start

## CO2 Emission Calculation

1. Google Maps API returns one to many routes for point A to point B. Each route is then broken down into steps. Each step is a section of the route in straight line.
2. Google's Elevation API is used to calculate the slope/gradient percentage of each step. Positive numbers indicate incline, negative numbers indicate decline.
3. Then, the speed of each step is calculated based on real-time duration and distance of each step.
4. Next, we make a POST request to the Route-E API the route/network data with additional JSON parameters that define RouteE model application.

```
   "steps_ids": stepIds,
   "lengths_miles": miles,
   "speeds_mph": speeds,
   "grades_percent": grades,
   "model": "diesel"
```

5. Route-E's API response with GGE(gasoline gallon equivalent) value which we convert that to CO2 emission in KG. 1GGE = 8.9kg
