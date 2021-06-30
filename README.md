**AOV Pages (non-cart):**

| property | context | datatype | description | example |
| -------- | ------- | -------- | ----------- | ------- |
| location | root | string | References folder name within global-data/products for which page to show up for. | location: purple-mattress |
| topHTML | root | string | Raw HTML that will show above AOV items. | topHTML: `<div>Buy all these things and get a discount.</div>` |
| mainLabel | root | string | The label above AOV items. | mainLabel: Complete Your Set | 
| items | root | array | A list of all the AOVs you want to show. | - items:<br/>&nbsp;&nbsp;&nbsp;&nbsp;- product:<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- handle: harmony-pillow-additional-qty |
| product | items | array | A list of AOV driver. | - product:<br/>&nbsp;&nbsp;&nbsp;&nbsp;- handle: harmony-pillow-additional-qty | 
| handle | product | string | References file name within global-data/aov-drivers/drivers. | handle: harmony-pillow-additional-qty |
| showOnVariants | product | object | A list of variant ids on this product page that will show this particular AOV item. | showOnVariants:<br/>&nbsp;&nbsp;&nbsp;&nbsp;32037233360943: true |
| [variantId] | showOnVariants | boolean | When defined, if the Shopify variant ID's is contained in this list it will show this particuar AOV item. It will error out if you forget to include a variant ID under any of these lists (per AOV instance). | 32037233360943: true |
<br/>
<br/>
<br/>

**Cart AOV**

