import { isNil } from "./utils";

interface FieldRequestBase {
  [key: string]: boolean | FieldRequestBase;
}

type FieldRequest = FieldRequestBase | boolean;

type IsBoolean<T> = T extends boolean ? true : false;

type IsBothBooleans<T1, T2> = IsBoolean<T1> extends true
  ? IsBoolean<T2> extends true
    ? true
    : false
  : false;

type IsFieldRequest<T> = T extends FieldRequest ? true : false;

type IsBothFieldRequest<T1, T2> = IsFieldRequest<T1> extends true
  ? IsFieldRequest<T2> extends true
    ? true
    : false
  : false;

type Conform<T> = IsBoolean<T> extends true
  ? boolean
  : IsFieldRequest<T> extends true
  ? T
  : never;

type Merge1<T> = T;

type Merge2<T1, T2> = IsBothBooleans<T1, T2> extends true
  ? boolean
  : IsBothFieldRequest<T1, T2> extends true
  ? {
      [K in keyof T1 | keyof T2]: K extends keyof T1
        ? K extends keyof T2
          ? /* both types have K */ Merge2<T1[K], T2[K]>
          : /* only T1 has K */ Conform<T1[K]>
        : K extends keyof T2
        ? /* only T2 has K */ Conform<T2[K]>
        : /* impossible */ never;
    }
  : never;

const isBoolean = (object: any) => typeof object === "boolean";

const isBothBooleans = (o1: any, o2: any) => isBoolean(o1) && isBoolean(o2);

const isObject = (object: any) =>
  typeof object === "object" && !Array.isArray(object);

const isBothObjects = (o1: any, o2: any) => isObject(o1) && isObject(o2);

const isFieldRequest = (object: any) => isBoolean(object) || isObject(object);

const merge1 = <T1 extends FieldRequest>(o1: T1) => o1;

function merge2<T1 extends FieldRequest, T2 extends FieldRequest>(
  o1: T1,
  o2: T2
): Merge2<T1, T2> {
  if (isBothBooleans(o1, o2)) {
    return true as Merge2<T1, T2>;
  }
  if (isBothObjects(o1, o2)) {
    const keys1 = Object.keys(o1);
    const keys2 = Object.keys(o2);
    const result: FieldRequest = {};
    new Set([...keys1, ...keys2]).forEach((k) => {
      const v1 = (o1 as any)[k];
      const v2 = (o2 as any)[k];
      if (isNil(v1)) {
        /* only o2 has k */
        if (isFieldRequest(v2)) {
          result[k] = v2;
        }
      } else if (isNil(v2)) {
        /* only o1 has k */
        if (isFieldRequest(v1)) {
          result[k] = v1;
        }
      } else {
        result[k] = merge2(v1, v2);
      }
    });
    return result as Merge2<T1, T2>;
  }
  throw new Error("both arguments must be booleans or objects");
}

type Merge3<T1, T2, T3> = Merge2<Merge2<T1, T2>, T3>;
const merge3 = <
  T1 extends FieldRequest,
  T2 extends FieldRequest,
  T3 extends FieldRequest
>(
  o1: T1,
  o2: T2,
  o3: T3
) => merge2(merge2(o1, o2) as FieldRequest, o3) as Merge3<T1, T2, T3>;

type Merge4<T1, T2, T3, T4> = Merge2<Merge2<T1, T2>, Merge2<T3, T4>>;
const merge4 = <
  T1 extends FieldRequest,
  T2 extends FieldRequest,
  T3 extends FieldRequest,
  T4 extends FieldRequest
>(
  o1: T1,
  o2: T2,
  o3: T3,
  o4: T4
) =>
  merge2(
    merge2(o1, o2) as FieldRequest,
    merge2(o3, o4) as FieldRequest
  ) as unknown as Merge4<T1, T2, T3, T4>;

type Merge5<T1, T2, T3, T4, T5> = Merge3<Merge2<T1, T2>, Merge2<T3, T4>, T5>;
const merge5 = <
  T1 extends FieldRequest,
  T2 extends FieldRequest,
  T3 extends FieldRequest,
  T4 extends FieldRequest,
  T5 extends FieldRequest
