import Button from "@/components/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Building2, Hash, Mail, MapPin, Phone, Save, User, X } from "lucide-react";

export default function ApartmentPage() {
  return (
    <div className="container">
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
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            </div>
          </div>
        </CardContent>

        {/* Footer Buttons */}
        <CardFooter className="flex justify-end gap-3 border-t pt-6">
           <Button type="button" variant="outline" iconLeft={<X className="h-4 w-4" />}>
            ยกเลิก
          </Button>
          <Button type="submit" variant="default" iconRight={<Save className="h-4 w-4" />}>
            บันทึกข้อมูล
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
