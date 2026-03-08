import React from 'react';
import { motion } from 'motion/react';
import { 
  ArrowUpRight, 
  ShieldCheck, 
  Package, 
  TrendingUp, 
  Building2, 
  Smartphone, 
  Zap,
  CheckCircle2,
  ChevronRight,
  Play,
  Users
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const benefits = [
    {
      title: "GST Ready Invoicing",
      description: "Generate professional, GST-compliant invoices in seconds. Automatic tax calculations for CGST, SGST, and IGST.",
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
      color: "bg-emerald-50"
    },
    {
      title: "Inventory Management",
      description: "Keep track of your stock levels in real-time. Get low-stock alerts and manage product variants easily.",
      icon: <Package className="w-6 h-6 text-blue-600" />,
      color: "bg-blue-50"
    },
    {
      title: "Sales Analytics",
      description: "Visualize your business growth with beautiful charts. Track daily sales, expenses, and profit margins.",
      icon: <TrendingUp className="w-6 h-6 text-purple-600" />,
      color: "bg-purple-50"
    },
    {
      title: "Multi-Business Support",
      description: "Manage multiple shops or business entities from a single dashboard with our multi-tenant architecture.",
      icon: <Building2 className="w-6 h-6 text-orange-600" />,
      color: "bg-orange-50"
    },
    {
      title: "Cloud Sync",
      description: "Your data is securely stored in the cloud. Access your business information from anywhere, anytime.",
      icon: <Zap className="w-6 h-6 text-yellow-600" />,
      color: "bg-yellow-50"
    },
    {
      title: "Mobile Friendly",
      description: "Fully responsive design that works perfectly on smartphones, tablets, and desktops.",
      icon: <Smartphone className="w-6 h-6 text-indigo-600" />,
      color: "bg-indigo-50"
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
              <ArrowUpRight className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">Johar Billing</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#benefits" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">Benefits</a>
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">Features</a>
            <button 
              onClick={onGetStarted}
              className="bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-slate-800 transition-all active:scale-95"
            >
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Trusted by 500+ Jharkhand Shops</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] mb-6 tracking-tight">
                Modern Billing for <span className="text-emerald-600">Jharkhand</span> Businesses
              </h1>
              <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-xl">
                The most powerful GST billing and inventory management system designed specifically for kirana stores, retail shops, and small businesses.
              </p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <button 
                  onClick={onGetStarted}
                  className="group bg-emerald-600 text-white px-8 py-4 rounded-2xl text-lg font-bold shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  Get Started Free
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-lg font-bold text-slate-600 hover:bg-slate-50 transition-all">
                  <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center">
                    <Play className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                  </div>
                  Watch Demo
                </button>
              </div>
              <div className="mt-12 flex items-center gap-6">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <img 
                      key={i}
                      src={`https://picsum.photos/seed/user${i}/100/100`} 
                      alt="User" 
                      className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                      referrerPolicy="no-referrer"
                    />
                  ))}
                </div>
                <p className="text-sm text-slate-500">
                  Join <span className="font-bold text-slate-900">2,000+</span> shop owners growing with us
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-emerald-500/10 blur-3xl rounded-full" />
              <div className="relative bg-slate-900 rounded-[2.5rem] p-4 shadow-2xl border border-slate-800">
                <img 
                  src="https://images.unsplash.com/photo-1556740749-887f6717d7e4?q=80&w=1200&h=800&auto=format&fit=crop" 
                  alt="Happy shopkeeper doing billing" 
                  className="rounded-[1.5rem] shadow-lg"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl shadow-xl border border-slate-100 hidden md:block">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase">Monthly Sales</p>
                      <p className="text-xl font-bold text-slate-900">₹4,52,000</p>
                    </div>
                  </div>
                  <div className="w-48 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "75%" }}
                      transition={{ duration: 2, delay: 1 }}
                      className="h-full bg-emerald-500" 
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-sm font-bold text-emerald-600 uppercase tracking-[0.2em] mb-4">Why Choose Us</h2>
            <h3 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Everything you need to run your shop efficiently</h3>
            <p className="text-lg text-slate-600">
              Johar Billing is built to solve the real-world problems of small retailers in Jharkhand.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all group"
              >
                <div className={`w-14 h-14 ${benefit.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  {benefit.icon}
                </div>
                <h4 className="text-xl font-bold mb-4">{benefit.title}</h4>
                <p className="text-slate-600 leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <h2 className="text-sm font-bold text-emerald-600 uppercase tracking-[0.2em] mb-4">Advanced Features</h2>
              <h3 className="text-4xl font-bold mb-8 tracking-tight">Powerful tools for your business growth</h3>
              <div className="space-y-6">
                {[
                  { title: "Smart Invoicing", desc: "One-click invoice generation with automatic GST breakdown." },
                  { title: "Expense Tracking", desc: "Monitor your spending and identify cost-saving opportunities." },
                  { title: "Customer Portal", desc: "Give your customers a professional experience with digital receipts." }
                ].map((feature, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="mt-1">
                      <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">{feature.title}</h4>
                      <p className="text-slate-600">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => document.getElementById('benefits')?.scrollIntoView({ behavior: 'smooth' })}
                className="mt-10 inline-flex items-center gap-2 text-emerald-600 font-bold hover:gap-3 transition-all"
              >
                Explore All Benefits <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="absolute -inset-10 bg-emerald-100/50 blur-3xl rounded-full" />
              <div className="relative grid grid-cols-2 gap-4">
                <div className="space-y-4 pt-12">
                  <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100">
                    <Zap className="w-8 h-8 text-yellow-500 mb-4" />
                    <p className="font-bold">Fast Setup</p>
                    <p className="text-xs text-slate-500">Get started in under 2 minutes</p>
                  </div>
                  <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100">
                    <ShieldCheck className="w-8 h-8 text-emerald-500 mb-4" />
                    <p className="font-bold">Secure Data</p>
                    <p className="text-xs text-slate-500">Bank-grade encryption</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100">
                    <Smartphone className="w-8 h-8 text-blue-500 mb-4" />
                    <p className="font-bold">Mobile App</p>
                    <p className="text-xs text-slate-500">Manage on the go</p>
                  </div>
                  <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100">
                    <Users className="w-8 h-8 text-purple-500 mb-4" />
                    <p className="font-bold">Multi-User</p>
                    <p className="text-xs text-slate-500">Collaborate with staff</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/20 blur-[100px] -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 blur-[100px] -ml-48 -mb-48" />
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight">
                Ready to transform your business?
              </h2>
              <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
                Join thousands of successful shop owners in Jharkhand. Start your 14-day free trial today. No credit card required.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <button 
                  onClick={onGetStarted}
                  className="bg-emerald-600 text-white px-10 py-5 rounded-2xl text-xl font-bold hover:bg-emerald-700 transition-all shadow-2xl shadow-emerald-600/20 active:scale-95"
                >
                  Get Started Now
                </button>
                <div className="flex items-center gap-2 text-slate-400">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm font-medium">Free setup assistance</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">Johar Billing</span>
          </div>
          <p className="text-sm text-slate-500">
            © 2026 Johar Billing Solutions. All rights reserved. Mardibros
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Privacy</a>
            <a href="#" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Terms</a>
            <a href="#" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
