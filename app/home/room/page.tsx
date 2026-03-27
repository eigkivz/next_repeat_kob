"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Combobox,
  ComboboxTrigger,
  ComboboxValue,
  ComboboxContent,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import {
  Plus,
  Home,
  Building,
  Trash2,
  CalendarCheck,
  Banknote,
  Users,
  Eye,
  Droplets,
  Zap,
  Pencil,
} from "lucide-react";
import { RoomInterface } from "@/interface/RoomInterface";
import RoomTypeInterface from "@/interface/RoomTypeInterface";
import { BookingInterface } from "@/interface/BookingInterface";

const Rooms = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasStayUntil, setHasStayUntil] = useState(false);
  const [isOpenViewDialog, setIsOpenViewDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedRoomForView, setSelectedRoomForView] =
    useState<RoomInterface | null>(null);

  // booking state
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [isOpenBookingDialog, setIsOpenBookingDialog] = useState(false);
  const [bookingData, setBookingData] = useState<BookingInterface>({
    customerName: "",
    customerPhone: "",
    customerAddress: "",
    customerCardId: "",
    customerGender: "",
    deposit: 0,
    remark: "",
    roomId: "",
    stayAt: new Date(),
    stayUntil: undefined,
    waterLog: [],
    electricLogs: []
  });

  // create room state
  const [rooms, setRooms] = useState<RoomInterface[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomTypeInterface[]>([]);
  const [roomTypeId, setRoomtypeId] = useState("");
  const [filterRoomTypeId, setFilterRoomtypeId] = useState("");
  const [totalRoom, setTotalRoom] = useState(0);
  const [totalLevel, setTotalLevel] = useState(0);
  const [towerName, setTowerName] = useState("");
  const [remark, setRemark] = useState("");

  // create water and electric log
  const [waterUnit, setwaterUnit] = useState(0);
  const [electricityUnit, setElectricityUnit] = useState(0);

  // edit water and electric unit state
  const [editWaterUnit, setEditWaterUnit] = useState(0);
  const [editElectricityUnit, setEditElectricityUnit] = useState(0);

  useEffect(() => {
    hdlFetchRoomTypes();
    hdlFetchRooms();
  }, []);

  useEffect(() => {
    // TODO: ตั้งค่าค่าเริ่มต้นสำหรับ Combobox
    if (roomTypes.length > 0) {
      // ตั้งค่าค่าเริ่มต้นเป็นค่าแรกสุดของ roomTypes
      setRoomtypeId(roomTypes[0].id);
      // setFilterRoomtypeId(roomTypes[0].id);
    }
  }, [roomTypes]);

  useEffect(() => {
    hdlFetchFilterRoom()
  }, [filterRoomTypeId])


  const hdlFetchFilterRoom = async () => {
    try {
      const res = await axios.get(`/api/room/${filterRoomTypeId}`);
      const roomFilterData = (res.data) as RoomInterface[];
      setRooms(roomFilterData);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: (error as Error).message
      });
    }
  }

  const hdlFetchRoomTypes = async () => {
    try {
      const res = await axios.get("/api/room-type");
      const roomTypesData = res.data as RoomTypeInterface[];
      setRoomTypes(roomTypesData);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: (error as Error).message,
      });
    }
  };

  const hdlFetchRooms = async () => {
    try {
      const res = await axios.get("/api/room");
      const rooms = res.data as RoomInterface[];
      setRooms(rooms);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: (error as Error).message,
      });
    }
  };

  const handleInputChange = (field: keyof RoomInterface, value: string) => {
    if (field === "roomTypeId") {
      setRoomtypeId(value);
    } else if (field === "towerName") {
      setTowerName(value);
    } else if (field === "totalRoom") {
      setTotalRoom(parseInt(value));
    } else if (field === "totalLevel") {
      setTotalLevel(parseInt(value));
    } else if (field === "remark") {
      setRemark(value);
    } else {
      console.log("ไม่ตรงกับข้อมูลที่ต้องการ");
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    const result = await Swal.fire({
      title: "ยืนยันการลบ?",
      text: "คุณต้องการลบห้องพักนี้ใช่หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/api/room/${roomId}`);
        Swal.fire({
          icon: "success",
          title: "สำเร็จ",
          text: "ลบห้องพักสำเร็จ",
        });
        hdlFetchRooms();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: (error as Error).message,
        });
      }
    }
  };

  const handleBookRoom = (room: RoomInterface) => {
    setSelectedRoomId(room.id);
    setHasStayUntil(false);
    setBookingData((prev) => ({
      ...prev,
      roomId: room.id,
      stayAt: new Date(),
      stayUntil: undefined,
    }));
    setIsOpenBookingDialog(true);
  };

  const handleViewGuest = (room: RoomInterface) => {
    setSelectedRoomForView(room);
    setIsOpenViewDialog(true);
    setIsEditMode(false); // Reset edit mode when opening dialog
    // TODO: fetch booking data from API
    if (!room) {
      return Swal.fire({
        icon: "warning",
        text: "ไม่พบผู้เข้าพักในระบบ",
        title: "ไม่พบผุ้เข้าพักในระบบ ที่เลือก",
      });
    }

    const guest = room.bookings[0];
  
    setBookingData({
      customerName: guest.customerName,
      customerPhone: guest.customerPhone,
      customerAddress: guest.customerAddress,
      customerCardId: guest.customerCardId,
      customerGender: guest.customerGender,
      deposit: guest.deposit,
      stayAt: guest.stayAt,
      stayUntil: guest.stayUntil,
      remark: guest.remark,
      roomId: guest.roomId,
      waterLog: guest.waterLog,
      electricityLogs: guest.electricityLogs
    });

    // Initialize edit water and electricity units from the latest log or default to 0
    const latestWaterLog = guest.waterLog?.[guest.waterLog.length - 1];
    const latestElectricLog = guest.electricityLogs?.[guest.electricityLogs.length - 1];
    setEditWaterUnit(latestWaterLog?.waterUnit || 0);
    setEditElectricityUnit(latestElectricLog?.electricityUnit || 0);
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const handleUpdateBooking = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post("/api/booking", { 
        ...bookingData, 
        waterUnit: editWaterUnit, 
        electricityUnit: editElectricityUnit 
      });
      Swal.fire({
        icon: "success",
        title: "สำเร็จ",
        text: "แก้ไขข้อมูลสำเร็จ",
      });
      setIsEditMode(false);
      hdlFetchRooms();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: (error as Error).message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitBooking = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post("/api/booking", { ...bookingData, 
        waterUnit: waterUnit, electricityUnit: electricityUnit});
      Swal.fire({
        icon: "success",
        title: "สำเร็จ",
        text: "จองห้องพักสำเร็จ",
      });

      setIsOpenBookingDialog(false);
      hdlFetchRooms();
      clearBookingForm();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: (error as Error).message,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const payload = {
        roomTypeId: roomTypeId,
        towerName: towerName,
        totalRoom: totalRoom,
        totalLevel: totalLevel,
        remark: remark,
      };

      await axios.post("/api/room", payload);

      Swal.fire({
        icon: "success",
        title: "สำเร็จ",
        text: "เพิ่มข้อมูลห้องพักสำเร็จ",
      });

      clearForm();
      hdlFetchRooms();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: (error as Error).message,
      });
    }
  };

  const hdlActivateRoom = async (roomId: string) => {
    try {
      const activateConfirm = await Swal.fire({
        title: "ยืนยันการเปิดใช้งาน",
        text: "คุณต้องการเปิดใช้งานห้องพักใช้หรือไม่ ?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "เปิดใช้งาน",
        cancelButtonText: "ยกเลิก",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
      });

      if (activateConfirm.isConfirmed) {
        const res = await axios.put("/api/room", { roomId });
        const mss = res.data as { message: string };
        hdlFetchRooms();

        Swal.fire({
          icon: "success",
          title: "สำเร็จ",
          text: mss.message,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: (error as Error).message,
      });
    }
  };

  const clearForm = () => {
    setRoomtypeId("");
    setTowerName("");
    setTotalRoom(0);
    setTotalLevel(0);
    setRemark("");
  };

  const clearBookingForm = () => {
    setBookingData({
      customerAddress: "",
      customerCardId: "",
      customerGender: "",
      customerName: "",
      customerPhone: "",
      deposit: 0,
      roomId: "",
      stayAt: new Date(),
      stayUntil: undefined,
      waterLog: [],
      electricLogs: []
    });
    setHasStayUntil(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Home className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  จัดการห้องพัก
                </h1>
                <p className="text-gray-600">
                  เพิ่มและจัดการข้อมูลห้องพักในระบบ
                </p>
              </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={clearForm}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  เพิ่มห้องพัก
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-125">
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-2">
                    <Building className="h-5 w-5 text-blue-600" />
                    <span>เพิ่มห้องพักใหม่</span>
                  </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Room Type Cards */}
                  <div className="space-y-2">
                    <Label>ประเภทห้องพัก *</Label>
                    <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto">
                      {roomTypes.map((item) => {
                        const isSelected = roomTypeId === item.id;
                        return (
                          <div
                            key={item.id}
                            onClick={() => handleInputChange("roomTypeId", item.id)}
                            className={`border-2 rounded-lg p-3 cursor-pointer transition-all ${
                              isSelected
                                ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
                                : "border-gray-200 hover:border-blue-300 hover:shadow-sm"
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <Building className={`h-5 w-5 ${isSelected ? "text-blue-600" : "text-gray-400"}`} />
                              {isSelected && (
                                <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <div className="mt-2">
                              <p className="font-medium text-sm text-gray-900">{item.name}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {item.price?.toLocaleString() || "0"} บาท/เดือน
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {roomTypes.length === 0 && (
                      <p className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-lg">
                        ยังไม่มีประเภทห้องพัก
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="buildingName">ชื่อตึก *</Label>
                    <Input
                      id="buildingName"
                      type="text"
                      placeholder="เช่น ตึก A, ตึก 1, อาคารสิริมังคลานุสรณ์"
                      value={towerName}
                      onChange={(e) =>
                        handleInputChange("towerName", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="roomsPerFloor">จำนวนห้องต่อชั้น *</Label>
                      <Input
                        id="roomsPerFloor"
                        type="number"
                        min="1"
                        placeholder="เช่น 10"
                        value={totalRoom}
                        onChange={(e) =>
                          handleInputChange("totalRoom", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="floorCount">จำนวนชั้น *</Label>
                      <Input
                        id="floorCount"
                        type="number"
                        min="1"
                        placeholder="เช่น 5"
                        value={totalLevel}
                        onChange={(e) =>
                          handleInputChange("totalLevel", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="floorCount">รายละเอียดเพิ่มเติม</Label>
                    <textarea
                      style={{ resize: "none" }}
                      className="input-modal"
                      rows={20}
                      value={remark}
                      onChange={(e) =>
                        handleInputChange("remark", e.target.value)
                      }
                      placeholder="รายละเอียดเพิ่มเติม...."
                    ></textarea>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      disabled={isSubmitting}
                    >
                      ยกเลิก
                    </Button>
                    <Button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "กำลังบันทึก..." : "เพิ่มห้องพัก"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Filter room by room type - Tab Pills */}
        <div className="mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-700">ประเภทห้องพัก:</span>
            <button
              onClick={() => {
                setFilterRoomtypeId("");
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filterRoomTypeId === ""
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              ทั้งหมด
            </button>
            {roomTypes.map((roomType) => (
              <button
                key={roomType.id}
                onClick={() => {
                  setFilterRoomtypeId(roomType.id);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filterRoomTypeId === roomType.id
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {roomType.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area - Room Cards */}
        {rooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Card Header */}
                <div
                  className={
                    room.status === "active"
                      ? "bg-linear-to-r from-blue-500 to-blue-600 p-4"
                      : "bg-linear-to-r from-red-500 to-red-600 p-4"
                  }
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">
                      {room.name}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        room.status === "active"
                          ? room.statusEmpty === "empty"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                          : "bg-gray-400 text-gray-700"
                      }}`}
                    >
                      {room.status === "active"
                        ? room.statusEmpty === "empty"
                          ? "ว่าง"
                          : "ไม่ว่าง"
                        : "ปิดใช้งาน"}
                    </span>
                  </div>
                  <p className="text-blue-100 text-sm mt-1">{room.towerName}</p>
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-3">
                  {/* Price */}
                  <div className="flex items-center gap-2 text-gray-700">
                    <Banknote className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">ราคา:</span>
                    <span className="font-semibold text-blue-600">
                      {room.roomType?.price?.toLocaleString() || "0"} บาท/เดือน
                    </span>
                  </div>

                  {/* Room Type */}
                  <div className="flex items-center gap-2 text-gray-700">
                    <Building className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">ประเภท:</span>
                    <span className="font-medium">
                      {room.roomType?.name || "-"}
                    </span>
                  </div>

                  {/* Capacity Info */}
                  <div className="flex items-center gap-2 text-gray-700">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">จำนวนชั้น/ห้อง:</span>
                    <span className="font-medium">
                      {room.totalLevel} ชั้น / {room.totalRoom} ห้อง
                    </span>
                  </div>

                  {/* Rental Fee Display */}
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        ค่าเช่ารายเดือน
                      </span>
                      <span className="text-lg font-bold text-green-600">
                        {room.roomType?.price?.toLocaleString() || "0"} ฿
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Footer - Buttons */}
                <div className="p-4 pt-0 flex gap-2 flex-wrap">
                  {room.status === "active" &&
                    room.statusEmpty === "notempty" && (
                      <Button
                        onClick={() => handleViewGuest(room)}
                        variant="outline"
                        className="flex-1 border-blue-300 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        ดูข้อมูลผู้เข้าพัก
                      </Button>
                    )}
                  <Button
                    onClick={() => handleBookRoom(room)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={
                      room.status === "active"
                        ? room.statusEmpty !== "empty"
                        : true
                    }
                  >
                    <CalendarCheck className="h-4 w-4 mr-2" />
                    จองห้องพัก
                  </Button>
                  {room.status === "active" ? (
                    <Button
                      onClick={() => handleDeleteRoom(room.id)}
                      variant="outline"
                      className="px-3 border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={() => hdlActivateRoom(room.id)}
                      variant="outline"
                      className="px-3 border-green-300 text-white bg-green-600 hover:bg-green-700 hover:text-white cursor-pointer"
                    >
                      ใช้งาน
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center py-12">
              <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                ยังไม่มีข้อมูลห้องพัก
              </h3>
              <p className="text-gray-600 mb-4">
                คลิกปุ่ม "เพิ่มห้องพัก" เพื่อเริ่มเพิ่มข้อมูลห้องพักในระบบ
              </p>
            </div>
          </div>
        )}

        {/* View Guest Dialog */}
        <Dialog open={isOpenViewDialog} onOpenChange={setIsOpenViewDialog}>
          <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="flex items-center space-x-2">
                  <Eye className="h-5 w-5 text-blue-600" />
                  <span>ข้อมูลผู้เข้าพัก - {selectedRoomForView?.name}</span>
                </DialogTitle>
                {!isEditMode && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-blue-300 text-blue-600 hover:bg-blue-50"
                    onClick={toggleEditMode}
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    แก้ไข
                  </Button>
                )}
              </div>
            </DialogHeader>

            <form onSubmit={handleUpdateBooking}>
              <div className="space-y-6">
                {/* ส่วนข้อมูลผู้เข้าพัก */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                    <Users className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      ข้อมูลผู้เข้าพัก
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-xs text-gray-500">ชื่อ-นามสกุล</span>
                      {isEditMode ? (
                        <Input
                          type="text"
                          value={bookingData.customerName}
                          onChange={(e) => setBookingData({ ...bookingData, customerName: e.target.value })}
                          required
                        />
                      ) : (
                        <p className="font-medium text-gray-900">
                          {bookingData.customerName || "-"}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-gray-500">เบอร์โทรศัพท์</span>
                      {isEditMode ? (
                        <Input
                          type="tel"
                          value={bookingData.customerPhone}
                          onChange={(e) => setBookingData({ ...bookingData, customerPhone: e.target.value })}
                          required
                        />
                      ) : (
                        <p className="font-medium text-gray-900">
                          {bookingData.customerPhone || "-"}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-gray-500">เลขบัตรประชาชน</span>
                      {isEditMode ? (
                        <Input
                          type="text"
                          value={bookingData.customerCardId}
                          onChange={(e) => setBookingData({ ...bookingData, customerCardId: e.target.value })}
                          required
                        />
                      ) : (
                        <p className="font-medium text-gray-900">
                          {bookingData.customerCardId || "-"}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-gray-500">เพศ</span>
                      {isEditMode ? (
                        <select
                          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                          value={bookingData.customerGender}
                          onChange={(e) => setBookingData({ ...bookingData, customerGender: e.target.value })}
                          required
                        >
                          <option value="">เลือกเพศ</option>
                          <option value="male">ชาย</option>
                          <option value="female">หญิง</option>
                          <option value="other">อื่นๆ</option>
                        </select>
                      ) : (
                        <p className="font-medium text-gray-900">
                          {bookingData.customerGender === "male"
                            ? "ชาย"
                            : bookingData.customerGender === "female"
                            ? "หญิง"
                            : bookingData.customerGender === "other"
                            ? "อื่นๆ"
                            : "-"}
                        </p>
                      )}
                    </div>
                    <div className="md:col-span-2 space-y-1">
                      <span className="text-xs text-gray-500">ที่อยู่</span>
                      {isEditMode ? (
                        <textarea
                          className="flex min-h-15 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                          value={bookingData.customerAddress}
                          onChange={(e) => setBookingData({ ...bookingData, customerAddress: e.target.value })}
                          rows={3}
                          required
                        />
                      ) : (
                        <p className="font-medium text-gray-900">
                          {bookingData.customerAddress || "-"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* ส่วนข้อมูลการจอง */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                    <CalendarCheck className="h-5 w-5 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      ข้อมูลการจอง
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-xs text-gray-500">วันที่เข้าพัก</span>
                      {isEditMode ? (
                        <Input
                          type="date"
                          value={bookingData.stayAt instanceof Date ? bookingData.stayAt.toISOString().split("T")[0] : ""}
                          onChange={(e) => setBookingData({ ...bookingData, stayAt: new Date(e.target.value) })}
                          required
                        />
                      ) : (
                        <p className="font-medium text-gray-900">
                          {bookingData.stayAt
                            ? new Date(bookingData.stayAt).toLocaleDateString("th-TH")
                            : "-"}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-gray-500">วันที่ออก</span>
                      {isEditMode ? (
                        <Input
                          type="date"
                          value={bookingData.stayUntil instanceof Date ? bookingData.stayUntil.toISOString().split("T")[0] : ""}
                          onChange={(e) => setBookingData({ ...bookingData, stayUntil: e.target.value ? new Date(e.target.value) : undefined })}
                        />
                      ) : (
                        <p className="font-medium text-gray-900">
                          {bookingData.stayUntil
                            ? new Date(bookingData.stayUntil).toLocaleDateString("th-TH")
                            : "ไม่ระบุ"}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-gray-500">เงินมัดจำ</span>
                      {isEditMode ? (
                        <Input
                          type="number"
                          min="0"
                          value={bookingData.deposit}
                          onChange={(e) => setBookingData({ ...bookingData, deposit: parseInt(e.target.value) || 0 })}
                          required
                        />
                      ) : (
                        <p className="font-medium text-green-600">
                          {bookingData.deposit?.toLocaleString() || "0"} บาท
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1 mt-4">
                    <span className="text-xs text-gray-500">หมายเหตุ</span>
                    {isEditMode ? (
                      <textarea
                        className="flex min-h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                        value={bookingData.remark}
                        onChange={(e) => setBookingData({ ...bookingData, remark: e.target.value })}
                        rows={3}
                      />
                    ) : (
                      <p className="font-medium text-gray-900 bg-gray-50 p-3 rounded-md">
                        {bookingData.remark || "-"}
                      </p>
                    )}
                  </div>
                </div>

                {/* ส่วนข้อมูลมิเตอร์ */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                    <div className="flex items-center gap-1">
                      <Droplets className="h-5 w-5 text-cyan-600" />
                      <Zap className="h-5 w-5 text-yellow-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      ข้อมูลมิเตอร์
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-100">
                      <div className="flex items-center gap-2 mb-2">
                        <Droplets className="h-4 w-4 text-cyan-600" />
                        <span className="text-sm text-gray-600">หน่วยน้ำ</span>
                      </div>
                      {isEditMode ? (
                        <Input
                          type="number"
                          min="0"
                          value={editWaterUnit}
                          onChange={(e) => setEditWaterUnit(parseInt(e.target.value) || 0)}
                          className="bg-white"
                        />
                      ) : (
                        <p className="text-2xl font-bold text-cyan-700">
                          {editWaterUnit.toLocaleString()}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">หน่วย</p>
                    </div>

                    <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm text-gray-600">หน่วยไฟ</span>
                      </div>
                      {isEditMode ? (
                        <Input
                          type="number"
                          min="0"
                          value={editElectricityUnit}
                          onChange={(e) => setEditElectricityUnit(parseInt(e.target.value) || 0)}
                          className="bg-white"
                        />
                      ) : (
                        <p className="text-2xl font-bold text-yellow-700">
                          {editElectricityUnit.toLocaleString()}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">หน่วย</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t mt-6">
                {isEditMode ? (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditMode(false)}
                    >
                      ยกเลิก
                    </Button>
                    <Button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "กำลังบันทึก..." : "บันทึก"}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      className="border-blue-300 text-blue-600 hover:bg-blue-50"
                      onClick={toggleEditMode}
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      แก้ไขข้อมูล
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsOpenViewDialog(false)}
                    >
                      ปิด
                    </Button>
                  </>
                )}
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Booking Modal */}
        <Dialog
          open={isOpenBookingDialog}
          onOpenChange={setIsOpenBookingDialog}
        >
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <CalendarCheck className="h-5 w-5 text-blue-600" />
                <span>จองห้องพัก</span>
              </DialogTitle>
            </DialogHeader>

            <form className="space-y-6" onSubmit={submitBooking}>
              {/* ข้อมูลผู้เข้าพัก */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  ข้อมูลผู้เข้าพัก
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customerName">ชื่อผู้เข้าพัก *</Label>
                    <Input
                      id="customerName"
                      type="text"
                      placeholder="กรอกชื่อ-นามสกุล"
                      value={bookingData.customerName}
                      onChange={(e) =>
                        setBookingData({
                          ...bookingData,
                          customerName: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customerPhone">เบอร์โทรศัพท์ *</Label>
                    <Input
                      id="customerPhone"
                      type="tel"
                      placeholder="กรอกเบอร์โทรศัพท์"
                      value={bookingData.customerPhone}
                      onChange={(e) =>
                        setBookingData({
                          ...bookingData,
                          customerPhone: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customerCardId">เลขบัตรประชาชน *</Label>
                    <Input
                      id="customerCardId"
                      type="text"
                      placeholder="กรอกเลขบัตรประชาชน 13 หลัก"
                      value={bookingData.customerCardId}
                      onChange={(e) =>
                        setBookingData({
                          ...bookingData,
                          customerCardId: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customerGender">เพศ *</Label>
                    <select
                      id="customerGender"
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      value={bookingData.customerGender}
                      onChange={(e) =>
                        setBookingData({
                          ...bookingData,
                          customerGender: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="">เลือกเพศ</option>
                      <option value="male">ชาย</option>
                      <option value="female">หญิง</option>
                      <option value="other">อื่นๆ</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerAddress">ที่อยู่ *</Label>
                  <textarea
                    id="customerAddress"
                    className="flex min-h-15 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                    placeholder="กรอกที่อยู่ปัจจุบัน"
                    value={bookingData.customerAddress}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        customerAddress: e.target.value,
                      })
                    }
                    rows={3}
                    required
                  />
                </div>
              </div>

              {/* ข้อมูลการจอง */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  ข้อมูลการจอง
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stayAt">วันที่เข้าพัก *</Label>
                    <Input
                      id="stayAt"
                      type="date"
                      value={
                        bookingData.stayAt instanceof Date
                          ? bookingData.stayAt.toISOString().split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        setBookingData({
                          ...bookingData,
                          stayAt: new Date(e.target.value),
                        })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="hasStayUntil"
                        checked={hasStayUntil}
                        onChange={(e) => {
                          setHasStayUntil(e.target.checked);
                          if (!e.target.checked) {
                            setBookingData({
                              ...bookingData,
                              stayUntil: undefined,
                            });
                          }
                        }}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <Label
                        htmlFor="hasStayUntil"
                        className="cursor-pointer text-sm"
                      >
                        ระบุวันที่ออก (ถ้าทราบ)
                      </Label>
                    </div>
                    {hasStayUntil && (
                      <Input
                        id="stayUntil"
                        type="date"
                        value={
                          bookingData.stayUntil instanceof Date
                            ? bookingData.stayUntil.toISOString().split("T")[0]
                            : ""
                        }
                        onChange={(e) =>
                          setBookingData({
                            ...bookingData,
                            stayUntil: new Date(e.target.value),
                          })
                        }
                        required={hasStayUntil}
                      />
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deposit">จำนวนเงินมัดจำ (บาท) *</Label>
                    <Input
                      id="deposit"
                      type="number"
                      min="0"
                      placeholder="กรอกจำนวนเงินมัดจำ"
                      value={bookingData.deposit}
                      onChange={(e) =>
                        setBookingData({
                          ...bookingData,
                          deposit: parseInt(e.target.value) || 0,
                        })
                      }
                      required
                    />
                  </div>

                  {/* หน่วยน้ำและหน่วยไฟ */}
                  <div className="space-y-2">
                    <Label htmlFor="waterUnit">หน่วยน้ำ (หน่วย)</Label>
                    <Input
                      id="waterUnit"
                      type="number"
                      min="0"
                      placeholder="กรอกหน่วยน้ำเริ่มต้น"
                      value={waterUnit}
                      onChange={e => setwaterUnit(Number(e.target.value))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="electricityUnit">หน่วยไฟ (หน่วย)</Label>
                    <Input
                      id="electricityUnit"
                      type="number"
                      min="0"
                      placeholder="กรอกหน่วยไฟเริ่มต้น"
                      value={electricityUnit}
                      onChange={e => setElectricityUnit(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="remark">ข้อมูลเพิ่มเติม</Label>
                  <textarea
                    id="remark"
                    className="flex min-h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                    placeholder="กรอกข้อมูลเพิ่มเติม (ถ้ามี)"
                    value={bookingData.remark}
                    onChange={(e) =>
                      setBookingData({ ...bookingData, remark: e.target.value })
                    }
                    rows={3}
                  />
                </div>
              </div>

              {/* ปุ่ม Action */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpenBookingDialog(false)}
                  disabled={isSubmitting}
                >
                  ยกเลิก
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "กำลังบันทึก..." : "ยืนยันการจอง"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Rooms;
