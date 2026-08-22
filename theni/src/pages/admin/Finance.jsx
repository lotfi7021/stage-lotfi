import React, { useState } from 'react';
import Icon from '../../components/common/Icon';
import { SESSIONS, FORMATIONS, FACTURES } from '../../data/mock';

const STATUS_STYLES = {
  'Paid':    'bg-green-100 text-green-800 border border-green-200',
  'Pending': 'bg-amber-100 text-amber-800 border border-amber-200',
  'Overdue': 'bg-error-container text-on-error-container border border-[#ffb4ab]',
};

const EMPTY_FORM = {
  session_id: '',
  bon_de_commande: '',
  montant_total: '',
  revenus: '',
  couts: '',
  statut_paiement: 'Pending',
};

// Build display rows from mock FACTURES
const buildInvoices = () =>
  FACTURES.map((f) => {
    const session = SESSIONS.find((s) => s.id === f.session_id);
    const formation = session ? FORMATIONS.find((fm) => fm.id === session.formation_id) : null;
    return {
      id: `INV-${String(f.id).padStart(4, '0')}`,
      session: session ? `Session #${session.id}` : 'N/A',
      formation: formation ? formation.titre : 'N/A',
      montant: f.montant_total.toLocaleString('en-US', { minimumFractionDigits: 3 }),
      bon_de_commande: f.bon_de_commande,
      statut_paiement: f.statut_paiement,
      revenus: f.revenus,
      couts: f.couts,
    };
  });

