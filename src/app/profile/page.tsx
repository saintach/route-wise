import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function Profile() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div>
        <h1>You need to be authenticated to view this page.</h1>
      </div>
    );
  }

  return (
    <div>
      <h1>Welcome, {session.user?.name}</h1>
      <p>This is a TEST protected page.</p>
    </div>
  );
}
