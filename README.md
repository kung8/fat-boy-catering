| property | datatype | description | example |
| -------- | -------- | ----------- | ------- |
| location | string | references folder name within global-data/products | purple-mattress |
| topHTML | string | raw HTML that will show above AOV items | <div></div> |
| mainLabel | string | the label above aovs | Complete Your Set | 
| items | array | a list of all the aovs you want to show |  |
    | product | array | | | 
        | handle | string | file name within global-data/aov-drivers/drivers | harmony-pillow-additional-qty |
        | showOnVariants | object | list of variant ids on this product page that will show this particular aov item | 32037233360943: true |
