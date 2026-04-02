"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
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
  Zap,
  Droplets,
  LoaderCircle,
  Save,
  Bolt,
  Wallet,
} from "lucide-react";

export default function WaterAndElectricityPrice() {
  const [waterPricePerUnit, setWaterPricePerUnit] = useState(0);
  const [electricityPricePerUnit, setElectricityPricePerUnit] = useState(0);
  const [id, setId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("/api/water-and-electricity-price");
      setWaterPricePerUnit(response.data?.waterPricePerUnit ?? 0);
      setElectricityPricePerUnit(response.data?.electricityPricePerUnit ?? 0);
      setId(response.data?.id ?? "");
      setIsPageLoading(false);
    } catch (error) {
      Swal.fire({
        title: "error",
        icon: "error",
        text: (error as Error).message,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        waterPricePerUnit: waterPricePerUnit,
        electricityPricePerUnit: electricityPricePerUnit,
      };

      if (id) {
        await axios.put("/api/water-and-electricity-price/" + id, payload);
      } else {
        await axios.post("/api/water-and-electricity-price", payload);
      }

      fetchData();

      Swal.fire({
        title: "สำเร็จ",
        icon: "success",
        text: "บันทึกราคาไฟฟ้าและน้ำสำเร็จ",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        icon: "error",
        text: (error as Error).message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isPageLoading) {
    return (
      <div className="container-card">
        <div className="flex items-center justify-center h-screen">
          <LoaderCircle size={50} className="animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="container-card">
      <Card className="max-w-2xl mx-auto shadow-lg">
        {/* Header */}
        <CardHeader className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Bolt className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">ราคาไฟฟ้าและน้ำ</CardTitle>
              <CardDescription>
                กำหนดราคาค่าไฟฟ้าและค่าน้ำต่อหน่วยสำหรับหอพัก
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* แสดงราคาปัจจุบัน */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* ราคาไฟฟ้า */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Zap className="h-5 w-5 text-amber-600" />
                </div>
                <span className="font-medium text-amber-900">ราคาไฟฟ้า</span>
              </div>
              <p className="text-2xl font-bold text-amber-700">
                ฿{electricityPricePerUnit.toLocaleString("th-TH")}
                <span className="text-sm font-normal text-amber-600 ml-1">/หน่วย</span>
              </p>
            </div>

            {/* ราคาน้ำ */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Droplets className="h-5 w-5 text-blue-600" />
                </div>
                <span className="font-medium text-blue-900">ราคาน้ำ</span>
              </div>
              <p className="text-2xl font-bold text-blue-700">
                ฿{waterPricePerUnit.toLocaleString("th-TH")}
                <span className="text-sm font-normal text-blue-600 ml-1">/หน่วย</span>
              </p>
            </div>
          </div>

          {/* Form แก้ไขราคา */}
          <form id="priceForm" onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                กำหนดราคาใหม่
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* ราคาไฟฟ้า */}
                <div className="space-y-2">
                  <label htmlFor="electricityPrice" className="text-sm font-medium block mb-1">
                    ราคาไฟฟ้าต่อหน่วย (บาท)
                  </label>
                  <div className="relative">
                    {/* <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">฿</span> */}
                    <input
                      id="electricityPrice"
                      type="number"
                      step="0.01"
                      min="0"
                      value={electricityPricePerUnit}
                      onChange={(e) => setElectricityPricePerUnit(Number(e.target.value))}
                      className="input-modal pl-8 pr-3"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* ราคาน้ำ */}
                <div className="space-y-2">
                  <label htmlFor="waterPrice" className="text-sm font-medium block mb-1">
                    ราคาน้ำต่อหน่วย (บาท)
                  </label>
                  <div className="relative">
                    {/* <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">฿</span> */}
                    <input
                      id="waterPrice"
                      type="number"
                      step="0.01"
                      min="0"
                      value={waterPricePerUnit}
                      onChange={(e) => setWaterPricePerUnit(Number(e.target.value))}
                      className="input-modal pl-8 pr-3"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </CardContent>

        {/* Footer Buttons */}
        <CardFooter className="flex justify-end gap-3 border-t pt-6">
          <Button
            type="submit"
            form="priceForm"
            variant="default"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <LoaderCircle className="h-4 w-4 animate-spin" />
                กำลังบันทึก...
              </span>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                บันทึกราคา
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
