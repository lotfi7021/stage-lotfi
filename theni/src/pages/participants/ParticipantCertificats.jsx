import { useState, useEffect } from 'react';
import Icon from '../../components/common/Icon';
import certificationService from '../../services/certifications/certificationService';

export default function ParticipantCertificats() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const [viewMode, setViewMode] = useState('grid');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await certificationService.getAllCertifications({ participantId: currentUser.id, limit: 100 });
        const certs = (res.data || []).map((cert) => {
          const expirationDate = cert.dateExpiration ? new Date(cert.dateExpiration) : null;
          const isExpired = expirationDate ? expirationDate < new Date() : false;
          const daysUntilExpiration = expirationDate
            ? Math.ceil((expirationDate - new Date()) / (1000 * 60 * 60 * 24))
            : null;

          return {
            ...cert,
            isExpired,
            daysUntilExpiration,
            isExpiringSoon: daysUntilExpiration !== null && daysUntilExpiration <= 90 && daysUntilExpiration > 0,
          };
        });
        setCertificates(certs);
      } catch (error) {
        console.error('Error fetching certificates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser.id]);

  const filteredCertificates = certificates.filter((cert) => {
    if (filterStatus === 'valid') return !cert.isExpired;
    if (filterStatus === 'expired') return cert.isExpired;
    return true;
  });

  const downloadCertificate = (cert) => {
    alert(`Downloading certificate: ${cert.reference}`);
  };

  const verifyCertificate = (cert) => {
    alert(`Certificate verification: ${cert.qrCode || cert.reference}`);
  };

  const getStatusColor = (cert) => {
    if (cert.isExpired) return 'bg-error-container text-on-error-container border-error';
    if (cert.isExpiringSoon) return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-success-container text-on-success-container border-success';
  };

  const getStatusText = (cert) => {
    if (cert.isExpired) return 'Expired';
    if (cert.isExpiringSoon) return `Expires in ${cert.daysUntilExpiration} days`;
    return 'Valid';
  };

  const getCategoryColor = (category) => {
    const colors = {
      Safety: 'bg-error-container text-on-error-container',
      Management: 'bg-primary-container text-on-primary',
      Technical: 'bg-secondary-container text-on-secondary-container',
      IT: 'bg-primary-container text-on-primary',
    };
    return colors[category] || 'bg-surface-variant text-on-surface-variant';
  };

  const validCertificates = certificates.filter((c) => !c.isExpired).length;
  const expiredCertificates = certificates.filter((c) => c.isExpired).length;
  const expiringSoon = certificates.filter((c) => c.isExpiringSoon).length;

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-background">My Certificates</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2 max-w-2xl">
            View, download, and manage your training certificates and professional credentials.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary"
          >
            <option value="all">All Certificates</option>
            <option value="valid">Valid Only</option>
            <option value="expired">Expired Only</option>
          </select>

          <div className="flex rounded-lg border border-outline-variant overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 transition-colors ${
                viewMode === 'grid'
                  ? 'bg-primary-container text-on-primary'
                  : 'bg-surface text-on-surface hover:bg-surface-container'
              }`}
            >
              <Icon name="grid_view" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 transition-colors ${
                viewMode === 'list'
                  ? 'bg-primary-container text-on-primary'
                  : 'bg-surface text-on-surface hover:bg-surface-container'
              }`}
            >
              <Icon name="view_list" />
            </button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-5 ambient-shadow flex flex-col gap-3">
          <div className="flex justify-between items-start">
            <span className="px-2 py-1 rounded-full text-label-sm font-bold uppercase bg-primary-container text-on-primary">Total</span>
            <span className="w-2.5 h-2.5 rounded-full mt-1 bg-primary" />
          </div>
          <p className="font-display-sm text-display-sm text-on-surface font-bold">{certificates.length}</p>
          <p className="font-label-sm text-on-surface-variant">Total Certificates</p>
        </div>

        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-5 ambient-shadow flex flex-col gap-3">
          <div className="flex justify-between items-start">
            <span className="px-2 py-1 rounded-full text-label-sm font-bold uppercase bg-success-container text-on-success-container">Valid</span>
            <span className="w-2.5 h-2.5 rounded-full mt-1 bg-success" />
          </div>
          <p className="font-display-sm text-display-sm text-on-surface font-bold">{validCertificates}</p>
          <p className="font-label-sm text-on-surface-variant">Active Certificates</p>
        </div>

        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-5 ambient-shadow flex flex-col gap-3">
          <div className="flex justify-between items-start">
            <span className="px-2 py-1 rounded-full text-label-sm font-bold uppercase bg-amber-100 text-amber-800">Warning</span>
            <span className="w-2.5 h-2.5 rounded-full mt-1 bg-amber-500" />
          </div>
          <p className="font-display-sm text-display-sm text-on-surface font-bold">{expiringSoon}</p>
          <p className="font-label-sm text-on-surface-variant">Expiring Soon</p>
        </div>

        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-5 ambient-shadow flex flex-col gap-3">
          <div className="flex justify-between items-start">
            <span className="px-2 py-1 rounded-full text-label-sm font-bold uppercase bg-error-container text-on-error-container">Expired</span>
            <span className="w-2.5 h-2.5 rounded-full mt-1 bg-error" />
          </div>
          <p className="font-display-sm text-display-sm text-on-surface font-bold">{expiredCertificates}</p>
          <p className="font-label-sm text-on-surface-variant">Expired Certificates</p>
        </div>
      </div>

      {/* Certificates Display */}
      {!loading && filteredCertificates.length > 0 ? (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredCertificates.map((cert) =>
            viewMode === 'grid' ? (
              <div key={cert.id} className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 ambient-shadow hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-label-sm font-bold uppercase ${getCategoryColor(cert.formation?.categorie)}`}>
                      {cert.formation?.categorie || '—'}
                    </span>
                  </div>
                  <div className="w-12 h-12 bg-tertiary-container rounded-lg flex items-center justify-center">
                    <Icon name="workspace_premium" className="text-on-tertiary-container text-[24px]" />
                  </div>
                </div>

                <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold mb-2 line-clamp-2">
                  {cert.formation?.titre || '—'}
                </h3>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-body-sm">
                    <span className="text-on-surface-variant">Reference:</span>
                    <span className="text-on-surface font-mono">{cert.reference}</span>
                  </div>
                  <div className="flex justify-between text-body-sm">
                    <span className="text-on-surface-variant">Issued:</span>
                    <span className="text-on-surface">{cert.dateEmission ? new Date(cert.dateEmission).toLocaleDateString('fr-TN') : '—'}</span>
                  </div>
                  <div className="flex justify-between text-body-sm">
                    <span className="text-on-surface-variant">Expires:</span>
                    <span className="text-on-surface">{cert.dateExpiration ? new Date(cert.dateExpiration).toLocaleDateString('fr-TN') : '—'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-label-sm font-medium border ${getStatusColor(cert)}`}>
                    {getStatusText(cert)}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => downloadCertificate(cert)}
                    className="flex-1 bg-primary-container text-on-primary hover:bg-[#004494] transition-colors rounded-xl px-3 py-2 text-label-sm flex items-center justify-center gap-1"
                  >
                    <Icon name="download" className="text-[16px]" />
                    Download
                  </button>
                  <button
                    onClick={() => setSelectedCertificate(cert)}
                    className="flex-1 border border-outline text-on-surface hover:bg-surface-container transition-colors rounded-xl px-3 py-2 text-label-sm flex items-center justify-center gap-1"
                  >
                    <Icon name="visibility" className="text-[16px]" />
                    View
                  </button>
                </div>
              </div>
            ) : (
              <div key={cert.id} className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 ambient-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-tertiary-container rounded-xl flex items-center justify-center shrink-0">
                    <Icon name="workspace_premium" className="text-on-tertiary-container text-[32px]" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-1 rounded-full text-label-sm font-bold uppercase ${getCategoryColor(cert.formation?.categorie)}`}>
                        {cert.formation?.categorie || '—'}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-label-sm font-medium border ${getStatusColor(cert)}`}>
                        {getStatusText(cert)}
                      </span>
                    </div>
                    <h3 className="font-headline-sm text-on-surface font-semibold mb-1">
                      {cert.formation?.titre || '—'}
                    </h3>
                    <div className="text-body-sm text-on-surface-variant">
                      Ref: {cert.reference} • Issued: {cert.dateEmission ? new Date(cert.dateEmission).toLocaleDateString('fr-TN') : '—'}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => downloadCertificate(cert)}
                      className="p-2 text-on-surface-variant hover:text-primary transition-colors"
                      title="Download Certificate"
                    >
                      <Icon name="download" className="text-[20px]" />
                    </button>
                    <button
                      onClick={() => verifyCertificate(cert)}
                      className="p-2 text-on-surface-variant hover:text-primary transition-colors"
                      title="Verify Certificate"
                    >
                      <Icon name="verified" className="text-[20px]" />
                    </button>
                    <button
                      onClick={() => setSelectedCertificate(cert)}
                      className="p-2 text-on-surface-variant hover:text-primary transition-colors"
                      title="View Details"
                    >
                      <Icon name="visibility" className="text-[20px]" />
                    </button>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      ) : (
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-12 text-center ambient-shadow">
          <Icon name="workspace_premium" className="text-on-surface-variant/40 text-[64px] mx-auto mb-4" />
          <h3 className="font-headline-sm text-on-surface-variant mb-2">
            {loading ? 'Loading certificates...' : filterStatus === 'all' ? 'No certificates yet' : `No ${filterStatus} certificates`}
          </h3>
          <p className="text-body-sm text-on-surface-variant mb-4">
            {!loading && filterStatus === 'all'
              ? 'Complete training programs to earn certificates'
              : ''}
          </p>
        </div>
      )}

      {/* Certificate Detail Modal */}
      {selectedCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/60" onClick={() => setSelectedCertificate(null)}>
          <div className="w-full max-w-2xl bg-surface-container-lowest rounded-xl shadow-ambient border border-outline-variant p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-md text-headline-md text-on-background">Certificate Details</h3>
              <button type="button" className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors" onClick={() => setSelectedCertificate(null)}>
                <Icon name="close" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div>
                  <div className="text-label-sm text-on-surface-variant mb-1">Training Program</div>
                  <div className="text-body-md text-on-surface font-semibold">{selectedCertificate.formation?.titre || '—'}</div>
                </div>

                <div>
                  <div className="text-label-sm text-on-surface-variant mb-1">Category</div>
                  <span className={`px-2 py-1 rounded-full text-label-sm font-bold uppercase ${getCategoryColor(selectedCertificate.formation?.categorie)}`}>
                    {selectedCertificate.formation?.categorie || '—'}
                  </span>
                </div>

                <div>
                  <div className="text-label-sm text-on-surface-variant mb-1">Reference</div>
                  <div className="text-body-md text-on-surface font-mono">{selectedCertificate.reference}</div>
                </div>

                <div>
                  <div className="text-label-sm text-on-surface-variant mb-1">Duration</div>
                  <div className="text-body-md text-on-surface">{selectedCertificate.formation?.duree || '—'}</div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-label-sm text-on-surface-variant mb-1">Issue Date</div>
                  <div className="text-body-md text-on-surface">{selectedCertificate.dateEmission ? new Date(selectedCertificate.dateEmission).toLocaleDateString('fr-TN') : '—'}</div>
                </div>

                <div>
                  <div className="text-label-sm text-on-surface-variant mb-1">Expiration Date</div>
                  <div className="text-body-md text-on-surface">{selectedCertificate.dateExpiration ? new Date(selectedCertificate.dateExpiration).toLocaleDateString('fr-TN') : '—'}</div>
                </div>

                <div>
                  <div className="text-label-sm text-on-surface-variant mb-1">Status</div>
                  <span className={`px-3 py-1 rounded-full text-label-sm font-medium border ${getStatusColor(selectedCertificate)}`}>
                    {getStatusText(selectedCertificate)}
                  </span>
                </div>

                <div>
                  <div className="text-label-sm text-on-surface-variant mb-1">QR Code</div>
                  <div className="text-body-md text-on-surface font-mono">{selectedCertificate.qrCode || '—'}</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant">
              <button
                onClick={() => verifyCertificate(selectedCertificate)}
                className="border border-outline text-on-surface hover:bg-surface-container transition-colors rounded-xl px-6 py-3 text-label-md flex items-center gap-2"
              >
                <Icon name="verified" />
                Verify
              </button>
              <button
                onClick={() => downloadCertificate(selectedCertificate)}
                className="bg-primary-container text-on-primary hover:bg-[#004494] transition-colors rounded-xl px-6 py-3 text-label-md flex items-center gap-2"
              >
                <Icon name="download" />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
