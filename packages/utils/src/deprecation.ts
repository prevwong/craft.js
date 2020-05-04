export const deprecationWarning = (name, suggestion?) =>
  console.warn(
    `Deprecation warning: ${name} will be deprecated. ${suggestion}`
  );
