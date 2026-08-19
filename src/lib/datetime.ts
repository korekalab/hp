/** D1(SQLite)の datetime('now') 形式("YYYY-MM-DD HH:MM:SS", UTC)をISO 8601に変換する */
export function toIsoDatetime(sqliteDatetime: string): string {
  return `${sqliteDatetime.replace(" ", "T")}Z`;
}
