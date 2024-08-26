import request from "@/lib/request"
import axios, { AxiosError } from "axios"
import { Params } from "next/dist/shared/lib/router/utils/route-matcher"

const exec = async (req: Request, context: { params: Params }) => {
    try {
        const route = context.params.routes.join('/')
        const { search } = new URL(req.url)

        // origin HTTP referer
        let referer = req.headers.get('Referer') ?? ''
        if (referer) {
            referer = referer.split('/').slice(0, 3).join('/')
        }
        // origin IP if CF-Connecting-IP exists
        const originIP = req.headers.get('CF-Connecting-IP') ?? req.headers.get('x-forwarded-for') ?? undefined

        const res = await request.request({
            url: route + search,
            method: req.method,
            headers: {
                Authorization: req.headers.get('Authorization') ?? undefined,
                Origin: referer,
                'x-forwarded-for': originIP
            },
            data: req.method == 'POST' ? await req.json() : undefined
        })
        return new Response(
            JSON.stringify({ success: true, data: res.data.data }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    } catch (e) {
        if (axios.isAxiosError(e)) {
            const data = (e as AxiosError<ErrorResponse>).response?.data
            return new Response(
                JSON.stringify({ success: false, data: data?.errors ? Object.values(data?.errors) : data?.message }),
                {
                    status: 403,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        } else {
            return new Response(
                JSON.stringify({ success: false, data: (e as Error).message }),
                {
                    status: 403,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }
    }
}

export async function GET(request: Request, context: { params: Params }) { return await exec(request, context) }
export async function POST(request: Request, context: { params: Params }) { return await exec(request, context) }