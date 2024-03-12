interface CheckboxProps {
    label: string;
    checked: boolean;
    onChange: () => void;
  }
  
  const CheckboxControl = ({ label, checked, onChange }: CheckboxProps) => (
    <div style={{ textAlign: "left" }}>
      <label>
        <input type="checkbox" checked={checked} onChange={onChange} />
        {label}
      </label>
    </div>
  );

  export default CheckboxControl;