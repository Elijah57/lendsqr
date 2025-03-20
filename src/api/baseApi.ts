import fetch, { BodyInit, RequestInit } from "node-fetch";
import { BadRequest } from "../middlewares/error";

class BaseAPI {
    public baseUrl: string;

    constructor(url: string){
        this.baseUrl = url
    }

    public async fetch <T> (url: string, body?: BodyInit, args?: Record<string, any>, RequestInit?: RequestInit): Promise<T>{

        try{
            const urlObj = new URL(url, this.baseUrl);
            if(args){
                urlObj.search = new URLSearchParams(args).toString()
            }

            const requestOptions = {...RequestInit, body}
            const response = await fetch(urlObj.toString(), requestOptions)

            if(!response.ok){
                const errorResponse = await response.text()
                throw new BadRequest(errorResponse)
            }

            if(response.status === 204){
                return null as T
            }
            return response.json() as Promise<T>

        }catch(error: any){
            throw new BadRequest(error)
        }

    }

    public async get <T>(url: string, args?: Record<string, any>, RequestInit?: RequestInit): Promise<T>{
        return this.fetch(url, undefined, args, {...RequestInit, method: "GET"})
    }

    public async post <T>(url: string, body:Record<string, any>,  args?: Record<string, any>, RequestInit?: RequestInit): Promise<T>{
        const bodyString = body ? JSON.stringify(body) : undefined
        return this.fetch(url, bodyString, args, {...RequestInit, method: "POST"})
    }
}

export default BaseAPI