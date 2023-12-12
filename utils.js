export const sanitizeUSZipCode = (zipCode) => {
  if (zipCode == null) {
    return zipCode;
  }

  if (zipCode === 0 || zipCode === '0' || zipCode === '-') {
    return '-'
  }

  if (!Number.isNaN(Number(zipCode))) {
    return String(zipCode).padStart(5, '0');
  }
  
  return zipCode;
};

export const sanitizeNonUSZipCode = (zipCode) => {
  if (zipCode === 0 || zipCode === '0' || zipCode === '-') {
    return '-'
  }
  
  return zipCode;
};
