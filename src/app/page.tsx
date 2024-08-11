import AuthButton from "./components/AuthButton";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <div className="flex flex-col items-center justify-center w-full p-8 text-center bg-gray-100 rounded-lg">
          <h1 className="text-4xl font-bold">Welcome to Route Wise</h1>
          <p className="mt-4 text-lg">Please login to access your account.</p>
          <div className="mt-6">
            <AuthButton />
          </div>
        </div>
      </div>
    </main>
  );
}
