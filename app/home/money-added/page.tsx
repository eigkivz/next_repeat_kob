'use client';

import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Wifi, Sofa, Trash2, Plus, Pencil, Trash } from 'lucide-react';
import Button from '@/components/button';
import Swal from "sweetalert2";
import axios from 'axios';

interface ExpenseItem {
  id: string;
  name: string;
  description: string;
  amount: number;
  icon: 'wifi' | 'furniture' | 'trash' | 'default';
}


const MoneyAddedPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [dataMoneyAd, setDataMoneyAd] = useState<ExpenseItem[]>([])
  const [expenseForm, setExpenseForm] = useState({
    name: '',
    description: '',
    amount: 0,
    icon: 'default' as ExpenseItem['icon'],
  });

  useEffect(() => {
    hdlFetchData()
  }, [])

  // ตัวอย่างข้อมูลค่าใช้จ่ายเพิ่มเติม
  const [expenses] = useState<ExpenseItem[]>([
    {
      id: '1',
      name: 'ค่า Internet',
      description: 'ค่าบริการอินเทอร์เน็ตรายเดือน',
      amount: 500,
      icon: 'wifi',
    },
    {
      id: '2',
      name: 'ค่าเช่า Furniture',
      description: 'ค่าเช่าเฟอร์นิเจอร์รายเดือน',
      amount: 1200,
      icon: 'furniture',
    },
    {
      id: '3',
      name: 'ค่าขยะ',
      description: 'ค่ากำจัดขยะรายเดือน',
      amount: 100,
      icon: 'trash',
    },
  ]);

  const handleOpenAdd = () => {
    setIsEdit(false);
    setExpenseForm({ name: '', description: '', amount: 0, icon: 'default' });
    setIsOpen(true);
  };

  const handleOpenEdit = (item: ExpenseItem) => {
    setIsEdit(true);
    setExpenseForm({
      name: item.name,
      description: item.description,
      amount: item.amount,
      icon: item.icon,
    });
    setIsOpen(true);
  };

  const getIconComponent = (iconType: ExpenseItem['icon']) => {
    switch (iconType) {
      case 'wifi':
        return <Wifi className="h-6 w-6 text-blue-600" />;
      case 'furniture':
        return <Sofa className="h-6 w-6 text-amber-600" />;
      case 'trash':
        return <Trash2 className="h-6 w-6 text-green-600" />;
      default:
        return <div className="h-6 w-6 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-sm">ค</div>;
    }
  };

  const getBgGradient = (iconType: ExpenseItem['icon']) => {
    switch (iconType) {
      case 'wifi':
        return 'from-blue-50 to-white';
      case 'furniture':
        return 'from-amber-50 to-white';
      case 'trash':
        return 'from-green-50 to-white';
      default:
        return 'from-gray-50 to-white';
    }
  };

  const getIconBg = (iconType: ExpenseItem['icon']) => {
    switch (iconType) {
      case 'wifi':
        return 'bg-blue-100';
      case 'furniture':
        return 'bg-amber-100';
      case 'trash':
        return 'bg-green-100';
      default:
        return 'bg-primary/10';
    }
  };

  const hdlFetchData = async () => {
    try {
      const res = await axios.get("/api/money-added");
      setDataMoneyAd(res.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: (error as Error).message
      })
    }
  }


  const hdlSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const payload = {
        name: expenseForm.name,
        description: expenseForm.description,
        amount: expenseForm.amount
      }
      
      await axios.post("/api/money-added", payload);

      Swal.fire({
        icon: "success",
        title: "สำเร็จ",
        text: "เพิ่มข้อมูลสำเร็จ"
      });

    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: (error as Error).message
        });
    }
  }

  return (
    <div className="container-card">
      <Card className="p-6">
        {/* Header */}
        <CardHeader className="flex flex-row items-center justify-between pb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">ค่าใช้จ่ายเพิ่มเติม</CardTitle>
              <p className="text-sm text-muted-foreground">
                จัดการค่าใช้จ่ายเพิ่มเติม เช่น ค่า Internet, ค่าเช่า Furniture, ค่าขยะ
              </p>
            </div>
          </div>
          <Button variant="default" onClick={handleOpenAdd}>
            <Plus className="h-4 w-4 mr-2" />
            เพิ่มค่าใช้จ่าย
          </Button>
        </CardHeader>

        {/* Grid Cards */}
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dataMoneyAd.map((item) => (
              <div
                key={item.id}
                className={`border rounded-xl p-4 hover:shadow-md transition-shadow bg-linear-to-br ${getBgGradient(item.icon)}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 ${getIconBg(item.icon)} rounded-lg`}>
                    {getIconComponent(item.icon)}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenEdit(item)}
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button variant="destructive" size="sm">
                      <Trash className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {item.description}
                </p>
                <p className="text-xl font-bold text-primary">
                  ฿{item.amount.toLocaleString('th-TH')}/เดือน
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dialog Modal Form */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <form id="moneyAdded" onSubmit={hdlSubmit}>
            <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isEdit ? 'แก้ไขค่าใช้จ่าย' : 'เพิ่มค่าใช้จ่าย'}</DialogTitle>
            <DialogDescription>
              กรอกข้อมูลค่าใช้จ่ายเพิ่มเติม เช่น ค่า Internet, ค่าเช่า Furniture, ค่าขยะ
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                ชื่อค่าใช้จ่าย <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="เช่น ค่า Internet, ค่าเช่า Furniture, ค่าขยะ"
                value={expenseForm.name}
                onChange={(e) =>
                  setExpenseForm({ ...expenseForm, name: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">รายละเอียด</Label>
              <Input
                id="description"
                placeholder="รายละเอียดเพิ่มเติม"
                value={expenseForm.description}
                onChange={(e) =>
                  setExpenseForm({ ...expenseForm, description: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">
                จำนวนเงิน (บาท/เดือน) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={expenseForm.amount}
                onChange={(e) =>
                  setExpenseForm({ ...expenseForm, amount: Number(e.target.value) })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon">ไอคอน</Label>
              <div className="flex gap-2">
                {(['wifi', 'furniture', 'trash', 'default'] as const).map((iconType) => (
                  <button
                    key={iconType}
                    type="button"
                    onClick={() => setExpenseForm({ ...expenseForm, icon: iconType })}
                    className={`p-2 rounded-lg border transition-all ${
                      expenseForm.icon === iconType
                        ? 'border-primary bg-primary/10'
                        : 'border-input hover:border-primary/50'
                    }`}
                  >
                    {getIconComponent(iconType)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                ยกเลิก
              </Button>
            </DialogClose>
            <Button type="submit" form="moneyAdded">
              {isEdit ? 'บันทึกการแก้ไข' : 'เพิ่มค่าใช้จ่าย'}
            </Button>
          </DialogFooter>
        </DialogContent>
        </form>
      </Dialog>
    </div>
  );
};

export default MoneyAddedPage;