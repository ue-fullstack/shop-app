import { createContext, useContext, useState } from 'react';
import { translations } from '../utils/translations';
import { TranslationKeys } from '../utils/translationKeys';
import Locale from '../types/locale';

interface AppContextInterface {
    loading: boolean;
    setLoading: (load: boolean) => void;
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (key: TranslationKeys) => string;
}

const AppContext = createContext<AppContextInterface>({
    loading: false,
    setLoading: () => {
        // empty function
    },
    locale: Locale.FR,
    setLocale: () => {
        // empty function
    },
    t: (key: TranslationKeys) => key,
});

type Props = {
    children: JSX.Element;
};

export function AppProvider({ children }: Props) {
    const [loading, setLoading] = useState<boolean>(false);
    const [locale, setLocale] = useState<Locale>(Locale.FR);

    const t = (key: TranslationKeys) => {
        return translations[locale][key] || key;
    };

    return (
        <AppContext.Provider
            value={{
                loading,
                setLoading,
                locale,
                setLocale,
                t,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export const useAppContext = () => useContext(AppContext);
