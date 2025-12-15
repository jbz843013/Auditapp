import React, { useState } from 'react';
import { Check, X, AlertCircle, FileText, Minus } from 'lucide-react';

const AuditApp = () => {
  const [projectName, setProjectName] = useState('');
  const auditItems = [
    { id: 1, category: "1. Gouvernance & périmètre", items: [
      "1.1 Inventaire complet des actifs (matériel, logiciels, données)",
      "1.2 Identification des services critiques",
      "1.3 Cartographie réseau à jour",
      "1.4 PSSI existante et appliquée",
      "1.5 Gestion des prestataires formalisée"
    ]},
    { id: 2, category: "2. Comptes, accès & identités", items: [
      "2.1 Politique de mots de passe conforme",
      "2.2 Comptes admin séparés des comptes utilisateurs",
      "2.3 Comptes inactifs supprimés",
      "2.4 MFA activé pour accès sensibles",
      "2.5 Principe du moindre privilège appliqué"
    ]},
    { id: 3, category: "3. Postes & appareils", items: [
      "3.1 Configuration sécurisée des postes (durcissement)",
      "3.2 Antivirus / EDR déployé partout",
      "3.3 Pare-feu local activé",
      "3.4 Chiffrement des disques (BitLocker, LUKS…)",
      "3.5 Gestion des périphériques USB"
    ]},
    { id: 4, category: "4. Réseau", items: [
      "4.1 Segmentation réseau (interne, DMZ, invités)",
      "4.2 Pare-feu correctement configuré",
      "4.3 IDS/IPS actif",
      "4.4 Protections mail en place (SPF/DKIM/DMARC)",
      "4.5 Wifi sécurisé (WPA3, VLAN invités)"
    ]},
    { id: 5, category: "5. Administration", items: [
      "5.1 Postes d'administration isolés",
      "5.2 Pas d'accès Internet depuis les postes admin",
      "5.3 Accès administrateurs journalisés",
      "5.4 Outils d'administration à jour"
    ]},
    { id: 6, category: "6. Mises à jour & correctifs", items: [
      "6.1 Patch management centralisé",
      "6.2 Mises à jour OS régulières",
      "6.3 Mises à jour applicatives régulières",
      "6.4 Gestion des logiciels obsolètes"
    ]},
    { id: 7, category: "7. Nomadisme & télétravail", items: [
      "7.1 VPN obligatoire",
      "7.2 Chiffrement des devices nomades",
      "7.3 Sécurisation des accès distants"
    ]},
    { id: 8, category: "8. Supervision & réaction", items: [
      "8.1 Journalisation des événements critiques",
      "8.2 Centralisation des logs (SIEM)",
      "8.3 Détection d'incidents opérationnelle",
      "8.4 Plan de réponse à incident existant",
      "8.5 Tests réguliers de restauration"
    ]},
    { id: 9, category: "9. Sauvegardes", items: [
      "9.1 Sauvegardes régulières",
      "9.2 Sauvegardes hors-ligne / immuables",
      "9.3 Procédure testée et validée",
      "9.4 Chiffrement des sauvegardes"
    ]}
  ];

  const allItems = auditItems.flatMap((cat, catIdx) => 
    cat.items.map((item, itemIdx) => ({
      key: `${catIdx}-${itemIdx}`,
      category: cat.category,
      text: item,
      // Points de gouvernance qui utilisent une simple checkbox
      isCheckbox: catIdx === 0 && itemIdx < 5
    }))
  );

  const [checklistData, setChecklistData] = useState(
    allItems.reduce((acc, item) => ({
      ...acc,
      [item.key]: { status: null, observation: '' }
    }), {})
  );

  const handleStatusChange = (key, status) => {
    setChecklistData(prev => ({
      ...prev,
      [key]: { ...prev[key], status }
    }));
  };

  const handleObservationChange = (key, observation) => {
    setChecklistData(prev => ({
      ...prev,
      [key]: { ...prev[key], observation }
    }));
  };

  const getStats = () => {
    const total = allItems.filter(item => !item.isCheckbox).length;
    let conforme = 0;
    let nonConforme = 0;
    let na = 0;
    
    Object.entries(checklistData).forEach(([key, data]) => {
      const item = allItems.find(i => i.key === key);
      if (item && !item.isCheckbox) {
        // Compter seulement les items qui ne sont pas des checkboxes (section 1)
        if (data.status === 'conforme') conforme++;
        else if (data.status === 'non-conforme') nonConforme++;
        else if (data.status === 'na') na++;
      }
    });
    
    const nonEvalue = total - conforme - nonConforme - na;
    return { total, conforme, nonConforme, na, nonEvalue };
  };

  const stats = getStats();

  const generatePDF = () => {
    const printWindow = window.open('', '', 'width=800,height=600');
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Rapport d'Audit - ${projectName || 'Sans titre'}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            color: #333;
          }
          h1 {
            color: #1e293b;
            border-bottom: 3px solid #1e293b;
            padding-bottom: 10px;
            font-size: 20px;
          }
          .project-info {
            background: #f8fafc;
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
          }
          .stats {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            margin: 20px 0;
          }
          .stat-box {
            padding: 10px;
            border-radius: 5px;
            text-align: center;
          }
          .stat-box.conforme { background: #dcfce7; color: #166534; }
          .stat-box.non-conforme { background: #fee2e2; color: #991b1b; }
          .stat-box.na { background: #f1f5f9; color: #475569; }
          .stat-box.non-evalue { background: #fef3c7; color: #92400e; }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          th {
            background: #1e293b;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: bold;
          }
          td {
            padding: 10px;
            border-bottom: 1px solid #e2e8f0;
          }
          .category-row {
            background: #f1f5f9;
            font-weight: bold;
            color: #334155;
          }
          .status {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 4px;
            font-weight: bold;
            font-size: 12px;
          }
          .status.conforme { background: #22c55e; color: white; }
          .status.non-conforme { background: #ef4444; color: white; }
          .status.na { background: #94a3b8; color: white; }
          .status.non-evalue { background: #f59e0b; color: white; }
          .status.fait { background: #22c55e; color: white; }
          .status.partiellement { background: #f97316; color: white; }
          .status.non-fait { background: #ef4444; color: white; }
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <h1>Feuille de Route — Audit de cybersécurité selon le guide d'hygiène informatique de l'ANSSI</h1>
        
        <div class="project-info">
          <strong>Nom du projet :</strong> ${projectName || 'Non renseigné'}<br>
          <strong>Date :</strong> ${new Date().toLocaleDateString('fr-FR')}
        </div>

        <div class="stats">
          <div class="stat-box conforme">
            <div style="font-size: 24px; font-weight: bold;">${stats.conforme}</div>
            <div>Conforme</div>
          </div>
          <div class="stat-box non-conforme">
            <div style="font-size: 24px; font-weight: bold;">${stats.nonConforme}</div>
            <div>Non conforme</div>
          </div>
          <div class="stat-box na">
            <div style="font-size: 24px; font-weight: bold;">${stats.na}</div>
            <div>N/A</div>
          </div>
          <div class="stat-box non-evalue">
            <div style="font-size: 24px; font-weight: bold;">${stats.nonEvalue}</div>
            <div>Non évalué</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 50%">Point de contrôle</th>
              <th style="width: 15%">Conformité</th>
              <th style="width: 35%">Observations</th>
            </tr>
          </thead>
          <tbody>
            ${allItems.map((item, idx) => {
              const isNewCategory = idx === 0 || item.category !== allItems[idx - 1].category;
              const data = checklistData[item.key];
              const statusText = data.status === 'conforme' ? 'Conforme' : 
                                 data.status === 'non-conforme' ? 'Non conforme' : 
                                 data.status === 'na' ? 'N/A' : 'Non évalué';
              const statusClass = data.status || 'non-evalue';
              
              return `
                ${isNewCategory ? `<tr class="category-row"><td colspan="3">${item.category}</td></tr>` : ''}
                <tr>
                  <td>${item.text}</td>
                  <td><span class="status ${statusClass}">${statusText}</span></td>
                  <td>${data.observation || '-'}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>

        <div style="margin-top: 30px; padding: 15px; background: #dbeafe; border-radius: 5px;">
          <strong>Synthèse :</strong> ${stats.conforme} mesures conformes sur ${stats.total} points de contrôle.
          ${stats.nonConforme > 0 ? ` ${stats.nonConforme} risques identifiés nécessitent une remédiation.` : ''}
        </div>

        <div class="no-print" style="margin-top: 20px; text-align: center;">
          <button onclick="window.print()" style="padding: 10px 20px; background: #1e293b; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">
            Imprimer / Enregistrer en PDF
          </button>
          <button onclick="window.close()" style="padding: 10px 20px; background: #64748b; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; margin-left: 10px;">
            Fermer
          </button>
        </div>
      </body>
      </html>
    `;
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-slate-800 mb-4">Feuille de Route — Audit de cybersécurité selon le guide d'hygiène informatique de l'ANSSI</h1>
          
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Nom du projet
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Saisir le nom du projet..."
              className="w-full px-4 py-3 border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="grid grid-cols-5 gap-4 mt-6">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="text-sm text-slate-600 mb-1">Total</div>
              <div className="text-2xl font-bold text-slate-800">{stats.total}</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="text-sm text-green-700 mb-1">Conforme</div>
              <div className="text-2xl font-bold text-green-700">{stats.conforme}</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <div className="text-sm text-red-700 mb-1">Non conforme</div>
              <div className="text-2xl font-bold text-red-700">{stats.nonConforme}</div>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-300">
              <div className="text-sm text-slate-600 mb-1">N/A</div>
              <div className="text-2xl font-bold text-slate-600">{stats.na}</div>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <div className="text-sm text-amber-700 mb-1">Non évalué</div>
              <div className="text-2xl font-bold text-amber-700">{stats.nonEvalue}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold w-1/2">Point de contrôle</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold w-1/6">Conformité</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold w-1/3">Observations</th>
                </tr>
              </thead>
              <tbody>
                {allItems.map((item, idx) => {
                  const isNewCategory = idx === 0 || item.category !== allItems[idx - 1].category;
                  return (
                    <React.Fragment key={item.key}>
                      {isNewCategory && (
                        <tr className="bg-slate-100">
                          <td colSpan="3" className="px-6 py-3 font-semibold text-slate-700 text-sm">
                            {item.category}
                          </td>
                        </tr>
                      )}
                      <tr className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-slate-700">
                          {item.text}
                        </td>
                        <td className="px-6 py-4">
                          {item.isCheckbox ? (
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => handleStatusChange(item.key, 'fait')}
                                className={`px-3 py-2 rounded-lg font-medium text-sm transition-all ${
                                  checklistData[item.key].status === 'fait'
                                    ? 'bg-green-500 text-white shadow-md'
                                    : 'bg-slate-100 text-slate-600 hover:bg-green-100'
                                }`}
                              >
                                <Check className="w-4 h-4 inline mr-1" />
                                Fait
                              </button>
                              <button
                                onClick={() => handleStatusChange(item.key, 'partiellement')}
                                className={`px-3 py-2 rounded-lg font-medium text-sm transition-all ${
                                  checklistData[item.key].status === 'partiellement'
                                    ? 'bg-orange-500 text-white shadow-md'
                                    : 'bg-slate-100 text-slate-600 hover:bg-orange-100'
                                }`}
                              >
                                <Minus className="w-4 h-4 inline mr-1" />
                                Partiellement fait
                              </button>
                              <button
                                onClick={() => handleStatusChange(item.key, 'non-fait')}
                                className={`px-3 py-2 rounded-lg font-medium text-sm transition-all ${
                                  checklistData[item.key].status === 'non-fait'
                                    ? 'bg-red-500 text-white shadow-md'
                                    : 'bg-slate-100 text-slate-600 hover:bg-red-100'
                                }`}
                              >
                                <X className="w-4 h-4 inline mr-1" />
                                Non fait
                              </button>
                            </div>
                          ) : (
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => handleStatusChange(item.key, 'conforme')}
                                className={`px-3 py-2 rounded-lg font-medium text-sm transition-all ${
                                  checklistData[item.key].status === 'conforme'
                                    ? 'bg-green-500 text-white shadow-md'
                                    : 'bg-slate-100 text-slate-600 hover:bg-green-100'
                                }`}
                              >
                                <Check className="w-4 h-4 inline mr-1" />
                                Conforme
                              </button>
                              <button
                                onClick={() => handleStatusChange(item.key, 'non-conforme')}
                                className={`px-3 py-2 rounded-lg font-medium text-sm transition-all ${
                                  checklistData[item.key].status === 'non-conforme'
                                    ? 'bg-red-500 text-white shadow-md'
                                    : 'bg-slate-100 text-slate-600 hover:bg-red-100'
                                }`}
                              >
                                <X className="w-4 h-4 inline mr-1" />
                                Non conforme
                              </button>
                              <button
                                onClick={() => handleStatusChange(item.key, 'na')}
                                className={`px-3 py-2 rounded-lg font-medium text-sm transition-all ${
                                  checklistData[item.key].status === 'na'
                                    ? 'bg-slate-500 text-white shadow-md'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                              >
                                <Minus className="w-4 h-4 inline mr-1" />
                                N/A
                              </button>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <textarea
                            value={checklistData[item.key].observation}
                            onChange={(e) => handleObservationChange(item.key, e.target.value)}
                            placeholder="Ajouter une observation..."
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            rows="2"
                          />
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <strong>Synthèse finale :</strong> {stats.conforme} mesures conformes sur {stats.total} points de contrôle. 
            {stats.nonConforme > 0 && ` ${stats.nonConforme} risques identifiés nécessitent une remédiation.`}
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={generatePDF}
            className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg transition-all flex items-center gap-2"
          >
            <FileText className="w-5 h-5" />
            Éditer le rapport PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuditApp;