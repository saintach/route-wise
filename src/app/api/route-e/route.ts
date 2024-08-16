export async function POST(request: Request) {
  let req_body = await request.json();
  try {
    const routeEResponse = await fetch(
      `${process.env.ROUTE_E_ENDPOINT}?api_key=${process.env.ROUTE_E_API_KEY}` as string,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req_body),
      }
    );
    const data = await routeEResponse.json();
    return Response.json({ data });
  } catch (error) {
    console.log("RouteE API request failed: ", error);
    return Response.error();
  }
}
