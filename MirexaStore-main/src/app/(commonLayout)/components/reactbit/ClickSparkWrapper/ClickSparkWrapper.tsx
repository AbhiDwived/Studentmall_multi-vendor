// components/ClickSparkWrapper.tsx
"use client";

import React from "react";
import ClickSpark from "../ClickSpark/ClickSpark";

const ClickSparkWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <ClickSpark
      sparkColor="#fff"
      sparkSize={10}
      sparkRadius={15}
      sparkCount={8}
      duration={400}
    >
      {children}
    </ClickSpark>
  );
};

export default ClickSparkWrapper;
