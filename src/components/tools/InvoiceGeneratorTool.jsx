import { downloadFile } from "../../utils/fileDownloader";
import React, { useState } from 'react';
import { Plus, Trash2, Download, Printer, FileText, Building2, User, DollarSign } from 'lucide-react';

export default function InvoiceGeneratorTool() {
  const [businessName, setBusinessName] = useState('Khushal Jangid Web Services');
  const [businessAddress, setBusinessAddress] = useState('Jaipur, Rajasthan, India');
  const [clientName, setClientName] = useState('Acme Corporation');
  const [clientAddress, setClientAddress] = useState('Mumbai, Maharashtra');
  const [invoiceNo, setInvoiceNo] = useState(`INV-${Math.floor(1000 + Math.random() * 9000)}`);
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [taxRate, setTaxRate] = useState(18); // 18% GST / Tax

  const [items, setItems] = useState([
    { description: 'Web Development & UI Design Services', quantity: 1, price: 15000 },
    { description: 'Domain & Cloud Server Setup', quantity: 1, price: 2500 }
  ]);

  const addItem = () => {
    setItems([...items, { description: 'New Service / Product', quantity: 1, price: 1000 }]);
  };

  const removeItem = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = field === 'description' ? value : parseFloat(value) || 0;
    setItems(updated);
  };

  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const taxAmount = (subtotal * (parseFloat(taxRate) || 0)) / 100;
  const grandTotal = subtotal + taxAmount;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto text-left">
      {/* Printable Invoice Container */}
      <div id="printable-invoice" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-[#3525cd] dark:text-[#c3c0ff]">INVOICE</h2>
            <p className="text-xs font-mono font-bold text-slate-500">#{invoiceNo}</p>
          </div>
          <div className="text-left sm:text-right space-y-1 text-xs">
            <span className="font-bold text-slate-400 uppercase">Invoice Date</span>
            <input
              type="date"
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
              className="block font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 focus:outline-none"
            />
          </div>
        </div>

        {/* Business & Client Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Business From */}
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
              <Building2 className="h-3.5 w-3.5 text-[#3525cd]" /> Billed From (Your Business)
            </span>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Your Business Name"
              className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold focus:outline-none"
            />
            <input
              type="text"
              value={businessAddress}
              onChange={(e) => setBusinessAddress(e.target.value)}
              placeholder="Business Address / Contact"
              className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-none"
            />
          </div>

          {/* Client To */}
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
              <User className="h-3.5 w-3.5 text-emerald-500" /> Billed To (Client Details)
            </span>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Client / Company Name"
              className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold focus:outline-none"
            />
            <input
              type="text"
              value={clientAddress}
              onChange={(e) => setClientAddress(e.target.value)}
              placeholder="Client Address / City"
              className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-none"
            />
          </div>
        </div>

        {/* Item Rows Table */}
        <div className="space-y-3 pt-2">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Invoice Items</span>
          
          <div className="space-y-2">
            {items.map((item, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => updateItem(idx, 'description', e.target.value)}
                  placeholder="Item description..."
                  className="flex-1 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold focus:outline-none"
                />
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(idx, 'quantity', e.target.value)}
                    placeholder="Qty"
                    className="w-16 px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono font-bold text-center focus:outline-none"
                  />
                  <span className="text-xs text-slate-400">×</span>
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) => updateItem(idx, 'price', e.target.value)}
                    placeholder="Price"
                    className="w-24 px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono font-bold focus:outline-none"
                  />
                  <div className="w-24 text-right font-mono font-bold text-xs text-slate-900 dark:text-slate-100">
                    ₹{(item.quantity * item.price).toFixed(2)}
                  </div>
                  {items.length > 1 && (
                    <button
                      onClick={() => removeItem(idx)}
                      className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={addItem}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition"
          >
            <Plus className="h-3.5 w-3.5" /> Add New Item Line
          </button>
        </div>

        {/* Totals Summary */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-500">Tax / GST Rate (%):</label>
            <input
              type="number"
              value={taxRate}
              onChange={(e) => setTaxRate(e.target.value)}
              className="w-16 px-2 py-1 bg-slate-50 dark:bg-slate-800 border rounded-lg text-xs font-bold font-mono focus:outline-none"
            />
          </div>

          <div className="space-y-1 text-right w-full sm:w-auto">
            <div className="text-xs text-slate-500 font-medium">Subtotal: <span className="font-mono font-bold text-slate-900 dark:text-white">₹{subtotal.toFixed(2)}</span></div>
            <div className="text-xs text-slate-500 font-medium">Tax ({taxRate}%): <span className="font-mono font-bold text-slate-900 dark:text-white">₹{taxAmount.toFixed(2)}</span></div>
            <div className="text-lg font-mono font-black text-[#3525cd] dark:text-[#c3c0ff] pt-1">
              Grand Total: ₹{grandTotal.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Export & Print Actions */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#3525cd] text-white font-black text-xs shadow-md hover:bg-indigo-600 transition"
        >
          <Printer className="h-4 w-4" /> Print or Download PDF Invoice
        </button>
      </div>
    </div>
  );
}
