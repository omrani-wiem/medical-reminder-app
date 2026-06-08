export const Language = [
    { code: 'fr', name: 'Français', flag:'🇫🇷' },
    { code: 'en', name: 'English', flag:'🇬🇧' }
    { code: 'ar', name: 'العربية', flag:'🇸🇦' }
];

export const isRTL = (langCode) => {
    return langCode === 'ar';
};