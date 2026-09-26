import React, { useState, useEffect } from "react";
import { api, type MemoryItem } from "../api/client";
import {
  X,
  Brain,
  Plus,
  Trash2,
  Sparkles,
  Loader2,
  Tag,
  Info,
} from "lucide-react";

interface MemoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MemoriesModal: React.FC<MemoriesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [newMemory, setNewMemory] = useState<string>("");
  const [category, setCategory] = useState<string>("preference");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMemories = async () => {
    setLoading(true);
    try {
      const data = await api.getMemories();
      setMemories(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMemories();
    }
  }, [isOpen]);

  const handleAddMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemory.trim()) return;

    setSubmitting(true);
    setError(null);
    try {
      await api.createMemory({
        memory: newMemory.trim(),
        category,
      });
      setNewMemory("");
      await fetchMemories();
    } catch (err: any) {
      setError(err.message || "Failed to store memory.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteMemory(id);
      await fetchMemories();
    } catch (err: any) {
      alert("Failed to delete memory: " + err.message);
    }
  };

  const handleClearAll = async () => {
    if (window.confirm("Are you sure you want to erase all long-term memories?")) {
      try {
        await api.clearMemories();
        setMemories([]);
      } catch (err: any) {
        alert("Failed to clear memories: " + err.message);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between bg-surface-subtle">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-light text-brand-accent">
              <Brain size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-ink">
                Agent Memory Store
              </h2>
              <p className="text-xs text-ink-muted font-medium">
                Persistent long-term memories and user investment context (ChromaDB)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-surface transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Explanation Banner */}
          <div className="p-4 rounded-xl bg-brand-light border border-brand-border flex items-start gap-3 text-xs text-ink-secondary">
            <Info size={16} className="text-brand-accent flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-ink">Zero-Cost Semantic Memory</p>
              <p className="text-ink-muted font-medium mt-0.5 leading-relaxed">
                FinSight extracts user preferences and risk appetite directly from chat conversations without extra LLM extraction calls. Facts are injected contextually during analysis.
              </p>
            </div>
          </div>

          {/* Add Manual Memory Form */}
          <form onSubmit={handleAddMemory} className="p-4 rounded-xl bg-surface-subtle border border-border space-y-3">
            <h3 className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
              <Plus size={14} className="text-brand-accent" />
              Add Remembered Context
            </h3>

            {error && (
              <p className="text-xs text-loss bg-loss-bg p-2.5 rounded-lg border border-loss-border font-medium">
                {error}
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-2.5">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-surface border border-border text-ink text-xs font-medium rounded-lg px-3 py-2 focus:outline-none focus:border-brand-accent shadow-2xs"
              >
                <option value="preference">Preference</option>
                <option value="risk_tolerance">Risk Profile</option>
                <option value="portfolio_goal">Goal</option>
                <option value="strategy">Strategy</option>
                <option value="general">General</option>
              </select>

              <input
                type="text"
                placeholder="e.g. Target 5-year horizon with low exposure to PSU banks"
                value={newMemory}
                onChange={(e) => setNewMemory(e.target.value)}
                className="flex-1 bg-surface border border-border text-ink text-xs font-medium rounded-lg px-3 py-2 focus:outline-none focus:border-brand-accent shadow-2xs"
              />

              <button
                type="submit"
                disabled={submitting || !newMemory.trim()}
                className="px-4 py-2 bg-ink hover:bg-ink-secondary text-white font-semibold rounded-lg text-xs transition-colors disabled:opacity-50 flex items-center justify-center gap-1 shadow-xs"
              >
                {submitting ? <Loader2 className="animate-spin" size={14} /> : "Save"}
              </button>
            </div>
          </form>

          {/* Memories List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <span className="text-xs font-bold text-ink">
                Stored Memories ({memories.length})
              </span>
              {memories.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="text-xs text-loss hover:text-red-700 font-semibold transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>

            {loading ? (
              <div className="py-8 flex justify-center text-ink-muted text-xs">
                <Loader2 className="animate-spin text-brand-accent" size={18} />
              </div>
            ) : memories.length === 0 ? (
              <div className="py-10 text-center text-ink-muted text-xs">
                <Sparkles size={20} className="mx-auto mb-2 text-ink-faint" />
                <p className="font-semibold text-ink-secondary">No memories stored yet.</p>
                <p className="text-[11px] text-ink-muted mt-1 font-medium">
                  Chat with FinSight or add preferences manually above.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {memories.map((mem) => (
                  <div
                    key={mem.id}
                    className="p-3.5 rounded-lg bg-surface border border-border flex items-start justify-between gap-3 text-xs shadow-2xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-brand-light text-brand-accent border border-brand-border flex items-center gap-1">
                          <Tag size={10} />
                          {mem.category}
                        </span>
                        {mem.created_at && (
                          <span className="text-[11px] text-ink-muted font-medium">
                            {new Date(mem.created_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <p className="text-ink font-medium leading-relaxed">
                        {mem.memory}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDelete(mem.id)}
                      className="p-1.5 rounded-md text-ink-muted hover:text-loss hover:bg-loss-bg transition-colors flex-shrink-0"
                      title="Delete Memory"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
