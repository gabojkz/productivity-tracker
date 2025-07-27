// Holiday service for fetching bank holidays
export class HolidayService {
  constructor() {
    this.baseUrl = 'https://date.nager.at/api/v3';
  }

  convertCountryCodes(countryCode) {
    switch (countryCode) {
      case 'UK':
        return 'GB';
      case 'GB':
          return 'GB';
      case 'US':
        return 'US';
      case 'CA':
        return 'CA';
      case 'AU':
        return 'AU';
      case 'NZ':
        return 'NZ';
      case 'PT':
        return 'PT';
      case 'ES':
        return 'ES';
      case 'FR':
        return 'FR';
      case 'DE':
        return 'DE';
      case 'IT':
        return 'IT';
      case 'NL':
        return 'NL';
      case 'BE':
        return 'BE';
      case 'SE':
        return 'SE';
      case 'AR':
        return 'AR';
      case 'BR':
        return 'BR';
      case 'CL':
        return 'CL';
      case 'CO':
        return 'CO';
      case 'MX':
        return 'MX';
      case 'PE':
        return 'PE';
      case 'VE':
        return 'VE';
      default:
        return 'US';
    }
  }

  async getBankHolidays(year, countryCode) {
    try {
      console.log(countryCode); 
      const response = await fetch(`${this.baseUrl}/PublicHolidays/${year}/${this.convertCountryCodes(countryCode)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const holidays = await response.json();
      return holidays.map(holiday => ({
        date: holiday.date,
        name: holiday.localName,
        type: holiday.type
      }));
    } catch (error) {
      console.error('Error fetching bank holidays:', error);
      return [];
    }
  }

  async getHolidaysForYear(year, countryCode) {
    try {
      const holidays = await this.getBankHolidays(year, this.convertCountryCodes(countryCode));
      return holidays.reduce((acc, holiday) => {
        acc[holiday.date] = holiday;
        return acc;
      }, {});
    } catch (error) {
      console.error('Error fetching holidays for year:', error);
      return {};
    }
  }
}

export default new HolidayService(); 