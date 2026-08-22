import React, { useState } from 'react';
import Icon from '../../components/common/Icon';
import authService from '../../services/auth/authService';

export default function Parametres() {
  const [pwdForm, setPwdForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [pwdMsg, setPwdMsg] = useState({ type: '', text: '' });
  const [pwdSaving, setPwdSaving] = useState(false);

  const handlePwdChange = (e) => {
    const { name, value } = e.target;
    setPwdForm((prev) => ({ ...prev, [name]: value }));
    setPwdMsg({ type: '', text: '' });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwdMsg({ type: '', text: '' });

    if (!pwdForm.currentPassword || !pwdForm.newPassword || !pwdForm.confirmPassword) {
      setPwdMsg({ type: 'error', text: 'Veuillez remplir tous les champs.' });
      return;
    }
    if (pwdForm.newPassword.length < 8) {
      setPwdMsg({ type: 'error', text: 'Le nouveau mot de passe doit contenir au moins 8 caractères.' });
      return;
    }
    if (pwdForm.newPassword !== pwdForm.confirmPassword) {
      setPwdMsg({ type: 'error', text: 'Les mots de passe ne correspondent pas.' });
      return;
    }

    setPwdSaving(true);
    try {
      await authService.changePassword(pwdForm);
      setPwdMsg({ type: 'success', text: 'Mot de passe modifié avec succès.' });
      setPwdForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPwdMsg({ type: 'error', text: err.response?.data?.error || 'Une erreur est survenue.' });
    } finally {
      setPwdSaving(false);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="mb-10">
        <h2 className="font-display-lg text-display-lg text-on-surface tracking-tight">
          Configuration
        </h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-2">
          Manage global platform preferences and security protocols.
        </p>
      </div>

      <div className="grid grid-cols-12 gap-gutter">
        <div className="col-span-12 flex flex-col gap-gutter">
          <section className="bg-surface-container-lowest rounded-xl border border-surface-variant shadow-ambient p-8">
            <div className="border-b border-surface-variant pb-4 mb-6">
              <h3 className="font-headline-md text-headline-md text-on-surface">Sécurité</h3>
              <p className="font-label-md text-label-md text-on-surface-variant mt-1">
                Authentication and session management rules.
              </p>
            </div>
            <div className="border-t border-surface-variant pt-6 mt-6">
              <h4 className="font-label-md text-label-md text-on-surface mb-1">
                Changer mon mot de passe
              </h4>
              <p className="font-label-sm text-label-sm text-on-surface-variant mb-4">
                Mettez à jour le mot de passe de votre compte.
              </p>

              {pwdMsg.text && (
                <div className={`mb-4 rounded-lg border px-4 py-3 text-sm ${
                  pwdMsg.type === 'success'
                    ? 'border-success/30 bg-success-container text-on-success-container'
                    : 'border-error/30 bg-error-container text-on-error-container'
                }`}>
                  {pwdMsg.text}
                </div>
              )}

              <form className="grid grid-cols-1 md:grid-cols-3 gap-4" onSubmit={handleChangePassword}>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-2">
                    Mot de passe actuel
                  </label>
                  <input
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                    type="password"
                    name="currentPassword"
                    value={pwdForm.currentPassword}
                    onChange={handlePwdChange}
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-2">
                    Nouveau mot de passe
                  </label>
                  <input
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                    type="password"
                    name="newPassword"
                    value={pwdForm.newPassword}
                    onChange={handlePwdChange}
                    placeholder="Min. 8 caractères"
                  />
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-2">
                    Confirmation
                  </label>
                  <input
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                    type="password"
                    name="confirmPassword"
                    value={pwdForm.confirmPassword}
                    onChange={handlePwdChange}
                    placeholder="••••••••"
                  />
                </div>
                <div className="md:col-span-3 flex justify-end">
                  <button
                    type="submit"
                    disabled={pwdSaving}
                    className="px-6 py-2.5 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md hover:opacity-90 shadow-ambient transition-opacity disabled:opacity-60"
                  >
                    {pwdSaving ? 'Mise à jour...' : 'Changer le mot de passe'}
                  </button>
                </div>
              </form>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}