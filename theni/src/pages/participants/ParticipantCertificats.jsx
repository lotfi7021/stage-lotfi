import { useState } from 'react';
import Icon from '../../components/common/Icon';
import { INSCRIPTIONS, SESSIONS, FORMATIONS, CERTIFICATIONS, UTILISATEURS, CURRENT_USER } from '../../data/mock';

export default function ParticipantCertificats() {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' ou 'list'
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'valid', 'expired'
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  // Récupérer les certificats du participant
  const participantCertificates = INSCRIPTIONS
    .filter(inscription => inscription.participant_id === CURRENT_USER.id)
    .map(inscription => {
      const session = SESSIONS.find(s => s.id === inscription.session_id);
      const formation = FORMATIONS.find(f => f.id === session?.formation_id);
      const certification = CERTIFICATIONS.find(c => c.inscription_id === inscription.id);
      const formateur = UTILISATEURS.find(u => u.id === session?.formateur_id);
      
      if (!certification) return null;
      
      const isExpired = new Date(certification.date_expiration) < new Date();
      const daysUntilExpiration = Math.ceil(
        (new Date(certification.date_expiration) - new Date()) / (1000 * 60 * 60 * 24)
      );

      return {
        ...certification,
        inscription,
        session,
        formation,
        formateur,
        isExpired,
        daysUntilExpiration,
        isExpiringSoon: daysUntilExpiration <= 90 && daysUntilExpiration > 0
      };
    })
    .filter(Boolean);

  // Filtrer les certificats
  const filteredCertificates = participantCertificates.filter(cert => {
    if (filterStatus === 'valid') return !cert.isExpired;
    if (filterStatus === 'expired') return cert.isExpired;
    return true;
  });

  const downloadCertificate = (cert) => {
    console.log('Downloading certificate:', cert.id);
    // Ici vous ajouteriez la logique de téléchargement
    alert(`Downloading certificate for ${cert.formation?.titre}`);
  };

  const verifyCertificate = (cert) => {
    console.log('Verifying certificate with QR:', cert.qr_code_token);
    // Ici vous ajouteriez la logique de vérification
    alert(`Certificate verification: ${cert.qr_code_token}`);
  };

  const getStatusColor = (cert) => {
    if (cert.isExpired) return 'bg-error-container text-on-error-container border-error';
    if (cert.isExpiringSoon) return 'bg-warning-container text-on-warning-container border-warning';
    return 'bg-success-container text-on-success-container border-success';
  };

  const getStatusText = (cert) => {
    if (cert.isExpired) return 'Expired';
    if (cert.isExpiringSoon) return `Expires in ${cert.daysUntilExpiration} days`;
    return 'Valid';
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Safety': 'bg-error-container text-on-error-container',
      'Management': 'bg-primary-container text-on-primary',
      'Technical Skills': 'bg-secondary-container text-on-secondary-container',
      'Leadership': 'bg-tertiary-container text-on-tertiary-container',
      'Digital Transformation': 'bg-surface-variant text-on-surface-variant',
      'Quality Management': 'bg-success-container text-on-success-container'
    };
    return colors[category] || 'bg-surface-variant text-on-surface-variant';
  };

  const validCertificates = participantCertificates.filter(c => !c.isExpired).length;
  const expiredCertificates = participantCertificates.filter(c => c.isExpired).length;
  const expiringSoon = participantCertificates.filter(c => c.isExpiringSoon).length;

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
          <p className="font-display-sm text-display-sm text-on-surface font-bold">{participantCertificates.length}</p>
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
            <span className="px-2 py-1 rounded-full text-label-sm font-bold uppercase bg-warning-container text-on-warning-container">Warning</span>
            <span className="w-2.5 h-2.5 rounded-full mt-1 bg-warning" />
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
      {filteredCertificates.length > 0 ? (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredCertificates.map((cert) => (
            viewMode === 'grid' ? (
              <div key={cert.id} className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 ambient-shadow hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-label-sm font-bold uppercase ${getCategoryColor(cert.formation?.categorie)}`}>
                      {cert.formation?.categorie}
                    </span>
                  </div>
                  <div className="w-12 h-12 bg-tertiary-container rounded-lg flex items-center justify-center">
                    <Icon name="workspace_premium" className="text-on-tertiary-container text-[24px]" />
                  </div>
                </div>

                <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold mb-2 line-clamp-2">
                  {cert.formation?.titre}
                </h3>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-body-sm">
                    <span className="text-on-surface-variant">Obtained:</span>
                    <span className="text-on-surface">{new Date(cert.date_obtention).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-body-sm">
                    <span className="text-on-surface-variant">Expires:</span>
                    <span className="text-on-surface">{new Date(cert.date_expiration).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-body-sm">
                    <span className="text-on-surface-variant">Trainer:</span>
                    <span className="text-on-surface">{cert.formateur?.prenom} {cert.formateur?.nom}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-label-sm font-medium border ${getStatusColor(cert)}`}>
                    {getStatusText(cert)}
                  </span>
                  <div className="text-body-sm text-on-surface-variant">
                    ID: {cert.qr_code_token?.slice(-6)}
                  </div>
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
                        {cert.formation?.categorie}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-label-sm font-medium border ${getStatusColor(cert)}`}>
                        {getStatusText(cert)}
                      </span>
                    </div>
                    <h3 className="font-headline-sm text-on-surface font-semibold mb-1">
                      {cert.formation?.titre}
                    </h3>
                    <div className="text-body-sm text-on-surface-variant">
                      Obtained: {new Date(cert.date_obtention).toLocaleDateString()} • 
                      Expires: {new Date(cert.date_expiration).toLocaleDateString()} • 
                      Trainer: {cert.formateur?.prenom} {cert.formateur?.nom}
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
          ))}
        </div>
      ) : (
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-12 text-center ambient-shadow">
          <Icon name="workspace_premium" className="text-on-surface-variant/40 text-[64px] mx-auto mb-4" />
          <h3 className="font-headline-sm text-on-surface-variant mb-2">
            {filterStatus === 'all' ? 'No certificates yet' : `No ${filterStatus} certificates`}
          </h3>
          <p className="text-body-sm text-on-surface-variant mb-4">
            {filterStatus === 'all' 
              ? 'Complete training programs to earn certificates'
              : `You don't have any ${filterStatus} certificates at the moment`}
          </p>
          {filterStatus === 'all' && (
            <button className="bg-primary-container text-on-primary hover:bg-[#004494] transition-colors rounded-xl px-6 py-3 text-label-md">
              Browse Training Catalog
            </button>
          )}
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
                  <div className="text-body-md text-on-surface font-semibold">{selectedCertificate.formation?.titre}</div>
                </div>
                
                <div>
                  <div className="text-label-sm text-on-surface-variant mb-1">Category</div>
                  <span className={`px-2 py-1 rounded-full text-label-sm font-bold uppercase ${getCategoryColor(selectedCertificate.formation?.categorie)}`}>
                    {selectedCertificate.formation?.categorie}
                  </span>
                </div>

                <div>
                  <div className="text-label-sm text-on-surface-variant mb-1">Trainer</div>
                  <div className="text-body-md text-on-surface">{selectedCertificate.formateur?.prenom} {selectedCertificate.formateur?.nom}</div>
                </div>

                <div>
                  <div className="text-label-sm text-on-surface-variant mb-1">Training Duration</div>
                  <div className="text-body-md text-on-surface">{selectedCertificate.formation?.duree_jours} days</div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-label-sm text-on-surface-variant mb-1">Issue Date</div>
                  <div className="text-body-md text-on-surface">{new Date(selectedCertificate.date_obtention).toLocaleDateString()}</div>
                </div>

                <div>
                  <div className="text-label-sm text-on-surface-variant mb-1">Expiration Date</div>
                  <div className="text-body-md text-on-surface">{new Date(selectedCertificate.date_expiration).toLocaleDateString()}</div>
                </div>

                <div>
                  <div className="text-label-sm text-on-surface-variant mb-1">Status</div>
                  <span className={`px-3 py-1 rounded-full text-label-sm font-medium border ${getStatusColor(selectedCertificate)}`}>
                    {getStatusText(selectedCertificate)}
                  </span>
                </div>

                <div>
                  <div className="text-label-sm text-on-surface-variant mb-1">Verification Code</div>
                  <div className="text-body-md text-on-surface font-mono">{selectedCertificate.qr_code_token}</div>
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