>(
  o1: T1,
  o2: T2,
  o3: T3,
  o4: T4,
  o5: T5
) =>
  merge3(
    merge2(o1, o2) as FieldRequest,
    merge2(o3, o4) as FieldRequest,
    o5
  ) as unknown as Merge5<T1, T2, T3, T4, T5>;

type Merge6<T1, T2, T3, T4, T5, T6> = Merge3<
  Merge2<T1, T2>,
  Merge2<T3, T4>,
  Merge2<T5, T6>
>;
const merge6 = <
  T1 extends FieldRequest,
  T2 extends FieldRequest,
  T3 extends FieldRequest,
  T4 extends FieldRequest,
  T5 extends FieldRequest,
  T6 extends FieldRequest
>(
  o1: T1,
  o2: T2,
  o3: T3,
  o4: T4,
  o5: T5,
  o6: T6
) =>
  merge3(
    merge2(o1, o2) as FieldRequest,
    merge2(o3, o4) as FieldRequest,
    merge2(o5, o6) as FieldRequest
  ) as unknown as Merge6<T1, T2, T3, T4, T5, T6>;

type Merge7<T1, T2, T3, T4, T5, T6, T7> = Merge4<
  Merge2<T1, T2>,
  Merge2<T3, T4>,
  Merge2<T5, T6>,
  T7
>;
const merge7 = <
  T1 extends FieldRequest,
  T2 extends FieldRequest,
  T3 extends FieldRequest,
  T4 extends FieldRequest,
  T5 extends FieldRequest,
  T6 extends FieldRequest,
  T7 extends FieldRequest
>(
  o1: T1,
  o2: T2,
  o3: T3,
  o4: T4,
  o5: T5,
  o6: T6,
  o7: T7
) =>
  merge4(
    merge2(o1, o2) as FieldRequest,
    merge2(o3, o4) as FieldRequest,
    merge2(o5, o6) as FieldRequest,
    o7
  ) as unknown as Merge7<T1, T2, T3, T4, T5, T6, T7>;

type Merge8<T1, T2, T3, T4, T5, T6, T7, T8> = Merge4<
  Merge2<T1, T2>,
  Merge2<T3, T4>,
  Merge2<T5, T6>,
  Merge2<T7, T8>
>;
const merge8 = <
  T1 extends FieldRequest,
  T2 extends FieldRequest,
  T3 extends FieldRequest,
  T4 extends FieldRequest,
  T5 extends FieldRequest,
  T6 extends FieldRequest,
  T7 extends FieldRequest,
  T8 extends FieldRequest
>(
  o1: T1,
  o2: T2,
  o3: T3,
  o4: T4,
  o5: T5,
  o6: T6,
  o7: T7,
  o8: T8
) =>
  merge4(
    merge2(o1, o2) as FieldRequest,
    merge2(o3, o4) as FieldRequest,
    merge2(o5, o6) as FieldRequest,
    merge2(o7, o8) as FieldRequest
  ) as unknown as Merge8<T1, T2, T3, T4, T5, T6, T7, T8>;

type Merge9<T1, T2, T3, T4, T5, T6, T7, T8, T9> = Merge5<
  Merge2<T1, T2>,
  Merge2<T3, T4>,
  Merge2<T5, T6>,
  Merge2<T7, T8>,
  T9
>;
const merge9 = <
  T1 extends FieldRequest,
  T2 extends FieldRequest,
  T3 extends FieldRequest,
  T4 extends FieldRequest,
  T5 extends FieldRequest,
  T6 extends FieldRequest,
  T7 extends FieldRequest,
  T8 extends FieldRequest,
  T9 extends FieldRequest
>(
  o1: T1,
  o2: T2,
  o3: T3,
  o4: T4,
  o5: T5,
  o6: T6,
  o7: T7,
  o8: T8,
  o9: T9
) =>
  merge5(
    merge2(o1, o2) as FieldRequest,
    merge2(o3, o4) as FieldRequest,
    merge2(o5, o6) as FieldRequest,
    merge2(o7, o8) as FieldRequest,
    o9
  ) as unknown as Merge9<T1, T2, T3, T4, T5, T6, T7, T8, T9>;

export {
  Merge1,
  Merge2,
  Merge3,
  Merge4,
  Merge5,
  Merge6,
  Merge7,
  Merge8,
  Merge9,
  merge1,
  merge2,
  merge3,
  merge4,
  merge5,
  merge6,
  merge7,
  merge8,
  merge9,
};
