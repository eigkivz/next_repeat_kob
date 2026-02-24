"use client";

import Button from "@/components/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import RoomTypeInterface from "@/interface/RoomTypeInterface";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

// const mockData = [
//   { id: 1, name: "room test1" },
//   { id: 2, name: "room test2" },
//   { id: 3, name: "room test3" },
// ];

const RoomType = () => {
  useEffect(() => {
    hdlFetchData();
  }, []);

  const [roomName, setRoomName] = useState<string>("");
  const [roomPrice, setRoomPrice] = useState<number>(0);
  const [roomRemark, setRoomRemark] = useState<string>("");
  const [roomType, setRoomType] = useState<RoomTypeInterface>();

  const hdlFetchData = async () => {
    try {
      const res = await axios.get("/api/room-type");
      const roomTypeData = res.data as RoomTypeInterface;
      setRoomType(roomTypeData);
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: (error as Error).message,
        title: "Error",
      });
    }
  };

  
  const hdlSubmit = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault()
    try {
      console.log('ok')
      const payload = {
        roomName,
        roomPrice,
        roomRemark
      };

      
      await axios.post("/api/room-type", payload);

      hdlFetchData();
      clearData();

      Swal.fire({
        icon: "success",
        text: "บันทึกประเภทห้องสำเร็จ",
        title: "สำเร็จ"
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: (error as Error).message,
        title: "Error",
      });
    }
  };

  const clearData = () => {
    setRoomType({
      name: "",
      price: 0,
      remark: "",
    });
  };

  return (
    <div className="container-card">
      <Card className="p-4">
        {/* หัวข้อประเภทห้อง */}
        <CardHeader>
          <div className="flex items-center gap-3">
            <span className="p-2 bg-primary/10 rounded-lg">
              <i className="fa-solid fa-couch text-2xl"></i>
            </span>
            <h1 className="text-2xl font-semibold">โปรดเลือกประเภทห้องพัก</h1>
          </div>
        </CardHeader>

        {/* <CardContent>
          <Combobox items={mockData.map((item) => item.name)}>
            <ComboboxInput placeholder="Select a framework" />
            <ComboboxContent>
              <ComboboxEmpty>No items found.</ComboboxEmpty>
              <ComboboxList>
                {(item) => (
                  <ComboboxItem key={item} value={item}>
                    {item}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </CardContent> */}

        {/* Dialog modal */}
        <Dialog>
          <form onSubmit={hdlSubmit}>
            <DialogTrigger asChild>
              <Button variant="default">เพิ่มประเภทห้องพัก</Button>
            </DialogTrigger>
            <DialogContent className="">
              <DialogHeader>
                <DialogTitle>เพิ่มประเภทห้อง</DialogTitle>
                <DialogDescription>
                  โปรดใส่ประเภทห้องพักที่ต้องการ
                </DialogDescription>
              </DialogHeader>

              <FieldGroup>
                <Field>
                  <Label htmlFor="name">ประเภทห้องพัก</Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="ใส่ประเภทห้องพัก..."
                    value={roomName}
                    onChange={(e) =>
                      setRoomName(e.target.value)
                    }
                  />
                </Field>
                <Field>
                  <Label htmlFor="price">ราคา</Label>
                  <Input
                    type="number"
                    id="price"
                    name="price"
                    placeholder="ใส่ราคาห้องพัก..."
                    value={roomPrice}
                    onChange={(e) =>
                      setRoomPrice(Number(e.target.value))
                    }
                  />
                </Field>
                <Field>
                  <Label htmlFor="remark">รายละเอียดเพิ่มเติม</Label>
                  <Textarea
                    id="remark"
                    name="remark"
                    placeholder="ใส่รายละเอียดเพิ่มเติม..."
                    value={roomRemark}
                    onChange={(e) =>
                      setRoomRemark(e.target.value)
                    }
                  />
                </Field>
              </FieldGroup>

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">ยกเลิก</Button>
                </DialogClose>
                <Button type="submit">บันทึก</Button>
              </DialogFooter>
            </DialogContent>
          </form>
        </Dialog>
      </Card>
    </div>
  );
};

export default RoomType;
