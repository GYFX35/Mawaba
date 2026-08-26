import type { NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import { Heart, ShieldCheck, Zap, Award, ExternalLink, CheckCircle2, Globe, Users, Code, Building2 } from 'lucide-react';

interface Tier {
  id: string;
  name: string;
  badge: string;
  price: string;
  billing: string;
  description: string;
  icon: any;
  popular?: boolean;
  benefits: string[];
  githubUrl: string;
}

const tiers: Tier[] = [
  {
    id: 'individual',
    name: 'Individual Supporter',
    badge: '🥉 Supporter',
    price: '$5',
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
    billing: 'per month',
    description: 'For enterprises drive global tech & educational impact.',
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
