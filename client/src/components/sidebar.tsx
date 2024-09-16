import { useUser } from "@/context/useUser";

export function SideBar() {
  const { shopper, user, users, getInitials } = useUser();

  const existingShopper = users?.find((u) => u.userId === shopper?.userId);
  const isShopperLoggedIn = user?.userId === shopper?.userId;

  return (
    <div className="flex items-center justify-center flex-col">
      <h1 className="font-semibold">Current Shopper</h1>
      {existingShopper && ( // If existing shopper, let others know someone is already with user info in sidebar
        <>
          <div className="relative flex justify-center items-center w-10 h-10 overflow-hidden bg-green-300 rounded-full dark:bg-gray-600">
            <span className="font-medium text-gray-600 dark:text-gray-300">{getInitials(existingShopper.name)}</span>
          </div>
          <div>
            <div className="font-medium">{existingShopper.name}</div>
          </div>
        </>
      )}
      {existingShopper &&
        isShopperLoggedIn && ( // If current logged in user matches current shopper, they have an unassign button
          <button className="h-10 px-2 py-2 mt-4 rounded-md text-sm font-medium whitespace-nowrap bg-red-500 hover:bg-red-700 text-slate-50 dark:bg-slate-50 dark:text-slate-900" type="submit">
            Unassign Me
          </button>
        )}
    </div>
  );
}
