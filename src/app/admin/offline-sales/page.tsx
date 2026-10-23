'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  History,
  Upload,
  Download,
  Plus,
  Search,
  RefreshCw,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  X,
  CreditCard,
  Banknote,
  Calendar,
  Phone,
  User,
  Bike,
  Sparkles,
  ArrowUpDown,
  Filter,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { useToast } from '@/context/ToastContext';
import { formatPrice, formatDate } from '@/lib/utils';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface IOfflineSale {
  _id: string;
  srNo?: string;
  customerName: string;
  phone: string;
  brand?: string;
  cycleModel: string;
  cycleSize?: string;
  purchaseDate: string;
  price: number;
  paymentMode: 'Cash' | 'Online' | 'UPI' | 'Card';
  feedback?: string;
  notes?: string;
  createdAt?: string;
}

interface IStats {
  totalRecords: number;
  totalAmount: number;
  cashCount: number;
  onlineCount: number;
}

export default function OfflineSalesPage() {
  const { success, error, info } = useToast();

  const [records, setRecords] = useState<IOfflineSale[]>([]);
  const [stats, setStats] = useState<IStats>({
    totalRecords: 0,
    totalAmount: 0,
    cashCount: 0,
    onlineCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Brands list
  const [availableBrands, setAvailableBrands] = useState<string[]>([
    'Gang',
    'Zeus',
    'Ralco',
    'Rajanik',
    'Vallabha',
    'Speed',
  ]);
  const [brandFilter, setBrandFilter] = useState('ALL');

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentModeFilter, setPaymentModeFilter] = useState('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Active item for edit/delete
  const [currentRecord, setCurrentRecord] = useState<IOfflineSale | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    srNo: '',
    customerName: '',
    phone: '',
    brand: '',
    cycleModel: '',
    cycleSize: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    price: 0,
    paymentMode: 'Cash' as 'Cash' | 'Online' | 'UPI' | 'Card',
    feedback: '',
    notes: '',
  });
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Fetch available brands from DB
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await fetch('/api/brands?all=true');
        const data = await res.json();
        if (data.success && data.brands) {
          const names: string[] = data.brands.map((b: any) => b.name);
          setAvailableBrands(Array.from(new Set([...names, 'Gang', 'Zeus', 'Ralco', 'Rajanik', 'Vallabha', 'Speed'])));
        }
      } catch {
        // keep defaults
      }
    };
    fetchBrands();
  }, []);

  // Bulk Upload State
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [parsedPreview, setParsedPreview] = useState<any[]>([]);
  const [defaultPaymentMode, setDefaultPaymentMode] = useState<'Cash' | 'Online'>('Cash');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch records
  const fetchRecords = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '30',
      });

      if (searchTerm) params.append('search', searchTerm);
      if (brandFilter !== 'ALL') params.append('brand', brandFilter);
      if (paymentModeFilter !== 'ALL') params.append('paymentMode', paymentModeFilter);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const res = await fetch(`/api/admin/offline-sales?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setRecords(data.records || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalRecords(data.pagination?.total || 0);
        if (data.stats) {
          setStats(data.stats);
        }
      } else {
        error(data.message || 'Failed to load records');
      }
    } catch (err: any) {
      console.error(err);
      error('Network error loading offline records');
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, brandFilter, paymentModeFilter, startDate, endDate, error]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  // Robust Date Parser for Excel dates (e.g. 30-06-26, DD-MM-YYYY, Excel numeric)
  const parseFlexibleDate = (raw: any): Date => {
    if (!raw) return new Date();

    if (raw instanceof Date && !isNaN(raw.getTime())) {
      return raw;
    }

    // If Excel serial number (e.g., 45473)
    if (typeof raw === 'number') {
      const utc_days = Math.floor(raw - 25569);
      const utc_value = utc_days * 86400;
      const date_info = new Date(utc_value * 1000);
      return isNaN(date_info.getTime()) ? new Date() : date_info;
    }

    const str = String(raw).trim();

    // Check for DD-MM-YY or DD-MM-YYYY or DD/MM/YYYY
    const parts = str.split(/[-/.]/);
    if (parts.length === 3) {
      const p0 = parseInt(parts[0], 10);
      const p1 = parseInt(parts[1], 10) - 1; // Month is 0-indexed
      let p2 = parseInt(parts[2], 10);

      // Handle 2-digit years like '26' -> 2026, '99' -> 1999
      if (p2 < 100) {
        p2 = p2 > 70 ? 1900 + p2 : 2000 + p2;
      }

      // Check if parts[0] is day or year
      if (parts[0].length === 4) {
        // YYYY-MM-DD
        const d = new Date(p0, p1, parseInt(parts[2], 10));
        if (!isNaN(d.getTime())) return d;
      } else {
        // DD-MM-YYYY
        const d = new Date(p2, p1, p0);
        if (!isNaN(d.getTime())) return d;
      }
    }

    const fallback = new Date(str);
    return isNaN(fallback.getTime()) ? new Date() : fallback;
  };

  // Handle Excel File Selected
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileToUpload(file);
    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary', cellDates: true });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const rawJson: any[] = XLSX.utils.sheet_to_json(ws, { defval: '' });

        if (!rawJson || rawJson.length === 0) {
          error('The selected Excel file is empty.');
          return;
        }

        // Fuzzy header matching
        const mappedRows = rawJson.map((row) => {
          let srNo = '';
          let name = '';
          let brand = '';
          let cycle = '';
          let dateVal: any = '';
          let size = '';
          let phone = '';
          let price = 0;
          let paymentMode = defaultPaymentMode;
          let feedback = '';

          Object.keys(row).forEach((k) => {
            const cleanKey = k.toLowerCase().replace(/[^a-z0-9]/g, '');

            if (cleanKey.includes('brand') || cleanKey.includes('company') || cleanKey === 'make') {
              brand = String(row[k]);
            } else if (cleanKey.includes('srno') || cleanKey.includes('sno') || cleanKey === 'slno' || cleanKey === 'id') {
              srNo = String(row[k]);
            } else if (cleanKey === 'name' || cleanKey.includes('customer')) {
              name = String(row[k]);
            } else if (cleanKey === 'cycle' || cleanKey.includes('bicycle') || cleanKey.includes('model')) {
              cycle = String(row[k]);
            } else if (cleanKey.includes('purchase') || cleanKey.includes('date')) {
              dateVal = row[k];
            } else if (cleanKey.includes('size') || cleanKey.includes('cyclesize')) {
              size = String(row[k]);
            } else if (cleanKey.includes('phone') || cleanKey.includes('mobile') || cleanKey.includes('contact')) {
              phone = String(row[k]);
            } else if (cleanKey.includes('price') || cleanKey.includes('amount') || cleanKey.includes('prize') || cleanKey.includes('cost')) {
              price = parseFloat(String(row[k]).replace(/[^0-9.]/g, '')) || 0;
            } else if (cleanKey.includes('payment') || cleanKey.includes('mode')) {
              const p = String(row[k]).trim().toLowerCase();
              if (p.includes('online') || p.includes('upi') || p.includes('card')) {
                paymentMode = 'Online';
              } else {
                paymentMode = 'Cash';
              }
            } else if (cleanKey.includes('feedback') || cleanKey.includes('review') || cleanKey.includes('remark')) {
              feedback = String(row[k]);
            }
          });

          // Clean phone number (remove spaces, dots)
          const cleanPhone = phone.replace(/[^0-9]/g, '');

          return {
            srNo: srNo || '',
            customerName: name || 'Walk-in Customer',
            phone: cleanPhone || phone || '',
            brand: brand || '',
            cycleModel: cycle || 'Unspecified Cycle',
            cycleSize: size || '',
            purchaseDate: parseFlexibleDate(dateVal).toISOString(),
            purchaseDateRaw: String(dateVal || ''),
            price,
            paymentMode,
            feedback: feedback || '',
          };
        });

        setParsedPreview(mappedRows);
        info(`Found ${mappedRows.length} rows in "${file.name}". Review the preview below.`);
      } catch (err: any) {
        console.error(err);
        error('Failed to parse Excel file. Please ensure it is a valid .xlsx or .csv.');
      }
    };

    reader.readAsBinaryString(file);
  };

  // Submit Bulk Upload
  const handleBulkImport = async () => {
    if (!parsedPreview || parsedPreview.length === 0) {
      error('No valid records to import.');
      return;
    }

    try {
      setUploading(true);
      // Apply selected default payment mode if record doesn't specify
      const finalRecords = parsedPreview.map((r) => ({
        ...r,
        paymentMode: r.paymentMode || defaultPaymentMode,
      }));

      const res = await fetch('/api/admin/offline-sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ records: finalRecords }),
      });

      const data = await res.json();
      if (data.success) {
        success(`Successfully imported ${data.count} offline sales records!`);
        setIsUploadModalOpen(false);
        setParsedPreview([]);
        setFileToUpload(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        fetchRecords();
      } else {
        error(data.message || 'Import failed.');
      }
    } catch (err: any) {
      console.error(err);
      error('Error during bulk import.');
    } finally {
      setUploading(false);
    }
  };

  // Handle Single Add or Edit Form Submit
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName || !formData.phone || !formData.cycleModel) {
      error('Customer Name, Phone Number, and Cycle Model are required.');
      return;
    }

    try {
      setFormSubmitting(true);
      if (isEditModalOpen && currentRecord) {
        // Edit record
        const res = await fetch(`/api/admin/offline-sales/${currentRecord._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success) {
          success('Record updated successfully.');
          setIsEditModalOpen(false);
          setCurrentRecord(null);
          fetchRecords();
        } else {
          error(data.message || 'Failed to update record.');
        }
      } else {
        // Create new record
        const res = await fetch('/api/admin/offline-sales', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success) {
          success('Offline purchase record added successfully.');
          setIsAddModalOpen(false);
          resetForm();
          fetchRecords();
        } else {
          error(data.message || 'Failed to add record.');
        }
      }
    } catch (err: any) {
      console.error(err);
      error('Failed to save record.');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Handle Delete Record
  const handleDeleteRecord = async () => {
    if (!currentRecord) return;
    try {
      const res = await fetch(`/api/admin/offline-sales/${currentRecord._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        success('Record deleted.');
        setIsDeleteModalOpen(false);
        setCurrentRecord(null);
        fetchRecords();
      } else {
        error(data.message || 'Failed to delete record.');
      }
    } catch (err) {
      error('Error deleting record.');
    }
  };

  const resetForm = () => {
    setFormData({
      srNo: '',
      customerName: '',
      phone: '',
      brand: '',
      cycleModel: '',
      cycleSize: '',
      purchaseDate: new Date().toISOString().split('T')[0],
      price: 0,
      paymentMode: 'Cash',
      feedback: '',
      notes: '',
    });
  };

  const openEditModal = (rec: IOfflineSale) => {
    setCurrentRecord(rec);
    setFormData({
      srNo: rec.srNo || '',
      customerName: rec.customerName || '',
      phone: rec.phone || '',
      brand: rec.brand || '',
      cycleModel: rec.cycleModel || '',
      cycleSize: rec.cycleSize || '',
      purchaseDate: rec.purchaseDate
        ? new Date(rec.purchaseDate).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      price: rec.price || 0,
      paymentMode: rec.paymentMode || 'Cash',
      feedback: rec.feedback || '',
      notes: rec.notes || '',
    });
    setIsEditModalOpen(true);
  };

  // Download Sample Template
  const handleDownloadTemplate = () => {
    const templateData = [
      {
        'SR.NO': 1,
        NAME: 'RAVULA.RAKESH',
        BRAND: 'Gang',
        CYCLE: 'GANG ROCK',
        PURCHASED: '30-06-26',
        'CYCLE-SIZE': "20'CYCLE",
        'PHONE NUMBER': '7207653194',
        PRICE: 7500,
        'PAYMENT MODE': 'Cash',
        FEEDBACK: 'good',
      },
      {
        'SR.NO': 2,
        NAME: 'munny.sunil',
        BRAND: 'Speed',
        CYCLE: 'speed sprint',
        PURCHASED: '01-07-26',
        'CYCLE-SIZE': "20'",
        'PHONE NUMBER': '9848423678',
        PRICE: 8200,
        'PAYMENT MODE': 'Online',
        FEEDBACK: 'ok',
      },
      {
        'SR.NO': 3,
        NAME: 'E.Suresh',
        BRAND: 'Zeus',
        CYCLE: 'zeus 26 mtb',
        PURCHASED: '04-07-26',
        'CYCLE-SIZE': '26*1.95 POWERBREAK',
        'PHONE NUMBER': '9849752718',
        PRICE: 9500,
        'PAYMENT MODE': 'Cash',
        FEEDBACK: 'good',
      },
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Past Sales Template');
    XLSX.writeFile(wb, 'Sri_Rama_Cycles_Offline_Template.xlsx');
    success('Sample template downloaded!');
  };

  // Export Filtered / All Records to Excel
  const handleExportRecords = async () => {
    try {
      info('Preparing export...');
      const params = new URLSearchParams({ export: 'true' });
      if (searchTerm) params.append('search', searchTerm);
      if (brandFilter !== 'ALL') params.append('brand', brandFilter);
      if (paymentModeFilter !== 'ALL') params.append('paymentMode', paymentModeFilter);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const res = await fetch(`/api/admin/offline-sales?${params.toString()}`);
      const data = await res.json();

      if (!data.success || !data.records || data.records.length === 0) {
        error('No records available to export.');
        return;
      }

      const rows = data.records.map((r: IOfflineSale, idx: number) => ({
        'SR.NO': r.srNo || idx + 1,
        NAME: r.customerName,
        BRAND: r.brand || '',
        CYCLE: r.cycleModel,
        PURCHASED: formatDate(r.purchaseDate),
        'CYCLE-SIZE': r.cycleSize || '',
        'PHONE NUMBER': r.phone,
        PRICE: r.price || 0,
        'PAYMENT MODE': r.paymentMode,
        FEEDBACK: r.feedback || '',
      }));

      const ws = XLSX.utils.json_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Offline Records');
      XLSX.writeFile(wb, `SriRamaCycles_Offline_Records_${new Date().toISOString().split('T')[0]}.xlsx`);
      success(`Exported ${rows.length} records successfully!`);
    } catch (err) {
      error('Failed to export records.');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 text-amber-600 rounded-xl shrink-0">
              <History className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Offline Customer & Cycle Records
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Maintain and lookup past offline sales, cycle specifications, customer contacts & warranty history.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-2.5 shrink-0">
          <button
            onClick={handleDownloadTemplate}
            className="h-9 sm:h-10 inline-flex items-center justify-center gap-2 px-3.5 text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-sm transition-all whitespace-nowrap"
            title="Download formatted Excel template"
          >
            <Download className="w-4 h-4 text-slate-500 shrink-0" />
            Download Template
          </button>

          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="h-9 sm:h-10 inline-flex items-center justify-center gap-2 px-3.5 text-xs sm:text-sm font-medium text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-lg shadow-sm transition-all whitespace-nowrap"
          >
            <Upload className="w-4 h-4 text-amber-700 shrink-0" />
            Import Excel / CSV
          </button>

          <button
            onClick={() => {
              resetForm();
              setIsAddModalOpen(true);
            }}
            className="h-9 sm:h-10 inline-flex items-center justify-center gap-2 px-4 text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4 shrink-0" />
            Add Record
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Records
            </span>
            <div className="p-1.5 bg-slate-100 rounded-lg text-slate-600">
              <Bike className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">{stats.totalRecords.toLocaleString()}</p>
          <span className="text-xs text-slate-400">Offline customer registry</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
              Cash Payments
            </span>
            <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600">
              <Banknote className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">{stats.cashCount.toLocaleString()}</p>
          <span className="text-xs text-emerald-600 font-medium">In-store cash bills</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              Online Payments
            </span>
            <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">{stats.onlineCount.toLocaleString()}</p>
          <span className="text-xs text-blue-600 font-medium">UPI / Card / NetBanking</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-600">
              Total Recorded
            </span>
            <div className="p-1.5 bg-purple-50 rounded-lg text-purple-600">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {formatPrice(stats.totalAmount)}
          </p>
          <span className="text-xs text-slate-400">Past offline bill total</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            placeholder="Search by customer name, phone number, cycle model, or Sr. No..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all placeholder:text-slate-400"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Brand Filter Selector */}
          <select
            value={brandFilter}
            onChange={(e) => {
              setBrandFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-semibold"
          >
            <option value="ALL">All Brands</option>
            {availableBrands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>

          {/* Payment Mode Selector */}
          <select
            value={paymentModeFilter}
            onChange={(e) => {
              setPaymentModeFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          >
            <option value="ALL">All Payment Modes</option>
            <option value="Cash">Cash Only</option>
            <option value="Online">Online / UPI Only</option>
          </select>

          {/* Date Picker Start */}
          <input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setPage(1);
            }}
            title="Start Purchase Date"
            className="px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
          />

          <span className="text-slate-400 text-xs">to</span>

          {/* Date Picker End */}
          <input
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              setPage(1);
            }}
            title="End Purchase Date"
            className="px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
          />

          {(startDate || endDate) && (
            <button
              onClick={() => {
                setStartDate('');
                setEndDate('');
              }}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              title="Clear date filters"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Refresh */}
          <button
            onClick={() => fetchRecords()}
            className="p-2 text-slate-500 hover:text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            title="Refresh table"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Export button */}
          <button
            onClick={handleExportRecords}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
            title="Export filtered records to Excel"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            Export
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-500">
            <LoadingSpinner size="lg" />
            <p className="mt-3 text-sm">Loading offline sales records...</p>
          </div>
        ) : records.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <History className="w-7 h-7" />
            </div>
            <h3 className="text-base font-semibold text-slate-800">No Offline Records Found</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
              {searchTerm || paymentModeFilter !== 'ALL' || startDate || endDate
                ? 'No records match your active filters. Try clearing your search.'
                : 'You have not uploaded or entered any past offline records yet. Click "Import Excel / CSV" or "Add Record" to get started.'}
            </p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium shadow-sm transition-all inline-flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Import Excel Sheet
              </button>
              <button
                onClick={() => {
                  resetForm();
                  setIsAddModalOpen(true);
                }}
                className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium transition-all inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Single Record
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  <th className="py-3 px-4 w-14">Sr. No</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Phone Number</th>
                  <th className="py-3 px-4">Brand</th>
                  <th className="py-3 px-4">Cycle Model</th>
                  <th className="py-3 px-4">Cycle Size</th>
                  <th className="py-3 px-4">Purchase Date</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Feedback</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.map((r, index) => (
                  <tr
                    key={r._id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    {/* Sr No */}
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-500 font-medium">
                      {r.srNo || (page - 1) * 30 + index + 1}
                    </td>

                    {/* Customer Name */}
                    <td className="py-3.5 px-4 font-medium text-slate-900">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 font-semibold flex items-center justify-center text-xs uppercase shrink-0">
                          {r.customerName.charAt(0) || 'C'}
                        </div>
                        <span className="truncate max-w-[150px] font-medium" title={r.customerName}>
                          {r.customerName}
                        </span>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="py-3.5 px-4 text-slate-700">
                      {r.phone ? (
                        <a
                          href={`tel:${r.phone}`}
                          className="inline-flex items-center gap-1.5 text-slate-700 hover:text-amber-600 font-mono text-xs tracking-wide group-hover:underline"
                        >
                          <Phone className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-500" />
                          {r.phone}
                        </a>
                      ) : (
                        <span className="text-slate-400 italic text-xs">No phone</span>
                      )}
                    </td>

                    {/* Brand */}
                    <td className="py-3.5 px-4">
                      {r.brand ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200/70">
                          {r.brand}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs italic">-</span>
                      )}
                    </td>

                    {/* Cycle Model */}
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      <div className="flex items-center gap-1.5">
                        <Bike className="w-4 h-4 text-amber-500 shrink-0" />
                        <span className="uppercase tracking-wide">{r.cycleModel}</span>
                      </div>
                    </td>

                    {/* Cycle Size */}
                    <td className="py-3.5 px-4">
                      {r.cycleSize ? (
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                          {r.cycleSize}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">-</span>
                      )}
                    </td>

                    {/* Purchase Date */}
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap text-xs">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatDate(r.purchaseDate)}</span>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4 font-semibold text-slate-900 whitespace-nowrap">
                      {r.price > 0 ? formatPrice(r.price) : <span className="text-slate-400 text-xs">-</span>}
                    </td>

                    {/* Payment Mode */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {r.paymentMode === 'Cash' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <Banknote className="w-3 h-3 text-emerald-600" />
                          Cash
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                          <CreditCard className="w-3 h-3 text-blue-600" />
                          Online
                        </span>
                      )}
                    </td>

                    {/* Feedback */}
                    <td className="py-3.5 px-4">
                      {r.feedback ? (
                        <span className="inline-block px-2 py-0.5 rounded text-xs bg-amber-50 text-amber-700 border border-amber-200 capitalize">
                          {r.feedback}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">-</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditModal(r)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit record"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setCurrentRecord(r);
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-200 flex items-center justify-between text-sm text-slate-500">
            <div>
              Showing <span className="font-semibold text-slate-800">{(page - 1) * 30 + 1}</span> to{' '}
              <span className="font-semibold text-slate-800">
                {Math.min(page * 30, totalRecords)}
              </span>{' '}
              of <span className="font-semibold text-slate-800">{totalRecords}</span> records
            </div>

            <div className="flex items-center gap-1">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-xs font-semibold text-slate-700">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: Upload Excel / CSV */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-100 text-amber-700 rounded-lg">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Import Past Sales Excel Sheet</h3>
                  <p className="text-xs text-slate-500">
                    Supports .xlsx, .xls, and .csv files matching your 7 columns.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsUploadModalOpen(false);
                  setParsedPreview([]);
                  setFileToUpload(null);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drag & Drop Upload Area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-amber-300 hover:border-amber-500 bg-amber-50/40 hover:bg-amber-50/70 rounded-xl p-8 text-center cursor-pointer transition-all"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
                className="hidden"
              />
              <FileSpreadsheet className="w-12 h-12 text-amber-500 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-800">
                {fileToUpload ? fileToUpload.name : 'Click to select or drag and drop your Excel file here'}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Reads columns: SR.NO, NAME, CYCLE, PURCHASED, CYCLE-SIZE, PHONE NUMBER, PRICE, PAYMENT MODE, FEEDBACK
              </p>
            </div>

            {/* Default Payment Mode Option if not specified in file */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
              <label className="text-xs font-semibold text-slate-700 block">
                Default Payment Mode (if column is missing in file):
              </label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                  <input
                    type="radio"
                    name="defaultPay"
                    value="Cash"
                    checked={defaultPaymentMode === 'Cash'}
                    onChange={() => setDefaultPaymentMode('Cash')}
                    className="text-amber-600 focus:ring-amber-500"
                  />
                  💵 Cash Payment
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                  <input
                    type="radio"
                    name="defaultPay"
                    value="Online"
                    checked={defaultPaymentMode === 'Online'}
                    onChange={() => setDefaultPaymentMode('Online')}
                    className="text-amber-600 focus:ring-amber-500"
                  />
                  💳 Online Payment (UPI / Card)
                </label>
              </div>
            </div>

            {/* Parsed Preview Table */}
            {parsedPreview.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>Data Preview (Showing first 5 of {parsedPreview.length} rows):</span>
                  <span className="text-emerald-600">✓ Ready to import</span>
                </div>
                <div className="border border-slate-200 rounded-lg overflow-x-auto max-h-48">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-600">
                      <tr>
                        <th className="p-2">Name</th>
                        <th className="p-2">Brand</th>
                        <th className="p-2">Cycle</th>
                        <th className="p-2">Size</th>
                        <th className="p-2">Phone</th>
                        <th className="p-2">Purchased</th>
                        <th className="p-2">Price</th>
                        <th className="p-2">Payment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {parsedPreview.slice(0, 5).map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-2 font-medium">{row.customerName}</td>
                          <td className="p-2 font-semibold text-amber-700">{row.brand || '-'}</td>
                          <td className="p-2">{row.cycleModel}</td>
                          <td className="p-2">{row.cycleSize || '-'}</td>
                          <td className="p-2 font-mono">{row.phone}</td>
                          <td className="p-2">{formatDate(row.purchaseDate)}</td>
                          <td className="p-2">{row.price > 0 ? formatPrice(row.price) : '-'}</td>
                          <td className="p-2">
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold">
                              {row.paymentMode || defaultPaymentMode}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setIsUploadModalOpen(false);
                  setParsedPreview([]);
                  setFileToUpload(null);
                }}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={parsedPreview.length === 0 || uploading}
                onClick={handleBulkImport}
                className="px-5 py-2 text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm transition-all inline-flex items-center gap-2"
              >
                {uploading ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span>Importing {parsedPreview.length} records...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm & Import ({parsedPreview.length} Records)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Add or Edit Record Form */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-slate-900 text-white rounded-lg">
                  {isEditModalOpen ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {isEditModalOpen ? 'Edit Offline Record' : 'Add Past Offline Record'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Store historical offline sales and warranty details.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                  setCurrentRecord(null);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Sr. No */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Sr. No / Bill No
                  </label>
                  <input
                    type="text"
                    value={formData.srNo}
                    onChange={(e) => setFormData({ ...formData, srNo: e.target.value })}
                    placeholder="e.g. 101 or BILL-2024"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>

                {/* Purchase Date */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Purchase Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.purchaseDate}
                    onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>

                {/* Customer Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Customer Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="e.g. RAVULA.RAKESH"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. 9848423678"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-mono"
                  />
                </div>

                {/* Brand / Company */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Brand / Company
                    </label>
                    <a
                      href="/admin/brands"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-bold text-amber-600 hover:text-amber-700 hover:underline"
                    >
                      + Manage Brands
                    </a>
                  </div>
                  <select
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-medium cursor-pointer"
                  >
                    <option value="">-- Select Brand (Optional) --</option>
                    {formData.brand && !availableBrands.includes(formData.brand) && (
                      <option value={formData.brand}>{formData.brand}</option>
                    )}
                    {availableBrands.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Cycle Model */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Cycle Model <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.cycleModel}
                    onChange={(e) => setFormData({ ...formData, cycleModel: e.target.value })}
                    placeholder="e.g. Rock, Sprint, Falcon..."
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>

                {/* Cycle Size */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Cycle Size / Specs
                  </label>
                  <input
                    type="text"
                    value={formData.cycleSize}
                    onChange={(e) => setFormData({ ...formData, cycleSize: e.target.value })}
                    placeholder="e.g. 20'CYCLE or 26*2.40"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>

                {/* Price / Amount */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Price / Amount (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={formData.price || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
                    }
                    placeholder="e.g. 8500"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-semibold text-slate-900"
                  />
                </div>

                {/* Payment Mode Selection */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Payment Mode <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, paymentMode: 'Cash' })}
                      className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-xs font-semibold transition-all ${
                        formData.paymentMode === 'Cash'
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <Banknote className="w-4 h-4" />
                      Cash Payment
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, paymentMode: 'Online' })}
                      className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-xs font-semibold transition-all ${
                        formData.paymentMode === 'Online'
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      Online / UPI
                    </button>
                  </div>
                </div>
              </div>

              {/* Feedback */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Customer Feedback / Remarks
                </label>
                <input
                  type="text"
                  value={formData.feedback}
                  onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                  placeholder="e.g. good, satisfied, ok, regular customer"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
                    setCurrentRecord(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-5 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 rounded-lg shadow-sm transition-all inline-flex items-center gap-2"
                >
                  {formSubmitting ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{isEditModalOpen ? 'Update Record' : 'Save Record'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Delete Confirmation */}
      {isDeleteModalOpen && currentRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-slate-900">Delete Offline Record?</h3>
              <p className="text-sm text-slate-500 mt-1">
                Are you sure you want to delete the record for{' '}
                <strong className="text-slate-800">{currentRecord.customerName}</strong> (
                {currentRecord.cycleModel})? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setCurrentRecord(null);
                }}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteRecord}
                className="px-5 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-all"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
