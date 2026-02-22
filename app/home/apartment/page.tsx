"use client";

import Button from "@/components/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Building2,
  Hash,
  Loader2,
  LoaderCircle,
  Mail,
  MapPin,
  Phone,
  Save,
  User,
} from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import ApartmentInterface from "@/interface/ApartmentInterface";

export default function ApartmentPage() {
  const [aptData, setAptData] = useState<ApartmentInterface>({
    name: "",
    address: "",
    phone: "",
    taxCode: "",
    email: "",
    lineId: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [ isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    callApartmentData();
  }, []);

  const callApartmentData = async () => {
    try {
      const resp = await axios.get("/api/apartment");
      const apartmentData = (resp.data) as ApartmentInterface;

      if (apartmentData?.message) {
        Swal.fire({
          icon: "info",
          text: apartmentData?.message,
          title: "ไม่พบข้อมูล",
          showCancelButton: true
        });

        return;
      }
      
      setAptData(apartmentData);
      setIsPageLoading(false);
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: (error as Error).message,
        title: "Error",
        showCancelButton: true,
      });
    }
  };

  const hdlSaveApartmentData = async (e: React.FormEvent<HTMLFormElement> ) => {
    e.preventDefault();
    try {

      const payload = {
        name: aptData.name,
        address: aptData.address,
        phone: aptData.phone,
        taxCode: aptData.taxCode,
        email: aptData.email,
        lineId: aptData.lineId,
      };

      setIsLoading(true);

        if (aptData?.id) {
        return await axios.put("/api/apartment/" + aptData.id, payload);
      }

      await axios.post("/api/apartment", payload);

      Swal.fire({
        icon: "success",
        text: "เพิ่มข้อมูล Apartment สำเร็จ",
        title: "เพิ่มข้อมูลสำเร็จ"
      });

    } catch (error) {
       Swal.fire({
        icon: "error",
        text: (error as Error).message,
        title: "Error",
        showCancelButton: true,
      });
    } finally {
      callApartmentData();
      clearData();
      setIsLoading(false);
      setIsPageLoading(false);
    }
  }

  const clearData = () => {
    setAptData({ 
      name: "",
      address: "",
      phone: "",
      taxCode: "",
      email: "",
      lineId: ""
    });
  }

  if (isPageLoading) {
    return (
      <div className="container">
        <div className="flex items-center justify-center h-100">
          <LoaderCircle size={50} className="w-full animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="container-card">
      <form onSubmit={hdlSaveApartmentData}>
        <Card className="max-w-2xl mx-auto shadow-lg">
        {/* Header */}
        <CardHeader className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">ข้อมูลหอพัก</CardTitle>
          </div>
          <CardDescription>
            กรอกข้อมูลหอพักของคุณให้ครบถ้วน ข้อมูลที่มี
            <span className="text-red-500 ml-1 font-bold text-lg">*</span>{" "}
            จำเป็นต้องกรอก
          </CardDescription>
        </CardHeader>

        {/* Form Content */}
        <CardContent className="space-y-6">
          {/* Section: ข้อมูลทั่วไป */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              ข้อมูลทั่วไป
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* ชื่อหอพัก */}
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="name" className="text-sm font-medium">
                  ชื่อหอพัก <span className="text-destructive ml-1">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  placeholder="กรอกชื่อหอพัก"
                  className="input-modal"
                  value={aptData?.name}
                  onChange={e => setAptData({...aptData, name: e.target.value})}
                />
              </div>

              {/* ที่อยู่ */}
              <div className="space-y-2 md:col-span-2">
                <label>
                  ที่อยู่
                  <span className="text-destructive ml-1">*</span>
                </label>
                <textarea
                  id="address"
                  required
                  rows={3}
                  placeholder="กรอกที่อยู่หอพัก"
                  className="input-textarea"
                  value={aptData?.address}
                  onChange={e => setAptData({ ...aptData, address: e.target.value })}
                ></textarea>
              </div>

              {/* เลขใบภาษี */}
              <div className="space-y-2">
                <label htmlFor="taxCode" className="text-sm font-medium">
                  <Hash className="h-4 w-4 inline mr-1"></Hash>
                  เลขใบภาษี
                </label>
                <input
                  id="taxCode"
                  type="text"
                  required
                  placeholder="เลขประจำตัวผู้เสียภาษี"
                  className="input-modal"
                  value={aptData?.taxCode}
                  onChange={e => setAptData({ ...aptData, taxCode: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Section: ข้อมูลติดต่อ */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Phone className="h-4 w-4 inline mr-1" />
              ข้อมูลติดต่อ
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* เบอร์โทรศัพท์ */}
              <div className="space-y-2">
                <label>
                  <Phone className="h-4 w-4 inline mr-1" />
                  เบอร์โทรศัพท์
                  <span className="text-destructive">*</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  required
                  placeholder="08x-xxx-xxxx"
                  className="input-modal"
                  value={aptData?.phone}
                  onChange={e => setAptData({ ...aptData, phone: e.target.value })}
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  <Mail className="h-4 w-4 inline mr-1" />
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  className="input-modal"
                  value={aptData?.email}
                  onChange={e => setAptData({ ...aptData, email: e.target.value })}
                />
              </div>

              {/* Line ID */}
              <div className="space-y-2">
                <label htmlFor="lineId" className="text-sm font-medium">
                  <User className="h-4 w-4 inline mr-1" />
                  Line ID
                </label>
                <input
                  id="lineId"
                  type="text"
                  placeholder="ไอดีไลน์"
                  className="input-modal"
                  value={aptData?.lineId}
                  onChange={e => setAptData({...aptData, lineId: e.target.value})}
                />
              </div>
            </div>
          </div>
        </CardContent>

        {/* Footer Buttons */}
        <CardFooter className="flex justify-end gap-3 border-t pt-6">
          {/* <Button
            type="button"
            variant="outline"
            iconLeft={<X className="h-4 w-4" />}
          >
            ยกเลิก
          </Button> */}
          <Button
            type="submit"
            variant="default"
            iconRight={isLoading ? undefined : <Save className="h-4 w-4" />}
            disabled={isLoading}
          >
            {
              isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  กำลังบันทึก...
                </span>
              ) : (
                "บันทึกข้อมูล"
              )
            }
          </Button>
        </CardFooter>
      </Card>
      </form>
    </div>
  );
}
