// utils/registerUtils.js

export const FORM_INITIAL = {
  nom: '', prenom: '', email: '',
  password: '', confirmPassword: '',
  faculte: '', niveau: ''
};

export const FACULTES = [
  { value: 'medecine',   label: 'Médecine' },
  { value: 'pharmacie',  label: 'Pharmacie' },
  { value: 'dentaire',   label: 'Médecine Dentaire' },
  { value: 'infirmier',  label: 'Sciences Infirmières' },
  { value: 'autre',      label: 'Autre' }
];

export const NIVEAUX = [
  { value: 'L1', label: 'Licence 1' },
  { value: 'L2', label: 'Licence 2' },
  { value: 'L3', label: 'Licence 3' },
  { value: 'M1', label: 'Master 1' },
  { value: 'M2', label: 'Master 2' },
  { value: 'doctorat',       label: 'Doctorat' },
  { value: 'professionnel',  label: 'Professionnel' }
];

export const validerRegister = (formData, acceptTerms, t) => {
  if (!formData.nom || !formData.prenom || !formData.email ||
      !formData.password || !formData.confirmPassword)
    return t('auth.allFieldsRequired');

  if (!acceptTerms)
    return t('auth.acceptTermsRequired');

  if (formData.password !== formData.confirmPassword)
    return t('auth.passwordMismatch');

  if (formData.password.length < 6)
    return t('auth.passwordTooShort');

  return null;
};