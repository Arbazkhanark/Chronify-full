import { Github, Twitter, Linkedin, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Footer() {
  return (
    <footer id="footer" className="bg-card border-t border-border py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Newsletter Section */}
        <div className="mb-16 p-8 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl border border-border">
          <h3 className="text-2xl font-bold text-foreground mb-2">Stay Updated</h3>
          <p className="text-muted-foreground mb-6">
            Get the latest features and study tips delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <Button className="rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground">
              Subscribe
            </Button>
          </div>
        </div>

        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <span className="text-sm font-bold text-primary-foreground">SF</span>
              </div>
              <span className="font-bold text-lg text-foreground">Chronify AI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              AI-powered time management for students. Study smarter, not harder.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Product</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Security
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Roadmap
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border mb-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 Chronify AI. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a href="#" aria-label="GitHub" className="w-10 h-10 rounded-lg bg-secondary/50 border border-border hover:bg-secondary hover:border-accent transition-colors flex items-center justify-center">
              <Github className="w-5 h-5 text-foreground" />
            </a>
            <a href="#" aria-label="Twitter" className="w-10 h-10 rounded-lg bg-secondary/50 border border-border hover:bg-secondary hover:border-accent transition-colors flex items-center justify-center">
              <Twitter className="w-5 h-5 text-foreground" />
            </a>
            <a href="#" aria-label="LinkedIn" className="w-10 h-10 rounded-lg bg-secondary/50 border border-border hover:bg-secondary hover:border-accent transition-colors flex items-center justify-center">
              <Linkedin className="w-5 h-5 text-foreground" />
            </a>
            <a href="#" aria-label="Email" className="w-10 h-10 rounded-lg bg-secondary/50 border border-border hover:bg-secondary hover:border-accent transition-colors flex items-center justify-center">
              <Mail className="w-5 h-5 text-foreground" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
