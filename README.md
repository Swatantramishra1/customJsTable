# Welcome to Custom Js Table

```
npm i swatantra_table_creater

```

It will take data as:

```
   option = {
      data*: [{}],
      maxRow: number,
      excludeColumns: [],
      sortableColumns: [],
      isStickyHeader: boolean,
      pagination: {
      per_page_record: 15
      }
}; 

```
**Start represent mendatory**

## Options

**data** ->  accept only array of object

**maxRow** -> custome number of row want to show 

**excludeColumns**  -> which column do you want to exclude from tables

**sortableColumns** -> it takes array of string -> should be column name like **["column_name"]**

**isStickyHeader** -> it takes as boolean wheather want to have sticky header or not

**pagination** -> 

```
 { 
  per_page_record: (should be number more than **0** )
 }

```




