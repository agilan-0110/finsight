import React from "react";
import { X, UploadCloud, GraduationCap, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { type User, api } from "../api/client";

interface OnboardingChoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onChooseUpload: () => void;
  onChooseTutorial: () => void;
}

export const OnboardingChoiceModal: React.FC<OnboardingChoiceModalProps> = ({
  isOpen,
  onClose,
  user,
  onChooseUpload,
  onChooseTutorial,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-scrim/30 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-stitch-lg overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-outline-variant/30 bg-surface-container-low/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary font-headline font-bold text-base shadow-sm">
              <span>F</span>
            </div>
            <div>
              <h2 className="font-headline text-base font-bold text-on-surface">
                Welcome to FinSight{user?.full_name ? `, ${user.full_name}` : ""}!
              </h2>
              <p className="text-xs text-on-surface-variant font-medium">
                Personalize your workspace setup to get started
              </p>
            </div>
          </div>
          <button
            onClick={handleSkipAll}
            className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
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
              className="group p-5 rounded-2xl border border-outline-variant/50 bg-surface-container-lowest hover:border-primary hover:bg-surface-container-low/40 transition-all cursor-pointer shadow-stitch-sm hover:shadow-stitch-md flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center text-on-primary-container mb-3 group-hover:scale-105 transition-transform">
                  <UploadCloud className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-headline text-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                  I Already Invest
                </h3>
                <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                  Upload statements from Zerodha, Groww, AngelOne, or Upstox to automatically import and analyze your live positions.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-outline-variant/30 flex items-center justify-between text-xs font-bold text-primary">
                <span>Upload Statement</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 2: Market Academy Tutorial */}
            <div
              onClick={() => {
                onClose();
                onChooseTutorial();
              }}
              className="group p-5 rounded-2xl border border-outline-variant/50 bg-surface-container-lowest hover:border-secondary hover:bg-surface-container-low/40 transition-all cursor-pointer shadow-stitch-sm hover:shadow-stitch-md flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center text-on-secondary-container mb-3 group-hover:scale-105 transition-transform">
                  <GraduationCap className="w-5 h-5 text-on-secondary-container" />
                </div>
                <h3 className="font-headline text-sm font-bold text-on-surface group-hover:text-on-secondary-container transition-colors">
                  I'm New to Investing
                </h3>
                <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                  Go through our interactive Stock Market Academy: learn shares, P/E ratios, risk management, and how to use AI research.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-outline-variant/30 flex items-center justify-between text-xs font-bold text-on-secondary-container">
                <span>Start Beginner Tutorial</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-[11px] text-on-surface-variant">
            <Sparkles className="w-4 h-4 text-primary flex-shrink-0" />
            <span>
              You can also use FinSight to analyze Indian stocks on NSE before purchasing them on your broker app.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-surface-container-low/40 border-t border-outline-variant/30 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-outline font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-gain" />
            <span>Private &amp; isolated multi-tenant portfolio</span>
          </div>
          <button
            onClick={handleSkipAll}
            className="text-xs font-semibold text-outline hover:text-on-surface hover:underline transition-colors"
          >
            Skip for now &amp; Explore Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
