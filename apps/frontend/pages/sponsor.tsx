import type { NextPage } from 'next';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import {
  Heart,
  ShieldCheck,
  Zap,
  Award,
  ExternalLink,
  CheckCircle2,
  Globe,
  Users,
  Code,
  Building2,
  CreditCard,
  Building,
  DollarSign,
  Copy,
  Check,
  Sparkles,
  Loader2,
  ArrowRight
} from 'lucide-react';
import { getApiUrl } from '../components/apiConfig';

interface Tier {
  id: string;
  name: string;
  badge: string;
  price: string;
  numericPrice: number;
  billing: string;
  description: string;
  icon: any;
  popular?: boolean;
  benefits: string[];
  githubUrl: string;
}

interface SponsorRecord {
  id: string;
  sponsorName: string;
  tierName: string;
  tierId: string;
  amount: number;
  billingCycle: string;
  paymentMethod: string;
  status: string;
  timestamp: string;
}

const tiers: Tier[] = [
  {
    id: 'individual',
    name: 'Individual Supporter',
    badge: '🥉 Supporter',
    price: '$5',
    numericPrice: 5,
    billing: 'per month',
    description: 'Perfect for passionate developers & open source advocates.',
    icon: Heart,
    benefits: [
      'Official Sponsor badge on GitHub profile',
      'Name listed in GitHub README & Contributors Hall of Fame',
      'Exclusive Supporter role in community channels',
      'Direct updates on new releases & features'
    ],
    githubUrl: 'https://github.com/sponsors/mawaba?frequency=one-time&sponsor=mawaba'
  },
  {
    id: 'developer',
    name: 'Developer Champion',
    badge: '🥈 Champion',
    price: '$25',
    numericPrice: 25,
    billing: 'per month',
    description: 'For power users and active open-source contributors.',
    icon: Code,
    popular: true,
    benefits: [
      'All Individual Supporter benefits',
      'Priority issue review & feature suggestions',
      'Early access to beta AI models & microservice modules',
      'Access to exclusive monthly engineering office hours'
    ],
    githubUrl: 'https://github.com/sponsors/mawaba'
  },
  {
    id: 'corporate',
    name: 'Corporate Partner',
    badge: '🥇 Corporate',
    price: '$250',
    numericPrice: 250,
    billing: 'per month',
    description: 'For tech companies & organizations leveraging Mawaba.',
    icon: Building2,
    benefits: [
      'All Developer Champion benefits',
      'Logo placement on README.md, homepage & documentation',
      'Bi-annual technical workshop & Q&A with core team',
      'Custom API integration & architecture consultation'
    ],
    githubUrl: 'https://github.com/sponsors/mawaba'
  },
  {
    id: 'strategic',
    name: 'Strategic Global Partner',
    badge: '💎 Strategic',
    price: '$1,000',
    numericPrice: 1000,
    billing: 'per month',
    description: 'For enterprises driving global tech & educational impact.',
    icon: Globe,
    benefits: [
      'All Corporate Partner benefits',
      'Premier top-tier logo positioning across all platforms',
      'Joint marketing blog post, PR release & GitHub Partner story',
      'Guest invitation to quarterly open-source advisory board'
    ],
    githubUrl: 'https://github.com/sponsors/mawaba'
  }
];

