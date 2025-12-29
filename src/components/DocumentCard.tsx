import { Download, ExternalLink, FileText, Presentation, TrendingUp, FileCheck, Building } from 'lucide-react';
import { InvestorDocument } from '../data/investorDocs';

interface DocumentCardProps {
  document: InvestorDocument;
}

const iconMap = {
  'file-text': FileText,
  'presentation': Presentation,
  'trending-up': TrendingUp,
  'file-check': FileCheck,
  'building': Building,
};

export const DocumentCard = ({ document }: DocumentCardProps) => {
  const IconComponent = iconMap[document.icon as keyof typeof iconMap] || FileText;

  const handleView = () => {
    window.open(document.filePath, '_blank');
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = document.filePath;
    link.download = document.filePath.split('/').pop() || 'document.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="group bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 transition-all duration-300 hover:border-teal-400/50 hover:shadow-lg hover:shadow-teal-500/10 hover:-translate-y-1">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-lg flex items-center justify-center border border-teal-400/30 group-hover:border-teal-400/50 transition-colors">
          <IconComponent className="w-6 h-6 text-teal-400" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white mb-1">
            {document.name}
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            {document.description}
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleView}
              className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              View Online
            </button>

            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
