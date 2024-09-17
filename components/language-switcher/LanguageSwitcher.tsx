'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { ChangeEvent } from 'react';

const LanguageSwitcher = () => {
  const t = useTranslations('LanguageSwitcher');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newLocale = event.target.value;
    const newPathname = pathname.replace(`/${locale}`, '');
    router.push(`/${newLocale}${newPathname}`);
  };

  return (
    <select value={locale} onChange={handleChange}>
      <option value="en">{t('en')}</option>
      <option value="hu">{t('hu')}</option>
    </select>
  );
};

export default LanguageSwitcher;
