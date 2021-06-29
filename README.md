| property | context | datatype | description | example |
| -------- | ------- | -------- | ----------- | ------- |
| location | root | string | references folder name within global-data/products | purple-mattress |
| topHTML | root | string | raw HTML that will show above AOV items | <div></div> |
| mainLabel | root | string | the label above aovs | Complete Your Set | 
| items | root | array | a list of all the aovs you want to show |  |
| product | items | array | | | 
| handle | product | string | file name within global-data/aov-drivers/drivers | harmony-pillow-additional-qty |
| showOnVariants | product | object | list of variant ids on this product page that will show this particular aov item | 32037233360943: true | 
