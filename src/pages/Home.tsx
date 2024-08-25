import { SideBar } from "../components/SideBar";

export function Home() {
  return (
    <main className="grid grid-cols-1 md:grid-cols-[3fr_1fr]">
      <section>
        <form className="flex items-center justify-between">
          <input type="text" className="w-full border-2 shadow-sm" placeholder="Add task" />
          <button className="p-2 rounded-md bg-purple-500">Add New</button>
        </form>
      </section>
      <section>
        <SideBar />
      </section>
    </main>
  );
}
