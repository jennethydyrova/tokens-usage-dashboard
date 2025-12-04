export interface UsageData {
  usage: MessageInfo[];
}

interface MessageInfo {
  message_id: number;
  timestamp: string;
  report_name?: string;
  credits_used: number;
}

// Converts a snake_case string literal type (e.g. "report_name")
// into a camelCase string literal type (e.g. "reportName")
type CamelCase<S extends string> = S extends `${infer T}_${infer U}`
  ? `${T}${Capitalize<CamelCase<U>>}`
  : S;

// Remaps all keys of an object type from snake_case to camelCase,
// preserving the original value types.
type CamelCasedProperties<T> = {
  [K in keyof T as CamelCase<string & K>]: T[K];
};

export type MessageInfoCamel = CamelCasedProperties<MessageInfo>;

export type TableDataType = {
  key: string | number;
} & Omit<CamelCasedProperties<MessageInfo>, "creditsUsed"> & {
    creditsUsed: string;
  };
