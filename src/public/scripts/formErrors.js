const errorDataDom = document.querySelector('#error-data');
if (!errorDataDom) throw new Error('Could not find the error data element.');

const givenDataDom = document.querySelector('#given-data');
if (!givenDataDom) throw new Error('Could not find the given data element.');

/**
 * @type {import('zod').z.core.$ZodIssue[]}
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const errorData = JSON.parse(errorDataDom.getHTML());
/**
 * @type {Record<string, string> & {owned_pokemon: number[]} }
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const givenData = JSON.parse(givenDataDom.getHTML());

for (const error of errorData) {
  const propertyName = error.path.at(0);
  if (!propertyName) throw new Error('Zod property path is undefined');
  document
    .querySelector(`[name="${CSS.escape(propertyName.toString())}"]`)
    ?.classList.add('error');
}

/**
 * @param {HTMLElement} selectDom
 * @param {number[]} optionData
 * @return {void}
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const setMultiselectData = (selectDom, optionData) => {
  for (const optionId of optionData) {
    /**
     * @type {HTMLOptionElement | null}
     */
    const option = selectDom.querySelector(
      `option[value="${CSS.escape(optionId.toString())}"]`,
    );
    if (option) option.selected = true;
  }
};

for (const [fieldName, fieldValue] of Object.entries(givenData)) {
  /**
   * @type {HTMLFormElement | null}
   */
  const fieldDom = document.querySelector(`[name="${CSS.escape(fieldName)}"]`);

  if (!fieldDom) continue;

  if (typeof fieldValue !== 'string' && fieldDom.matches('select[multiple]')) {
    setMultiselectData(fieldDom, fieldValue);
    continue;
  }

  fieldDom.value = fieldValue;
}
