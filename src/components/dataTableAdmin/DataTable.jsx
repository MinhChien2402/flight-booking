// Libs
// Components, Layouts, Pages
// Others
// Styles, images, icons
import React, { useState } from "react";

export default function DataTablePage({
  title,
  searchPlaceholder,
  createButtonLabel,
  onCreate,
  columns,
  data,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortAsc, setSortAsc] = useState(true);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const handleSortToggle = () => {
    setSortAsc(!sortAsc);
  };

  const filteredData = data
    .filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(searchTerm)
      )
    )
    .sort((a, b) => {
      const aName = a.name || "";
      const bName = b.name || "";
      return sortAsc ? aName.localeCompare(bName) : bName.localeCompare(aName);
    });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>

      <div className="flex flex-wrap items-center gap-4 mb-4">
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={handleSearchChange}
          className="border border-gray-300 px-4 py-2 rounded w-full md:w-80"
        />
        <button
          onClick={onCreate}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          {createButtonLabel}
        </button>
      </div>

      <div className="mb-4">
        <select
          onChange={handleSortToggle}
          className="border border-gray-300 px-4 py-2 rounded"
        >
          <option>Sort by Name (A-Z)</option>
          <option>Sort by Name (Z-A)</option>
        </select>
      </div>

      <div className="overflow-auto">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {columns.map((col, index) => (
                <th key={index} className="text-left px-4 py-2 border-b">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                {columns.map((col, index) => {
                  const key = Object.keys(row)[index];
                  const value = row[key];

                  if (key === "actions") {
                    return (
                      <td key={index} className="px-4 py-2">
                        <button className="bg-green-500 text-white px-2 py-1 rounded mr-2">
                          ✏️
                        </button>
                        <button className="bg-red-500 text-white px-2 py-1 rounded">
                          🗑️
                        </button>
                      </td>
                    );
                  }

                  return (
                    <td key={index} className="px-4 py-2">
                      {value}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
