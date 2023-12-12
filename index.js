import { writeFile } from 'fs/promises';

import input from './input.json' assert { type: "json" };
import { sanitizeNonUSZipCode, sanitizeUSZipCode } from './utils.js';

const isUSCountry = (country) => {
  if (country && country.indexOf('United States of America') === -1) {
    return true;
  }
  return false;
}

const isUSState = (state) => {
  if (state && state === 'N/A - outside USA') {
    return false;
  }
  return true;
}

const recordIsNonUS = (record) => {
  const nonUSCountry = isUSCountry(record.country)
    ? record.country
    : null;
  const nonUSState = !isUSState(record.state);
  return nonUSCountry || nonUSState;
};

const keyForRecord = (record) => {
  if (record.zipCode === 0 || record.zipCode === '0' || record.zipCode === '-') {
    return '-';
  }

  const nonUSCountry = isUSCountry(record.country)
    ? record.country
    : null;
  const nonUSState = !isUSState(record.state);

  const zipCode = nonUSCountry || nonUSState
    ? sanitizeNonUSZipCode(record.zipCode)
    : sanitizeUSZipCode(record.zipCode);
  
  if (nonUSCountry) {
    return `${zipCode}-$-${nonUSCountry}`;
  }
  if (nonUSState) {
    return `${zipCode}-$-${record.state}`;
  }
  if (zipCode.indexOf('-') !== -1) {
    return zipCode.split('-')[0];
  }
  return zipCode;
};


const recordsByZipCodeAndCountry = (input) => {
  let byKey = {};
  input.forEach(record => {
    const key = keyForRecord(record);
    if (!byKey[key]) {
      byKey[key] = [];
    }
    byKey[key].push(record);
  });
  return byKey;
};

const congressionalDistrictListFromRecords = (records) => {
  let uniqueDistricts = {};
  records.forEach(record => {
    if (record.congressionalDistrict) {
      uniqueDistricts[record.congressionalDistrict] = true;
    }
  });
  const districts = Object.keys(uniqueDistricts).sort().join(', ');
  return districts.split(', ').sort().join(', ');
};

const emailsFromRecords = (records) => {
  let uniqueEmails = {};
  records.forEach(record => {
    if (record.email) {
      uniqueEmails[record.email] = true;
    }
  });
  const emails = Object.keys(uniqueEmails).sort().join(', ');
  return emails.split(', ').sort().join(', ');
};

const sortByZipCode = (a, b) => {
  if (a.zipCode < b.zipCode) {
    return -1;
  }
  if (a.zipCode > b.zipCode) {
    return 1;
  }
  return 0;
};

const dedupedZipCodeRecords = (byKey) => {
  const output = Object.entries(byKey)
    .filter(([key, records]) => records.length > 0)
    .map(([key, records]) => {
      const zipCode = key.split('-$-')[0];
      const congressionalDistrict = congressionalDistrictListFromRecords(records);
      const email = emailsFromRecords(records);
      const metroArea = records.find(record => record.metroArea)?.metroArea;
      const outputZipCode = congressionalDistrict?.length > 0
        ? sanitizeUSZipCode(zipCode)
        : zipCode;
      const isUS = records.find(record => recordIsNonUS(record)) === undefined;
      return {
        zipCode: outputZipCode,
        congressionalDistrict: congressionalDistrict && isUS ? congressionalDistrict : undefined,
        email: email ? email : undefined,
        metroArea
      };
    });
  return output.sort(sortByZipCode);
};

const writeToCSV = (output) => {
  const headings = 'Zip Code,Congressional District,Metro Area,Email';
  const csv = output.map(record => {
    return `"${record.zipCode}","${record.congressionalDistrict || ''}","${record.metroArea || ''}","${record.email || ''}"`;
  }).join('\n');

  const content = `${headings}\n${csv}`;

  writeFile('output.csv', content, 'utf8')
    .then(() => console.info('Written to output.csv'))
    .catch((error) => console.error(error));
}

const run = () => {
  console.info(`Initial input has ${input.length} records`);
  
  const byKey = recordsByZipCodeAndCountry(input);
  console.info(`There are ${Object.keys(byKey).length} distinct country+zip codes`);
  
  const output = dedupedZipCodeRecords(byKey);

  writeToCSV(output);
};

run();
