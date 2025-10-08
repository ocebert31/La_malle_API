const mapInvalidField = (errorsArray, fieldRenameMap) => {
  return errorsArray.map(errorItem => {
    const renamedData = {};

    // Parcours chaque champ dans data
    for (const originalField in errorItem.data) {
      if (Object.hasOwn(errorItem.data, originalField)) {
        // Si le champ est dans fieldRenameMap, on prend le nouveau nom, sinon on garde le nom original
        const newFieldName = fieldRenameMap[originalField] || originalField;
        renamedData[newFieldName] = errorItem.data[originalField];
      }
    }
    // Retourne l'objet d'erreur avec le data renommé
    return { ...errorItem, data: renamedData };
  });
};

module.exports = { mapInvalidField }