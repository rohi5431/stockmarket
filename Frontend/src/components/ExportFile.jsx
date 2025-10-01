import { Menu } from "@headlessui/react";
import { HiOutlineDownload } from "react-icons/hi";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// ===== Export Functions =====

// Export PDF
const exportPDF = (title, columns, data, filename) => {
  const doc = new jsPDF();
  doc.text(title, 14, 10);
  doc.autoTable({
    head: [columns],
    body: data,
    startY: 20,
  });
  doc.save(filename);
};

// Export Excel
const exportExcel = (data, filename) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  saveAs(new Blob([excelBuffer]), filename);
};

// Export CSV
const exportCSV = (data, filename) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const csvOutput = XLSX.utils.sheet_to_csv(worksheet);
  const blob = new Blob([csvOutput], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, filename);
};

// Print
const printData = (title, data, columns) => {
  const printWindow = window.open("", "_blank");
  const html = `
    <html>
      <head>
        <title>${title}</title>
        <style>
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #333; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <h2>${title}</h2>
        <table>
          <thead>
            <tr>${columns.map(c => `<th>${c}</th>`).join("")}</tr>
          </thead>
          <tbody>
            ${data.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join("")}</tr>`).join("")}
          </tbody>
        </table>
      </body>
    </html>
  `;
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.print();
};

// ===== Dropdown Component =====
const ExportFile = ({ holdings = [], trades = [] }) => {
  // Prepare data
  const holdingsColumns = ["Symbol", "Quantity", "Avg Price"];
  const holdingsData = holdings.map(h => [h.symbol, h.quantity, h.avgPrice]);

  const tradesColumns = ["Symbol", "Quantity", "Price", "Type", "Date"];
  const tradesData = trades.map(t => [t.symbol, t.quantity, t.price, t.type, t.date]);

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm rounded-lg shadow hover:from-indigo-500 hover:to-purple-500 transition">
        <HiOutlineDownload size={18} />
        Export
      </Menu.Button>

      <Menu.Items className="absolute right-0 mt-2 w-44 origin-top-right bg-white divide-y divide-gray-200 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
        <div className="p-1">
          {/* Portfolio Exports */}
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => exportPDF("Portfolio Holdings", holdingsColumns, holdingsData, "portfolio.pdf")}
                className={`${active ? "bg-indigo-100 text-indigo-700" : "text-gray-700"} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
              >
                Portfolio PDF
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => exportExcel(holdings, "portfolio.xlsx")}
                className={`${active ? "bg-indigo-100 text-indigo-700" : "text-gray-700"} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
              >
                Portfolio Excel
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => exportCSV(holdings, "portfolio.csv")}
                className={`${active ? "bg-indigo-100 text-indigo-700" : "text-gray-700"} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
              >
                Portfolio CSV
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => printData("Portfolio Holdings", holdingsData, holdingsColumns)}
                className={`${active ? "bg-indigo-100 text-indigo-700" : "text-gray-700"} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
              >
                Portfolio Print
              </button>
            )}
          </Menu.Item>

          {/* Trades Exports */}
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => exportPDF("Trade History", tradesColumns, tradesData, "trades.pdf")}
                className={`${active ? "bg-indigo-100 text-indigo-700" : "text-gray-700"} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
              >
                Trades PDF
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => exportExcel(trades, "trades.xlsx")}
                className={`${active ? "bg-indigo-100 text-indigo-700" : "text-gray-700"} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
              >
                Trades Excel
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => exportCSV(trades, "trades.csv")}
                className={`${active ? "bg-indigo-100 text-indigo-700" : "text-gray-700"} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
              >
                Trades CSV
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => printData("Trade History", tradesData, tradesColumns)}
                className={`${active ? "bg-indigo-100 text-indigo-700" : "text-gray-700"} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
              >
                Trades Print
              </button>
            )}
          </Menu.Item>
        </div>
      </Menu.Items>
    </Menu>
  );
};

export default ExportFile;
