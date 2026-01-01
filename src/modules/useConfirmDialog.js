import React, { useCallback, useState } from "react";

export const ACTIONS = {
  ADD: "ADD",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
};

const useConfirmDialog = () => {
  const [actionType, setActionType] = useState(null);
  const [pendingValues, setPendingValues] = useState(null);
  const [pendingActions, setPendingActions] = useState(null);
  const [operationModule, setOperationModule] = useState(null);

  const openDialog = useCallback(
    (action, values, actions, operation_module) => {
      setActionType(action);
      setPendingValues(values);
      setPendingActions(actions);
      setOperationModule(operation_module);
    },
    []
  );

  const closeDialog = useCallback(() => {
    setActionType(null);
    setPendingValues(null);
    setPendingActions(null);
    setOperationModule(null);
  }, []);

  return {
    isOpen: Boolean(actionType),
    actionType,
    pendingValues,
    pendingActions,
    operationModule,
    openDialog,
    closeDialog,
  };
};

export default useConfirmDialog;
