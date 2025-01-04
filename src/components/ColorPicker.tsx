import { ChangeEventHandler, useId } from 'react';

type Props = {
  label: string;
  initial: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
};

const ColorPicker = ({ onChange, label, initial }: Props) => {
  const id = useId();

  return (
    <div className="flex gap-2 items-center">
      <input type="color" id={id} value={initial} onChange={onChange} />
      <label htmlFor={id}>{label}</label>
    </div>
  );
};

export default ColorPicker;
