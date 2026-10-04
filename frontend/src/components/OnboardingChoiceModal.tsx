import React from "react";
import { X, UploadCloud, Compass, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { type User, api } from "../api/client";

interface OnboardingChoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onChooseUpload: () => void;
  onChooseExplore: () => void;
}

export const OnboardingChoiceModal: React.FC<OnboardingChoiceModalProps> = ({
  isOpen,
  onClose,
  user,
  onChooseUpload,
  onChooseExplore,
}) => {
  if (!isOpen) return null;

  const handleSkipAll = async () => {
    try {
      await api.completeTutorial();
    } catch {
      // ignore
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-surface rounded-2xl border border-outline-variant/60 shadow-stitch-lg overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-outline-variant/40 bg-surface">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary font-headline font-bold text-base shadow-sm">
              <span>F</span>
            </div>
            <div>
              <h2 className="font-headline text-base font-bold text-on-surface">
                Welcome to FinSight{user?.full_name ? `, ${user.full_name}` : ""}!
              </h2>
              <p className="text-xs text-secondary font-medium">
                Personalize your workspace setup to get started
              </p>
            </div>
          </div>
          <button
            onClick={handleSkipAll}
            className="p-1.5 rounded-lg text-secondary hover:text-on-surface hover:bg-surface-container-low transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Choice Cards */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-on-surface font-semibold">
            How would you like to begin your FinSight journey?
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Card 1: Existing Broker Statement */}
            <div
              onClick={() => {
                onClose();
                onChooseUpload();
              }}
              className="group p-5 rounded-xl border border-outline-variant/60 bg-surface hover:border-outline-variant hover:bg-surface-container-low/40 transition-all cursor-pointer shadow-stitch-sm flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-3 group-hover:scale-105 transition-transform">
                  <UploadCloud className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-headline text-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                  I Already Invest
                </h3>
                <p className="text-xs text-secondary mt-1.5 leading-relaxed">
                  Upload statements from Zerodha, Groww, AngelOne, or Upstox to automatically import and analyze your live positions.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-outline-variant/40 flex items-center justify-between text-xs font-bold text-primary">
                <span>Upload Statement</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 2: Explore Investments & Research */}
            <div
              onClick={() => {
                onClose();
                onChooseExplore();
              }}
              className="group p-5 rounded-xl border border-outline-variant/60 bg-surface hover:border-outline-variant hover:bg-surface-container-low/40 transition-all cursor-pointer shadow-stitch-sm flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-surface-container-low border border-outline-variant/40 flex items-center justify-center text-primary mb-3 group-hover:scale-105 transition-transform">
                  <Compass className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-headline text-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                  Explore Options First
                </h3>
                <p className="text-xs text-secondary mt-1.5 leading-relaxed">
                  Understand asset classes (Index funds, FDs, Gold, Bonds) and research Indian stocks before putting money at risk.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-outline-variant/40 flex items-center justify-between text-xs font-bold text-primary">
                <span>Explore Options</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-xl bg-surface-container-low border border-outline-variant/40 text-[11px] text-secondary">
            <Sparkles className="w-4 h-4 text-primary flex-shrink-0" />
            <span>
              You can also use FinSight to analyze Indian stocks on NSE before purchasing them on your broker app.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-surface border-t border-outline-variant/40 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-secondary font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-gain" />
            <span>Private &amp; isolated multi-tenant portfolio</span>
          </div>
          <button
            onClick={handleSkipAll}
            className="text-xs font-semibold text-secondary hover:text-on-surface hover:underline transition-colors"
          >
            Skip for now &amp; Explore Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
