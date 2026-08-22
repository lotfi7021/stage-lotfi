import React, { useState } from 'react';
import Icon from '../../components/common/Icon';

const CATEGORIES = [
  {
    id: 'cours',
    label: 'Support de Cours',
    count: '124 Fichiers',
    icon: 'menu_book'
  },
  {
    id: 'emargement',
    label: "Feuilles d'Émargement",
    count: '86 Fichiers',
    icon: 'how_to_reg'
  },
  {
    id: 'certifications',
    label: 'Certifications',
    count: '42 Fichiers',
    icon: 'verified'
  },
  {
    id: 'catalogues',
    label: 'Catalogues PDF',
    count: '15 Fichiers',
    icon: 'library_books'
  }
];

const DOCUMENTS = [
  {
    id: 1,
    name: 'Manuel_Securite_2023.pdf',
    category: 'cours',
    categoryLabel: 'Support de Cours',
    date: '12 Oct 2023',
    status: 'Validé',
    statusColor: 'text-primary',
    dot: 'bg-primary',
    icon: 'picture_as_pdf',
    iconColor: 'text-error',
    size: '2.4 MB',
    type: 'PDF',
    author: 'Admin STEG'
  },
  {
    id: 2,
    name: 'Emargement_Session_A.docx',
    category: 'emargement',
    categoryLabel: 'Feuilles',
    date: '10 Oct 2023',
    status: 'En attente',
    statusColor: 'text-secondary',
    dot: 'bg-secondary',
    icon: 'description',
    iconColor: 'text-secondary',
    size: '860 KB',
    type: 'DOCX',
    author: 'Admin STEG'
  }
];

