import type { NextPage } from 'next';
import Head from 'next/head';
import { Target, Users, Lightbulb } from 'lucide-react';

const AboutPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>About Us | Mawaba</title>
      </Head>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Our Mission to Globalize Innovation</h1>
            <p className="text-xl text-gray-500 leading-relaxed">
              Mawaba is born from the vision of a world where geography doesn&apos;t limit opportunity.
              We are building a digital ecosystem that bridges the gap between great ideas and global impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-20">
            <div className="space-y-4">
              <div className="bg-blue-100 w-12 h-12 flex items-center justify-center rounded-lg">
                <Target className="text-blue-600" />
              </div>
              <h3 className="text-xl font-bold">Focus</h3>
              <p className="text-gray-500">Targeting critical sectors including health, education, and sustainable business development.</p>
            </div>
            <div className="space-y-4">
              <div className="bg-blue-100 w-12 h-12 flex items-center justify-center rounded-lg">
                <Users className="text-blue-600" />
              </div>
              <h3 className="text-xl font-bold">Community</h3>
              <p className="text-gray-500">Fostering a global community of thinkers, creators, and doers who share our vision for a better world.</p>
            </div>
            <div className="space-y-4">
              <div className="bg-blue-100 w-12 h-12 flex items-center justify-center rounded-lg">
                <Lightbulb className="text-blue-600" />
              </div>
              <h3 className="text-xl font-bold">Innovation</h3>
              <p className="text-gray-500">Integrating cutting-edge AI to streamline communication and partnership management.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
