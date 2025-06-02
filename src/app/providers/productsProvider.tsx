// "use client";

// import { ProductsContext, useProductsData } from "./useProductsData";

// export default async function ProductsProvider({
//   children,
// }: Readonly<{ children: React.ReactNode }>) {
//   const products = await useProductsData();

//   console.log("products<****>", products);
//   return (
//     <ProductsContext.Provider value={products}>
//       {children}
//     </ProductsContext.Provider>
//   );
// }
