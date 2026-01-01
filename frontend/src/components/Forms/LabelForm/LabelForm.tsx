interface Props {
  children: any,
}

function LabelForm(props: Props) {
  return (
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {props.children}
    </label>
  );
}

export default LabelForm;
