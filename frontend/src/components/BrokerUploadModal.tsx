import React, { useState, useRef } from "react";
import {
  X,
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { api, type BrokerUploadResponse, type ParsedBrokerHolding } from "../api/client";

interface BrokerUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (count: number) => void;
}

export const BrokerUploadModal: React.FC<BrokerUploadModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<BrokerUploadResponse | null>(null);
  const [selectedHoldings, setSelectedHoldings] = useState<ParsedBrokerHolding[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleReset = () => {
    setSelectedFile(null);
    setUploadResult(null);
    setSelectedHoldings([]);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const processFile = async (file: File) => {
    setSelectedFile(file);
    setError(null);
    setIsUploading(true);

    try {
      const result = await api.uploadBrokerStatement(file);
      if (!result.holdings || result.holdings.length === 0) {
        throw new Error("No valid equity holdings detected in this file. Please ensure it is a statement containing Stock, Quantity, and Average Buy Price.");
      }
      setUploadResult(result);
      setSelectedHoldings(result.holdings);
    } catch (err: any) {
      setError(err.message || "Failed to parse statement. Please check file format.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const toggleHolding = (holding: ParsedBrokerHolding) => {
    if (selectedHoldings.some((h) => h.ticker === holding.ticker)) {
      setSelectedHoldings(selectedHoldings.filter((h) => h.ticker !== holding.ticker));
    } else {
      setSelectedHoldings([...selectedHoldings, holding]);
    }
  };

  const handleConfirmImport = async () => {
    if (!uploadResult || selectedHoldings.length === 0) return;
    setIsImporting(true);
    setError(null);

    try {
      const res = await api.confirmBrokerImport(uploadResult.broker, selectedHoldings);
      onImportSuccess(res.imported_count);
      onClose();
      handleReset();
    } catch (err: any) {
      setError(err.message || "Failed to import holdings into portfolio.");
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-scrim/30 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-stitch-lg overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-outline-variant/30 bg-surface-container-low/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center text-on-primary-container shadow-sm">
              <FileSpreadsheet className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-headline text-base font-bold text-on-surface">
                Import Portfolio Statement
              </h2>
              <p className="text-xs text-on-surface-variant font-medium">
                Auto-sync holdings directly from Zerodha, Groww, AngelOne, or Upstox
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              onClose();
              handleReset();
            }}
            className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-error-container/60 border border-error/20 flex items-start gap-2.5 text-xs text-on-error-container font-medium animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 text-error flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Broker Badges */}
          <div className="flex items-center flex-wrap gap-2 text-[11px] font-semibold text-on-surface-variant">
            <span>Supported Exports:</span>
            <span className="px-2 py-0.5 rounded-md bg-surface-container border border-outline-variant/40 text-on-surface">
              Zerodha Kite (CSV/XLSX)
            </span>
            <span className="px-2 py-0.5 rounded-md bg-surface-container border border-outline-variant/40 text-on-surface">
              Groww (Excel/CSV)
            </span>
            <span className="px-2 py-0.5 rounded-md bg-surface-container border border-outline-variant/40 text-on-surface">
              AngelOne (CSV)
            </span>
            <span className="px-2 py-0.5 rounded-md bg-surface-container border border-outline-variant/40 text-on-surface">
              Upstox
            </span>
          </div>

          {!uploadResult ? (
            /* Upload Drop Area */
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                dragActive
                  ? "border-primary bg-primary-container/20 scale-[0.99]"
                  : "border-outline-variant/60 hover:border-primary/60 hover:bg-surface-container-low/50"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv, .xlsx, .xls"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center text-primary shadow-sm">
                  {isUploading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <UploadCloud className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <p className="font-headline text-sm font-bold text-on-surface">
                    {isUploading
                      ? "Analyzing statement structure..."
                      : "Drag & drop your broker file here"}
                  </p>
                  <p className="text-xs text-on-surface-variant mt-1">
                    or click to browse your computer (.csv, .xlsx, .xls)
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-gain font-semibold bg-gain/10 px-2.5 py-1 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>100% confidential • Processed locally on your machine</span>
                </div>
              </div>
            </div>
          ) : (
            /* Parsed Preview Table */
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-gain" />
                  <span className="font-semibold text-on-surface">
                    Detected Broker: <strong className="text-primary">{uploadResult.broker}</strong>
                    {selectedFile && (
                      <span className="text-[10px] text-on-surface-variant font-normal ml-2">
                        ({selectedFile.name})
                      </span>
                    )}
                  </span>
                </div>
                <div className="text-on-surface-variant">
                  {selectedHoldings.length} of {uploadResult.total_detected} positions selected
                </div>
                <button
                  onClick={handleReset}
                  className="text-outline hover:text-error text-xs font-semibold flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear File</span>
                </button>
              </div>

              {/* Table of detected holdings */}
              <div className="border border-outline-variant/40 rounded-xl overflow-hidden shadow-stitch-sm">
                <div className="max-h-64 overflow-y-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-outline-variant/40 bg-surface-container-low text-[11px] font-semibold text-outline uppercase tracking-wider">
                        <th className="p-3 w-10 text-center">
                          <input
                            type="checkbox"
                            checked={selectedHoldings.length === uploadResult.holdings.length}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedHoldings(uploadResult.holdings);
                              } else {
                                setSelectedHoldings([]);
                              }
                            }}
                            className="rounded border-outline-variant text-primary focus:ring-primary cursor-pointer"
                          />
                        </th>
                        <th className="p-3">Stock / Scrip</th>
                        <th className="p-3">NSE Ticker</th>
                        <th className="p-3 text-right">Quantity</th>
                        <th className="p-3 text-right">Avg Price (₹)</th>
                        <th className="p-3 text-right">Value (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/30">
                      {uploadResult.holdings.map((h) => {
                        const isChecked = selectedHoldings.some((item) => item.ticker === h.ticker);
                        const estValue = (h.quantity * h.avg_buy_price).toLocaleString("en-IN", {
                          maximumFractionDigits: 0,
                        });
                        return (
                          <tr
                            key={h.ticker}
                            onClick={() => toggleHolding(h)}
                            className={`cursor-pointer transition-colors ${
                              isChecked
                                ? "bg-surface-container-lowest hover:bg-surface-container-low/70"
                                : "opacity-40 bg-surface-container-low/20"
                            }`}
                          >
                            <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => toggleHolding(h)}
                                className="rounded border-outline-variant text-primary focus:ring-primary cursor-pointer"
                              />
                            </td>
                            <td className="p-3">
                              <div className="font-semibold text-on-surface">{h.company_name}</div>
                              <div className="text-[10px] text-on-surface-variant">{h.original_name}</div>
                            </td>
                            <td className="p-3 font-mono font-semibold text-primary">{h.ticker}</td>
                            <td className="p-3 text-right font-medium text-on-surface">{h.quantity}</td>
                            <td className="p-3 text-right font-medium text-on-surface">
                              ₹{h.avg_buy_price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                            </td>
                            <td className="p-3 text-right font-semibold text-on-surface">₹{estValue}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-surface-container-low/40 border-t border-outline-variant/30 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              handleReset();
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            Cancel
          </button>

          {uploadResult && (
            <button
              onClick={handleConfirmImport}
              disabled={isImporting || selectedHoldings.length === 0}
              className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dim text-on-primary text-xs font-semibold flex items-center gap-2 shadow-sm transition-all active:scale-[0.99] disabled:opacity-50"
            >
              {isImporting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Import {selectedHoldings.length} Positions to FinSight</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
