"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DownloadIcon, FileTextIcon, ImageIcon, CalendarIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface EnhancedExportProps {
  isOpen: boolean
  onClose: () => void
  destination: string
  itinerary: string
  formData: any
}

export function EnhancedExport({ isOpen, onClose, destination, itinerary, formData }: EnhancedExportProps) {
  const [exportOptions, setExportOptions] = useState({
    includeMap: true,
    includePhotos: true,
    includeTips: true,
    includeContacts: false,
    includeWeather: true,
  })
  const [format, setFormat] = useState("pdf")
  const [template, setTemplate] = useState("modern")
  const [isExporting, setIsExporting] = useState(false)
  const { toast } = useToast()

  const handleExport = async () => {
    setIsExporting(true)

    toast({
      title: "Preparing your export...",
      description: `Creating ${format.toUpperCase()} with selected options.`,
    })

    // Simulate export process
    await new Promise((resolve) => setTimeout(resolve, 3000))

    toast({
      title: "Export completed!",
      description: `Your ${destination} itinerary has been downloaded.`,
    })

    setIsExporting(false)
    onClose()
  }

  const exportFormats = [
    { value: "pdf", label: "PDF Document", icon: FileTextIcon, description: "Perfect for printing and sharing" },
    { value: "image", label: "Image Gallery", icon: ImageIcon, description: "Social media ready images" },
    { value: "calendar", label: "Calendar File", icon: CalendarIcon, description: "Import to your calendar app" },
  ]

  const templates = [
    { value: "modern", label: "Modern", description: "Clean and contemporary design" },
    { value: "traditional", label: "Traditional", description: "Classic Indian-inspired design" },
    { value: "minimal", label: "Minimal", description: "Simple and elegant layout" },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <DownloadIcon className="h-5 w-5 text-primary" />
            <span>Export Your Itinerary</span>
          </DialogTitle>
          <DialogDescription>Customize your export with various formats and options</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Export Format */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Export Format</Label>
            <div className="grid gap-3">
              {exportFormats.map((fmt) => {
                const Icon = fmt.icon
                return (
                  <Card
                    key={fmt.value}
                    className={`cursor-pointer transition-colors ${
                      format === fmt.value ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                    }`}
                    onClick={() => setFormat(fmt.value)}
                  >
                    <CardContent className="pt-4">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            format === fmt.value ? "bg-primary/20" : "bg-muted"
                          }`}
                        >
                          <Icon
                            className={`h-5 w-5 ${format === fmt.value ? "text-primary" : "text-muted-foreground"}`}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{fmt.label}</div>
                          <div className="text-sm text-muted-foreground">{fmt.description}</div>
                        </div>
                        <div
                          className={`w-4 h-4 rounded-full border-2 ${
                            format === fmt.value ? "border-primary bg-primary" : "border-muted-foreground"
                          }`}
                        >
                          {format === fmt.value && <div className="w-full h-full rounded-full bg-white scale-50" />}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Template Selection */}
          {format === "pdf" && (
            <div className="space-y-3">
              <Label className="text-base font-medium">Template Style</Label>
              <Select value={template} onValueChange={setTemplate}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((tmpl) => (
                    <SelectItem key={tmpl.value} value={tmpl.value}>
                      <div>
                        <div className="font-medium">{tmpl.label}</div>
                        <div className="text-xs text-muted-foreground">{tmpl.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Export Options */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Include in Export</Label>
            <div className="space-y-3">
              {[
                { key: "includeMap", label: "Interactive Map", description: "Location pins and routes" },
                { key: "includePhotos", label: "Destination Photos", description: "Beautiful images of places" },
                { key: "includeTips", label: "Local Tips & Insights", description: "Cultural tips and hidden gems" },
                { key: "includeWeather", label: "Weather Information", description: "Climate and seasonal info" },
                { key: "includeContacts", label: "Emergency Contacts", description: "Local emergency numbers" },
              ].map((option) => (
                <div key={option.key} className="flex items-start space-x-3">
                  <Checkbox
                    id={option.key}
                    checked={exportOptions[option.key as keyof typeof exportOptions]}
                    onCheckedChange={(checked) => setExportOptions((prev) => ({ ...prev, [option.key]: checked }))}
                  />
                  <div className="flex-1">
                    <Label htmlFor={option.key} className="font-medium cursor-pointer">
                      {option.label}
                    </Label>
                    <div className="text-sm text-muted-foreground">{option.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Preview */}
          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle className="text-lg">Export Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-2">
                <div>
                  <strong>Destination:</strong> {destination}
                </div>
                <div>
                  <strong>Format:</strong> {exportFormats.find((f) => f.value === format)?.label}
                </div>
                {format === "pdf" && (
                  <div>
                    <strong>Template:</strong> {templates.find((t) => t.value === template)?.label}
                  </div>
                )}
                <div>
                  <strong>Includes:</strong> {Object.entries(exportOptions).filter(([_, value]) => value).length}{" "}
                  additional sections
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Export Button */}
          <Button onClick={handleExport} disabled={isExporting} className="w-full text-lg py-6" size="lg">
            {isExporting ? (
              <>
                <DownloadIcon className="mr-2 h-5 w-5 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <DownloadIcon className="mr-2 h-5 w-5" />
                Export {exportFormats.find((f) => f.value === format)?.label}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
