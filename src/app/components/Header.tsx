import { Button } from "@/app/components/ui/button";
import { Check, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="text-xl font-bold text-gray-900">SaaSify</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              Features
            </a>
            <a href="#testimonials" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              Testimonials
            </a>
            <a href="#pricing" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              Pricing
            </a>
            <a href="#about" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              About
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <button className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              Sign In
            </button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6">
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              <a href="#features" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                Features
              </a>
              <a href="#testimonials" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                Testimonials
              </a>
              <a href="#pricing" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                Pricing
              </a>
              <a href="#about" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                About
              </a>
              <hr className="border-gray-100" />
              <button className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors text-left">
                Sign In
              </button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-full">
                Get Started
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
