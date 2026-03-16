import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PolicyModal } from './PolicyModal';
import { CubeBackground } from './CubeBackground';
import { ParticleText } from './ParticleText';
import { GlowCard } from './GlowCard';
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
  Users,
  MessageSquare,
  Star,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  MapPin,
  Send,
  Briefcase,
  HelpCircle
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const [activePolicy, setActivePolicy] = useState<'privacy' | 'terms' | 'refund' | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
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
            <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">Pricing</a>
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
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-4xl w-full mb-16"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Trusted by 500+ Jharkhand Shops</span>
              </div>
              <h1 className="text-5xl md:text-8xl font-bold leading-[1.1] mb-8 tracking-tight">
                <div className="flex flex-col items-center">
                  <div className="flex flex-wrap justify-center gap-x-[0.3em]">
                    <span className="whitespace-nowrap">
                      <ParticleText text="Modern" />
                    </span>
                    <span className="whitespace-nowrap">
                      <ParticleText text="Billing" />
                    </span>
                    <span className="whitespace-nowrap">
                      <ParticleText text="for" />
                    </span>
                  </div>
                  <div className="flex flex-wrap justify-center gap-x-[0.3em]">
                    <span className="text-emerald-600 whitespace-nowrap">
                      <ParticleText text="Your" />
                    </span>
                    <span className="whitespace-nowrap">
                      <ParticleText text="Businesses" />
                    </span>
                  </div>
                </div>
              </h1>
              <p className="text-xl md:text-2xl text-slate-600 mb-12 leading-relaxed max-w-2xl mx-auto">
                The most powerful GST billing and inventory management system designed specifically for kirana stores, retail shops, and small businesses.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <button 
                  onClick={onGetStarted}
                  className="group bg-emerald-600 text-white px-10 py-5 rounded-2xl text-xl font-bold shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 active:scale-95 w-full sm:w-auto"
                >
                  Get Started Free
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="flex items-center justify-center gap-3 px-10 py-5 rounded-2xl text-xl font-bold text-slate-600 hover:bg-slate-50 transition-all w-full sm:w-auto">
                  <div className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center">
                    <Play className="w-5 h-5 text-emerald-600 fill-emerald-600" />
                  </div>
                  Watch Demo
                </button>
              </div>
              <div className="mt-16 flex flex-col items-center gap-6">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <img 
                      key={i}
                      src={`https://picsum.photos/seed/user${i}/100/100`} 
                      alt="User" 
                      className="w-12 h-12 rounded-full border-2 border-white shadow-md"
                      referrerPolicy="no-referrer"
                    />
                  ))}
                </div>
                <p className="text-base text-slate-500">
                  Join <span className="font-bold text-slate-900">2,000+</span> shop owners growing with us
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="relative w-full max-w-5xl"
            >
              <div className="absolute -inset-10 bg-emerald-500/10 blur-[100px] rounded-full" />
              <div className="relative bg-slate-900 rounded-[3rem] p-4 shadow-2xl border border-slate-800">
                <img 
                  src="https://images.unsplash.com/photo-1556740749-887f6717d7e4?q=80&w=2000&h=1000&auto=format&fit=crop" 
                  alt="Happy shopkeeper doing billing" 
                  className="rounded-[2rem] shadow-lg w-full object-cover aspect-[21/9]"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute -bottom-10 -right-10 bg-white p-8 rounded-[2.5rem] shadow-2xl border border-slate-100 hidden lg:block">
                  <div className="flex items-center gap-6 mb-6">
                    <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center">
                      <TrendingUp className="w-8 h-8 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Monthly Sales</p>
                      <p className="text-3xl font-black text-slate-900">₹4,52,000</p>
                    </div>
                  </div>
                  <div className="w-64 h-3 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "75%" }}
                      transition={{ duration: 2, delay: 1.5 }}
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
      <section id="benefits" className="py-24 bg-slate-50 relative overflow-hidden">
        <CubeBackground />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-sm font-bold text-emerald-600 uppercase tracking-[0.2em] mb-4">Why Choose Us</h2>
            <h3 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              <ParticleText text="Everything you need to run your shop efficiently" />
            </h3>
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
              >
                <GlowCard className="h-full">
                  <div className="bg-white p-8 h-full group-hover:bg-white/90 transition-colors">
                    <div className={`w-14 h-14 ${benefit.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      {benefit.icon}
                    </div>
                    <h4 className="text-xl font-bold mb-4">{benefit.title}</h4>
                    <p className="text-slate-600 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </GlowCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative overflow-hidden">
        <CubeBackground />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold text-emerald-600 uppercase tracking-[0.2em] mb-4">Advanced Features</h2>
            <h3 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              <ParticleText text="Powerful tools for your business growth" />
            </h3>
            <p className="text-lg text-slate-600">
              Everything you need to manage your shop, from billing to inventory, all in one place.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Smart Invoicing", desc: "One-click invoice generation with automatic GST breakdown.", icon: <Zap className="w-6 h-6 text-yellow-500" /> },
              { title: "Expense Tracking", desc: "Monitor your spending and identify cost-saving opportunities.", icon: <TrendingUp className="w-6 h-6 text-emerald-500" /> },
              { title: "Customer Portal", desc: "Give your customers a professional experience with digital receipts.", icon: <Users className="w-6 h-6 text-blue-500" /> },
              { title: "Mobile App", desc: "Manage your business on the go with our dedicated mobile app.", icon: <Smartphone className="w-6 h-6 text-indigo-500" /> },
              { title: "Inventory Alerts", desc: "Get notified when stock is low so you never run out of items.", icon: <Package className="w-6 h-6 text-orange-500" /> },
              { title: "Secure Backup", desc: "Your data is backed up daily with bank-grade encryption.", icon: <ShieldCheck className="w-6 h-6 text-emerald-500" /> }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <GlowCard className="h-full">
                  <div className="bg-slate-50 p-8 h-full group-hover:bg-white transition-all">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                      {feature.icon}
                    </div>
                    <h4 className="font-bold text-xl mb-3">{feature.title}</h4>
                    <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                  </div>
                </GlowCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <CubeBackground />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full">
          <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/10 blur-[120px] -ml-48 -mt-48" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 blur-[120px] -mr-48 -mb-48" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-[0.2em] mb-4">Pricing Plans</h2>
            <h3 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-[#f2800f]">
              <ParticleText text="Simple, transparent pricing" />
            </h3>
            <p className="text-lg text-slate-400">
              Choose the plan that's right for your business. No hidden fees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Starter",
                price: "0",
                desc: "Perfect for new shops starting their digital journey.",
                features: ["7-Day Free Trial", "Up to 100 Invoices/mo", "Basic Inventory", "1 Staff User"],
                button: "Start Free Trial",
                popular: false
              },
              {
                name: "Standard",
                price: "499",
                desc: "The most popular choice for growing retail businesses.",
                features: ["Up to 1,000 Invoices/mo", "Full Inventory Management", "Up to 3 Staff Users", "GST Reports & Filing Ready", "WhatsApp Support", "Mobile App Access"],
                button: "Get Started",
                popular: true
              },
              {
                name: "Enterprise",
                price: "999",
                desc: "Advanced features for large shops and multiple branches.",
                features: ["Everything in Standard", "Multi-Shop Support (3 Tenants)", "Up to 10 Staff Users", "Advanced Sales Analytics", "Dedicated Account Manager", "Custom Branding"],
                button: "Contact Sales",
                popular: false
              }
            ].map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={plan.popular ? 'scale-105 z-20' : ''}
              >
                <GlowCard className="h-full">
                  <div className={`p-8 md:p-10 h-full transition-all flex flex-col ${
                    plan.popular 
                      ? 'bg-white text-slate-900' 
                      : 'bg-slate-800 text-white hover:bg-slate-800/80'
                  }`}>
                    {plan.popular && (
                      <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest z-30">
                        Most Popular
                      </div>
                    )}
                    
                    <div className="mb-8">
                      <h4 className={`text-2xl font-bold mb-2 ${plan.popular ? 'text-slate-900' : 'text-white'}`}>{plan.name}</h4>
                      <p className={`text-sm ${plan.popular ? 'text-slate-500' : 'text-slate-400'}`}>{plan.desc}</p>
                    </div>

                    <div className="mb-8 flex items-baseline gap-1">
                      <span className={`text-5xl font-black ${plan.popular ? 'text-slate-900' : 'text-white'}`}>₹{plan.price}</span>
                      <span className={plan.popular ? 'text-slate-500' : 'text-slate-400'}>/month</span>
                    </div>

                    <ul className="space-y-4 mb-10 flex-1">
                      {plan.features.map((feature, j) => (
                        <li key={j} className="flex items-center gap-3 text-sm">
                          <CheckCircle2 className={`w-5 h-5 shrink-0 ${plan.popular ? 'text-emerald-500' : 'text-emerald-400'}`} />
                          <span className={plan.popular ? 'text-slate-600' : 'text-slate-300'}>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={onGetStarted}
                      className={`w-full py-4 rounded-2xl font-bold transition-all active:scale-95 ${
                        plan.popular
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-600/20'
                          : 'bg-white text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      {plan.button}
                    </button>
                  </div>
                </GlowCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold text-emerald-600 uppercase tracking-[0.2em] mb-4">Success Stories</h2>
            <h3 className="text-4xl font-bold mb-6 tracking-tight">See how businesses are growing with Johar Billing</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Ranchi Electronics",
                metric: "30% Increase in Sales",
                desc: "Streamlined their inventory and billing, leading to faster checkout times and happier customers.",
                image: "https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&q=80&w=800"
              },
              {
                title: "Jamshedpur Mart",
                metric: "50% Less Inventory Loss",
                desc: "Real-time stock tracking helped them identify and reduce wastage significantly.",
                image: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=800"
              },
              {
                title: "Dhanbad Pharmacy",
                metric: "Zero GST Errors",
                desc: "Automated tax calculations ensured 100% compliance and stress-free filing.",
                image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=800"
              }
            ].map((study, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <GlowCard className="h-full">
                  <div className="bg-white h-full overflow-hidden group-hover:bg-white/95 transition-all">
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={study.image} 
                        alt={study.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="p-6">
                      <h4 className="text-xl font-bold mb-2">{study.title}</h4>
                      <p className="text-emerald-600 font-bold text-sm mb-4">{study.metric}</p>
                      <p className="text-slate-600 text-sm leading-relaxed">{study.desc}</p>
                      <button className="mt-4 text-emerald-600 text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
                        Read Case Study <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </GlowCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold text-emerald-600 uppercase tracking-[0.2em] mb-4">Testimonials</h2>
            <h3 className="text-4xl font-bold mb-6 tracking-tight">Trusted by shop owners like you</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "Johar Billing has completely transformed how I manage my shop. It's so easy to use, even my staff learned it in a day.",
                author: "Rajesh Kumar",
                role: "Owner, Kumar General Store",
                image: "https://randomuser.me/api/portraits/men/32.jpg"
              },
              {
                quote: "The best part is the mobile app. I can check my sales from home. Highly recommended for every shopkeeper in Jharkhand.",
                author: "Amit Singh",
                role: "Director, Singh Hardware",
                image: "https://randomuser.me/api/portraits/men/45.jpg"
              },
              {
                quote: "Customer support is excellent. Whenever I have a doubt, they help me immediately. The GST reports are a lifesaver.",
                author: "Priya Sharma",
                role: "Manager, Sharma Boutique",
                image: "https://randomuser.me/api/portraits/women/44.jpg"
              }
            ].map((testimonial, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <GlowCard className="h-full">
                  <div className="bg-white p-8 h-full relative group-hover:bg-white/95 transition-all">
                    <div className="absolute top-8 right-8 text-emerald-100">
                      <MessageSquare className="w-12 h-12" />
                    </div>
                    <div className="flex gap-1 mb-6">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <p className="text-slate-600 mb-8 relative z-10">"{testimonial.quote}"</p>
                    <div className="flex items-center gap-4">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.author} 
                        className="w-12 h-12 rounded-full border-2 border-emerald-100"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <p className="font-bold text-slate-900">{testimonial.author}</p>
                        <p className="text-xs text-slate-500">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </GlowCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio / Industries Section */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-[0.2em] mb-4">Industries</h2>
            <h3 className="text-4xl font-bold mb-6 tracking-tight">Perfect for any business type</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: <Package className="w-8 h-8" />, name: "Retail Stores" },
              { icon: <Smartphone className="w-8 h-8" />, name: "Electronics" },
              { icon: <ShieldCheck className="w-8 h-8" />, name: "Pharmacy" },
              { icon: <Briefcase className="w-8 h-8" />, name: "Services" },
              { icon: <Building2 className="w-8 h-8" />, name: "Wholesale" },
              { icon: <Users className="w-8 h-8" />, name: "Restaurants" },
              { icon: <TrendingUp className="w-8 h-8" />, name: "Supermarkets" },
              { icon: <Zap className="w-8 h-8" />, name: "Hardware" }
            ].map((industry, i) => (
              <motion.div 
                key={i}
                whileHover={{ scale: 1.05 }}
              >
                <GlowCard className="h-full">
                  <div className="bg-slate-800 p-6 h-full flex flex-col items-center justify-center gap-4 text-center hover:bg-slate-700 transition-colors">
                    <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400">
                      {industry.icon}
                    </div>
                    <p className="font-bold text-lg">{industry.name}</p>
                  </div>
                </GlowCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-emerald-600 uppercase tracking-[0.2em] mb-4">FAQ</h2>
            <h3 className="text-4xl font-bold mb-6 tracking-tight">Frequently Asked Questions</h3>
          </div>
          <div className="space-y-4">
            {[
              { q: "Is Johar Billing GST compliant?", a: "Yes, our software is fully GST compliant. It automatically calculates CGST, SGST, and IGST based on your products and generates GST-ready invoices and reports." },
              { q: "Can I use it offline?", a: "Yes! Johar Billing works in a hybrid mode. You can continue billing even without internet, and your data will sync automatically when you're back online." },
              { q: "Is there a mobile app available?", a: "Absolutely. We have a dedicated mobile app for both Android and iOS, allowing you to manage your business from anywhere." },
              { q: "How secure is my data?", a: "We use bank-grade encryption to protect your data. Your information is stored securely on cloud servers with regular backups." },
              { q: "Do you offer support?", a: "Yes, we offer dedicated support via phone, email, and chat. Our team is available to help you with any questions or issues." }
            ].map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between font-bold text-slate-900 hover:bg-slate-50 transition-colors"
                >
                  {faq.q}
                  {openFaq === i ? <ChevronUp className="w-5 h-5 text-emerald-600" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </button>
                <motion.div 
                  initial={false}
                  animate={{ height: openFaq === i ? 'auto' : 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-50 pt-4">
                    {faq.a}
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-sm font-bold text-emerald-600 uppercase tracking-[0.2em] mb-4">Contact Us</h2>
              <h3 className="text-4xl font-bold mb-6 tracking-tight">Get in touch with our team</h3>
              <p className="text-lg text-slate-600 mb-12">
                Have questions about Johar Billing? We're here to help. Fill out the form or reach out to us directly.
              </p>
              
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Visit Us</h4>
                    <p className="text-slate-600">123 Main Road, Ranchi, Jharkhand 834001</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Email Us</h4>
                    <p className="text-slate-600">support@joharbilling.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Call Us</h4>
                    <p className="text-slate-600">+91 98765 43210</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">First Name</label>
                    <input type="text" className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-emerald-500/20" placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Last Name</label>
                    <input type="text" className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-emerald-500/20" placeholder="Doe" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Email Address</label>
                  <input type="email" className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-emerald-500/20" placeholder="john@example.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Message</label>
                  <textarea rows={4} className="w-full px-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-emerald-500/20" placeholder="How can we help you?" />
                </div>
                <button type="submit" className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2">
                  Send Message <Send className="w-4 h-4" />
                </button>
              </form>
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
                Join thousands of successful shop owners in Jharkhand. Start your 7-day free trial today. No credit card required.
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
            <button onClick={() => setActivePolicy('privacy')} className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Privacy Policy</button>
            <button onClick={() => setActivePolicy('terms')} className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Terms of Service</button>
            <button onClick={() => setActivePolicy('refund')} className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Refund Policy</button>
          </div>
        </div>
      </footer>
      <PolicyModal
        isOpen={activePolicy === 'privacy'}
        onClose={() => setActivePolicy(null)}
        title="Privacy Policy"
      >
        <p>At Johar Billing, we take your privacy seriously. This Privacy Policy describes how we collect, use, and protect your personal information.</p>
        <h3 className="text-lg font-bold text-slate-900 mt-4">Information We Collect</h3>
        <p>We collect information you provide directly to us, such as when you create an account, subscribe to our service, or contact us for support. This may include your name, email address, phone number, and business details.</p>
        <h3 className="text-lg font-bold text-slate-900 mt-4">How We Use Your Information</h3>
        <p>We use your information to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, and communicate with you about products, services, and events.</p>
        <h3 className="text-lg font-bold text-slate-900 mt-4">Data Security</h3>
        <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
      </PolicyModal>

      <PolicyModal
        isOpen={activePolicy === 'terms'}
        onClose={() => setActivePolicy(null)}
        title="Terms of Service"
      >
        <p>Welcome to Johar Billing. By accessing or using our website and services, you agree to be bound by these Terms of Service.</p>
        <h3 className="text-lg font-bold text-slate-900 mt-4">Use of Service</h3>
        <p>You must be at least 18 years old to use our services. You agree to use the service only for lawful purposes and in accordance with these Terms.</p>
        <h3 className="text-lg font-bold text-slate-900 mt-4">Account Security</h3>
        <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
        <h3 className="text-lg font-bold text-slate-900 mt-4">Intellectual Property</h3>
        <p>The service and its original content, features, and functionality are and will remain the exclusive property of Johar Billing and its licensors.</p>
      </PolicyModal>

      <PolicyModal
        isOpen={activePolicy === 'refund'}
        onClose={() => setActivePolicy(null)}
        title="Refund Policy"
      >
        <p>We want you to be completely satisfied with Johar Billing. If you are not satisfied with our service, please review our refund policy below.</p>
        <h3 className="text-lg font-bold text-slate-900 mt-4">Free Trial</h3>
        <p>We offer a 7-day free trial for all new users. You can cancel anytime during the trial period without being charged.</p>
        <h3 className="text-lg font-bold text-slate-900 mt-4">Subscription Refunds</h3>
        <p>For paid subscriptions, we generally do not offer refunds for partial months or years of service. However, if you believe you have been charged in error or have a special circumstance, please contact our support team.</p>
        <h3 className="text-lg font-bold text-slate-900 mt-4">Cancellation</h3>
        <p>You can cancel your subscription at any time from your account settings. Your access will continue until the end of your current billing period.</p>
      </PolicyModal>
    </div>
  );
}
