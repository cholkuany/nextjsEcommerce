"use client";

import { useCallback } from "react";

import type {
  IVariantCombination,
  IVariantOption,
  IVariantDefinition,
  TWeightUnit,
  TDisplayType
} from "@/models/modelTypes/product";

// ADVANCED VARIANTS COMPONENT
export function VariantManagement({
  variantDefs,
  variants,
  onDefs,
  onVariants,
}: {
  variantDefs: IVariantDefinition[];
  variants: IVariantCombination[];
  onDefs: (defs: IVariantDefinition[]) => void;
  onVariants: (vars: IVariantCombination[]) => void;
}) {
  const addDef = useCallback(() => {
    onDefs([
      ...variantDefs,
      {
        name: "",
        values: [],
        displayType: "dropdown",
      },
    ]);
  }, [onDefs, variantDefs]);

  function updateDef(idx: number, patch: Partial<IVariantDefinition>) {
    const defs = [...variantDefs];
    defs[idx] = { ...defs[idx], ...patch };
    onDefs(defs);
  }

  function addDefValue(idx: number, value: string) {
    const defs = [...variantDefs];
    if (!defs[idx].values.includes(value))
      defs[idx].values = [...defs[idx].values, value];
    onDefs(defs);
  }

  function removeDef(idx: number) {
    onDefs(variantDefs.filter((_, i) => i !== idx));
  }

  function addVariant() {
    onVariants([
      ...variants,
      {
        options: variantDefs.map((d) => ({
          name: d.name,
          value: d.values[0] || "",
        })),
        sku: "",
        price: 0,
        stock: 0,
        isActive: true,
        isDefault: false,
        images: [],
        lowStockThreshold: 10,
        trackQuantity: false,
        allowBackorder: false,
        weightUnit: "kg" as const,
        isPreorder: false,
        availableFrom: new Date(),
        compareAtPrice: 0,
        barcode: "",
        preorderDate: new Date(),
        discontinuedDate: new Date(),
        restockDate: new Date(),
      },
    ]);
  }

  function updateVariant(idx: number, patch: Partial<IVariantCombination>) {
    const arr = [...variants];
    arr[idx] = { ...arr[idx], ...patch };
    onVariants(arr);
  }

  function removeVariant(idx: number) {
    onVariants(variants.filter((_, i) => i !== idx));
  }

  return (
    <div>
      <div>
        <strong>Variant Options (Definitions)</strong>
        {variantDefs.map((def, idx) => (
          <div key={idx} className="my-2 border rounded p-2">
            <input
              className="border p-1 w-36"
              placeholder="Option Name (e.g. Size)"
              value={def.name}
              onChange={(e) => updateDef(idx, { name: e.target.value })}
            />
            <select
              className="border p-1 ml-2"
              value={def.displayType || "dropdown"}
              onChange={(e) =>
                updateDef(idx, { displayType: e.target.value as TDisplayType | undefined })
              }
            >
              <option value="dropdown">Dropdown</option>
              <option value="swatch">Swatch</option>
              <option value="button">Button</option>
              <option value="image">Image</option>
            </select>
            <input
              className="border p-1 w-28 ml-2"
              placeholder="Add value"
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.currentTarget.value.trim() !== "") {
                  addDefValue(idx, e.currentTarget.value.trim());
                  e.currentTarget.value = "";
                  e.preventDefault();
                }
              }}
            />
            <span className="ml-2">
              {def.values.map((v, vi) => (
                <span
                  key={vi}
                  className="inline-block bg-gray-200 px-2 rounded mr-1"
                >
                  {v}
                </span>
              ))}
            </span>
            <button
              type="button"
              onClick={() => removeDef(idx)}
              className="text-red-600 ml-4"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addDef}
          className="bg-blue-200 rounded px-2 py-1 mt-1"
        >
          Add Variant Option
        </button>
      </div>

      <div className="mt-4">
        <strong>Variants</strong>
        {variants.map((v, i) => (
          <div key={i} className="border rounded p-2 mb-2">
            <div className="flex flex-wrap gap-x-2 mb-2">
              {variantDefs.map((def, di) => (
                <span key={di} className="mr-2">
                  <label>{def.name}:</label>
                  <select
                    value={
                      v.options.find((o: IVariantOption) => o.name === def.name)
                        ?.value || ""
                    }
                    onChange={(e) => {
                      const options = v.options.map((o: IVariantOption) =>
                        o.name === def.name
                          ? { ...o, value: e.target.value }
                          : o
                      );
                      updateVariant(i, { options });
                    }}
                    className="ml-1 border rounded"
                  >
                    {def.values.map((val, vi) => (
                      <option key={vi} value={val}>
                        {val}
                      </option>
                    ))}
                  </select>
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-x-2 items-center">
              <label>
                Barcode
                <input
                  name="barcode"
                  defaultValue={v.barcode ?? "BARCODE"}
                  className="p-1 border border-gray-400 rounded mb-2 bg-gray-200 focus:bg-gray-100 focus:outline-gray-600 ml-2"
                />
              </label>
              <label className="block">
                Compare price:
                <input
                  type="number"
                  name="compareAtPrice"
                  defaultValue={v.compareAtPrice ?? 0}
                  className="p-1 border border-gray-400 rounded mb-2 bg-gray-200 focus:bg-gray-100 focus:outline-gray-600 ml-2"
                />
              </label>
              <label className="block">
                Stock:
                <input
                  name="discontinuedDate"
                  defaultValue={v.stock ?? 0}
                  className="p-1 border border-gray-400 rounded mb-2 bg-gray-200 focus:bg-gray-100 focus:outline-gray-600 ml-2"
                />
              </label>
              {/* <label className="block">
                Weight Unit
                <select
                  name="weightUnit"
                  value={v.weightUnit}
                  onChange={(e) =>
                    updateVariant(i, {
                      weightUnit: e.target.value as TWeightUnit,
                    })
                  }
                  className="relative p-1 border border-gray-400 rounded mb-2 bg-gray-200 focus:bg-gray-100 focus:outline-gray-600 ml-2"
                >
                  {["kg", "lb", "g", "oz"].map((unit, index) => (
                    <option key={index} value={unit} className="absolute top-6">
                      {unit}
                    </option>
                  ))}
                </select>
              </label> */}
              <label className="block">
                Weight{" "}
                <input
                  type="number"
                  value={v.weight}
                  onChange={(e) =>
                    updateVariant(i, { weight: Number(e.target.value) })
                  }
                  className="p-1 border border-gray-400 rounded mb-2 bg-gray-200 focus:bg-gray-100 focus:outline-gray-600 ml-2"
                />
                <select
                  name="weightUnit"
                  value={v.weightUnit}
                  onChange={(e) =>
                    updateVariant(i, {
                      weightUnit: e.target.value as TWeightUnit,
                    })
                  }
                  className="relative p-1 border border-gray-400 rounded mb-2 bg-gray-200 focus:bg-gray-100 focus:outline-gray-600 ml-2"
                >
                  {["kg", "lb", "g", "oz"].map((unit, index) => (
                    <option key={index} value={unit} className="absolute top-6">
                      {unit}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                Low stock threshold
                <input
                  type="number"
                  value={v.lowStockThreshold}
                  onChange={(e) =>
                    updateVariant(i, {
                      lowStockThreshold: Number(e.target.value),
                    })
                  }
                  className="relative p-1 border border-gray-400 rounded mb-2 bg-gray-200 focus:bg-gray-100 focus:outline-gray-600 ml-2"
                />
              </label>
              <label>
                {v.options.map((option, index) => (
                  <div key={option.name + index} className="inline-block">
                    <input
                      className="border p-1 w-36"
                      placeholder="Option Name (e.g. Size)"
                      value={option.name}
                    />
                    <select className="border p-1 ml-2" value="Select option">
                      <option value="dropdown">Dropdown</option>
                      <option value="swatch">Swatch</option>
                      <option value="button">Button</option>
                      <option value="image">Image</option>
                    </select>
                    <input
                      className="border p-1 w-28 ml-2"
                      placeholder="Add value"
                      value={option.value}
                    />
                  </div>
                ))}
              </label>
              <label className="block">
                SKU{" "}
                {
                  <input
                    type="text"
                    value={v.sku}
                    className="p-1 border border-gray-400 rounded mb-2 bg-gray-200 focus:bg-gray-100 focus:outline-gray-600 ml-2"
                  />
                }
              </label>
              <div className="flex flex-wrap gap-y-2 gap-x-4 my-2">
                <label className="inline-block">
                  <input
                    name="active"
                    type="checkbox"
                    checked={v.isActive}
                    onChange={(e) =>
                      updateVariant(i, { isActive: e.target.checked })
                    }
                    className="p-1 border border-gray-400 rounded mb-2 bg-gray-200 focus:bg-gray-100 focus:outline-gray-600 mr-2"
                  />
                  Active
                </label>
                <label className="inline-block">
                  <input
                    name="default"
                    type="checkbox"
                    checked={v.isDefault}
                    onChange={(e) =>
                      updateVariant(i, { isDefault: e.target.checked })
                    }
                    className="p-1 border border-gray-400 rounded mb-2 bg-gray-200 focus:bg-gray-100 focus:outline-gray-600 mr-2"
                  />
                  Default
                </label>
                <label className="inline-block">
                  <input
                    name="trackQuantity"
                    type="checkbox"
                    checked={v.trackQuantity}
                    onChange={(e) =>
                      updateVariant(i, { trackQuantity: e.target.checked })
                    }
                    className="p-1 border border-gray-400 rounded mb-2 bg-gray-200 focus:bg-gray-100 focus:outline-gray-600 mr-2"
                  />
                  Track Quantity
                </label>
                <label className="inline-block">
                  <input
                    name="preOrder"
                    type="checkbox"
                    value={v.isPreorder ? "true" : "false"}
                    onChange={(e) =>
                      updateVariant(i, { isPreorder: e.target.checked })
                    }
                    checked={v.isPreorder}
                    className="mr-2"
                  />
                  Pre-Order
                </label>
                <label className="inline-block">
                  <input
                    type="checkbox"
                    name="backOrder"
                    checked={v.allowBackorder}
                    onChange={(e) =>
                      updateVariant(i, { allowBackorder: e.target.checked })
                    }
                    className="p-1 border border-gray-400 rounded mb-2 bg-gray-200 focus:bg-gray-100 focus:outline-gray-600 mr-2"
                  />{" "}
                  Back Order
                </label>
              </div>

              <label className="block">
                Restock Date{" "}
                <input
                  type="date"
                  value={v.restockDate?.getDate() ?? ""}
                  className="p-1 border border-gray-400 rounded mb-2 bg-gray-200 focus:bg-gray-100 focus:outline-gray-600 ml-2"
                />
              </label>
              <label className="block">
                Pre-order Date{" "}
                <input
                  type="date"
                  value={v.preorderDate?.getDate() ?? ""}
                  className="p-1 border border-gray-400 rounded mb-2 bg-gray-200 focus:bg-gray-100 focus:outline-gray-600 ml-2"
                />
              </label>
              <label className="block">
                Available From{" "}
                <input
                  type="date"
                  name="availableFrom"
                  defaultValue={
                    v.availableFrom
                      ? new Date(v.availableFrom).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                      })
                      : ""
                  }
                  onChange={(e) =>
                    updateVariant(i, {
                      availableFrom: new Date(e.target.value),
                    })
                  }
                  className="p-1 border border-gray-400 rounded mb-2 bg-gray-200 focus:bg-gray-100 focus:outline-gray-600 ml-2"
                />
              </label>
              <label className="block">
                Discontinued Date:
                <input
                  name="discontinuedDate"
                  type="date"
                  defaultValue={
                    v.discontinuedDate
                      ? typeof v.discontinuedDate === "string"
                        ? v.discontinuedDate
                        : v.discontinuedDate.toISOString().slice(0, 10)
                      : ""
                  }
                  className="p-1 border border-gray-400 rounded mb-2 bg-gray-200 focus:bg-gray-100 focus:outline-gray-600 ml-2"
                />
              </label>

              {/* <label className="block">
                <fieldset className="border rounded p-4">
                  <legend className="font-semibold">Variant Images</legend>
                  <ImageManagement
                    images={v.images}
                    onAdd={handleAddImg}
                    onDelete={handleDelImg}
                    onPrimary={handlePrimaryImg}
                  />
                </fieldset>
              </label> */}
              <button
                type="button"
                className="text-red-600 ml-3"
                onClick={() => removeVariant(i)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addVariant}
          className="bg-blue-200 rounded px-2 py-1"
        >
          Add Variant
        </button>
      </div>
    </div>
  );
}
