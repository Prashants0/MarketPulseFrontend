import { cn } from "@/lib/utils";
import React, { useState } from "react";

function PercentageInput({ className }: { className?: string }) {
  const [percentage, setPercentage] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // Regex to allow only numbers, backspaces and one period (.) for decimal values
    const re = /^[0-9\b.]+$/;

    // Validate input and allow a maximum of 100
    if (value === "" || (re.test(value) && parseFloat(value) <= 100)) {
      setPercentage(value);
    }
  };

  return (
    <input
      className={cn(className)}
      type="text"
      value={percentage}
      onChange={handleChange}
      placeholder=""
    />
  );
}

export default PercentageInput;
