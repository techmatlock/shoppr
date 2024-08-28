import { AddNewForm } from "../components/AddNewForm";
import { ShoppingList } from "../components/ShoppingList";
import { SideBar } from "../components/SideBar";
import React from "react";

type Props = {
  isMobile: boolean;
};

export function Home({ isMobile }: Props) {
  return (
    <main className="grid grid-cols-1 md:grid-cols-[3fr_1fr] px-12">
      <section>
        <AddNewForm />
        <ShoppingList isMobile={isMobile} />
      </section>
      {!isMobile && (
        <section className="shadow-md rounded-md h-full ml-4">
          <SideBar />
        </section>
      )}
    </main>
  );
}
