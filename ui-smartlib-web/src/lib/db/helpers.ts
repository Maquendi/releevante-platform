import type {
    BuildQueryResult,
    DBQueryConfig,
    ExtractTablesWithRelations,
  } from "drizzle-orm";
  
  import type  * as schema  from  "@/config/drizzle/schemas";
  

type TSchema = ExtractTablesWithRelations<typeof schema>;
type QueryConfig<TableName extends keyof TSchema> = DBQueryConfig<"one" | "many", boolean, TSchema, TSchema[TableName]>;

export type InferQueryModel<
    TableName extends keyof TSchema,
    QBConfig extends QueryConfig<TableName> 
> = BuildQueryResult<TSchema, TSchema[TableName], QBConfig>;