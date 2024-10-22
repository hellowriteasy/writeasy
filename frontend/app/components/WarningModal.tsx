import React from "react";
import Subscription from "./Subscription";

type TWarningModal = {
  role: string;
  status: string;
  isAccountSuspended: boolean;
  isSubcriptionActive?: boolean;
};
const WarningModal = ({
  role,
  isAccountSuspended,
  status,
  isSubcriptionActive,
}: TWarningModal) => {
  if (role === "admin") return <></>;
  if (status === "suspended") {
    return <Subscription isAccountSuspended={true} />;
  }
  if (!isSubcriptionActive) {
    return <Subscription />;
  }
};

export default WarningModal;
