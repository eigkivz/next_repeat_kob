import Link from "next/link";

const Sidebar = () => {
  return (
    <div className="bg-slate-700 w-96 h-screen">
      <div className="p-6 text-center bg-slate-800">
        <h1 className="text-2xl font-bold text-white">JS Apartments</h1>
      </div>
      <div className="flex flex-col gap-5 text-xl text-white p-5 font-semibold">
        <Link href="/home/apartment" className="space-x-3">
          <i className="fa-solid fa-building-user"></i>
          <span>Apartment</span>
        </Link>
        <Link href="/home/room-type" className="space-x-3">
          <i className="fa-solid fa-couch"></i>
          <span>Room Type</span>
        </Link>
        <Link href="/home/room" className="space-x-3">
        <i className="fa-solid fa-hotel"></i>
        <span>Room</span>
        </Link>
        <Link href="/home/money-added" className="space-x-3">
          <i className="fa-solid fa-money-bill-wave"></i>
          <span>ค่าใช้จ่ายเพิ่มเติม</span>
        </Link>
        <Link href="/home/water-and-electricity-price" className="space-x-3">
          <i className="fa-solid fa-wand-magic-sparkles"></i>
          <span>ราคาไฟและน้ำ</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
