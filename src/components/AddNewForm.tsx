export function AddNewForm() {
  return (
    <form className="flex items-center justify-between mt-2">
      <input type="text" className="w-full py-2 p-4 border-2 rounded-md shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500" placeholder="Add New" required />
      <button className="ml-2 px-8 py-2 whitespace-nowrap rounded-md bg-green-500 hover:bg-green-700 text-white">Add New</button>
    </form>
  );
}
