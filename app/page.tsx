"use client"

import { handleCheckLogin, handleLogin, handleSearch } from "./handler";
import { useEffect, useState } from "react";
import {
  Button,
  DateValue,
  getKeyValue,
  Input,
  RangeCalendar,
  RangeValue,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow
} from "@nextui-org/react";
import { getLocalTimeZone, today } from "@internationalized/date";
import { filesize } from "filesize";

export default function Home() {
  const [isLogin, setLogin] = useState(false)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [date, setDate] = useState<RangeValue<DateValue>>({
    start: today(getLocalTimeZone()).subtract({ days: 1 }),
    end: today(getLocalTimeZone()),
  })
  const [data, setData] = useState<SearchData[]>([])

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (token) {
      handleCheckLogin(token).then((res: boolean) => {
        setLogin(res)
      })
    }
  }, [])

  if (!isLogin) return (
    <main className="flex justify-center items-center h-screen">
      <div className="flex flex-col gap-3">
        <Input type="email" placeholder="郵箱" onValueChange={setEmail} />
        <Input type="password" placeholder="密碼" onValueChange={setPassword} />
        <Button onPress={() => {
          handleLogin({ email, password }).then((res: boolean) => { setLogin(res) })
        }}>
          登陸
        </Button>
      </div>
    </main>
  )

  return (
    <main className="flex h-auto flex-col items-center justify-between p-1 gap-3">
      <RangeCalendar
        calendarWidth={300}
        visibleMonths={1}
        aria-label="Date (Show Month and Year Picker)"
        maxValue={today(getLocalTimeZone())}
        value={date}
        onChange={setDate}
      />
      <Button onPress={() => {
        handleSearch(date).then((res) => { setData(res) })
      }}>查詢</Button>
      <Table
        isStriped
        isHeaderSticky
        aria-label="Example table with dynamic content">
        <TableHeader>
          <TableColumn className="text-center" key="user_id">用戶 ID</TableColumn>
          <TableColumn className="text-center" key="email">用戶郵箱</TableColumn>
          <TableColumn className="text-center" key="u">上傳</TableColumn>
          <TableColumn className="text-center" key="d">下載</TableColumn>
          <TableColumn className="text-center" key="total">合計</TableColumn>
        </TableHeader>
        <TableBody items={data}>
          {(item) => (
            <TableRow key={item.user_id.toString()}>
              {(columnKey) => {
                if (columnKey === 'user_id' || columnKey === 'email') {
                  return (<TableCell>{getKeyValue(item, columnKey)}</TableCell>)
                } else {
                  return (
                    <TableCell>{filesize(getKeyValue(item, columnKey), { standard: "jedec" })}</TableCell>
                  )
                }
              }}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </main>);
}
