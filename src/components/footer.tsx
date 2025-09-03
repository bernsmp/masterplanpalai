import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t bg-white/80 backdrop-blur-sm dark:bg-slate-900/80 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Left side - Brand */}
          <div className="text-center md:text-left">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} PlanPal AI by Smart Living, Smarter Solutions.
            </p>
          </div>
          
          {/* Right side - Legal Links */}
          <div className="flex items-center gap-6">
            <Link 
              href="/terms" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
            <Link 
              href="/privacy" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}