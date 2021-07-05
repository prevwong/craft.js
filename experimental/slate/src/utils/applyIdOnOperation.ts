import shortid from 'shortid';
import { Operation } from 'slate';

const fieldForOperation = {
  // eslint-disable-next-line @typescript-eslint/camelcase
  insert_node: 'node',
  // eslint-disable-next-line @typescript-eslint/camelcase
  split_node: 'properties',
};

function isValidOperation(
  operationType: string
): operationType is keyof typeof fieldForOperation {
  return operationType in fieldForOperation;
}

const applyIdToProperty = (property: any) => {
  const { children } = property;
  const newId = shortid();

  const op = {
    ...property,
    id: newId,
    // We need to generate a new id for the children (if any)
    // Otherwise this causes issue with copy-paste (TEXT-316, TEXT-439)
    ...(children
      ? { children: children.map((child: any) => applyIdToProperty(child)) }
      : {}),
  };

  return op;
};

export const applyIdOnOperation = (operation: Operation) => {
  const { type } = operation;

  if (isValidOperation(type)) {
    const propertyToChange = fieldForOperation[type];
    const ops = operation[propertyToChange];

    return {
      ...operation,
      [propertyToChange]: applyIdToProperty(ops),
    };
  }

  return operation;
};