export default function PrevisualisationDocument() {
  const [selectedDoc, setSelectedDoc] = useState(null);

  const openPreview = (doc) => setSelectedDoc(doc);
  const closePreview = () => setSelectedDoc(null);

  return (
    <>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-primary">
              Gestion Documentaire
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-2">
              Gérez, partagez et consultez les documents liés aux formations.
            </p>
          </div>
          <div className="flex justify-end">
            <button
              className="flex items-center gap-2 px-4 py-2 bg-surface-container-high text-primary font-label-md text-label-md rounded-lg hover:bg-primary hover:text-on-primary transition-all border border-outline-variant"
              type="button"
            >
              <Icon name="create_new_folder" />
              Nouveau Dossier
            </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-gutter">
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
            <section className="grid grid-cols-2 gap-4">
              {CATEGORIES.map((cat) => (
                <div
                  key={cat.id}
                  className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-ambient-sm hover:shadow-ambient transition-all cursor-pointer flex items-start gap-4 group"
                >
                  <div className="p-3 bg-surface-container rounded-lg text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                    <Icon name={cat.icon} className="text-3xl" />
                  </div>
                  <div>
                    <h3 className="font-headline-md text-label-md font-bold text-on-surface">
                      {cat.label}
                    </h3>
                    <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">
                      {cat.count}
                    </p>
                  </div>
                </div>
              ))}
            </section>

            <section className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-ambient-sm overflow-hidden">
              <div className="p-6 border-b border-outline-variant flex justify-between items-center">
                <h3 className="font-headline-md text-headline-md text-on-surface">
                  Documents Récents
                </h3>
                <button className="font-label-md text-label-md text-primary hover:underline" type="button">
                  Voir tout
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low font-label-sm text-label-sm text-on-surface-variant border-b border-outline-variant">
                      <th className="py-4 px-6 font-semibold">Nom du Fichier</th>
                      <th className="py-4 px-6 font-semibold">Catégorie</th>
                      <th className="py-4 px-6 font-semibold">Date d'Ajout</th>
                      <th className="py-4 px-6 font-semibold">Statut</th>
                      <th className="py-4 px-6 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="font-body-md text-body-md">
                    {DOCUMENTS.map((doc) => (
                      <tr
                        key={doc.id}
                        onClick={() => openPreview(doc)}
                        className="border-b border-surface-variant hover:bg-surface-bright transition-colors cursor-pointer"
                      >
                        <td className="py-4 px-6 flex items-center gap-3">
                          <Icon name={doc.icon} className={doc.iconColor} />
                          {doc.name}
                        </td>
                        <td className="py-4 px-6">
                          <span className="bg-surface-container px-2 py-1 rounded text-label-sm font-label-sm">
                            {doc.categoryLabel}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-on-surface-variant">{doc.date}</td>
                        <td className="py-4 px-6">
                          <span className={`flex items-center gap-1.5 text-label-sm ${doc.statusColor}`}>
                            <span className={`w-2 h-2 rounded-full ${doc.dot}`}></span>
                            {doc.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            className="text-on-surface-variant hover:text-primary transition-colors mr-2"
                            type="button"
                            onClick={() => openPreview(doc)}
                          >
                            <Icon name="visibility" />
                          </button>
                          <button
                            className="text-on-surface-variant hover:text-primary transition-colors"
                            type="button"
                          >
                            <Icon name="download" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
            <section className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-ambient-sm">
              <h3 className="font-headline-md text-headline-md text-on-surface mb-4">
                Upload Rapide
              </h3>
              <div className="border-2 border-dashed border-outline-variant rounded-lg p-8 flex flex-col items-center justify-center text-center hover:bg-surface-bright hover:border-primary transition-all cursor-pointer">
                <Icon name="cloud_upload" className="text-4xl text-primary mb-2" />
                <p className="font-label-md text-label-md text-on-surface font-semibold">
                  Glissez-déposez vos fichiers ici
                </p>
                <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">
                  ou cliquez pour parcourir (Max 50MB)
                </p>
              </div>
            </section>

            <section className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-ambient-sm">
              <h3 className="font-headline-md text-headline-md text-on-surface mb-4">
                Téléchargements Récents
              </h3>
              <ul className="flex flex-col gap-4">
                <li className="flex items-center gap-3 font-body-md text-body-md">
                  <div className="w-10 h-10 rounded bg-surface-container flex items-center justify-center text-on-surface-variant">
                    <Icon name="picture_as_pdf" />
                  </div>
                  <div className="flex-1">
                    <p className="text-on-surface line-clamp-1">Catalogue_Formations_24.pdf</p>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">
                      Aujourd'hui, 09:41
                    </p>
                  </div>
                </li>
                <li className="flex items-center gap-3 font-body-md text-body-md">
                  <div className="w-10 h-10 rounded bg-surface-container flex items-center justify-center text-on-surface-variant">
                    <Icon name="description" />
                  </div>
                  <div className="flex-1">
                    <p className="text-on-surface line-clamp-1">Liste_Participants_V2.xlsx</p>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">
                      Hier, 14:22
                    </p>
                  </div>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>

      <div
        className={`fixed top-0 right-0 h-screen w-96 bg-surface-container-lowest border-l border-outline-variant shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          selectedDoc ? '' : 'translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface">
          <h3 className="font-headline-md text-headline-md text-primary truncate pr-4">
            Aperçu du Document
          </h3>
          <button
            className="p-2 hover:bg-surface-container-high rounded-full transition-colors"
            type="button"
            aria-label="Fermer l'aperçu"
            onClick={closePreview}
          >
            <Icon name="close" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {selectedDoc && (
            <>
              <div className="aspect-[3/4] w-full bg-surface-container-low rounded-lg border border-dashed border-outline-variant flex flex-col items-center justify-center text-on-surface-variant mb-6">
                <Icon name={selectedDoc.icon} className="text-6xl mb-2" />
                <p className="font-label-md">{selectedDoc.name}</p>
                <p className="font-label-sm text-on-surface-variant mt-1">
                  Prévisualisation non disponible
                </p>
              </div>
              <div className="space-y-4">
                <h4 className="font-bold text-on-surface border-b border-outline-variant pb-2">
                  Informations
                </h4>
                <div className="grid grid-cols-2 gap-y-3 text-body-md">
                  <span className="text-on-surface-variant">Taille:</span>
                  <span className="text-on-surface font-semibold">{selectedDoc.size}</span>
                  <span className="text-on-surface-variant">Type:</span>
                  <span className="text-on-surface font-semibold">{selectedDoc.type}</span>
                  <span className="text-on-surface-variant">Ajouté le:</span>
                  <span className="text-on-surface font-semibold">{selectedDoc.date}</span>
                  <span className="text-on-surface-variant">Auteur:</span>
                  <span className="text-on-surface font-semibold">{selectedDoc.author}</span>
                </div>
              </div>
            </>
          )}
        </div>
        <div className="p-6 border-t border-outline-variant bg-surface-container-low flex flex-col gap-3">
          <button
            className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-on-primary rounded-lg font-bold hover:bg-primary-container transition-all"
            type="button"
          >
            <Icon name="download" />
            Télécharger
          </button>
          <div className="flex gap-3">
            <button
              className="flex-1 flex items-center justify-center gap-2 py-2 border border-outline-variant rounded-lg hover:bg-surface-bright transition-all"
              type="button"
            >
              <Icon name="share" />
              Partager
            </button>
            <button
              className="flex-1 flex items-center justify-center gap-2 py-2 border border-error text-error rounded-lg hover:bg-error-container transition-all"
              type="button"
            >
              <Icon name="delete" />
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </>
  );
}