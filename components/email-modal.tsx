import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface EmailModalProps {
  open: boolean
  onClose: () => void
  onEmailSubmit: (email: string) => void
}

const EmailModal: React.FC<EmailModalProps> = ({ open, onClose, onEmailSubmit }) => {
  const [email, setEmail] = useState("")

  const handleSubmit = () => {
    if (email) {
      onEmailSubmit(email)
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enter Your Email</DialogTitle>
          <DialogDescription>Please enter your email to access the dashboard.</DialogDescription>
        </DialogHeader>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <DialogFooter>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EmailModal