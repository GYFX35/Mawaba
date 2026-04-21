import type { NextPage } from 'next';
import Head from 'next/head';
import { Briefcase, MessageCircle, Share2, TrendingUp, Cpu, Globe } from 'lucide-react';

const ServicesPage: NextPage = () => {
  const services = [
    {
      title: "Business Promotion",
      desc: "Connect with global markets and investors through our AI-curated networking feeds.",
      icon: <Briefcase className="h-10 w-10 text-blue-600" />
    },
    {
      title: "Idea Publishing",
      desc: "Share your developmental ideas and receive peer reviews from experts in various fields.",
      icon: <Share2 className="h-10 w-10 text-blue-600" />
    },
    {
      title: "Real-time Collaboration",
      desc: "Instant messaging and collaborative workspace for international partnerships.",
      icon: <MessageCircle className="h-10 w-10 text-blue-600" />
    },
    {
      title: "Growth Analytics",
      desc: "Track the impact of your ideas and business reach with detailed dashboard insights.",
      icon: <TrendingUp className="h-10 w-10 text-blue-600" />
    },
    {
      title: "AI Business Assistant",
      desc: "Leverage Langchain and Langflow to automate your business processes and customer interactions.",
      icon: <Cpu className="h-10 w-10 text-blue-600" />
    },
    {
      title: "Global POS Integration",
      desc: "Seamlessly connect with NCR, Square, Toast, and other global commerce platforms.",
      icon: <Globe className="h-10 w-10 text-blue-600" />
    }
  ];

  return (
    <>
      <Head>
        <title>Our Services | Mawaba</title>
      </Head>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">What We Offer</h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">Providing the tools and the network for a smarter, more connected world.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {services.map((service, idx) => (
              <div key={idx} className="flex gap-6 p-8 rounded-3xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300">
                <div className="bg-blue-50 p-4 h-fit rounded-2xl">
                  {service.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-gray-500 leading-relaxed text-lg">{service.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default ServicesPage;
