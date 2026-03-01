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

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// const mockData = [
//   { id: 1, name: "room test1" },
//   { id: 2, name: "room test2" },
//   { id: 3, name: "room test3" },
// ];

const RoomType = () => {
  useEffect(() => {
    hdlFetchData();
  }, []);

  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [remark, setRemark] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [roomType, setRoomType] = useState<RoomTypeInterface[]>();

  const hdlFetchData = async () => {
    try {
      const res = await axios.get("/api/room-type");
      const roomTypeData = res.data as RoomTypeInterface[];
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
    e.preventDefault();
    try {
      const payload = {
        name,
        price,
        remark,
      };

      await axios.post("/api/room-type", payload);

      setIsOpen(false);
      hdlFetchData();
      clearData();

      Swal.fire({
        icon: "success",
        text: "บันทึกประเภทห้องสำเร็จ",
        title: "สำเร็จ",
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
    setName("");
    setPrice(0);
    setRemark("");
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
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <form id="roomType" onSubmit={hdlSubmit}>
            <DialogTrigger asChild>
              <Button variant="default" onClick={() => setIsOpen(true)}>
                เพิ่มประเภทห้องพัก
              </Button>
            </DialogTrigger>
            <DialogContent>
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
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Field>
                <Field>
                  <Label htmlFor="price">ราคา</Label>
                  <Input
                    type="number"
                    id="price"
                    name="price"
                    placeholder="ใส่ราคาห้องพัก..."
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                  />
                </Field>
                <Field>
                  <Label htmlFor="remark">รายละเอียดเพิ่มเติม</Label>
                  <Textarea
                    id="remark"
                    name="remark"
                    placeholder="ใส่รายละเอียดเพิ่มเติม..."
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                  />
                </Field>
              </FieldGroup>

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">ยกเลิก</Button>
                </DialogClose>
                <Button form="roomType" type="submit">
                  บันทึก
                </Button>
              </DialogFooter>
            </DialogContent>
          </form>
        </Dialog>

        {/* show room type */}
        <div>
          <Table>
            <TableCaption>ตารางจัดการประเภทห้องพัก</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ลำดับ</TableHead>
                <TableHead>ประเภท</TableHead>
                <TableHead>รายละเอียด</TableHead>
                <TableHead className="text-right">ราคา</TableHead>
                <TableHead className="text-center">จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roomType?.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{++index}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.remark}</TableCell>
                  <TableCell className="text-right">
                    {item.price.toLocaleString("th-TH")}
                  </TableCell>
                  <TableCell className="flex flex-row gap-1 justify-center items-center">
                    <Button variant="default" size="sm">แก้ไข</Button>
                    <Button variant="destructive" size="sm">ลบ</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default RoomType;
