"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ShareIcon, CopyIcon, MailIcon, MessageSquareIcon, CheckIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  destination: string
  itinerary: string
}

export function ShareModal({ isOpen, onClose, destination, itinerary }: ShareModalProps) {
  const [copied, setCopied] = useState(false)
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState(`Check out this amazing ${destination} itinerary I created with YatraAI!`)
  const { toast } = useToast()

  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/shared-itinerary/123`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast({
        title: "Link copied!",
        description: "Share link has been copied to your clipboard.",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please copy the link manually.",
        variant: "destructive",
      })
    }
  }

  const handleEmailShare = () => {
    const subject = `Amazing ${destination} Travel Itinerary`
    const body = `${message}\n\nView the full itinerary here: ${shareUrl}`
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.open(mailtoUrl)

    toast({
      title: "Email client opened",
      description: "Your email client should open with the pre-filled message.",
    })
  }

  const handleWhatsAppShare = () => {
    const text = `${message}\n\nView the full itinerary: ${shareUrl}`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <ShareIcon className="h-5 w-5 text-primary" />
            <span>Share Your Itinerary</span>
          </DialogTitle>
          <DialogDescription>Share your {destination} travel plan with friends and family</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Share Link */}
          <div className="space-y-2">
            <Label>Share Link</Label>
            <div className="flex space-x-2">
              <Input value={shareUrl} readOnly className="flex-1" />
              <Button onClick={handleCopyLink} variant="outline" size="sm">
                {copied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Custom Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Custom Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a personal message..."
              rows={3}
            />
          </div>

          {/* Email Share */}
          <div className="space-y-2">
            <Label htmlFor="email">Send via Email</Label>
            <div className="flex space-x-2">
              <Input
                id="email"
                type="email"
                placeholder="friend@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleEmailShare} variant="outline" size="sm" disabled={!email}>
                <MailIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Social Share Buttons */}
          <div className="space-y-2">
            <Label>Quick Share</Label>
            <div className="flex space-x-2">
              <Button onClick={handleWhatsAppShare} variant="outline" className="flex-1 bg-transparent">
                <MessageSquareIcon className="h-4 w-4 mr-2" />
                WhatsApp
              </Button>
              <Button
                onClick={() => {
                  const text = `${message} ${shareUrl}`
                  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
                  window.open(twitterUrl, "_blank")
                }}
                variant="outline"
                className="flex-1"
              >
                <span className="mr-2">𝕏</span>
                Twitter
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
