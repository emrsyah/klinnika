import React from "react";

const TransaksiSubDetail = ({label, value} : {label: string, value: string}) => {
  return (
    <div className="flit justify-between">
      <h3 className="font-semibold text-gray-400">{label}</h3>
      <h3 className="font-semibold text-blue-600">{value}</h3>
    </div>
  );
};

export default TransaksiSubDetail;
