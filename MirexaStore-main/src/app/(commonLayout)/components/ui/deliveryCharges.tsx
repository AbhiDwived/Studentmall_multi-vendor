import React, { useState } from "react";

type DeliveryCharge = {
  division: string;
  district: string;
  charge: number;
};

// Full Bangladesh Division → Districts mapping
const divisionDistricts: Record<string, string[]> = {
  Dhaka: [
    "Dhaka",
    "Gazipur",
    "Kishoreganj",
    "Manikganj",
    "Munshiganj",
    "Narayanganj",
    "Narsingdi",
    "Rajbari",
    "Shariatpur",
    "Tangail",
    "Faridpur",
    "Gopalganj",
    "Madaripur",
  ],
  Chattogram: [
    "Chattogram",
    "Cox's Bazar",
    "Bandarban",
    "Khagrachari",
    "Rangamati",
    "Brahmanbaria",
    "Cumilla",
    "Chandpur",
    "Feni",
    "Lakshmipur",
    "Noakhali",
  ],
  Khulna: [
    "Khulna",
    "Bagerhat",
    "Satkhira",
    "Jessore",
    "Jhenaidah",
    "Magura",
    "Meherpur",
    "Narail",
    "Chuadanga",
    "Kushtia",
  ],
  Rajshahi: [
    "Rajshahi",
    "Chapai Nawabganj",
    "Naogaon",
    "Natore",
    "Pabna",
    "Joypurhat",
    "Bogura",
    "Sirajganj",
  ],
  Barisal: [
    "Barisal",
    "Barguna",
    "Bhola",
    "Jhalokati",
    "Patuakhali",
    "Pirojpur",
  ],
  Sylhet: ["Sylhet", "Habiganj", "Moulvibazar", "Sunamganj"],
  Rangpur: [
    "Rangpur",
    "Dinajpur",
    "Gaibandha",
    "Kurigram",
    "Lalmonirhat",
    "Nilphamari",
    "Panchagarh",
    "Thakurgaon",
  ],
  Mymensingh: ["Mymensingh", "Jamalpur", "Netrokona", "Sherpur"],
};

export default function DeliveryChargesForm({
  initialDeliveryCharges = [],
  initialDefaultCharge = 0,
  onChange,
}: {
  initialDeliveryCharges?: DeliveryCharge[];
  initialDefaultCharge?: number;
  onChange: (deliveryCharges: DeliveryCharge[], defaultCharge: number) => void;
}) {
  const [deliveryCharges, setDeliveryCharges] = useState<DeliveryCharge[]>(
    initialDeliveryCharges
  );
  const [defaultCharge, setDefaultCharge] =
    useState<number>(initialDefaultCharge);

  const updateCharge = (
    index: number,
    field: "division" | "district" | "charge",
    value: string | number
  ) => {
    const updated = [...deliveryCharges];
    if (field === "charge") {
      updated[index].charge = Number(value);
    } else if (field === "division") {
      updated[index].division = String(value);
      updated[index].district = ""; // Reset district when division changes
    } else if (field === "district") {
      updated[index].district = String(value);
    }
    setDeliveryCharges(updated);
    onChange(updated, defaultCharge);
  };

  const addZone = () => {
    const updated = [
      ...deliveryCharges,
      { division: "", district: "", charge: 0 },
    ];
    setDeliveryCharges(updated);
    onChange(updated, defaultCharge);
  };

  const removeZone = (index: number) => {
    const updated = deliveryCharges.filter((_, i) => i !== index);
    setDeliveryCharges(updated);
    onChange(updated, defaultCharge);
  };

  const updateDefaultCharge = (value: number) => {
    setDefaultCharge(value);
    onChange(deliveryCharges, value);
  };

  return (
    <div className="space-y-4 p-4 border rounded-md">
      <h3 className="font-bold text-lg mb-2">
        Delivery Charges by Division & District
      </h3>

      {deliveryCharges.map((dc, idx) => {
        const districts = divisionDistricts[dc.division] || [];

        return (
          <div key={idx} className="flex gap-3 items-center">
            {/* Division dropdown */}
            <select
              value={dc.division}
              onChange={(e) => updateCharge(idx, "division", e.target.value)}
              className="border p-2 rounded flex-1"
            >
              <option value="">Select Division</option>
              {Object.keys(divisionDistricts).map((division) => (
                <option key={division} value={division}>
                  {division}
                </option>
              ))}
            </select>

            {/* District dropdown */}
            <select
              value={dc.district}
              onChange={(e) => updateCharge(idx, "district", e.target.value)}
              className="border p-2 rounded flex-1"
              disabled={!dc.division}
            >
              <option value="">Select District</option>
              {districts.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>

            {/* Charge input */}
            <input
              type="number"
              min={0}
              step={0.01}
              placeholder="Charge"
              value={dc.charge}
              onChange={(e) => updateCharge(idx, "charge", e.target.value)}
              className="border p-2 rounded w-24"
            />

            {/* Remove button */}
            <button
              type="button"
              onClick={() => removeZone(idx)}
              className="text-red-600 font-semibold"
              aria-label="Remove zone"
            >
              &times;
            </button>
          </div>
        );
      })}

      {/* Add Zone */}
      <button
        type="button"
        onClick={addZone}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        + Add Zone
      </button>

      {/* Default Charge */}
      <div className="mt-4">
        <label className="font-semibold block mb-1">
          Default Delivery Charge
        </label>
        <input
          type="number"
          min={0}
          step={0.01}
          value={defaultCharge}
          onChange={(e) => updateDefaultCharge(Number(e.target.value))}
          className="border p-2 rounded w-32"
        />
      </div>
    </div>
  );
}
