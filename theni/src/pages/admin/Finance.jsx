import React, { useState, useEffect } from 'react';
import Icon from '../../components/common/Icon';
import factureService from '../../services/factures/factureService';
import api from '../../services/config/api';

const STATUS_STYLES = {
  PAYEE: 'bg-green-100 text-green-800 border border-green-200',
  EN_ATTENTE: 'bg-amber-100 text-amber-800 border border-amber-200',
  EN_RETARD: 'bg-error-container text-on-error-container border border-[#ffb4ab]',
  ANNULEE: 'bg-surface-container text-on-surface-variant border border-outline-variant',
};

const STATUS_LABELS = {
  PAYEE: 'Paid',
  EN_ATTENTE: 'Pending',
  EN_RETARD: 'Overdue',
  ANNULEE: 'Cancelled',
};

const STATUT_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'PAYEE', label: 'Paid' },
  { value: 'EN_ATTENTE', label: 'Pending' },
  { value: 'EN_RETARD', label: 'Overdue' },
  { value: 'ANNULEE', label: 'Cancelled' },
];

const EMPTY_FORM = {
  client: '',
  sessionId: '',
  montant: '',
  tva: '',
  date: '',
  statut: 'EN_ATTENTE',
};

export default function Finance() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortDir, setSortDir] = useState('asc');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [invoices, setInvoices] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [formations, setFormations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [facturesRes, sessionsRes, formationsRes] = await Promise.all([
          factureService.getAllFactures({ limit: 100 }),
          api.get('/sessions', { params: { limit: 100 } }),
          api.get('/formations', { params: { limit: 100 } }),
        ]);
        if (facturesRes.success) setInvoices(facturesRes.data);
        if (sessionsRes.data?.sessions) setSessions(sessionsRes.data.sessions);
        if (formationsRes.data?.formations) setFormations(formationsRes.data.formations);
      } catch {
        // API not available
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const updateForm = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveError('');
    const session = sessions.find((s) => s.id === parseInt(form.sessionId));
    if (!session) {
      setSaveError('Please select a valid session.');
      return;
    }
    try {
      const result = await factureService.createFacture({
        client: form.client,
        formationId: session.formationId,
        sessionId: session.id,
        montant: parseFloat(form.montant),
        tva: form.tva ? parseFloat(form.tva) : undefined,
        date: form.date,
        statut: form.statut,
      });
      if (result.success) {
        setInvoices((prev) => [result.data, ...prev]);
        setForm(EMPTY_FORM);
        setModalOpen(false);
      }
    } catch (err) {
      setSaveError(err.response?.data?.error || 'Failed to create the invoice.');
    }
  };

  const buildDisplayRows = (factures) =>
    factures.map((f) => {
      const session = sessions.find((s) => s.id === f.sessionId);
      const formation = formations.find((fm) => fm.id === f.formationId);
      return {
        id: f.id,
        client: f.client,
        session: session ? `Session #${session.id}` : 'N/A',
        formation: formation ? formation.titre : 'N/A',
        montant: Number(f.montant).toLocaleString('en-US', { minimumFractionDigits: 3 }),
        statut: f.statut,
        date: new Date(f.date).toLocaleDateString('fr-TN'),
      };
    });

  const displayInvoices = buildDisplayRows(invoices);

  const query = search.trim().toLowerCase();
  const filtered = displayInvoices.filter((inv) => {
    const matchesSearch =
      query === '' ||
      [inv.id, inv.client, inv.session, inv.formation].some((v) =>
        v.toLowerCase().includes(query)
      );
    const matchesStatus =
      statusFilter === '' || inv.statut === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sorted = [...filtered].sort((a, b) =>
    sortDir === 'asc' ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id)
  );

  const totalRevenue = invoices
    .filter((f) => f.statut === 'PAYEE')
    .reduce((sum, f) => sum + Number(f.montant), 0);
  const pendingCount = invoices.filter((f) => f.statut === 'EN_ATTENTE').length;
  const overdueCount = invoices.filter((f) => f.statut === 'EN_RETARD').length;
  const collectionRate = invoices.length > 0
    ? Math.round((invoices.filter((f) => f.statut === 'PAYEE').length / invoices.length) * 100)
    : 0;

  return (
    <div className="flex flex-col gap-8 md:gap-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-background font-bold mb-2">
            Financial Management
          </h2>
          <p className="text-on-surface-variant font-body-md max-w-2xl">
            Track and manage all invoices, training budget and collection rates in real time.
          </p>
        </div>
        <button
          type="button"
          className="bg-primary-container text-on-primary rounded-lg py-2.5 px-6 font-label-md flex items-center justify-center gap-2 hover:bg-[#004494] transition-colors shrink-0 shadow-sm"
          onClick={() => setModalOpen(true)}
        >
          <Icon name="add_circle" className="text-[20px]" />
          New Invoice
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Revenue', value: `${(totalRevenue / 1000).toFixed(1)}K`, icon: 'account_balance_wallet', badge: `${invoices.filter((f) => f.statut === 'PAYEE').length} paid`, trend: true, bg: 'bg-secondary-container', fg: 'text-on-secondary-container' },
          { label: 'Pending Invoices', value: String(pendingCount + overdueCount), icon: 'pending_actions', badge: `${overdueCount} overdue`, trend: false, bg: 'bg-error-container', fg: 'text-on-error-container' },
          { label: 'Total Invoices', value: String(invoices.length), icon: 'receipt', badge: `${invoices.length} total`, trend: false, bg: 'bg-surface-container-high', fg: 'text-on-surface-variant' },
          { label: 'Collection Rate', value: `${collectionRate}%`, icon: 'verified', badge: 'Target: 95%', trend: collectionRate >= 80, bg: 'bg-secondary-fixed', fg: 'text-on-secondary-fixed' },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant ambient-shadow flex flex-col justify-between h-[160px]">
            <div className="flex justify-between items-start mb-4">
              <span className="font-label-md text-on-surface-variant uppercase tracking-wider">{kpi.label}</span>
              <div className={`w-8 h-8 rounded-full ${kpi.bg} flex items-center justify-center ${kpi.fg}`}>
                <Icon name={kpi.icon} size={18} />
              </div>
            </div>
            <div>
              <div className="font-display-lg text-display-lg text-on-surface mb-1">{kpi.value}</div>
              <div className={`flex items-center gap-1 font-label-sm ${kpi.trend ? 'text-green-700' : 'text-on-surface-variant'}`}>
                {kpi.trend && <Icon name="trending_up" size={14} />}
                <span>{kpi.badge}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Invoice Table */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant ambient-shadow overflow-hidden flex flex-col">
        <div className="p-6 border-b border-surface-variant flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h3 className="font-headline-md text-headline-md text-on-surface">Invoice Register</h3>
          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]" />
              <input
                className="pl-10 pr-4 py-2 border border-outline-variant rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-surface-container-lowest text-on-surface w-full md:w-64"
                placeholder="Search invoices..."
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="border border-outline-variant rounded-lg px-4 py-2 text-sm focus:border-primary outline-none bg-surface-container-lowest text-on-surface"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {STATUT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-surface-variant">
                <th
                  className="px-6 py-4 font-label-sm text-on-surface-variant uppercase tracking-wider whitespace-nowrap cursor-pointer select-none"
                  onClick={() => setSortDir(sortDir === 'asc' ? 'desc' : 'asc')}
                >
                  <span className="inline-flex items-center gap-1">
                    Invoice ID
                    <Icon name={sortDir === 'asc' ? 'arrow_drop_up' : 'arrow_drop_down'} size={16} />
                  </span>
                </th>
                <th className="px-6 py-4 font-label-sm text-on-surface-variant uppercase tracking-wider">Client</th>
                <th className="px-6 py-4 font-label-sm text-on-surface-variant uppercase tracking-wider">Session</th>
                <th className="px-6 py-4 font-label-sm text-on-surface-variant uppercase tracking-wider min-w-[180px]">Training</th>
                <th className="px-6 py-4 font-label-sm text-on-surface-variant uppercase tracking-wider whitespace-nowrap">Amount (TND)</th>
                <th className="px-6 py-4 font-label-sm text-on-surface-variant uppercase tracking-wider whitespace-nowrap">Date</th>
                <th className="px-6 py-4 font-label-sm text-on-surface-variant uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 font-label-sm text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="font-body-md text-on-surface divide-y divide-surface-variant">
              {!loading && sorted.map((inv) => (
                <tr key={inv.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="px-6 py-4 font-label-md text-primary font-bold">{inv.id}</td>
                  <td className="px-6 py-4 text-on-surface-variant">{inv.client}</td>
                  <td className="px-6 py-4 text-on-surface-variant">{inv.session}</td>
                  <td className="px-6 py-4 text-on-surface">{inv.formation}</td>
                  <td className="px-6 py-4 font-medium">{inv.montant}</td>
                  <td className="px-6 py-4 text-on-surface-variant">{inv.date}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[inv.statut] || STATUS_STYLES['EN_ATTENTE']}`}>
                      {STATUS_LABELS[inv.statut] || inv.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button type="button" className="text-outline hover:text-primary transition-colors p-1" title="View details">
                      <Icon name="visibility" className="text-[20px]" />
                    </button>
                    <button type="button" className="text-outline hover:text-primary transition-colors p-1" title="Download PDF">
                      <Icon name="download" className="text-[20px]" />
                    </button>
                  </td>
                </tr>
              ))}
              {!loading && sorted.length === 0 && (
                <tr>
                  <td className="px-6 py-8 text-sm text-on-surface-variant text-center" colSpan={8}>
                    No invoices match the search criteria.
                  </td>
                </tr>
              )}
              {loading && (
                <tr>
                  <td className="px-6 py-8 text-sm text-on-surface-variant text-center" colSpan={8}>
                    Chargement...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-surface-variant flex items-center justify-between text-sm text-on-surface-variant">
          <span>Showing {sorted.length} invoice{sorted.length !== 1 ? 's' : ''}</span>
          <div className="flex items-center gap-2">
            <button type="button" className="p-1 rounded hover:bg-surface-container-low">
              <Icon name="chevron_left" className="text-[20px]" />
            </button>
            <button type="button" className="w-8 h-8 rounded bg-primary-container text-on-primary flex items-center justify-center font-medium">1</button>
            <button type="button" className="p-1 rounded hover:bg-surface-container-low">
              <Icon name="chevron_right" className="text-[20px]" />
            </button>
          </div>
        </div>
      </div>

      {/* New Invoice Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/60" onClick={() => setModalOpen(false)}>
          <div className="w-full max-w-lg bg-surface-container-lowest rounded-xl shadow-ambient border border-outline-variant p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-md text-headline-md text-on-background">New Invoice</h3>
              <button type="button" className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors" onClick={() => setModalOpen(false)}>
                <Icon name="close" />
              </button>
            </div>
            <form className="flex flex-col gap-4" onSubmit={handleSave}>
              {saveError && (
                <div className="bg-error-container/20 border border-error-container text-on-error-container rounded-xl px-4 py-3 text-body-md">
                  {saveError}
                </div>
              )}
              {/* Client */}
              <div className="flex flex-col gap-1">
                <label className="text-label-md text-on-surface">Client <span className="text-error">*</span></label>
                <input
                  className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary w-full"
                  type="text"
                  placeholder="Client name"
                  name="client"
                  value={form.client}
                  onChange={updateForm}
                  required
                />
              </div>

              {/* Session */}
              <div className="flex flex-col gap-1">
                <label className="text-label-md text-on-surface">Session <span className="text-error">*</span></label>
                <select
                  className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary w-full"
                  name="sessionId"
                  value={form.sessionId}
                  onChange={updateForm}
                  required
                >
                  <option value="">Select a session</option>
                  {sessions.map((s) => {
                    const f = formations.find((fm) => fm.id === s.formationId);
                    return (
                      <option key={s.id} value={s.id}>
                        Session #{s.id} — {f?.titre || 'N/A'} ({new Date(s.dateDebut).toLocaleDateString('fr-TN')})
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Amounts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-label-md text-on-surface">Total Amount (TND) <span className="text-error">*</span></label>
                  <input
                    className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary w-full"
                    type="number" step="0.001" placeholder="18000.000"
                    name="montant" value={form.montant} onChange={updateForm} required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-label-md text-on-surface">TVA (TND)</label>
                  <input
                    className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary w-full"
                    type="number" step="0.001" placeholder="3600.000"
                    name="tva" value={form.tva} onChange={updateForm}
                  />
                </div>
              </div>

              {/* Date */}
              <div className="flex flex-col gap-1">
                <label className="text-label-md text-on-surface">Invoice Date <span className="text-error">*</span></label>
                <input
                  className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary w-full"
                  type="date"
                  name="date" value={form.date} onChange={updateForm} required
                />
              </div>

              {/* Payment status */}
              <div className="flex flex-col gap-1">
                <label className="text-label-md text-on-surface">Payment Status</label>
                <select
                  className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary w-full"
                  name="statut" value={form.statut} onChange={updateForm}
                >
                  <option value="EN_ATTENTE">Pending</option>
                  <option value="PAYEE">Paid</option>
                  <option value="EN_RETARD">Overdue</option>
                  <option value="ANNULEE">Cancelled</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" className="border border-outline text-on-surface-variant hover:bg-surface-container transition-colors rounded-xl px-6 py-3 text-label-md" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="bg-primary-container text-on-primary hover:bg-[#004494] transition-colors rounded-xl px-6 py-3 text-label-md flex items-center gap-2">
                  <Icon name="add_circle" /> Create Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
