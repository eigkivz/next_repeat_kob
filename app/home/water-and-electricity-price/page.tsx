"use client";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import Button from "@/components/button";


export default function WaterAndElectricityPrice() {
  const [waterPricePerUnit, setWaterPricePerUnit] = useState(0);
  const [electricityPricePerUnit, setElectricityPricePerUnit] = useState(0);
  const [id, setId] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("/api/water-and-electricity-price");
      setWaterPricePerUnit(response.data?.waterPricePerUnit);
      setElectricityPricePerUnit(response.data?.electricityPricePerUnit);
      setId(response.data?.id);
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
        title: 'success',
        icon: 'success',
        timer: 1000
      });
    } catch (error) {
        Swal.fire({
            title: 'Error',
            icon: 'error',
            text: (error as Error).message
        })
    }
  };

  return <>
    <div>
        <h1 className="text-2xl font-semibold">ราคาไฟ และน้ำ</h1>
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <label>ราคาไฟต่อหน่วย</label>
                <input 
                    type="number"
                    value={waterPricePerUnit}
                    onChange={e => setWaterPricePerUnit(Number(e.target.value))}
                    className="input-modal"
                     />
            </div>
            <div className="mb-4">
                <label>ราคาน้ำต่อหน่วย</label>
                <input 
                    type="number"
                    value={electricityPricePerUnit}
                    onChange={e => setElectricityPricePerUnit(Number(e.target.value))}
                    className="input-modal"
                     />
            </div>
            <Button>
                <i className="fa fa-check"></i>
                บันทึก
            </Button>
        </form>
    </div>
  </>;
}
