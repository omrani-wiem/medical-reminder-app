export const validerResetPassword = (formData, t) => {
  if (!formData.email || !formData.code || !formData.new_password)
    return t('auth.allFieldsRequired');

  if (formData.new_password !== formData.confirm_password)
    return t('auth.passwordMismatch');

  if (formData.new_password.length < 6)
    return t('auth.passwordTooShort');

  return null;
};