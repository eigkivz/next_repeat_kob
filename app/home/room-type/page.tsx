"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { useState } from "react";

const mockData = [
  { id: 1, name: "room test1" },
  { id: 2, name: "room test2" },
  { id: 3, name: "room test3" },
];


const RoomType = () => {
  const [roomType, setRoomType] = useState("");

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

        <CardContent>
          <Combobox items={mockData.map(item => ( item.name ))}>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default RoomType;
