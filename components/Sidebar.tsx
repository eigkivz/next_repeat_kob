import Link from "next/link";
import React from "react";

const Sidebar = () => {
  return (
    <div className="bg-slate-700 w-96 h-screen">
      <div className="p-6 text-center bg-slate-800">
        <h1 className="text-2xl font-bold text-white">JS Apartments</h1>
      </div>
      <div className="text-xl text-white p-5 font-semibold">
        <Link href="/home/apartment" className="space-x-3">
          <i className="fa-solid fa-building-user"></i>
          <span>Apartment</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
