"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Combobox, ComboboxTrigger, ComboboxValue, ComboboxContent, ComboboxItem, ComboboxList } from "@/components/ui/combobox";
import { Plus, Home, Building } from "lucide-react";
import { RoomInterface } from "@/interface/RoomInterface";
import RoomTypeInterface from "@/interface/RoomTypeInterface";

// interface RoomFormData {
//   roomType: string;
//   buildingName: string;
//   roomsPerFloor: string;
//   floorCount: string;
// }

const Rooms = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [rooms, setRooms] = useState<RoomInterface[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomTypeInterface[]>([])
  const [roomTypeId, setRoomtypeId] = useState("");
  const [filterRoomTypeId, setFilterRoomtypeId] = useState("");
  const [id, setIsOpen] = useState(false);
  const [totalRoom, setTotalRoom] = useState(0);
  const [totalLevel, setTotalLevel] = useState(0);
  const [towerName, setTowerName] = useState("");
  const [remark, setRemark] = useState("");

  useEffect(() => {
    hdlFetchRoomTypes();
  }, []);

  useEffect(() => {
    // TODO: ตั้งค่าค่าเริ่มต้นสำหรับ Combobox
    if (roomTypes.length > 0) {
      // ตั้งค่าค่าเริ่มต้นเป็นค่าแรกสุดของ roomTypes
      setRoomtypeId(roomTypes[0].id);
      setFilterRoomtypeId(roomTypes[0].id);
    }
  }, [roomTypes])

  const hdlFetchRoomTypes = async () => {
    try {
      const res = await axios.get("/api/room-type");
      const roomTypesData = (res.data) as RoomTypeInterface[];
      setRoomTypes(roomTypesData);
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
      setRemark(value)
    } else {
      console.log("ไม่ตรงกับข้อมูลที่ต้องการ")
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation
    // if (!formData.roomType || !formData.buildingName || !formData.roomsPerFloor || !formData.floorCount) {
    //   Swal.fire({
    //     icon: "warning",
    //     title: "กรุณากรอกข้อมูลให้ครบ",
    //     text: "โปรดกรอกข้อมูลทุกช่องในฟอร์ม",
    //   });
    //   return;
    // }

    setIsSubmitting(true);

    try {
      // Here you would send the data to your API
      const res = await axios.post("/api/room", {
        roomType: formData.roomType,
        buildingName: formData.buildingName,
        roomsPerFloor: parseInt(formData.roomsPerFloor),
        floorCount: parseInt(formData.floorCount)
      });

      Swal.fire({
        icon: "success",
        title: "เพิ่มห้องพักสำเร็จ",
        text: "ข้อมูลห้องพักได้ถูกบันทึกเรียบร้อยแล้ว",
      });

      // Reset form
      // setFormData({
      //   roomType: "",
      //   buildingName: "",
      //   roomsPerFloor: "",
      //   floorCount: ""
      // });
      setIsDialogOpen(false);

      // Refresh data
      hdlFetchRoomTypes();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถเพิ่มห้องพักได้ กรุณาลองใหม่อีกครั้ง",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  //   { value: "standard", label: "ห้องพักมาตรฐาน" },
  //   { value: "deluxe", label: "ห้องพักดีลักซ์" },
  //   { value: "suite", label: "ห้องสวีท" },
  //   { value: "family", label: "ห้องพักครอบครัว" },
  //   { value: "single", label: "ห้องพักเดี่ยว" },
  //   { value: "double", label: "ห้องพักคู่" }
  // ];

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
                <h1 className="text-2xl font-bold text-gray-900">จัดการห้องพัก</h1>
                <p className="text-gray-600">เพิ่มและจัดการข้อมูลห้องพักในระบบ</p>
              </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  เพิ่มห้องพัก
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-2">
                    <Building className="h-5 w-5 text-blue-600" />
                    <span>เพิ่มห้องพักใหม่</span>
                  </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="roomType">ประเภทห้องพัก *</Label>
                    <Combobox items={roomTypes} itemToStringValue={(item: RoomTypeInterface) => item.name }>
                      <ComboboxTrigger className="w-full h-10 px-3 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <ComboboxValue placeholder="เลือกประเภทห้องพัก" />
                      </ComboboxTrigger>
                      <ComboboxContent className="w-full z-50 bg-white border border-gray-200 rounded-md shadow-lg">
                        <ComboboxList className="max-h-60 overflow-auto">
                          {(roomTypes) => (
                            <ComboboxItem key={roomTypes.name} value={roomTypes}>
                              {roomTypes.name}
                            </ComboboxItem>
                          )}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="buildingName">ชื่อตึก *</Label>
                    <Input
                      id="buildingName"
                      type="text"
                      placeholder="เช่น ตึก A, ตึก 1, อาคารสิริมังคลานุสรณ์"
                      value={towerName}
                      onChange={(e) => handleInputChange("towerName", e.target.value)}
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
                        // value={formData.roomsPerFloor}
                        // onChange={(e) => handleInputChange("roomsPerFloor", e.target.value)}
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
                        // value={formData.floorCount}
                        // onChange={(e) => handleInputChange("floorCount", e.target.value)}
                        required
                      />
                    </div>
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

        {/* Content Area - You can add room listing here */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-center py-12">
            <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">ยังไม่มีข้อมูลห้องพัก</h3>
            <p className="text-gray-600 mb-4">คลิกปุ่ม "เพิ่มห้องพัก" เพื่อเริ่มเพิ่มข้อมูลห้องพักในระบบ</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rooms