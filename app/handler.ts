import { DateValue, RangeValue } from "@nextui-org/react"
import axios, { AxiosError, AxiosResponse } from "axios"
import { toast } from "sonner"

export const handleError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
        const data = (error as AxiosError<ErrorResponse>).response?.data
        toast.error(data?.data)
    } else {
        toast.error((error as Error).message)
    }
}
export const handleLogin = async ({ email, password }: {
    email: string;
    password: string;
}) => {
    try {
        const res: AxiosResponse<ResponseData<AuthData>> = await axios.post("/api/passport/auth/login", {
            email,
            password
        })
        if (res.data.data.is_admin !== 1) throw new Error("權限不足")

        localStorage.setItem('authToken', res.data.data.auth_data);
        axios.defaults.headers.common['Authorization'] = res.data.data.auth_data
        toast.success("登陸成功")
        return true
    } catch (error) {
        handleError(error)
        return false
    }
}
export const handleCheckLogin = async (token: string) => {
    try {
        const res: AxiosResponse<ResponseData<CheckLoginData>> = await axios.get("/api/user/checkLogin", {
            headers: {
                Authorization: token
            }
        })
        if (!res.data.data.is_admin || !res.data.data.is_login) throw new Error("登陸異常")

        axios.defaults.headers.common['Authorization'] = token
        return true
    } catch (error) {
        localStorage.removeItem("authToken")
        delete axios.defaults.headers.common['Authorization']
        handleError(error)
        return false
    }
}

export const handleSearch = async (date: RangeValue<DateValue>) => {
    const convertDate = (date: DateValue) => {
        return Math.floor(new Date(date.toDate('Asia/Hong_Kong')).getTime() / 1000)
    }    
    try {
        const res: AxiosResponse<ResponseData<SearchData[]>> = await axios.get(`/api/${process.env.NEXT_PUBLIC_PATH}/stat/getRanking?type=user_consumption_rank&start_at=${convertDate(date.start)}&end_at=${convertDate(date.end)}`)
        return res.data.data
    } catch (error) {
        handleError(error)
        return []
    }
}