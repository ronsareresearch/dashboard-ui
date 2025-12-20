import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const RoleDropdown = ({ value, onChange, isLoading }) => {
  return (
    <div className="space-y-2">
      <label
        htmlFor="role"
        className="block text-sm font-medium text-gray-500"
      >
        Select Role
      </label>

      <Select
        value={value}
        onValueChange={onChange}
        disabled={isLoading}
      >
        <SelectTrigger
          className="w-full  px-6 py-6 flex items-center border border-gray-200 rounded-md bg-white focus:ring-1 focus:ring-[#c99c4a] text-prime-black"
        >
          <SelectValue placeholder="Select role" />
        </SelectTrigger>

        <SelectContent className="text-base">
          <SelectItem value="Admin" className="py-4">Admin</SelectItem>
          <SelectItem value="Member" className="py-4">Member</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default RoleDropdown;
