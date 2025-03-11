import React from "react";
import VerticalSidebar from "../components/VerticalSidebar";
import Header from "../components/Header";

function HomeScreen() {
  return (
    <>
      <VerticalSidebar />
      <Header />
      <div className="container-xxl flex-grow-1 container-p-y">
        <h1>Home</h1>
      </div>
    </>
  );
}

export default HomeScreen;
