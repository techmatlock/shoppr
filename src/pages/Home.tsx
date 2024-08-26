import { ShoppingList } from "../components/ShoppingList";
import { SideBar } from "../components/SideBar";

type Props = {
  isMobile: boolean;
};

export function Home({ isMobile }: Props) {
  return (
    <main className="grid grid-cols-1 md:grid-cols-[3fr_1fr]">
      <section>
        <form className="flex items-center justify-between mt-2">
          <input type="text" className="w-full py-2 border-2 rounded-md shadow-sm" placeholder="Add New" />
          <button className="ml-2 px-8 py-2 whitespace-nowrap rounded-md bg-purple-500 hover:bg-purple-700 text-white">Add New</button>
        </form>
        <ShoppingList isMobile={isMobile} />
      </section>
      {!isMobile && (
        <section>
          <SideBar />
        </section>
      )}
    </main>
  );
}
