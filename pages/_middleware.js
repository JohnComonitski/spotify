import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req){
    const token = await getToken({ req, secret: process.env.JWT_SECRET });
    console.log("Token:",token)
    const { pathname }  = req.nextUrl;
    console.log("Path",pathname)

    if(pathname.includes("/api/auth") || token){
        console.log("going to next")
        return NextResponse.next()
    }

    if (!token && pathname !== "/login"){
        console.log("going to login")
        //return NextResponse.rewrite(new URL('/login', req.url))
        return NextResponse.redirect("/login")
    }
}