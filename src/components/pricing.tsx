import { Badge } from "./badge";
export function Pricing({
  price,
  currentPrice,
  isDiscounted,
  discountPercent,
}: {
  price: number;
  currentPrice: number;
  isDiscounted: boolean;
  discountPercent: number;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {isDiscounted ? (
          <>
            <span className="text-sm text-gray-500 line-through">
              ${currentPrice}
            </span>

            <span className="text-lg font-bold text-green-600">${price}</span>
          </>
        ) : (
          <span className="text-lg font-bold text-gray-900">
            ${currentPrice}
          </span>
        )}
      </div>

      {/* % Off */}
      {isDiscounted && discountPercent > 0 && (
        <Badge className="bg-green-50 text-green-600">
          Save {discountPercent}%
        </Badge>
      )}
    </div>
  );
}
