"use client";

import { Input } from "./ui/input";

export function AddNewForm() {
  return (
    <form>
      <div className="flex w-full items-center space-x-2">
        <Input type="text" placeholder="Add New" required />
        <button className="h-10 px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap bg-blue-500 text-slate-50 dark:bg-slate-50 dark:text-slate-900" type="submit">
          Add New
        </button>
      </div>
    </form>
  );
}
