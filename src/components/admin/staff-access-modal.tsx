import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  ArrowRight,
  ExternalLink,
  Info,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { adminAuth } from "@/lib/admin-auth";

interface StaffAccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StaffAccessModal({ open, onOpenChange }: StaffAccessModalProps) {
  const isAuth = adminAuth.isAuthenticated();
  const navigate = useNavigate();

  const handleProceed = () => {
    onOpenChange(false);
    navigate({ to: "/launglaachi-portal" });
  };

  const handleOpenNewTab = () => {
    onOpenChange(false);
    window.open("/launglaachi-portal", "_blank", "noopener,noreferrer");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-amber-500/30 bg-card/95 backdrop-blur-xl p-6 sm:p-7 shadow-2xl">
        <DialogHeader className="text-center sm:text-left space-y-3">
          <div className="flex items-center justify-between">
            <div className="grid size-11 place-items-center rounded-2xl bg-amber-500/15 border border-amber-500/30 text-gold shadow-sm">
              <Lock className="size-5 text-gold" />
            </div>
            <Badge
              variant="outline"
              className={
                isAuth
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-extrabold text-[10px] uppercase"
                  : "border-amber-500/40 bg-amber-500/10 text-amber-800 dark:text-amber-300 font-extrabold text-[10px] uppercase"
              }
            >
              {isAuth ? "Session Active" : "Restricted Access"}
            </Badge>
          </div>

          <DialogTitle className="font-display text-xl font-bold tracking-tight text-foreground">
            Staff & Management Gateway
          </DialogTitle>

          <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
            This internal portal is reserved exclusively for restaurant management, banquet
            hall coordinators, and authorized staff.
          </DialogDescription>
        </DialogHeader>

        {/* Informative Guidance Card */}
        <div className="rounded-2xl border border-border/80 bg-muted/30 p-3.5 text-xs space-y-2">
          <div className="flex items-start gap-2.5">
            <Info className="size-4 text-primary shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-foreground">Are you a restaurant customer?</p>
              <p className="text-muted-foreground text-[11px] leading-snug">
                For table reservations, party booking enquiries, and food delivery orders, please
                use our public website features. No login is needed for customers.
              </p>
            </div>
          </div>

          <div className="border-t border-border/60 pt-2 flex items-center justify-between text-[11px]">
            <span className="text-muted-foreground">Portal Status:</span>
            <span className="font-bold text-foreground flex items-center gap-1">
              {isAuth ? (
                <>
                  <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Authenticated Admin</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="size-3.5 text-amber-600 dark:text-amber-400" />
                  <span>Requires Credentials</span>
                </>
              )}
            </span>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto h-9 text-xs font-semibold"
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleProceed}
            className="w-full sm:w-auto h-9 bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-bold shadow-sm"
          >
            <span>Proceed to Admin Portal</span>
            <ArrowRight className="ml-1.5 size-3.5" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={handleOpenNewTab}
            title="Open admin dashboard in a new browser tab"
            className="hidden sm:inline-flex h-9 text-xs text-muted-foreground hover:text-foreground"
          >
            <ExternalLink className="size-3.5" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
