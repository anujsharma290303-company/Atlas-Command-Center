
export type FormFieldConfig<T> = {
  [K in keyof T]: {
    label: string;
    type: "text" | "number" | "select" | "date";
    inputType?: "text" | "password" | "email"; 
    placeholder?: string;
    validation?: (value: T[K]) => string | null;
  };
};