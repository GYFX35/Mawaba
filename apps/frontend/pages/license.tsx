import type { NextPage } from 'next';
import Head from 'next/head';
import { Shield } from 'lucide-react';

const LicensePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>MIT License | Mawaba</title>
      </Head>

      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 md:p-12 rounded-3xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-100 p-3 rounded-2xl">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900">MIT License</h1>
                <p className="text-sm text-gray-500">Open Source Software License</p>
              </div>
            </div>

            <hr className="border-gray-200 my-6" />

            <div className="prose prose-blue text-gray-600 space-y-4">
              <p className="font-semibold text-gray-900">Copyright (c) 2026 Mawaba</p>

              <p className="leading-relaxed">
                Permission is hereby granted, free of charge, to any person obtaining a copy
                of this software and associated documentation files (the &quot;Software&quot;), to deal
                in the Software without restriction, including without limitation the rights
                to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
                copies of the Software, and to permit persons to whom the Software is
                furnished to do so, subject to the following conditions:
              </p>

              <p className="leading-relaxed">
                The above copyright notice and this permission notice shall be included in all
                copies or substantial portions of the Software.
              </p>

              <p className="leading-relaxed bg-red-50 text-red-900 p-6 rounded-2xl border border-red-100 font-mono text-xs uppercase tracking-wider">
                THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
                IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
                FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
                AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
                LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
                OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
                SOFTWARE.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LicensePage;
