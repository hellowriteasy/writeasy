import { axiosInstance } from "@/app/utils/config/axios";
import { useCustomToast } from "@/app/utils/hooks/useToast";
import { TUser } from "@/app/utils/types";
import React, { useEffect, useState } from "react";
import moment from "moment";

const SubscriptionUser = ({
  user,
  onUpdate,
}: {
  user:
    | (TUser & {
        expiresAt: string;
        isSubcriptionActive: boolean;
        subscriptionType: string;
      })
    | any;
  onUpdate: () => void;
}) => {
  const [hasExpired, setHasExpired] = useState<null | boolean>(null);
  const [endDate, setEndDate] = useState("");
  const AxiosIns = axiosInstance("");

  const toast = useCustomToast();

  useEffect(() => {
    const expiresAt = user.expiresAt;
    if (expiresAt) {
      setHasExpired(new Date(user.expiresAt) < new Date());
    }
  }, [user.expiresAt]);

  const handleUpdateSubscription = async (userId: string) => {
    if (!endDate) {
      return;
    }
    try {
      await AxiosIns.put("/auth/users/subscribe", {
        user_id: userId,
        end_date: endDate,
      });
      toast("Subscription updated successfully", "success");

      await onUpdate();
    } catch (error) {
      toast("Failed to update subscription ", "error");
    }
  };
  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await AxiosIns.delete(`/auth/users/${userId}`);
      await onUpdate();
      toast("User deleted successfully", "success");
    } catch (error) {
      toast("Failed to delete user", "error");
    }
  };
  const handleSuspendAccount = async (userId: string) => {
    try {
      const res = await AxiosIns.put(`/auth/users/profile/${userId}`, {
        status: "suspended",
      });
      if (res.status === 201) {
        await onUpdate();

        toast("Account suspended successfully", "success");
      }
    } catch (error) {
      toast("Failed to suspend account", "error");
    }
  };
  const handleActivateAccount = async (userId: string) => {
    try {
      const res = await AxiosIns.put(`/auth/users/profile/${userId}`, {
        status: "active",
      });
      if (res.status === 201) {
        await onUpdate();

        toast("Account activated successfully", "success");
      }
    } catch (error) {
      toast("Failed to activate account", "error");
    }
  };
  console.log("user status", user.status);
  return (
    <div
      key={user._id}
      className="bg-white shadow-sm rounded-md p-4 px-14 mb-4 font-unkempt"
    >
      <p className="text-lg font-bold">{user.username}</p>
      <p className="text-gray-600">{user.email}</p>
      <p className="text-gray-600">Role: {user.role}</p>
      <p className="text-gray-600">Status: {user.status}</p>

      <p className="text-gray-600">
        {hasExpired ? "Subscription Expired" : null}
        {user.isSubcriptionActive  ? (
          <p className="text-gray-600">
            Payment Type : {user.payment_type || ""}
          </p>
        ) : null}
        {user.isSubcriptionActive
          ? ` Expires At : ${moment(new Date(user.expiresAt)).format("lll")} `
          : null}
        {hasExpired === null && user.isSubcriptionActive === false
          ? ` No Subscription `
          : null}
      </p>

      <p className="text-gray-600">
        Last Login: {moment(new Date(user.lastLogin)).format("lll")}
      </p>

      <div className="mt-2">
        <input
          type="date"
          value={endDate}
          onChange={handleEndDateChange}
          className="px-3 py-2 border border-gray-300 rounded-md"
        />
        <button
          className="ml-2 px-4 py-2 bg-custom-yellow text-black rounded-md"
          onClick={() => handleUpdateSubscription(user._id)}
        >
          Update Subscription
        </button>

        {user.status === "suspended" ? (
          <button
            className="ml-2 px-4 py-2 bg-green-500 text-white rounded-md"
            onClick={() => handleActivateAccount(user._id)}
          >
            Unsuspend Account
          </button>
        ) : (
          <button
            className="ml-2 px-4 py-2 bg-orange-600 text-white rounded-md"
            onClick={() => handleSuspendAccount(user._id)}
          >
            Suspend Account
          </button>
        )}
        <button
          className="ml-2 px-4 py-2 bg-red-500 text-white rounded-md"
          onClick={() => handleDeleteUser(user._id)}
        >
          Delete User
        </button>
      </div>
    </div>
  );
};

export default SubscriptionUser;
