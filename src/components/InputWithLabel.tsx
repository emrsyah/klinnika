import React from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

// Define the InputWithLabelProps interface
interface InputWithLabelProps extends React.HTMLProps<HTMLDivElement> {
  label: string;
  value: string;
  loading?: boolean;
}

const InputWithLabel = React.forwardRef<HTMLDivElement, InputWithLabelProps>(
  ({ label, value, loading = false, ...restProps }, ref) => {
    return (
      <div className="grid w-full max-w-sm items-center gap-1.5" {...restProps}>
        <Label htmlFor="email">{label}</Label>
        <Input
          type="email"
          id="email"
          placeholder="Placeholder"
          className="text-gray-700 font-medium !opacity-90"
          disabled
          value={loading ? "Loading..." : value}
        />
      </div>
    );
  }
);

InputWithLabel.displayName = "InputWithLabel";

export default InputWithLabel;
