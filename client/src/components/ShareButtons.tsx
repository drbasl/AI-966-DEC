import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { Check, Copy, Link2, Loader2, Share2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ShareButtonsProps {
  promptId: number;
  promptTitle: string;
  promptText: string;
}

export default function ShareButtons({ promptId, promptTitle, promptText }: ShareButtonsProps) {
  const [open, setOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const generateLinkMutation = trpc.share.generateLink.useMutation();

  const handleGenerateLink = async () => {
    try {
      const result = await generateLinkMutation.mutateAsync({ promptId });
      const fullUrl = `${window.location.origin}/share/${result.token}`;
      setShareUrl(fullUrl);
      toast.success("تم إنشاء رابط المشاركة");
    } catch (error) {
      toast.error("فشل إنشاء رابط المشاركة");
    }
  };

  const handleCopyLink = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("تم نسخ الرابط");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyForShare = (platform: string) => {
    if (!shareUrl) return;
    let text = "";
    
    switch (platform) {
      case "twitter":
        text = `شاهد هذا البرومبت الرائع: ${promptTitle}\n\n${shareUrl}\n\n#رقيم_AI #AI #البرومبتات`;
        break;
      case "linkedin":
        text = `شاهد هذا البرومبت الرائع: ${promptTitle}\n\n${shareUrl}\n\nمولّد برومبتات ذكي يساعدك على تحسين تفاعلك مع الذكاء الاصطناعي`;
        break;
      case "whatsapp":
        text = `🔥 شاهد هذا البرومبت الرائع:\n${promptTitle}\n\n${shareUrl}`;
        break;
      default:
        text = `${promptTitle}\n\n${shareUrl}`;
    }
    
    navigator.clipboard.writeText(text);
    toast.success(`تم نسخ النص للمشاركة على ${platform === "twitter" ? "تويتر" : platform === "linkedin" ? "لينكدإن" : "واتساب"}`);
  };

  const handleShareTwitter = () => {
    handleCopyForShare("twitter");
  };

  const handleShareLinkedIn = () => {
    handleCopyForShare("linkedin");
  };

  const handleShareWhatsApp = () => {
    if (!shareUrl) return;
    const text = `🔥 شاهد هذا البرومبت الرائع:\n${promptTitle}\n\n${shareUrl}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setOpen(true);
            if (!shareUrl) {
              handleGenerateLink();
            }
          }}
        >
          <Share2 className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>مشاركة البرومبت</DialogTitle>
          <DialogDescription>
            شارك هذا البرومبت مع أصدقائك على وسائل التواصل الاجتماعي
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Share URL */}
          {generateLinkMutation.isPending ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="mr-2 text-sm text-muted-foreground">جاري إنشاء الرابط...</span>
            </div>
          ) : shareUrl ? (
            <>
              <div className="flex items-center gap-2">
                <Input value={shareUrl} readOnly className="flex-1" />
                <Button
                  size="icon"
                  variant="outline"
                  onClick={handleCopyLink}
                  className="shrink-0"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>

              {/* Social Share Buttons */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  اضغط على المنصة لنسخ النص والرابط جاهزًا للمشاركة:
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    onClick={handleShareTwitter}
                    className="gap-2 flex-col h-auto py-3"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    <span className="text-xs">نسخ لتويتر</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleShareLinkedIn}
                    className="gap-2 flex-col h-auto py-3"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    <span className="text-xs">نسخ للينكدإن</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleShareWhatsApp}
                    className="gap-2 flex-col h-auto py-3"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    <span className="text-xs">فتح واتساب</span>
                  </Button>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
