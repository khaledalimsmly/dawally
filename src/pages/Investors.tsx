import { useState, FormEvent } from 'react';
import { Lock, AlertCircle, Shield } from 'lucide-react';
import { DocumentCard } from '../components/DocumentCard';
import { investorDocuments, documentCategories } from '../data/investorDocs';

const INVESTOR_PASSWORD = 'dawally2025';

export const Investors = () => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('investor_auth') === 'true';
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (password === INVESTOR_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('investor_auth', 'true');
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-full border border-teal-400/30 mb-4">
              <Lock className="w-8 h-8 text-teal-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Investor Portal
            </h1>
            <p className="text-gray-400">
              Enter password to access confidential resources
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Access Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Enter password"
                required
              />
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full px-4 py-3 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-lg transition-colors"
            >
              Access Portal
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            This portal contains confidential information. Unauthorized access is prohibited.
          </p>
        </div>
      </div>
    );
  }

  const documentsByCategory = investorDocuments.reduce((acc, doc) => {
    if (!acc[doc.category]) {
      acc[doc.category] = [];
    }
    acc[doc.category].push(doc);
    return acc;
  }, {} as Record<string, typeof investorDocuments>);

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">
              DAWALLY — Investor Resources
            </h1>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 max-w-3xl">
            <p className="text-amber-200 text-sm leading-relaxed">
              <strong>Confidential Information:</strong> The documents provided in this portal contain proprietary and confidential information about DAWALLY.
              By accessing these materials, you agree to maintain their confidentiality and use them solely for evaluation purposes.
            </p>
          </div>
        </div>

        <div className="space-y-12">
          {Object.entries(documentsByCategory).map(([category, docs]) => (
            <section key={category}>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="h-1 w-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full"></div>
                {documentCategories[category as keyof typeof documentCategories]}
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {docs.map((doc) => (
                  <DocumentCard key={doc.id} document={doc} />
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-gray-500">
            <Lock className="w-4 h-4" />
            <span>All documents are confidential and protected</span>
          </div>
        </div>
      </div>
    </div>
  );
};
