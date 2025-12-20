import {
  FiTrash2,
  FiPlus
} from "react-icons/fi";

import { IVariantOption } from "@/models/modelTypes/product"
const Options = ({ options, handleOptionChange, inputClasses, v_idx, variantId, removeVariantOption, addVariantOption }:
  {
    options: IVariantOption[],
    handleOptionChange: (variantId: string, optIndex: number, field: "name" | "value", value: string) => void,
    inputClasses: string,
    v_idx: number,
    variantId: string,
    removeVariantOption: (variantId: string, optIndex: number) => void,
    addVariantOption: (variantId: string) => void,
  }) => {
  return (
    <div className="space-y-2">
      {options.map((opt, o_idx) => (
        <div key={o_idx} className="flex items-center gap-2">
          <Option
            opt={opt}
            o_idx={o_idx}
            v_idx={v_idx}
            variantId={variantId}
            handleOptionChange={handleOptionChange}
            inputClasses={inputClasses}
          />
          {options.length > 1 && (
            <button
              type="button"
              onClick={() =>
                removeVariantOption(variantId, o_idx)
              }
              className="text-gray-400 hover:text-red-600"
            >
              <FiTrash2 />
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() => addVariantOption(variantId)}
        className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
      >
        <FiPlus className="mr-1" /> Add Option
      </button>
    </div>
  );
};

export default Options;

const Option = (
  { opt, o_idx, v_idx, variantId, handleOptionChange, inputClasses }:
    {
      v_idx: number,
      handleOptionChange: (variantId: string, optIndex: number, field: "name" | "value", value: string) => void,
      o_idx: number,
      opt: IVariantOption,
      variantId: string,
      inputClasses: string
    }) => {
  return <>
    <input
      name={`variants[${v_idx}][options][${o_idx}][name]`}
      value={opt.name}
      onChange={(e) =>
        handleOptionChange(
          variantId,
          o_idx,
          "name",
          e.target.value
        )
      }
      placeholder="Option Name (e.g. Size)"
      className={inputClasses}
    />
    <input
      name={`variants[${v_idx}][options][${o_idx}][value]`}
      value={opt.value}
      onChange={(e) =>
        handleOptionChange(
          variantId,
          o_idx,
          "value",
          e.target.value
        )
      }
      placeholder="Option Value (e.g. Medium)"
      className={inputClasses}
    />
  </>
}