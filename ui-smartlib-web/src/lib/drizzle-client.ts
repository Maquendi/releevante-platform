'use server'
import {
  BuildQueryResult,
  DBQueryConfig,
  eq,
  ExtractTablesWithRelations,
  InferInsertModel,
} from "drizzle-orm";
import { db } from "../config/drizzle/db";
import * as schema from "../config/drizzle/schemas";

type TSchema = ExtractTablesWithRelations<typeof schema>;

type QueryConfig<TableName extends keyof TSchema> = DBQueryConfig<
  "one" | "many",
  boolean,
  TSchema,
  TSchema[TableName]
>;

type OptsQuery<T extends keyof TSchema> = QueryConfig<T>;


type QueryResult<
  TableName extends keyof TSchema,
  QBConfig extends QueryConfig<TableName> 
> = BuildQueryResult<TSchema, TSchema[TableName], QBConfig>;

export async function dbGetAll<T extends keyof TSchema,Opts extends OptsQuery<T>>(
  table: T,
  opts?: Opts
):Promise<QueryResult<T,Opts>[]>{
  try {
    const data = await db.query[table].findMany(opts || {});
    return data as QueryResult<T, Opts>[]; 

  } catch (error) {
    throw new Error("Error getting data: " + error);
  }
}

export async function dbGetOne<T extends keyof TSchema, Opts extends OptsQuery<T>>(
  table: T,
  opts?: Opts
):Promise<QueryResult<T,Opts>> {
  try {
    const data = await db.query[table].findFirst(opts || {});

    return data as QueryResult<T,Opts> ;
  } catch (error) {
    throw new Error("Error getting data: " + error);
  }
}

export async function dbGetById<T extends keyof TSchema, Opts extends OptsQuery<T>>(
  table: T,
  id: number,
  opts?: Opts
):Promise<QueryResult<T,Opts>> {
  try {
    const data = await db.query[table].findFirst({
      where: eq(schema[table].id, id),
      columns: opts?.columns,
      with: opts?.with,
      extras: opts?.extras,
    });

    if (!data) {
      throw new Error("No record found");
    }
    return data as QueryResult<T,Opts> ;
  } catch (error) {
    throw new Error("Error getting data: " + error);
  }
}

export async function dbPost<T extends keyof TSchema>(
  table: T,
  values: InferInsertModel<(typeof schema)[T]>
) {
  try {
    const [data] = await db
      .insert(schema[table])
      .values(values as any)
      .returning();

    if (!data) {
      throw new Error("Error creating element");
    }

    return data;
  } catch (error) {
    throw new Error("Error getting data: " + error);
  }
}

export async function dbPut<T extends keyof TSchema>(
  table: T,
  id: number,
  values: Partial<InferInsertModel<(typeof schema)[T]>>
) {
  try {
    const [data] = await db
      .update(schema[table])
      .set(values as Record<string, any>)
      .where(eq(schema[table].id, id))
      .returning();

    if (!data) {
      throw new Error("Error updating element");
    }

    return data;
  } catch (error) {
    throw new Error("Error getting data: " + error);
  }
}

export async function dbDelete<T extends keyof TSchema>(table: T, id: number) {
  try {
    const [data] = await db
      .delete(schema[table])
      .where(eq(schema[table].id, id))
      .returning();

    if (!data) {
      throw new Error("Error deleting element");
    }

    return data;
  } catch (error) {
    throw new Error("Error getting data: " + error);
  }
}
