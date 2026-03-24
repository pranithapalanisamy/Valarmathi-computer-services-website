import { useState } from "react";
import { Plus, Search, Edit2, Trash2, Package, Filter } from "lucide-react";

const PRODUCTS = [
  { id: 1, name: "HP Pavilion i5 Laptop", category: "Laptops", price: "₹45,000", stock: 24, status: "Active" },
  { id: 2, name: "Dell Inspiron 15 3000", category: "Laptops", price: "₹42,500", stock: 18, status: "Active" },
  { id: 3, name: "TP-Link Router AC1200", category: "Networking", price: "₹1,499", stock: 62, status: "Active" },
  { id: 4, name: "Kingston SSD 512GB", category: "Storage", price: "₹4,200", stock: 4, status: "Low Stock" },
  { id: 5, name: "Logitech MX Master 3", category: "Accessories", price: "₹10,999", stock: 15, status: "Active" },
  { id: 6, name: "Samsung 24\" Monitor", category: "Monitors", price: "₹14,500", stock: 9, status: "Active" },
  { id: 7, name: "RTX 4060 GPU", category: "GPU", price: "₹32,000", stock: 3, status: "Low Stock" },
  { id: 8, name: "Corsair DDR5 16GB", category: "RAM", price: "₹7,800", stock: 0, status: "Out of Stock" },
];

const STATUS_STYLES: Record<string, string> = {
  "Active": "bg-emerald-100 text-emerald-700 border border-emerald-200",
  "Low Stock": "bg-amber-100 text-amber-700 border border-amber-200",
  "Out of Stock": "bg-red-100 text-red-700 border border-red-200",
};

export default function AdminProducts() {
  const [search, setSearch] = useState("");
  const filtered = PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Products Management</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage your product inventory and catalog</p>
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-md shadow-blue-200 hover:shadow-lg">
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border-b border-slate-100">
          <div className="flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-2 w-full sm:w-72">
            <Search className="h-4 w-4 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent text-sm text-slate-600 placeholder-slate-400 outline-none w-full"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter className="h-4 w-4" /> Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50">
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3.5">#</th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3.5">Product</th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3.5">Category</th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3.5">Price</th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3.5">Stock</th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3.5">Status</th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3.5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-3.5 text-slate-400 font-mono text-xs">{String(product.id).padStart(3, "0")}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center shrink-0">
                        <Package className="h-4 w-4 text-indigo-500" />
                      </div>
                      <span className="font-semibold text-slate-800">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">{product.category}</span>
                  </td>
                  <td className="px-4 py-3.5 font-bold text-slate-900">{product.price}</td>
                  <td className="px-4 py-3.5 font-semibold text-slate-700">{product.stock}</td>
                  <td className="px-4 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[product.status]}`}>{product.status}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <button className="h-8 w-8 rounded-lg hover:bg-blue-50 hover:text-blue-600 text-slate-400 flex items-center justify-center transition-colors">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button className="h-8 w-8 rounded-lg hover:bg-red-50 hover:text-red-600 text-slate-400 flex items-center justify-center transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100 text-sm text-slate-500">
          <p>Showing {filtered.length} of {PRODUCTS.length} products</p>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors font-medium">← Prev</button>
            <button className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-semibold">1</button>
            <button className="px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors font-medium">Next →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