const SponsorPage: NextPage = () => {
  const [selectedTier, setSelectedTier] = useState<string>('developer');
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'card' | 'bank_transfer'>('stripe');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'one-time'>('monthly');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [sponsorName, setSponsorName] = useState<string>('');
  const [sponsorEmail, setSponsorEmail] = useState<string>('');

  // Credit Card fields
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardExpiry, setCardExpiry] = useState<string>('');
  const [cardCvc, setCardCvc] = useState<string>('');

  // API State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [checkoutResult, setCheckoutResult] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [copiedRef, setCopiedRef] = useState<boolean>(false);

  // Live Sponsors & Metrics state
  const [sponsorsList, setSponsorsList] = useState<SponsorRecord[]>([]);
  const [totalRaised, setTotalRaised] = useState<number>(1275);
  const [activeCount, setActiveCount] = useState<number>(3);

  useEffect(() => {
    fetchSponsors();
  }, []);

  const fetchSponsors = async () => {
    try {
      const res = await fetch(getApiUrl('/api/sponsorship/sponsors'));
      if (res.ok) {
        const data = await res.json();
        if (data.sponsors) setSponsorsList(data.sponsors);
        if (data.metrics) {
          setTotalRaised(data.metrics.totalAmountRaised);
          setActiveCount(data.metrics.activeSponsorsCount);
        }
      }
    } catch (err) {
      console.warn('Could not load live sponsors list', err);
    }
  };

  const currentTierObj = tiers.find(t => t.id === selectedTier) || tiers[1];
  const payableAmount = customAmount ? parseFloat(customAmount) || 0 : currentTierObj.numericPrice;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setCheckoutResult(null);

    if (!sponsorName.trim() || !sponsorEmail.trim()) {
      setErrorMessage('Please enter your full name and valid email address.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(getApiUrl('/api/sponsorship/checkout'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sponsorName,
          sponsorEmail,
          tierId: selectedTier,
          customAmount: customAmount ? parseFloat(customAmount) : undefined,
          billingCycle,
          paymentMethod,
          cardNumber: paymentMethod === 'card' ? cardNumber : undefined,
          cardExpiry: paymentMethod === 'card' ? cardExpiry : undefined,
          cardCvc: paymentMethod === 'card' ? cardCvc : undefined
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to process sponsorship payment');
      }

      setCheckoutResult(data);
      fetchSponsors(); // Refresh list after new sponsor transaction
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during checkout');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  return (
    <>
      <Head>
        <title>Sponsorship & GitHub Partnerships | Mawaba</title>
        <meta name="description" content="Support Mawaba's open-source AI, climate, education, and global development platform via GitHub Sponsors and GitHub Partnerships." />
      </Head>

      {/* Hero Section */}
      <section className="relative py-20 bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs font-semibold uppercase tracking-wider mb-6">
              <Heart className="h-4 w-4 fill-pink-500 text-pink-500" /> GitHub Sponsors & Partner Program
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
              Fuel Open Innovation & Global Impact
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed mb-8">
              Mawaba empowers millions across AI tutoring, climate action, educational tools, and cultural heritage. Support our open-source mission through GitHub Funding tools.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://github.com/sponsors/mawaba"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-sm shadow-lg shadow-pink-600/30 transition-all transform hover:-translate-y-0.5"
              >
                <Heart className="h-5 w-5 fill-white" /> Sponsor on GitHub
                <ExternalLink className="h-4 w-4" />
              </a>
              <a
                href="#tiers"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-sm transition-all"
              >
                View Sponsorship Tiers
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Why Sponsor Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Sponsor Mawaba?</h2>
            <p className="text-slate-600">
              Your financial contributions directly sustain infrastructure, fund AI tutor API tokens, support open-source grants, and keep educational tools free worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Sustain AI Infrastructure</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Provide essential API bandwidth and LLM compute resources so learners in under-resourced regions get instant AI tutoring.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-12 h-12 bg-emerald-600/10 rounded-xl flex items-center justify-center text-emerald-600 mb-6">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Climate & Impact Tech</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Accelerate climate action apps, CO2 calculation tools, and global development modules accessible without subscription paywalls.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-12 h-12 bg-purple-600/10 rounded-xl flex items-center justify-center text-purple-600 mb-6">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Empower Developers</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Empower open-source developers through micro-grants, hackathons, and global open API toolsets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tiers Section */}
      <section id="tiers" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-4">
              <Award className="h-4 w-4" /> Sponsorship Tiers
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Choose Your Impact Tier</h2>
            <p className="text-slate-600">
              Select a tier that matches your goals—from individual community support to corporate GitHub partnership.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {tiers.map((tier) => {
              const Icon = tier.icon;
              const isSelected = selectedTier === tier.id;
              return (
                <div
                  key={tier.id}
                  onClick={() => setSelectedTier(tier.id)}
                  className={`relative cursor-pointer rounded-2xl bg-white p-8 flex flex-col justify-between transition-all duration-200 border ${
                    isSelected
                      ? 'border-pink-500 ring-2 ring-pink-500/20 shadow-xl'
                      : tier.popular
                      ? 'border-blue-500 shadow-md'
                      : 'border-slate-200 hover:border-slate-300 shadow-sm'
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow">
                      Most Popular
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
                        {tier.badge}
                      </span>
                      <Icon className="h-6 w-6 text-slate-500" />
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 mb-2">{tier.name}</h3>
                    <p className="text-slate-500 text-xs mb-6 h-10">{tier.description}</p>

                    <div className="mb-6">
                      <span className="text-4xl font-extrabold text-slate-900">{tier.price}</span>
                      <span className="text-slate-500 text-xs ml-1">/{tier.billing}</span>
                    </div>

                    <ul className="space-y-3 mb-8 text-xs text-slate-600 border-t border-slate-100 pt-6">
                      {tier.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-pink-500 shrink-0 mt-0.5" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <a
                    href={tier.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full text-center py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                      isSelected || tier.popular
                        ? 'bg-pink-600 hover:bg-pink-500 text-white shadow'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                    }`}
                  >
                    <Heart className="h-3.5 w-3.5 fill-current" />
                    Select {tier.name}
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Direct Checkout & Sponsorship Modal Section */}
      <section id="checkout" className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-50 text-pink-700 border border-pink-200 text-xs font-semibold uppercase tracking-wider mb-4">
              <Sparkles className="h-4 w-4" /> Multi-Method Sponsorship Checkout
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Complete Your Sponsorship</h2>
            <p className="text-slate-600 text-sm">
              Sponsor via <strong>Stripe</strong>, <strong>Credit/Debit Cards</strong>, or <strong>Direct Bank Transfer</strong>.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-lg">
            {/* Step 1: Billing Frequency & Selected Tier Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200 mb-8">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Selected Tier</span>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-slate-900">{currentTierObj.name}</span>
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-pink-100 text-pink-700">
                    {currentTierObj.badge}
                  </span>
                </div>
              </div>

              <div className="flex items-center bg-slate-200 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    billingCycle === 'monthly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Monthly Recurring
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle('one-time')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    billingCycle === 'one-time' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  One-Time Contribution
                </button>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="mb-8">
              <label className="block text-xs font-bold uppercase text-slate-600 tracking-wider mb-3">
                Select Payment Method
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => { setPaymentMethod('stripe'); setCheckoutResult(null); }}
                  className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all text-center ${
                    paymentMethod === 'stripe'
                      ? 'border-pink-500 bg-pink-50/50 ring-2 ring-pink-500/20 text-pink-900 font-bold'
                      : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <CreditCard className="h-6 w-6 text-indigo-600" />
                  <span className="text-xs">Stripe Checkout</span>
                  <span className="text-[10px] text-slate-500 font-normal">Card / Apple Pay / Google Pay</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setPaymentMethod('card'); setCheckoutResult(null); }}
                  className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all text-center ${
                    paymentMethod === 'card'
                      ? 'border-pink-500 bg-pink-50/50 ring-2 ring-pink-500/20 text-pink-900 font-bold'
                      : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <CreditCard className="h-6 w-6 text-pink-600" />
                  <span className="text-xs">Credit / Debit Card</span>
                  <span className="text-[10px] text-slate-500 font-normal">Direct Instant Processing</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setPaymentMethod('bank_transfer'); setCheckoutResult(null); }}
                  className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all text-center ${
                    paymentMethod === 'bank_transfer'
                      ? 'border-pink-500 bg-pink-50/50 ring-2 ring-pink-500/20 text-pink-900 font-bold'
                      : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <Building className="h-6 w-6 text-emerald-600" />
                  <span className="text-xs">Bank Wire Transfer</span>
                  <span className="text-[10px] text-slate-500 font-normal">SEPA / ACH / SWIFT</span>
                </button>
              </div>
            </div>

            {/* Checkout Form */}
            <form onSubmit={handleCheckout} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Sponsor Full Name / Organization *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme Corp or Jane Doe"
                    value={sponsorName}
                    onChange={(e) => setSponsorName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Sponsor Contact Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. sponsor@domain.org"
                    value={sponsorEmail}
                    onChange={(e) => setSponsorEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Custom Contribution Amount (Optional)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="number"
                    min="1"
                    placeholder={`Default tier price: $${currentTierObj.numericPrice}`}
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>

              {/* Card Details when Card method selected */}
              {paymentMethod === 'card' && (
                <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-pink-600" /> Card Details
                  </h4>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Card Number</label>
                    <input
                      type="text"
                      placeholder="4532 •••• •••• 8892"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        placeholder="12/28"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-pink-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">CVC Code</label>
                      <input
                        type="text"
                        placeholder="123"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-pink-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {errorMessage && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-pink-600 hover:bg-pink-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-pink-600/25 flex items-center justify-center gap-2 transition-all"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" /> Processing Payment...
                  </>
                ) : (
                  <>
                    <Heart className="h-5 w-5 fill-white" /> Complete ${payableAmount} {billingCycle === 'monthly' ? '/ Month' : ''} Sponsorship
                  </>
                )}
              </button>
            </form>

            {/* Checkout Confirmation Output */}
            {checkoutResult && (
              <div className="mt-8 p-6 rounded-2xl bg-slate-900 text-white space-y-4 animate-fadeIn">
                <div className="flex items-center gap-3 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="h-6 w-6 shrink-0" />
                  <span>{checkoutResult.message}</span>
                </div>

                {checkoutResult.checkoutUrl && (
                  <div className="pt-2">
                    <p className="text-xs text-slate-300 mb-3">Redirecting to secure Stripe Checkout endpoint...</p>
                    <a
                      href={checkoutResult.checkoutUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all"
                    >
                      Open Stripe Session <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                )}

                {checkoutResult.receiptNumber && (
                  <div className="text-xs text-slate-300 space-y-1">
                    <p><strong>Receipt Reference:</strong> {checkoutResult.receiptNumber}</p>
                    <p><strong>Status:</strong> Active & Confirmed</p>
                  </div>
                )}

                {checkoutResult.bankDetails && (
                  <div className="p-4 rounded-xl bg-slate-800 border border-slate-700 text-xs space-y-2 mt-4">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-pink-400">Direct Wire Transfer Information</span>
                      <button
                        onClick={() => copyToClipboard(checkoutResult.bankDetails.reference)}
                        className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white"
                      >
                        {copiedRef ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                        {copiedRef ? 'Copied' : 'Copy Reference'}
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300 pt-2 border-t border-slate-700">
                      <div><strong>Account Name:</strong> {checkoutResult.bankDetails.accountName}</div>
                      <div><strong>Bank:</strong> {checkoutResult.bankDetails.bankName}</div>
                      <div><strong>IBAN:</strong> {checkoutResult.bankDetails.iban}</div>
                      <div><strong>SWIFT/BIC:</strong> {checkoutResult.bankDetails.swiftBic}</div>
                      <div className="sm:col-span-2 text-yellow-400 font-bold pt-1">
                        Required Wire Reference Code: {checkoutResult.bankDetails.reference}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Live Sponsors Hall of Fame */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
            <div>
              <span className="px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-xs font-semibold uppercase tracking-wider inline-block mb-3">
                Community Impact & Backers
              </span>
              <h2 className="text-3xl font-extrabold">Sponsorship Hall of Fame</h2>
              <p className="text-slate-400 text-sm mt-1">
                Honoring organizations & leaders fueling open-source development globally.
              </p>
            </div>

            <div className="flex items-center gap-6 bg-slate-800/80 px-6 py-4 rounded-2xl border border-slate-700">
              <div>
                <span className="text-xs text-slate-400 block">Total Funds Raised</span>
                <span className="text-2xl font-extrabold text-pink-400">${totalRaised.toLocaleString()}</span>
              </div>
              <div className="w-px h-8 bg-slate-700"></div>
              <div>
                <span className="text-xs text-slate-400 block">Active Backers</span>
                <span className="text-2xl font-extrabold text-white">{activeCount}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sponsorsList.map((s) => (
              <div
                key={s.id}
                className="p-6 rounded-2xl bg-slate-800 border border-slate-700 flex flex-col justify-between hover:border-slate-600 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold px-2.5 py-1 rounded bg-slate-700 text-pink-300">
                      {s.tierName}
                    </span>
                    <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                      {s.paymentMethod.replace('_', ' ')}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{s.sponsorName}</h3>
                  <p className="text-xs text-slate-400 mb-4">
                    Contributed ${s.amount} ({s.billingCycle})
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Status: <strong className="text-emerald-400 font-semibold">{s.status}</strong></span>
                  <span>{new Date(s.timestamp).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GitHub Partnership Banner */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-slate-900 to-blue-950 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-semibold rounded-full uppercase tracking-wider">
                Enterprise & GitHub Partnerships
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold">Interested in Custom Partnerships or Cloud Credits?</h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                We partner with AI labs, cloud vendors, universities, and open-source foundations. Get custom integrations, co-branding opportunities, and dedicated technical advisory.
              </p>
            </div>
            <div className="shrink-0 flex flex-col sm:flex-row gap-4">
              <a
                href="mailto:partnerships@mawaba.org"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-md transition-all"
              >
                Contact Partnerships Team
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SponsorPage;
