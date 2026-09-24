import { SupportedLanguage } from './i18n';

declare global {
  interface Window {
    google?: {
      translate?: {
        TranslateElement?: any;
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

/**
 * Google Translate Language Mapping
 */
const GOOGLE_LANG_MAP: Record<SupportedLanguage, string> = {
  en: 'en',
  it: 'it',
  es: 'es',
  fr: 'fr',
  de: 'de',
  la: 'la',
};

/**
 * Set the Google Translate cookie to trigger automatic page-wide translation
 */
export function setGoogleTranslateCookie(targetLang: SupportedLanguage): void {
  if (typeof document === 'undefined') return;

  const googleLang = GOOGLE_LANG_MAP[targetLang] || 'en';
  
  if (targetLang === 'en') {
    // Clear Google Translate cookie for standard English
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`;
    return;
  }

  const cookieVal = `/en/${googleLang}`;
  document.cookie = `googtrans=${cookieVal}; path=/;`;
  document.cookie = `googtrans=${cookieVal}; path=/; domain=.${window.location.hostname};`;
}

/**
 * Initialize Google Translate dynamically if script is not already present
 */
export function initializeGoogleTranslate(targetLang: SupportedLanguage): void {
  if (typeof window === 'undefined') return;

  // Set the translation cookie immediately
  setGoogleTranslateCookie(targetLang);

  // If already loaded, trigger translation change
  if (window.google?.translate?.TranslateElement) {
    applyLanguageToGoogleTranslateWidget(targetLang);
    return;
  }

  // Define global init callback if not already present
  if (!window.googleTranslateElementInit) {
    window.googleTranslateElementInit = () => {
      try {
        new window.google!.translate!.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,it,es,fr,de,la',
            autoDisplay: false,
          },
          'google_translate_element'
        );
        // Apply current target language once initialized
        applyLanguageToGoogleTranslateWidget(targetLang);
      } catch (err) {
        console.warn('Google Translate Element initialization notice:', err);
      }
    };
  }

  // Inject script tag if not present
  if (!document.getElementById('google-translate-script')) {
    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.type = 'text/javascript';
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.head.appendChild(script);
  }
}

/**
 * Programmatically select target language in Google Translate select element
 */
function applyLanguageToGoogleTranslateWidget(targetLang: SupportedLanguage): void {
  if (targetLang === 'en') return;

  setTimeout(() => {
    try {
      const select = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
      if (select) {
        select.value = GOOGLE_LANG_MAP[targetLang];
        select.dispatchEvent(new Event('change'));
      }
    } catch {
      // Element might still be mounting
    }
  }, 400);
}
