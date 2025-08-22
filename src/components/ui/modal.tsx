import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  icon?: React.ComponentType<{ size?: number }>;
}

const Modal = ({ isOpen, onClose, title, children, icon: Icon }: ModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto transform-gpu transition-all duration-300 scale-100 hover:scale-[1.02] shadow-2xl border-0 bg-gradient-to-br from-background via-card to-muted/30 backdrop-blur-sm">
        <DialogHeader className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive transition-all duration-200 transform hover:rotate-90"
            onClick={onClose}
          >
            <X size={16} />
          </Button>
          <DialogTitle className="flex items-center gap-3 text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            {Icon && <Icon size={28} className="text-primary" />}
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-6 prose prose-lg max-w-none">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
