import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useEffect } from "react";
import { useCallback } from "react";

const useBtnPermission = (moduleName) => {
  //   const [permissionList, setPermissionList] = useState([]);
  const [btnAddEnabled, setBtnAddEnabled] = useState(false);
  const [btnUpdateEnabled, setBtnUpdateEnabled] = useState(false);
  const [btnDeleteEnabled, setBtnDeleteEnabled] = useState(false);

  const { permissions } = useAuth();

  //   useEffect(() => {
  //     // setPermissionList(permissions);
  //   }, [permissions]);

  const addBtnPermissions = useCallback(() => {
    setBtnAddEnabled(false);
    setBtnUpdateEnabled(false);
    setBtnDeleteEnabled(false);

    if (!Array.isArray(permissions) || !moduleName) return;

    const modulepermissions = permissions.filter((p) =>
      p.startsWith(moduleName)
    );
    modulepermissions.forEach((p) => {
      if (p.includes("CREATE")) setBtnAddEnabled(true);
      if (p.includes("UPDATE")) setBtnUpdateEnabled(true);
      if (p.includes("DELETE")) setBtnDeleteEnabled(true);
    });
  }, [permissions, moduleName]); 

  useEffect(() => {
    addBtnPermissions();
    
  }, [permissions, moduleName, addBtnPermissions]);

  //   const getBtnPermissions = (permissions) => {
  //     if (!permissions) return;
  //     const modulePermissions = permissions.filter((p) =>
  //       p.startsWith(moduleName)
  //     );
  //     modulePermissions.forEach((p) => {
  //       if (p.includes("CREATE")) {
  //         setBtnAddEnabled(true);
  //       }
  //       if (p.includes("UPDATE")) {
  //         setBtnUpdateEnabled(true);
  //       }
  //       if (p.includes("DELETE")) {
  //         setBtnDeleteEnabled(true);
  //       }
  //     });
  //   }

  //    useEffect(() => {
  //     getBtnPermissions(permissionList);
  //   }, [permissionList]);

  return {
    btnAddEnabled,
    btnUpdateEnabled,
    btnDeleteEnabled,
  };
};
export default useBtnPermission;
