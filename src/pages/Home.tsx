import { SideBar } from "../components/SideBar";

export function Home() {
  return (
    <main>
      <div className="grid grid-cols-[3fr_1fr] mt-12">
        <div>
          <button className="p-2 rounded-md bg-purple-500">Add New</button>
        </div>
        <div>
          <SideBar />
        </div>
      </div>
    </main>
  );
}
