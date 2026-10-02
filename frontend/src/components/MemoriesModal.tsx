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
  Edit2,
  Check,
  Search,
} from "lucide-react";

interface MemoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORY_STYLES: Record<string, { label: string; bg: string; text: string; border: string }> = {
  profile: { label: "Profile", bg: "bg-blue-50 dark:bg-blue-950/30", text: "text-blue-700 dark:text-blue-300", border: "border-blue-200 dark:border-blue-800" },
  goal: { label: "Goal", bg: "bg-emerald-50 dark:bg-emerald-950/30", text: "text-emerald-700 dark:text-emerald-300", border: "border-emerald-200 dark:border-emerald-800" },
  risk: { label: "Risk Appetite", bg: "bg-amber-50 dark:bg-amber-950/30", text: "text-amber-700 dark:text-amber-300", border: "border-amber-200 dark:border-amber-800" },
  preference: { label: "Preference", bg: "bg-purple-50 dark:bg-purple-950/30", text: "text-purple-700 dark:text-purple-300", border: "border-purple-200 dark:border-purple-800" },
  strategy: { label: "Strategy", bg: "bg-indigo-50 dark:bg-indigo-950/30", text: "text-indigo-700 dark:text-indigo-300", border: "border-indigo-200 dark:border-indigo-800" },
  general: { label: "General", bg: "bg-surface-container", text: "text-on-surface-variant", border: "border-outline-variant/50" },
};

