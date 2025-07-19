import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@zim/ui";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [activeAttr, setActiveAttr] = useState<Record<string, string>>({});
  const [product, setProduct] = useState<IProduct | null>(null);

  useEffect(() => {
    (async () => {
      const product: Awaited<IProduct> = await fetch(`http://localhost:8000/products/61ed388d-2c1e-486e-aa18-45849a97eadd`, {
        headers: {
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }).then((res) => res.json());

      const firstProductAttributes = (
        product.product.product_variants.find((pv) => pv.quantity > 0) ?? product.product.product_variants[0]
      ).product_variant_attribute_values.map((pvav) => {
        return {
          [pvav.attribute_value.attribute_id]: pvav.attribute_value.id,
        };
      });

      setActiveAttr(Object.assign({}, ...firstProductAttributes));

      setProduct(product);
    })();
  }, []);

  if (!product) return "Loading...";

  const activeProduct = product.product.product_variants.find((pv) => {
    // Check if every attribute in activeAttr matches a value in this variant
    return Object.entries(activeAttr).every(([attrId, valueId]) =>
      pv.product_variant_attribute_values.some((pvav) => pvav.attribute_value.attribute_id === attrId && pvav.attribute_value.id === valueId)
    );
  });

  if (!activeProduct) return <>Empty</>;

  const isOutOfStock = +activeProduct.quantity === 0;

  return (
    <div>
      <div className="py-5">
        <h3 className="text-3xl font-bold">title: {product?.product.title}</h3>
        <h2 className="text-lg font-bold">Conent: {product?.product.content}</h2>
        <h2 className="text-lg font-bold">Condition: {product?.product.conditon}</h2>
      </div>
      <hr />
      <div className="pl-5 py-7">
        <p>
          Price: {activeProduct.price_in_minor_units / 100} {activeProduct.pricing_calc_by}
        </p>

        <p>Quantity: {isOutOfStock ? <>(out of stock)</> : activeProduct.quantity}</p>

        <p>is active: {activeProduct.active ? "Yes" : "No"}</p>

        <div className="inline-flex flex-col gap-3">
          <div className="inline-flex items-center gap-4  bg-gray-100 p-1 rounded-md">
            <Button
              disabled={isOutOfStock}
              size="icon">
              -
            </Button>
            <span>{1}</span>
            <Button
              disabled={isOutOfStock}
              size="icon">
              +
            </Button>
          </div>

          <Button disabled={isOutOfStock}>Buy now</Button>
        </div>
      </div>

      <hr />
      <hr />

      {product.attributes.map((attribute) => {
        return (
          <div className="flex flex-col gap-0 pl-5 py-5">
            <h2 className="text-lg font-bold underline">{attribute.title}</h2>

            <div className="flex items-center gap-5 pl-5">
              {attribute.attribute_values.map((attributeValue) => {
                const isInStock = product.product.product_variants.some((pv) => {
                  // Check if this variant has all active attributes, but with this attributeValue for the current attribute
                  return (
                    +pv.quantity > 0 &&
                    Object.entries({ ...activeAttr, [attribute.id]: attributeValue.id }).every(([attrId, valueId]) =>
                      pv.product_variant_attribute_values.some((pvav) => pvav.attribute_value.attribute_id === attrId && pvav.attribute_value.id === valueId)
                    )
                  );
                });

                return (
                  <div className="relative inline-block">
                    {!isInStock && (
                      <span
                        className="pointer-events-none absolute left-1 top-1 w-[calc(100%-0.5rem)] h-[calc(100%-0.5rem)] !text-black/30 z-50"
                        aria-hidden="true">
                        <svg
                          width="100%"
                          height="100%"
                          viewBox="0 0 100 40"
                          className="block">
                          <line
                            x1="0"
                            y1="0"
                            x2="100"
                            y2="40"
                            stroke="currentColor"
                            strokeWidth="4"
                            strokeLinecap="round"
                          />
                        </svg>
                      </span>
                    )}

                    <Button
                      key={attributeValue.id}
                      size="sm"
                      variant={activeAttr[attribute.id] === attributeValue.id ? "default" : "secondary"}
                      onClick={() => {
                        setActiveAttr((prev) => ({ ...prev, [attribute.id]: attributeValue.id }));
                      }}>
                      {attributeValue.title}
                      {/* {isInStock ? null : <>(out of stock)</>} */}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
