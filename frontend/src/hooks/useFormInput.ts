import { useState } from "react";

const useFormInput = <T extends object>(initialState: T) => {
  const [formState, setFormState] = useState<T>(initialState);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  return [formState, handleInputChange] as const;
};

export default useFormInput;