export default function Finance() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All statuses');
  const [sortDir, setSortDir] = useState('asc');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [invoices, setInvoices] = useState(buildInvoices());

  const updateForm = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    const session = SESSIONS.find((s) => s.id === parseInt(form.session_id));
    const formation = session ? FORMATIONS.find((f) => f.id === session.formation_id) : null;
    const newInvoice = {
      id: `INV-${String(Date.now()).slice(-4)}`,
      session: session ? `Session #${session.id}` : 'N/A',
      formation: formation ? formation.titre : 'N/A',
      montant: parseFloat(form.montant_total).toLocaleString('en-US', { minimumFractionDigits: 3 }),
      bon_de_commande: form.bon_de_commande,
      statut_paiement: form.statut_paiement,
      revenus: parseFloat(form.revenus) || 0,
      couts: parseFloat(form.couts) || 0,
    };
    setInvoices((prev) => [...prev, newInvoice]);
    setForm(EMPTY_FORM);
    setModalOpen(false);
  };

  const query = search.trim().toLowerCase();
  const filtered = invoices.filter((inv) => {
    const matchesSearch =
      query === '' ||
      [inv.id, inv.session, inv.formation, inv.bon_de_commande].some((v) =>
        v.toLowerCase().includes(query)
      );
    const matchesStatus =
      statusFilter === 'All statuses' || inv.statut_paiement === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sorted = [...filtered].sort((a, b) =>
    sortDir === 'asc' ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id)
  );

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
          { label: 'Revenue', value: '142.5K', icon: 'account_balance_wallet', badge: '+12% this month', trend: true, bg: 'bg-secondary-container', fg: 'text-on-secondary-container' },
          { label: 'Pending Invoices', value: '24', icon: 'pending_actions', badge: 'Total: 35,400 TND', trend: false, bg: 'bg-error-container', fg: 'text-on-error-container' },
          { label: 'Allocated Budget', value: '500K', icon: 'pie_chart', badge: 'Consumed: 45%', trend: false, bg: 'bg-surface-container-high', fg: 'text-on-surface-variant' },
          { label: 'Collection Rate', value: '88%', icon: 'verified', badge: 'Target: 95%', trend: true, bg: 'bg-secondary-fixed', fg: 'text-on-secondary-fixed' },
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
              <option>All statuses</option>
              <option>Paid</option>
              <option>Pending</option>
              <option>Overdue</option>
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
                <th className="px-6 py-4 font-label-sm text-on-surface-variant uppercase tracking-wider">Session</th>
                <th className="px-6 py-4 font-label-sm text-on-surface-variant uppercase tracking-wider min-w-[180px]">Training</th>
                <th className="px-6 py-4 font-label-sm text-on-surface-variant uppercase tracking-wider whitespace-nowrap">Amount (TND)</th>
                <th className="px-6 py-4 font-label-sm text-on-surface-variant uppercase tracking-wider whitespace-nowrap">Purchase Order</th>
                <th className="px-6 py-4 font-label-sm text-on-surface-variant uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 font-label-sm text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="font-body-md text-on-surface divide-y divide-surface-variant">
              {sorted.map((inv) => (
                <tr key={inv.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="px-6 py-4 font-label-md text-primary font-bold">{inv.id}</td>
                  <td className="px-6 py-4 text-on-surface-variant">{inv.session}</td>
                  <td className="px-6 py-4 text-on-surface">{inv.formation}</td>
                  <td className="px-6 py-4 font-medium">{inv.montant}</td>
                  <td className="px-6 py-4 text-on-surface-variant">{inv.bon_de_commande}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[inv.statut_paiement] || STATUS_STYLES['Pending']}`}>
                      {inv.statut_paiement}
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
              {sorted.length === 0 && (
                <tr>
                  <td className="px-6 py-8 text-sm text-on-surface-variant text-center" colSpan={7}>
                    No invoices match the search criteria.
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
              {/* Session */}
              <div className="flex flex-col gap-1">
                <label className="text-label-md text-on-surface">Session <span className="text-error">*</span></label>
                <select
                  className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary w-full"
                  name="session_id"
                  value={form.session_id}
                  onChange={updateForm}
                  required
                >
                  <option value="">Select a session</option>
                  {SESSIONS.map((s) => {
                    const f = FORMATIONS.find((fm) => fm.id === s.formation_id);
                    return (
                      <option key={s.id} value={s.id}>
                        Session #{s.id} — {f?.titre || 'N/A'} ({s.date_debut} to {s.date_fin})
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Purchase Order */}
              <div className="flex flex-col gap-1">
                <label className="text-label-md text-on-surface">Purchase Order <span className="text-error">*</span></label>
                <input
                  className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary w-full"
                  type="text"
                  placeholder="e.g. PO-2024-0150"
                  name="bon_de_commande"
                  value={form.bon_de_commande}
                  onChange={updateForm}
                  required
                />
              </div>

              {/* Amounts */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-label-md text-on-surface">Total Amount (TND) <span className="text-error">*</span></label>
                  <input
                    className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary w-full"
                    type="number" step="0.001" placeholder="18000.000"
                    name="montant_total" value={form.montant_total} onChange={updateForm} required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-label-md text-on-surface">Revenue (TND)</label>
                  <input
                    className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary w-full"
                    type="number" step="0.001" placeholder="18000.000"
                    name="revenus" value={form.revenus} onChange={updateForm}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-label-md text-on-surface">Costs (TND)</label>
                  <input
                    className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary w-full"
                    type="number" step="0.001" placeholder="4500.000"
                    name="couts" value={form.couts} onChange={updateForm}
                  />
                </div>
              </div>

              {/* Profit margin preview */}
              {form.revenus && form.couts && (
                <div className="bg-secondary-container/20 border border-secondary rounded-lg p-3 flex justify-between items-center">
                  <span className="text-label-md text-on-surface-variant">Profit margin:</span>
                  <span className="text-headline-sm text-secondary font-bold">
                    {(parseFloat(form.revenus) - parseFloat(form.couts)).toFixed(3)} TND
                  </span>
                </div>
              )}

              {/* Payment status */}
              <div className="flex flex-col gap-1">
                <label className="text-label-md text-on-surface">Payment Status</label>
                <select
                  className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary w-full"
                  name="statut_paiement" value={form.statut_paiement} onChange={updateForm}
                >
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Overdue">Overdue</option>
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