export const MemoriesModal: React.FC<MemoriesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [newMemory, setNewMemory] = useState<string>("");
  const [category, setCategory] = useState<string>("preference");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // In-line editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>("");
  const [editCategory, setEditCategory] = useState<string>("general");
  const [updating, setUpdating] = useState<boolean>(false);

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
      setEditingId(null);
      setError(null);
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

  const handleStartEdit = (mem: MemoryItem) => {
    setEditingId(mem.id);
    setEditText(mem.memory);
    setEditCategory(mem.category || "general");
  };

  const handleSaveEdit = async (id: string) => {
    if (!editText.trim()) return;
    setUpdating(true);
    try {
      await api.updateMemory(id, {
        memory: editText.trim(),
        category: editCategory,
      });
      setEditingId(null);
      await fetchMemories();
    } catch (err: any) {
      alert("Failed to update memory: " + err.message);
    } finally {
      setUpdating(false);
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
    if (window.confirm("Are you sure you want to erase all long-term memories from your FinSight memory bank?")) {
      try {
        await api.clearMemories();
        setMemories([]);
      } catch (err: any) {
        alert("Failed to clear memories: " + err.message);
      }
    }
  };

  const filteredMemories = memories.filter((m) =>
    m.memory.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl w-full max-w-2xl overflow-hidden shadow-stitch-xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-outline-variant/40 flex items-center justify-between bg-surface-container-low/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary shadow-xs">
              <Brain size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-on-surface font-headline">
                  FinSight Memory Bank
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-primary-container text-on-primary-container uppercase">
                  ChatGPT &amp; Gemini Style
                </span>
              </div>
              <p className="text-xs text-on-surface-variant font-medium mt-0.5">
                Persistent facts, budget limits &amp; risk preferences known by your AI companion
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {/* Explanation Banner */}
          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/40 flex items-start gap-3 text-xs text-on-surface-variant">
            <Info size={16} className="text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-on-surface">Zero-Cost Semantic Memory Architecture</p>
              <p className="text-on-surface-variant font-medium mt-0.5 leading-relaxed text-[11px]">
                FinSight automatically remembers your personal details, budget, and risk comfort from your conversations and onboarding profile. You can review, edit, or delete any remembered fact at any time.
              </p>
            </div>
          </div>

          {/* Add Manual Memory Form */}
          <form onSubmit={handleAddMemory} className="p-4 rounded-xl bg-surface-container-low/70 border border-outline-variant/40 space-y-3">
            <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5 font-headline">
              <Plus size={14} className="text-primary" />
              Teach FinSight A Personal Fact
            </h3>

            {error && (
              <p className="text-xs text-error bg-error-container/20 p-2.5 rounded-lg border border-error/20 font-medium">
                {error}
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-2.5">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-surface-container-lowest border border-outline-variant/60 text-on-surface text-xs font-medium rounded-lg px-3 py-2 focus:outline-none focus:border-primary shadow-xs"
              >
                <option value="preference">Preference</option>
                <option value="goal">Goal</option>
                <option value="risk">Risk Appetite</option>
                <option value="profile">Profile</option>
                <option value="strategy">Strategy</option>
                <option value="general">General</option>
              </select>

              <input
                type="text"
                placeholder="e.g. Planning to buy a house in 2029, prefers low-debt firms"
                value={newMemory}
                onChange={(e) => setNewMemory(e.target.value)}
                className="flex-1 bg-surface-container-lowest border border-outline-variant/60 text-on-surface text-xs font-medium rounded-lg px-3 py-2 focus:outline-none focus:border-primary shadow-xs placeholder:text-outline"
              />

              <button
                type="submit"
                disabled={submitting || !newMemory.trim()}
                className="px-4 py-2 bg-primary hover:bg-primary-dim text-on-primary font-bold rounded-lg text-xs transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-xs"
              >
                {submitting ? <Loader2 className="animate-spin" size={14} /> : "Remember"}
              </button>
            </div>
          </form>

          {/* Search & Header */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-outline-variant/30">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-on-surface">
                  Known Memories ({memories.length})
                </span>
                {memories.length > 0 && (
                  <span className="text-[10px] text-outline font-medium">
                    (Auto-injected into AI answers)
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {memories.length > 3 && (
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-outline pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Filter memories..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 pr-2.5 py-1 text-xs rounded-lg bg-surface-container-low border border-outline-variant/50 text-on-surface placeholder:text-outline w-36 sm:w-44 focus:outline-none focus:border-primary"
                    />
                  </div>
                )}
                {memories.length > 0 && (
                  <button
                    onClick={handleClearAll}
                    className="text-xs text-error hover:text-red-700 font-semibold transition-colors px-2 py-1 rounded hover:bg-error-container/10"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>

            {loading ? (
              <div className="py-8 flex justify-center text-outline text-xs">
                <Loader2 className="animate-spin text-primary" size={20} />
              </div>
            ) : memories.length === 0 ? (
              <div className="py-12 text-center text-outline text-xs">
                <Sparkles size={24} className="mx-auto mb-2 text-outline/50" />
                <p className="font-bold text-on-surface">Your memory bank is empty</p>
                <p className="text-[11px] text-on-surface-variant mt-1 font-medium max-w-sm mx-auto">
                  FinSight learns facts naturally as you chat or complete your onboarding profile. You can also add memories manually above.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredMemories.map((mem) => {
                  const style = CATEGORY_STYLES[mem.category] || CATEGORY_STYLES.general;
                  const isEditing = editingId === mem.id;

                  return (
                    <div
                      key={mem.id}
                      className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/50 hover:border-outline-variant transition-all text-xs shadow-xs space-y-2"
                    >
                      {isEditing ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <select
                              value={editCategory}
                              onChange={(e) => setEditCategory(e.target.value)}
                              className="bg-surface-container border border-outline-variant/60 text-on-surface text-[11px] font-medium rounded-md px-2 py-1 focus:outline-none focus:border-primary"
                            >
                              <option value="preference">Preference</option>
                              <option value="goal">Goal</option>
                              <option value="risk">Risk Appetite</option>
                              <option value="profile">Profile</option>
                              <option value="strategy">Strategy</option>
                              <option value="general">General</option>
                            </select>
                            <span className="text-[10px] text-outline">Editing Memory</span>
                          </div>
                          <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            rows={2}
                            className="w-full bg-surface-container-low border border-outline-variant/60 text-on-surface text-xs font-medium rounded-lg p-2 focus:outline-none focus:border-primary"
                          />
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setEditingId(null)}
                              className="px-2.5 py-1 text-xs text-on-surface-variant hover:text-on-surface rounded-md font-medium"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSaveEdit(mem.id)}
                              disabled={updating || !editText.trim()}
                              className="px-3 py-1 bg-primary hover:bg-primary-dim text-on-primary text-xs font-bold rounded-md flex items-center gap-1 shadow-xs"
                            >
                              {updating ? <Loader2 className="animate-spin w-3 h-3" /> : <Check size={13} />}
                              <span>Save</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border flex items-center gap-1 ${style.bg} ${style.text} ${style.border}`}>
                                <Tag size={9} />
                                {style.label}
                              </span>
                              {mem.created_at && (
                                <span className="text-[10px] text-outline font-medium">
                                  {new Date(mem.created_at).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                            <p className="text-on-surface font-medium leading-relaxed pt-0.5">
                              {mem.memory}
                            </p>
                          </div>

                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button
                              onClick={() => handleStartEdit(mem)}
                              className="p-1.5 rounded-md text-outline hover:text-primary hover:bg-primary/10 transition-colors"
                              title="Edit Memory"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => handleDelete(mem.id)}
                              className="p-1.5 rounded-md text-outline hover:text-error hover:bg-error-container/20 transition-colors"
                              title="Forget Fact"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