| property | context | datatype | description | example |
| -------- | ------- | -------- | ----------- | ------- |
| location | root | string | Unlike the non-cart AOV Pages, it should just be the 'cart' instead of referencing the folders in the global-data/products. | location: cart |
| items | root | array | List of AOV items | items:<br/>&nbsp;&nbsp;&nbsp;&nbsp;-id: mattress-protector<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name: Mattress Protector |
| id | items | string | References folder name within global-data/products to pull the correct variants information. | id: mattress-protector |
| name | items | string | Name that will show in the AOV. | name: Mattress Protector |
| img | items | string | Image that will show in the AOV. | img: https://cdn.purple.com/image/upload/products/mattress-protector/mattress-protector-nav-transparent.png |
| modal | items | string | References file name within global-data/product-modals/modals and pulls information from that file. | modal: mattress-protector |
| requiresMattress | items | boolean | It'll only show in cart if a mattress is in the cart (and this is set to true). Default is false. | requiresMattress: true |
| matchMattressSize | items | boolean | It'll match the size of the first mattress in the cart (which will be the most expensive one). Default should be the first variant for that particular AOV item. | matchMattressSize: true |
| lowerText | items | string | Text that will show in AOV towards the bottom. It'll be centered and in our grey font color. | lowerText: Protect your premium mattress without sacrificing comfort. |
| hideModel | items | boolean | Hides the model text underneath the product name inside the AOV item. Shows by default. | hideModel: true |
| additionalDiscount | items | integer | On top of discounts that are already applied, this is offering an additional discount. Use decimal. | additionalDiscount: .10 |
| allowToAddEachAgain | items | boolean | When the non-main bundle AOV item exist and you try to add the bundle AOV items, this property means that you will be able to re-add that non-main buncel AOV item as well. For example, double + back cushion bundle cart AOV and you have the back cushion already in the cart (non-main product in that bundle since it is the additional product). This means that it will add the double and back cushion to the cart when adding the bundle. Default is it only would add the main product (and this AOV will only show if the main product isn't already a cart item). | allowToAddEachAgain: true |
| discountType | items | string | Defines the discount type (fixed vs percentage). Percentage is the default if not defined. | discountType: percentage |
| modalLinkText | items | string | Text that will trigger the modal on click. | modalLinkText: Change Height |
| additionalItemsToAdd | items | object | Contains the information for the additional item that will be added. | additionalItemsToAdd:<br/>&nbsp;&nbsp;&nbsp;&nbsp;- variantId: 39819396612285<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;productId: 6718679220413<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;qty: 1<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;id: harmony-pillow |
| variantId | additionalItemsToAdd | integer | Shopify Variant ID that will be added. This is what is referenced inside the actual add to cart. | variantId: 39819396612285 |
| productId | additionalItemsToAdd | integer | Shopify Product ID of the product that will be added. | productId: 6718679220413 |
| qty | additionalItemsToAdd | integer | Number of this item to add to the cart. | qty: 1 |
| id | additionalItemsToAdd | string | References folder name within global-data/products to pull the correct variants information. | id: harmony-pillow |
| bundleAov | items | boolean | (optional) Not needed since its not doing anything for the actual logic, instead use the additionalItemsToAdd property. | bundleAov: true |
<!-- | variantOnly | items | boolean | | variantOnly: true | -->
<!-- | requiresProductId | items | boolean |   | requiresMattress: false | -->
<!-- | specificAovsPerProduct | root | object | | | -->
<br/>
<br/>
<br/>

**AOV Drivers:**

| property | context | datatype | description | example |
| -------- | ------- | -------- | ----------- | ------- |
| id | root | string | References folder name within global-data/products. | id: ascent |
| name | root | string | If not defined it will default to the name within the variants file. It will use this for the AOV.  | name: Purple Harmony Pillow |
| nameIfChecked | root | string | When AOV checked it will show this name. | nameIfChecked: Harmony Pillow |
| img | root | string | The image that will display for the AOV driver. | img: https://cdn.purple.com/image/upload/products/ascent-powerbase/ascent-3-by-2.jpg |
| modal | root | string | References file within global-data/product-modals/modals | modal: ascent |
| matchMattressSize | root | boolean | Will match the mattress size if enabled (only applicable on mattress PDPs). Default is false. If falsey, it will select the first variant. | matchMattressSize: true |
| hasSizeDropdown | root | boolean | Shows the size dropdown if enabled. Default is false. If falsey, it will select the first variant. | hasSizeDropdown: true  |
| toggleLabel | root | string | Label that will show above toggle decision. | toggleLabel: Model |
| toggleVariant | root | string | This decides which variant type to loop through inside the variant file to display as a toggle decision. | toggleVariant: model |
| defaultSize | root | string | Size to default AOV to. | defaultSize: Full/Queen |
| defaultColor | root | string | Color to default AOV to. | defaultColor: Grey |
| variantUnit | root | string | Specifies any particular unit to use especially when we don't want to display options for other unit types. Only can have one unit selected through this route. | variantUnit: Sheet Set |
| discountMessage | root | string | Message in AOV driver to invoke promo discount messaging (i.e. pink font color). | discountMessage: 20% Off the Purple Duvet |
| buyMoreSaveMore | root | string | Qualifies AOV item toward BMSM count and will activate discounts accordingly. | buyMoreSaveMore: true |
| lowerText | root | string | Message in AOV driver to add any special messaging (i.e. centered, grey messaging). | lowerText: Not eligible for accessory sale |
| variants | root | array | List of all the different variants mainly to show different images. | variants:<br/>&nbsp;&nbsp;&nbsp;&nbsp;- id: Lightweight<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;label: LIGHTWEIGHT<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;img: https://cdn.purple.com/image/upload/v1580946150/products/Foundation/frame_foundation_slate_2x3.png |
| id | variants | string | References the toggle type's options to display a different defined image. | id: Lightweight |
| label | variants | string | Label to show above the toggle type decision. | label: LIGHTWEIGHT |
| img | variants | string | Image to show when toggle type decision is selected. | img: https://cdn.purple.com/image/upload/v1580946150/products/Foundation/frame_foundation_slate_2x3.png |
| sizeImages | root | object | Mapping of variant size to their corresponding image to display. | sizeImages:<br/>&nbsp;&nbsp;&nbsp;&nbsp;Twin XL: https://cdn.purple.com/image/upload/products/ascent-powerbase/ascent-twin-03.jpg<br/>&nbsp;&nbsp;&nbsp;&nbsp;Queen: https://cdn.purple.com/image/upload/products/ascent-powerbase/ascent-queen-03.jpg<br/>&nbsp;&nbsp;&nbsp;&nbsp;King: https://cdn.purple.com/image/upload/products/ascent-powerbase/ascent-queen-03.jpg<br/>&nbsp;&nbsp;&nbsp;&nbsp;Split King: https://cdn.purple.com/image/upload/products/ascent-powerbase/ascent-split-king-03.jpg |
| additionalQty | root | object | Use if allowing customer to be able to add a second quantity of AOV item. | additionalQty:<br/>&nbsp;&nbsp;&nbsp;&nbsp;topLabel: Save an additional $32<br/>&nbsp;&nbsp;&nbsp;&nbsp;bottomLabel: When you buy a second Harmony Pillow<br/>&nbsp;&nbsp;&nbsp;&nbsp;discountType: fixed<br/>&nbsp;&nbsp;&nbsp;&nbsp;discount: 16<br/>&nbsp;&nbsp;&nbsp;&nbsp;toggleLabel: Second Pillow Height<br/>&nbsp;&nbsp;&nbsp;&nbsp;bmsmTopLabel: Second Harmony Pillow |
| topLabel | additionalQty | string | Top line text that shows next to additional qty checkbox.  | topLabel: Save an additional $32 |
| bottomLabel | additionalQty | string | Bottom line text that shows next to additional qty checkbox. | bottomLabel: When you buy a second Harmony Pillow |
| discountType | additionalQty | string | Defined discount type (fixed vs percent). Logic default is percent (leave blank if you want to use percent). | discountType: fixed |
| discount | additionalQty | integer | Defined discount amount (use whole number not decimal). | discount: 16 |
| toggleLabel | additionalQty | string | Label above the second additional toggle decisions. | toggleLabel: Second Pillow Height |
| bmsmTopLabel | additionalQty | string | Label that will replace the topLabel (and bottomLabel, indirectly). This will be turned on when buyMoreSaveMore is enabled. This will show up next to the additional qty checkbox. | bmsmTopLabel: Second Harmony Pillow |
<!-- | harmonyPillowSize | root | string |  | harmonyPillowSize: Standard | -->
<br/>
<br/>
<br/>
