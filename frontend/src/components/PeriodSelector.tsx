import React from 'react';

import { useTranslation } from 'react-i18next';

import { TIME_PERIODS } from '../utils/helpers';

interface Props {
  selectedPeriod: string;
  onChange: (period: string) => void;
}

const PeriodSelector: React.FC<Props> = ({ selectedPeriod, onChange }) => {
  const { t } = useTranslation();

  return (
    <div>
      <label htmlFor="period-select" className="block text-sm font-medium text-gray-700 mb-2">
        {t('charts.timePeriodTitle')}
      </label>
      <select
        id="period-select"
        className="border border-gray-300 rounded px-4 py-2 text-sm w-full"
        value={selectedPeriod}
        onChange={(e) => onChange(e.target.value)}
      >
        {TIME_PERIODS.map((period) => (
          <option key={period.value} value={period.value}>
            {period.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default PeriodSelector;