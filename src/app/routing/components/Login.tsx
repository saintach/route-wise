import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import useSettingStore from "@/lib/useSettingStore";

export function Login() {
  const { setUser } = useSettingStore();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  function handleSubmit() {
    setPending(true);
    // wait for a few seconds
    setTimeout(() => {
      setPending(false);
      setUser({
        username,
        password,
        isLoggedIn: true,
        vehicleType: "gasoline",
      });
    }, 1000);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link">Login</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Login</DialogTitle>
          <DialogDescription>
            Use a username and password to login.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              name="username"
              id="username"
              className="col-span-3"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              Password
            </Label>
            <Input
              name="password"
              id="password"
              type="password"
              className="col-span-3"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button aria-disabled={pending} onClick={() => handleSubmit()}>
            {pending ? "Submitting..." : "Login"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
