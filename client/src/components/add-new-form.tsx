export function AddNewForm() {
  return (
    <form>
      <div className="flex w-full items-center space-x-2">
        <input type="text" className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 " placeholder="Add New" required />
        <button className="h-10 px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap bg-blue-500 text-slate-50 dark:bg-slate-50 dark:text-slate-900" type="submit">
          Add New
        </button>
      </div>
    </form>
  );
}
