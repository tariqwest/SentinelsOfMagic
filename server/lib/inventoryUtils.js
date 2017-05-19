const validateAddItemForm = (form) => {
  const errors = {};
  const success = true;

  if (form.name === '') {
    success = false;
    errors.name = 'Please enter an item name';
  }
  if (form.notes === '') {
    success = false;
    errors.notes = 'Please add some notes to your item';
  }

  return { success, errors };
};

module.exports.validateAddItemForm = validateAddItemForm;
