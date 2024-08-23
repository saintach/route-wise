import { useState } from "react";
import useSettingStore from "@/lib/useSettingStore";
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
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function Profile() {
  const [pending, setPending] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [vehicleType, setVehicleType] = useState("gasoline");
  const { settings, setUserVehicleType } = useSettingStore();
  const { user } = settings;

  const handleSave = () => {
    setPending(true);
    setTimeout(() => {
      setPending(false);
      setUserVehicleType(vehicleType);
      setIsOpen(false);
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Avatar>
          <AvatarImage src="/avatar.png" alt="User profile image" />
        </Avatar>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Hello, {user.username}</DialogTitle>
          <DialogDescription>
            You can save the following settings to your profile.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="form-group">
            <Label htmlFor="origin">Vehicle Type</Label>
            <Select
              onValueChange={(val) => setVehicleType(val)}
              value={vehicleType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a vehicle type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gasoline">Gasoline</SelectItem>
                <SelectItem value="diesel">Diesel</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
                <SelectItem value="electric">EV</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button aria-disabled={pending} onClick={() => handleSave()}>
            {pending ? "Submitting..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
