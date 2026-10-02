// src/components/shared/footer.tsx
import { Github, Twitter, Linkedin, Mail, Sparkles, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

const DSA_TOOL_URL = 'https://dsa-revision.in/'   // 🔥 NEW

export function Footer() {
  return (
    <footer id="footer" className="bg-card border-t border-border py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">

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

              {/* 🔥 NEW: Free Tools subsection */}
              <li className="pt-3 mt-3 border-t border-border/60">
                <a
                  href={DSA_TOOL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-accent" />
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Free DSA Tool
                  </span>
                  <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
                </a>
                <p className="text-xs text-muted-foreground mt-1">
                  NeetCode 150 · Daily missions · Pattern-based
                </p>
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