import React from "react";

const SkeletonTable = ({ items, count, headers }) => {
  // If items are not provided, create a skeleton list with the specified count
  items = items || Array.from({ length: count });

  return (
    <div className="w-full bg-white dark:bg-slate-700 shadow-base rounded-md">
      <table className="w-full table-fixed">
        <thead className="bg-slate-200 dark:bg-slate-700">
          <tr>
            {headers.map((header, index) => (
              <th
                scope="col"
                className={`table-th py-3 ${index === 0 ? "w-1/12" : ""}`}
                key={index}
              >
                {header.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="animate-pulse bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700">
          {items.map((item, i) => (
            <tr key={i}>
              {headers.map((_, index) => (
                <td key={index}>
                  <div className="h-2 bg-[#C4C4C4] dark:bg-slate-500 m-2 p-2 rounded"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SkeletonTable;
