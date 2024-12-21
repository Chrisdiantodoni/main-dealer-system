import React, { ReactNode, useState } from "react";
import LoaderCircle from "@/components/Loader-circle";
import { key } from "localforage";
import SkeletionTable from "@/components/skeleton/Table";
import Error from "../404";
// import { EyeSlashFill } from "react-bootstrap-icons";
import notFound from "../../assets/images/not-found.png";

const Table = ({
  headers,
  data,
  action,
  isLoading,
  expand,
  expandedRows,
  is_delete,
}) => {
  const [expandRows, setExpandRows] = useState([]);
  const byString = (o, s) => {
    // Return early if object is null or undefined
    if (o === null || o === undefined) {
      return null;
    }

    s = s.replace(/\[(\w+)\]/g, ".$1");
    s = s.replace(/^\./, "");

    var a = s?.split(".");

    for (var i = 0, n = a.length; i < n; ++i) {
      var k = a[i];
      if (k in o) {
        o = o[k];
      } else {
        return null; // Return null if property does not exist
      }
    }
    return o;
  };
  const [expandedIndex, setExpandedIndex] = useState(null);

  const expandRow = (item, isExpanded, index) => {
    return (
      <tr key={index}>
        <td colSpan={headers.length}>
          {isExpanded && (
            <div>{/* Render your expanded row content here */}</div>
          )}
        </td>
      </tr>
    );
  };

  const handleExpandRow = (index) => {
    setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  console.log(headers.length);

  return (
    <div className="overflow-x-auto">
      {isLoading ? (
        <SkeletionTable count={headers.length} headers={headers} />
      ) : (
        <>
          <table className="min-w-full divide-y divide-slate-100 table-fixed min-h-[50] dark:divide-slate-700">
            <thead className="bg-slate-200 dark:bg-slate-700">
              <tr>
                {headers.map((item, index) => (
                  <th
                    scope="col"
                    className={` table-th py-3 ${index === 0 ? "w-1/12" : ""}`}
                    key={index}
                  >
                    {item.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700">
              {data?.length > 0 ? (
                data?.map((item, index) => {
                  return (
                    <React.Fragment key={index}>
                      <tr
                        className={
                          "border-t border-stroke py-4.5 px-4 md:px-6 2xl:px-7.5 items-center whitespace-nowrap"
                        }
                        onClick={() => handleExpandRow(key)}
                        key={index}
                      >
                        {headers.map((header, index) => (
                          <td
                            className={`table-td text-sm items-center text-black py-2`}
                            key={index}
                          >
                            {byString(item, header.key) || "-"}
                          </td>
                        ))}
                        {action && (
                          <td className="items-center" key={index}>
                            {action}
                          </td>
                        )}
                      </tr>
                      {expand &&
                        expandRows?.map((row, index) => {
                          return expandRow(
                            row,
                            index === expandedIndex,
                            `expand-${index}`
                          );
                        })}
                    </React.Fragment>
                  );
                  // Object.byString = function (o: any, s: any) {
                  //   s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
                  //   s = s.replace(/^\./, ''); // strip a leading dot
                  //   var a = s?.split('.');

                  //   for (var i = 0, n = a.length; i < n; ++i) {
                  //     var k = a[i];
                  //     if (k in o) {
                  //       o = o[k];
                  //     } else {
                  //       return;
                  //     }
                  //   }
                  //   return o;
                  // };
                  // return (
                  //   <tr
                  //     className="border-t border-stroke py-4.5 px-4 md:px-6 2xl:px-7.5 items-center"
                  //     key={key}
                  //   >
                  //     {data.map((itemColumn, indexColumn) => (
                  //       <td className="items-center" key={indexColumn}>
                  //         {Object.byString(item, itemColumn.key) || null}
                  //       </td>
                  //     ))}
                  //     {action ? <td className="items-center">{action}</td> : null}
                  //   </tr>
                  // );
                })
              ) : (
                <tr key={key} className="h-60">
                  <td
                    colSpan={headers?.length}
                    className="text-center text-black"
                  >
                    <div className="flex justify-center h-60 items-center">
                      <img
                        src={notFound}
                        className="w-auto h-52"
                        alt="Not Found"
                      />
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default Table;
