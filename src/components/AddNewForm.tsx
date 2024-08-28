"use client";

import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function AddNewForm() {
  return (
    <form>
      <div className="flex w-full items-center space-x-2">
        <Input type="text" placeholder="Add New" required />
        <Button type="submit">Add New</Button>
      </div>
    </form>
  );
}
